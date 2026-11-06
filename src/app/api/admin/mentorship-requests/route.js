/**
 * GET /api/admin/mentorship-requests?status=new
 * Liste des demandes de mentorat. Réponse : { requests }
 */
import { jsonSuccess, handleApiError } from "@/lib/server/responses";
import { requireAdmin } from "@/lib/server/requireAdmin";
import { listMentorshipRequests } from "@/lib/db/mentorshipRequests";
import { MENTORSHIP_STATUSES } from "@/config/statuses";

export async function GET(request) {
  try {
    await requireAdmin();
    const status = request.nextUrl.searchParams.get("status") || "";

    const requests = await listMentorshipRequests({
      status: MENTORSHIP_STATUSES[status] ? status : "",
    });
    return jsonSuccess({ requests });
  } catch (error) {
    return handleApiError(error);
  }
}
