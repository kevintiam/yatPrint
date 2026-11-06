/**
 * Fonctions ORM des fiches de fichiers téléversés (table uploaded_files).
 * Le contenu des fichiers est géré par lib/services/storage.js.
 */
import { getPrisma } from "./prisma";
import { isValidId, toPlain } from "./serialize";
import { deleteById } from "./helpers";

/**
 * Enregistre la fiche d'un fichier.
 * @param {object} data - { originalName, storedName, mimeType, sizeBytes, purpose, isPublic }
 * @returns {Promise<object>}
 */
export async function createFileRecord(data) {
  const row = await getPrisma().uploadedFile.create({ data });
  return toPlain(row);
}

/**
 * @param {string} id
 * @returns {Promise<object|null>}
 */
export async function findFileRecordById(id) {
  if (!isValidId(id)) return null;
  const row = await getPrisma().uploadedFile.findUnique({ where: { id } });
  return toPlain(row);
}

/**
 * Supprime la fiche d'un fichier. Les lignes de commande qui l'utilisaient
 * gardent le nom du fichier (le lien devient vide).
 * @param {string} id
 * @returns {Promise<boolean>}
 */
export async function deleteFileRecord(id) {
  const deleted = await deleteById(getPrisma().uploadedFile, id);
  return Boolean(deleted);
}
