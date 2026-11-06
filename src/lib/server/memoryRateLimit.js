/**
 * Compteur anti-abus EN MÉMOIRE (solution de secours).
 *
 * Utilisé seulement quand Upstash Redis n'est pas configuré (développement local).
 * Limites : les compteurs repartent à zéro au redémarrage du serveur, et sur
 * Vercel chaque instance a ses propres compteurs. En production, configurez
 * Upstash (voir rateLimit.js).
 */

// clé (ex. "quotes:203.0.113.5") -> liste des dates des dernières requêtes
const requestLog = new Map();
const MAX_TRACKED_KEYS = 5000;

/**
 * Enregistre une requête et indique si la limite est dépassée.
 * @param {string} key - action + adresse IP
 * @param {{limit: number, windowMs: number}} options
 * @returns {boolean} true si la requête est autorisée
 */
export function checkMemoryRateLimit(key, options) {
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