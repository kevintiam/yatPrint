/**
 * GET /api/admin/orders?status=paid&search=dupont&page=2
 * Liste paginée des commandes pour l'admin (filtres facultatifs).
 * Réponse : { orders: [...], total, page, pageCount }
 */
import { jsonSuccess, handleApiError } from "@/lib/server/responses";
import { requireAdmin } from "@/lib/server/requireAdmin";
import { readOrderFilters } from "@/lib/server/orderFilters";
import { listOrders } from "@/lib/db/orders";

export async function GET(request) {
  try {
    await requireAdmin();
    const filters = readOrderFilters(request.nextUrl.searchParams);
    const result = await listOrders(filters);
    return jsonSuccess(result);
  } catch (error) {
    return handleApiError(error);
  }
}
