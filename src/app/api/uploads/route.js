/**
 * POST /api/uploads
 * Reçoit le fichier de design d'un client (configurateur).
 *
 * Corps : FormData avec un champ « file ».
 * Réponse : { file: { id, name, size, type } }
 *
 * Le fichier est PRIVÉ : seul l'admin peut le télécharger ensuite.
 */
import { jsonSuccess, handleApiError } from "@/lib/server/responses";
import { ApiError } from "@/lib/server/ApiError";
import { enforceRateLimit, RATE_LIMITS } from "@/lib/server/rateLimit";
import { getFileError } from "@/lib/validation/upload";
import { saveUploadedFile } from "@/lib/services/storage";
import { DESIGN_UPLOAD_RULES } from "@/config/catalog";
import { hasValidSignature } from "@/lib/server/fileSignature";


export async function POST(request) {
  try {
    await enforceRateLimit(request, "uploads", RATE_LIMITS.upload);

    const formData = await request.formData();
    const file = formData.get("file");

    // Vérification définitive (le navigateur a déjà vérifié, mais on ne lui fait pas confiance)
    const fileError = getFileError(file, DESIGN_UPLOAD_RULES);
    if (fileError) {
      throw new ApiError(400, fileError);
    }
        // Le type annoncé peut être faux : on vérifie le contenu réel
    if (!(await hasValidSignature(file))) {
      throw new ApiError(400, "Le contenu du fichier ne correspond pas à son format.");
    }

    const record = await saveUploadedFile(file, { purpose: "design", isPublic: false });

    return jsonSuccess(
      {
        file: {
          id: record.id,
          name: record.originalName,
          size: record.sizeBytes,
          type: record.mimeType,
        },
      },
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}
