/**
 * Fonctions ORM de la galerie de réalisations (table gallery_items).
 */
import { getPrisma } from "./prisma";
import { toPlain } from "./serialize";
import { deleteById, updateById, withoutUndefined } from "./helpers";

/**
 * Liste les photos de la galerie, dans l'ordre d'affichage.
 * @param {{includeHidden?: boolean, limit?: number}} [options]
 * @returns {Promise<object[]>}
 */
export async function listGalleryItems(options = {}) {
  const rows = await getPrisma().galleryItem.findMany({
    where: options.includeHidden ? {} : { isVisible: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    take: options.limit || 200,
  });
  return toPlain(rows);
}

/**
 * Ajoute une photo à la galerie.
 * @param {object} data - titre, catégorie, imageUrl...
 * @returns {Promise<object>}
 */
export async function createGalleryItem(data) {
  const row = await getPrisma().galleryItem.create({ data });
  return toPlain(row);
}

/**
 * Modifie une photo (titre, catégorie, visibilité, ordre).
 * @param {string} id
 * @param {object} changes
 * @returns {Promise<object|null>}
 */
export async function updateGalleryItem(id, changes) {
  return updateById(getPrisma().galleryItem, id, withoutUndefined(changes));
}

/**
 * Supprime une photo de la galerie.
 * @param {string} id
 * @returns {Promise<object|null>} la photo supprimée (pour effacer son fichier), ou null
 */
export async function deleteGalleryItem(id) {
  return deleteById(getPrisma().galleryItem, id);
}
