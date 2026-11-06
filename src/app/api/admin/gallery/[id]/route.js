/**
 * /api/admin/gallery/<id>
 *
 * PATCH  : modifie une photo (titre, catégorie, visibilité, ordre) -> { item }
 * DELETE : supprime la photo (et son fichier s'il a été téléversé) -> { ok: true }
 */
import { jsonSuccess, handleApiError, readJsonBody, validateOrThrow } from "@/lib/server/responses";
import { ApiError } from "@/lib/server/ApiError";
import { requireAdmin } from "@/lib/server/requireAdmin";
import { galleryUpdateSchema } from "@/lib/validation/admin";
import { deleteGalleryItem, updateGalleryItem } from "@/lib/db/gallery";
import { deleteStoredFile, getFileIdFromUrl } from "@/lib/services/storage";

export async function PATCH(request, { params }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const changes = validateOrThrow(galleryUpdateSchema, await readJsonBody(request));

    const item = await updateGalleryItem(id, changes);
    if (!item) throw new ApiError(404, "Photo introuvable.");
    return jsonSuccess({ item });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request, { params }) {
  try {
    await requireAdmin();
    const { id } = await params;

    const item = await deleteGalleryItem(id);
    if (!item) throw new ApiError(404, "Photo introuvable.");

    // Photo téléversée dans l'admin : on efface aussi le fichier du disque.
    // (Les photos de départ du dossier public/ ne sont pas touchées.)
    const fileId = getFileIdFromUrl(item.imageUrl);
    if (fileId) {
      await deleteStoredFile(fileId);
    }

    return jsonSuccess({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
