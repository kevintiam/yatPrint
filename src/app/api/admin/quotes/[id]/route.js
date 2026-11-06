/**
 * PATCH /api/admin/quotes/<id>
 * Modifie le statut et/ou la note interne d'une demande de devis.
 * Corps : { status?, adminNote? }   Réponse : { item }
 */
import { jsonSuccess, handleApiError, readJsonBody, validateOrThrow } from "@/lib/server/responses";
import { ApiError } from "@/lib/server/ApiError";
import { requireAdmin } from "@/lib/server/requireAdmin";
import { quoteUpdateSchema } from "@/lib/validation/admin";
import { updateQuoteRequest } from "@/lib/db/quoteRequests";

export async function PATCH(request, { params }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const changes = validateOrThrow(quoteUpdateSchema, await readJsonBody(request));

    const quote = await updateQuoteRequest(id, changes);
    if (!quote) throw new ApiError(404, "Demande introuvable.");
    return jsonSuccess({ item: quote });
  } catch (error) {
    return handleApiError(error);
  }
}
