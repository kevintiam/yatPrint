/**
 * Vérification d'un fichier téléversé (type et taille).
 *
 * Utilisée dans le navigateur (message immédiat) ET sur le serveur
 * (vérification définitive). Zod n'est pas utilisé ici car un fichier
 * n'est pas une simple donnée texte.
 */

/**
 * @param {{type: string, size: number} | null} file - objet File du navigateur ou du serveur
 * @param {{maxSizeMb: number, acceptedTypes: string[], acceptedLabel: string}} rules
 *        voir DESIGN_UPLOAD_RULES et IMAGE_UPLOAD_RULES dans config/catalog.js
 * @returns {string|null} message d'erreur en français, ou null si le fichier est valide
 */
export function getFileError(file, rules) {
  if (!file || typeof file.size !== "number") {
    return "Aucun fichier reçu.";
  }

  if (file.size === 0) {
    return "Le fichier est vide.";
  }

  if (!rules.acceptedTypes.includes(file.type)) {
    return `Format non accepté. Formats acceptés : ${rules.acceptedLabel}.`;
  }

  const maxBytes = rules.maxSizeMb * 1024 * 1024;
  if (file.size > maxBytes) {
    return `Fichier trop lourd : ${rules.maxSizeMb} Mo maximum.`;
  }

  return null;
}
