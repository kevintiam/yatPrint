/**
 * Petites fonctions communes aux fonctions ORM.
 */
import { isValidId, toPlain } from "./serialize";

/** Code d'erreur Prisma « enregistrement introuvable ». */
const NOT_FOUND_CODE = "P2025";

/**
 * Modifie un enregistrement par son identifiant.
 * @param {object} model - ex. getPrisma().quoteRequest
 * @param {string} id
 * @param {object} data - champs à modifier
 * @returns {Promise<object|null>} l'enregistrement modifié, ou null s'il n'existe pas
 */
export async function updateById(model, id, data) {
  if (!isValidId(id)) return null;

  try {
    const row = await model.update({ where: { id }, data });
    return toPlain(row);
  } catch (error) {
    if (error.code === NOT_FOUND_CODE) return null;
    throw error;
  }
}

/**
 * Supprime un enregistrement par son identifiant.
 * @param {object} model
 * @param {string} id
 * @returns {Promise<object|null>} l'enregistrement supprimé, ou null s'il n'existait pas
 */
export async function deleteById(model, id) {
  if (!isValidId(id)) return null;

  try {
    const row = await model.delete({ where: { id } });
    return toPlain(row);
  } catch (error) {
    if (error.code === NOT_FOUND_CODE) return null;
    throw error;
  }
}

/**
 * Retire les champs non définis (undefined) d'un objet de modification,
 * pour ne pas effacer une valeur que l'admin n'a pas envoyée.
 * @param {object} changes
 * @returns {object}
 */
export function withoutUndefined(changes) {
  const result = {};
  for (const [key, value] of Object.entries(changes)) {
    if (value !== undefined) result[key] = value;
  }
  return result;
}
