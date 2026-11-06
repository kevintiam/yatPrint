/**
 * GET /api/admin/stats
 * Chiffres du tableau de bord : ventes du mois, ventes des 30 derniers jours,
 * commandes par statut, meilleurs produits, dernières commandes, demandes non lues.
 */
import { jsonSuccess, handleApiError } from "@/lib/server/responses";
import { requireAdmin } from "@/lib/server/requireAdmin";
import { getDashboardStats } from "@/lib/db/stats";

export async function GET() {
  try {
    await requireAdmin();
    const stats = await getDashboardStats();
    return jsonSuccess(stats);
  } catch (error) {
    return handleApiError(error);
  }
}
