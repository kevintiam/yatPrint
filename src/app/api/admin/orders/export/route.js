/**
 * GET /api/admin/orders/export?status=paid&search=dupont
 * Télécharge les commandes (mêmes filtres que la liste) en fichier CSV.
 */
import { handleApiError } from "@/lib/server/responses";
import { requireAdmin } from "@/lib/server/requireAdmin";
import { readOrderFilters } from "@/lib/server/orderFilters";
import { listOrdersForExport } from "@/lib/db/orders";
import { buildOrdersCsv } from "@/lib/services/ordersCsv";

export async function GET(request) {
  try {
    await requireAdmin();
    const filters = readOrderFilters(request.nextUrl.searchParams);
    const orders = await listOrdersForExport(filters);

    const today = new Date().toISOString().slice(0, 10);
    return new Response(buildOrdersCsv(orders), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="commandes-yatprint-${today}.csv"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
