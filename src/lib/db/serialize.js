/**
 * Conversion des résultats de Prisma en objets JavaScript « simples ».
 *
 * Prisma renvoie des dates (objets Date). On les transforme en texte (ISO)
 * pour que les données aient la même forme partout : dans les pages serveur,
 * dans les composants client et dans les réponses JSON de l'API.
 */

/**
 * @param {any} data - résultat d'une requête Prisma (objet, liste ou null)
 * @returns {any} copie sans objets Date (remplacés par du texte)
 */
export function toPlain(data) {
  if (data === null || data === undefined) {
    return null;
  }
  return JSON.parse(JSON.stringify(data));
}

/**
 * Vérifie qu'un identifiant a un format plausible (ex. « cm3x1k2...» créé par Prisma).
 * Évite une requête inutile si quelqu'un tape une adresse comme /admin/commandes/<script>.
 * @param {unknown} id
 * @returns {boolean}
 */
export function isValidId(id) {
  return typeof id === "string" && /^[a-z0-9]{10,40}$/i.test(id);
}
