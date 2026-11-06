"use client";

/**
 * Hooks des chiffres de l'admin.
 *
 * - useAdminDashboard()          -> GET /api/admin/stats     (tableau de bord complet)
 * - useAdminCounters(refreshKey) -> GET /api/admin/counters  (pastilles du menu)
 */
import { useApiQuery } from "../useApiQuery";

export function useAdminDashboard() {
  const query = useApiQuery("/admin/stats");

  return {
    stats: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Compteurs du menu (commandes à traiter, nouvelles demandes).
 * @param {string} refreshKey - ex. l'adresse de la page : les compteurs sont
 *   relus à chaque changement de page (la valeur est ignorée par le serveur).
 */
export function useAdminCounters(refreshKey) {
  const query = useApiQuery("/admin/counters", { params: { page: refreshKey } });

  return {
    // On garde les anciens chiffres affichés pendant le rechargement
    counters: query.data || { ordersToProcess: 0, newQuotes: 0, newMentorships: 0, newMessages: 0 },
  };
}
