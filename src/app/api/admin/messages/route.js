/**
 * GET /api/admin/messages?status=new
 * Liste des messages de contact. Réponse : { messages }
 */
import { jsonSuccess, handleApiError } from "@/lib/server/responses";
import { requireAdmin } from "@/lib/server/requireAdmin";
import { listContactMessages } from "@/lib/db/contactMessages";
import { MESSAGE_STATUSES } from "@/config/statuses";

export async function GET(request) {
  try {
    await requireAdmin();
    const status = request.nextUrl.searchParams.get("status") || "";

    const messages = await listContactMessages({ status: MESSAGE_STATUSES[status] ? status : "" });
    return jsonSuccess({ messages });
  } catch (error) {
    return handleApiError(error);
  }
}
