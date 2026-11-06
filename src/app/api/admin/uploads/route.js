/**
 * POST /api/admin/uploads
 * Téléverse une photo de produit ou de galerie (fichier PUBLIC).
 *
 * Corps : FormData avec « file » et « purpose » ("product" ou "gallery").
 * Réponse : { url: "/api/files/<id>" }
 */
import { jsonSuccess, handleApiError } from "@/lib/server/responses";
import { ApiError } from "@/lib/server/ApiError";
import { requireAdmin } from "@/lib/server/requireAdmin";
import { getFileError } from "@/lib/validation/upload";
import { getFileUrl, saveUploadedFile } from "@/lib/services/storage";
import { IMAGE_UPLOAD_RULES } from "@/config/catalog";
import { hasValidSignature } from "@/lib/server/fileSignature";


export async function POST(request) {
  try {
    await requireAdmin();

    const formData = await request.formData();
    const file = formData.get("file");
    const purpose = formData.get("purpose");

    if (purpose !== "product" && purpose !== "gallery") {
      throw new ApiError(400, "Destination de la photo invalide.");
    }

    const fileError = getFileError(file, IMAGE_UPLOAD_RULES);
    if (fileError) {
      throw new ApiError(400, fileError);
    }
        // Le type annoncé peut être faux : on vérifie le contenu réel
    if (!(await hasValidSignature(file))) {
      throw new ApiError(400, "Le contenu du fichier ne correspond pas à son format.");
    }


    const record = await saveUploadedFile(file, { purpose, isPublic: true });
    return jsonSuccess({ url: getFileUrl(record.id) }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
