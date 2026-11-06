/**
 * GET /api/admin/counters
 * Petits compteurs du menu de l'admin :
 * { ordersToProcess, newQuotes, newMentorships, newMessages }
 */
import { jsonSuccess, handleApiError } from "@/lib/server/responses";
import { requireAdmin } from "@/lib/server/requireAdmin";
import { getAdminCounters } from "@/lib/db/stats";

export async function GET() {
  try {
    await requireAdmin();
    const counters = await getAdminCounters();
    return jsonSuccess(counters);
  } catch (error) {
    return handleApiError(error);
  }
}
