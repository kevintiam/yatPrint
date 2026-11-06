/**
 * PATCH /api/admin/messages/<id>
 * Change le statut d'un message (non lu, lu, archivé).
 * Corps : { status }   Réponse : { item }
 */
import { jsonSuccess, handleApiError, readJsonBody, validateOrThrow } from "@/lib/server/responses";
import { ApiError } from "@/lib/server/ApiError";
import { requireAdmin } from "@/lib/server/requireAdmin";
import { messageUpdateSchema } from "@/lib/validation/admin";
import { updateContactMessageStatus } from "@/lib/db/contactMessages";

export async function PATCH(request, { params }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const { status } = validateOrThrow(messageUpdateSchema, await readJsonBody(request));

    const message = await updateContactMessageStatus(id, status);
    if (!message) throw new ApiError(404, "Message introuvable.");
    return jsonSuccess({ item: message });
  } catch (error) {
    return handleApiError(error);
  }
}
