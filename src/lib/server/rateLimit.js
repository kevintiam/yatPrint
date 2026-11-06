/**
 * Limite anti-abus : X requêtes maximum par adresse IP pendant une période
 * donnée (ex. 8 demandes de devis en 10 minutes).
 *
 * Deux modes, choisis automatiquement :
 * 1. UPSTASH REDIS (production) : si UPSTASH_REDIS_REST_URL et UPSTASH_REDIS_REST_TOKEN
 *    sont remplis. Les compteurs sont partagés entre toutes les instances Vercel
 *    et survivent aux redémarrages. Algorithme « fenêtre glissante ».
 * 2. MÉMOIRE (développement) : sinon. Voir memoryRateLimit.js.
 *
 * Si Upstash ne répond pas, la requête est AUTORISÉE (et l'erreur notée dans
 * le terminal) : une panne de l'anti-abus ne doit jamais bloquer une vente.
 *
 * Utilisation dans une route API :
 *   await enforceRateLimit(request, "quotes", RATE_LIMITS.form);
 */
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { ApiError } from "./ApiError";
import { checkMemoryRateLimit } from "./memoryRateLimit";

/** Réglages réutilisés par les routes. */
export const RATE_LIMITS = {
  form: { limit: 8, windowMs: 10 * 60 * 1000 }, // 8 envois / 10 min
  upload: { limit: 20, windowMs: 10 * 60 * 1000 }, // 20 fichiers / 10 min
  checkout: { limit: 15, windowMs: 10 * 60 * 1000 },
  tracking: { limit: 20, windowMs: 10 * 60 * 1000 },
  password: { limit: 6, windowMs: 15 * 60 * 1000 }, // changement de mot de passe dans l'admin
};

let redisClient = null;
let memoryWarningShown = false;
const limiters = new Map(); // nom de l'action -> limiteur Upstash

/**
 * Upstash est-il configuré ? (Les noms KV_REST_API_... sont ceux créés
 * automatiquement par l'intégration Upstash de Vercel.)
 * @returns {boolean}
 */
export function isRedisConfigured() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  return Boolean(url && token);
}

/**
 * Limiteur Upstash d'une action (créé une seule fois, puis réutilisé).
 * @param {string} actionName - ex. "quotes"
 * @param {{limit: number, windowMs: number}} options
 * @returns {Ratelimit}
 */
function getLimiter(actionName, options) {
  if (!redisClient) {
    redisClient = Redis.fromEnv(); // lit les variables UPSTASH_... (ou KV_...)
  }
  if (!limiters.has(actionName)) {
    limiters.set(
      actionName,
      new Ratelimit({
        redis: redisClient,
        limiter: Ratelimit.slidingWindow(options.limit, `${Math.round(options.windowMs / 1000)} s`),
        prefix: `yatprint:ratelimit:${actionName}`,
        timeout: 3000, // au-delà de 3 s sans réponse, la requête est autorisée
      })
    );
  }
  return limiters.get(actionName);
}

/**
 * Adresse IP du visiteur (fournie par l'hébergeur dans les en-têtes).
 * Sur Vercel, ces en-têtes sont remplis par Vercel lui-même (fiables).
 * @param {Request} request
 * @returns {string}
 */
export function getClientIp(request) {
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return "inconnue";
}

/**
 * Enregistre une requête et indique si elle est autorisée.
 * @param {Request} request
 * @param {string} actionName - ex. "quotes"
 * @param {{limit: number, windowMs: number}} options
 * @returns {Promise<boolean>} true si la requête est autorisée
 */
export async function checkRateLimit(request, actionName, options) {
  const ip = getClientIp(request);

  // Mode développement : compteurs en mémoire
  if (!isRedisConfigured()) {
    if (process.env.NODE_ENV === "production" && !memoryWarningShown) {
      memoryWarningShown = true;
      console.warn("[Anti-abus] Upstash Redis n'est pas configuré : limites gardées en mémoire seulement.");
    }
    return checkMemoryRateLimit(`${actionName}:${ip}`, options);
  }

  // Mode production : compteurs partagés dans Upstash Redis
  try {
    const result = await getLimiter(actionName, options).limit(ip);
    return result.success;
  } catch (error) {
    console.error("[Anti-abus] Upstash injoignable, requête autorisée :", error.message);
    return true;
  }
}

/**
 * Lance une erreur 429 si le visiteur a fait trop de requêtes.
 * ⚠️ Fonction asynchrone : toujours l'appeler avec « await ».
 * @param {Request} request
 * @param {string} actionName - ex. "quotes"
 * @param {{limit: number, windowMs: number}} options
 * @throws {ApiError}
 */
export async function enforceRateLimit(request, actionName, options) {
  const isAllowed = await checkRateLimit(request, actionName, options);
  if (!isAllowed) {
    throw new ApiError(429, "Trop de tentatives. Patientez quelques minutes avant de réessayer.");
  }
}