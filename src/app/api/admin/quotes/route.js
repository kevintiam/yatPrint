/**
 * GET /api/admin/quotes?status=new
 * Liste des demandes de devis entreprise. Réponse : { quotes }
 */
import { jsonSuccess, handleApiError } from "@/lib/server/responses";
import { requireAdmin } from "@/lib/server/requireAdmin";
import { listQuoteRequests } from "@/lib/db/quoteRequests";
import { QUOTE_STATUSES } from "@/config/statuses";

export async function GET(request) {
  try {
    await requireAdmin();
    const status = request.nextUrl.searchParams.get("status") || "";

    const quotes = await listQuoteRequests({ status: QUOTE_STATUSES[status] ? status : "" });
    return jsonSuccess({ quotes });
  } catch (error) {
    return handleApiError(error);
  }
}
