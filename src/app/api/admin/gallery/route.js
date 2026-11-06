/**
 * /api/admin/gallery
 *
 * GET  : toutes les photos, cachées comprises -> { items }
 * POST : ajoute une photo -> { item }
 *        Corps : { title, category, imageUrl, description?, sortOrder?, isVisible? }
 */
import { jsonSuccess, handleApiError, readJsonBody, validateOrThrow } from "@/lib/server/responses";
import { requireAdmin } from "@/lib/server/requireAdmin";
import { galleryItemSchema } from "@/lib/validation/admin";
import { createGalleryItem, listGalleryItems } from "@/lib/db/gallery";

export async function GET() {
  try {
    await requireAdmin();
    const items = await listGalleryItems({ includeHidden: true });
    return jsonSuccess({ items });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request) {
  try {
    await requireAdmin();
    const data = validateOrThrow(galleryItemSchema, await readJsonBody(request));

    const item = await createGalleryItem(data);
    return jsonSuccess({ item }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
