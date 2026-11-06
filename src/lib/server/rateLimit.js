/**
 * Limite anti-abus très simple : X requêtes maximum par adresse IP
 * pendant une période donnée (ex. 10 demandes de devis en 10 minutes).
 *
 * Les compteurs sont gardés en mémoire : ils repartent à zéro au redémarrage
 * du serveur. C'est suffisant pour un petit site ; pour un gros trafic,
 * on utiliserait un service dédié (ex. Upstash Redis).
 */
import { ApiError } from "./ApiError";

// clé (ex. "quotes:203.0.113.5") -> liste des dates des dernières requêtes
const requestLog = new Map();
const MAX_TRACKED_KEYS = 5000;

/**
 * Adresse IP du visiteur (fournie par l'hébergeur dans les en-têtes).
 * @param {Request} request
 * @returns {string}
 */
export function getClientIp(request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") || "inconnue";
}

/**
 * Enregistre une requête et indique si la limite est dépassée.
 * @param {string} key
 * @param {{limit: number, windowMs: number}} options
 * @returns {boolean} true si la requête est autorisée
 */
export function checkRateLimit(key, options) {
  const now = Date.now();

  // On garde seulement les requêtes encore dans la fenêtre de temps
  const recentRequests = [];
  for (const time of requestLog.get(key) || []) {
    if (now - time < options.windowMs) recentRequests.push(time);
  }

  if (recentRequests.length >= options.limit) {
    requestLog.set(key, recentRequests);
    return false;
  }

  recentRequests.push(now);
  requestLog.set(key, recentRequests);

  // Évite que la mémoire grossisse sans fin : on repart de zéro si trop de visiteurs
  if (requestLog.size > MAX_TRACKED_KEYS) {
    requestLog.clear();
  }
  return true;
}

/**
 * Lance une erreur 429 si le visiteur a fait trop de requêtes.
 * @param {Request} request
 * @param {string} actionName - ex. "quotes"
 * @param {{limit: number, windowMs: number}} options
 * @throws {ApiError}
 */
export function enforceRateLimit(request, actionName, options) {
  const key = `${actionName}:${getClientIp(request)}`;
  if (!checkRateLimit(key, options)) {
    throw new ApiError(429, "Trop de tentatives. Patientez quelques minutes avant de réessayer.");
  }
}

/** Réglages réutilisés par les routes publiques. */
export const RATE_LIMITS = {
  form: { limit: 8, windowMs: 10 * 60 * 1000 }, // 8 envois / 10 min
  upload: { limit: 20, windowMs: 10 * 60 * 1000 }, // 20 fichiers / 10 min
  checkout: { limit: 15, windowMs: 10 * 60 * 1000 },
  tracking: { limit: 20, windowMs: 10 * 60 * 1000 },
  password: { limit: 6, windowMs: 15 * 60 * 1000 }, // changement de mot de passe dans l'admin
};
