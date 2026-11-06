"use client";

/**
 * Hooks des commandes dans l'admin.
 *
 * - useAdminOrders(filters)       -> GET   /api/admin/orders?status=...&search=...&page=...
 * - useAdminOrdersExport()        -> GET   /api/admin/orders/export (fichier CSV)
 * - useAdminOrder(id)             -> GET   /api/admin/orders/<id>
 *                                    PATCH /api/admin/orders/<id>  (statut, notes)
 */
import { useState } from "react";
import { axiosClient } from "@/lib/api/axiosClient";
import { getApiErrorMessage } from "@/lib/api/apiErrors";
import { useApiQuery } from "../useApiQuery";
import { useApiMutation } from "../useApiMutation";

/**
 * Garde seulement les filtres remplis (on n'envoie pas « ?status= » vide).
 * @param {{status?: string, search?: string, page?: number}} filters
 */
function toQueryParams(filters) {
  const params = {};
  if (filters.status) params.status = filters.status;
  if (filters.search) params.search = filters.search;
  if (filters.page && filters.page > 1) params.page = filters.page;
  return params;
}

/**
 * Liste paginée des commandes.
 * @param {{status?: string, search?: string, page?: number}} filters
 */
export function useAdminOrders(filters) {
  const query = useApiQuery("/admin/orders", { params: toQueryParams(filters) });
  const data = query.data;

  return {
    orders: data ? data.orders : [],
    total: data ? data.total : 0,
    page: data ? data.page : 1,
    pageCount: data ? data.pageCount : 1,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Téléchargement des commandes en CSV (mêmes filtres que la liste, sans la page).
 * Le fichier est reçu en « blob » puis proposé au navigateur avec un lien temporaire.
 */
export function useAdminOrdersExport() {
  const [isExporting, setIsExporting] = useState(false);

  /**
   * @param {{status?: string, search?: string}} filters
   * @returns {Promise<{ok: boolean, message?: string}>}
   */
  async function exportOrders(filters) {
    setIsExporting(true);
    try {
      const params = toQueryParams({ status: filters.status, search: filters.search });
      const response = await axiosClient.get("/admin/orders/export", { params, responseType: "blob" });

      // Nom du fichier choisi par le serveur (en-tête Content-Disposition)
      const disposition = response.headers["content-disposition"] || "";
      const match = /filename="([^"]+)"/.exec(disposition);
      const fileName = match ? match[1] : "commandes-yatprint.csv";

      // Lien invisible cliqué automatiquement, puis supprimé
      const url = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      return { ok: true };
    } catch (error) {
      return { ok: false, message: getApiErrorMessage(error) };
    } finally {
      setIsExporting(false);
    }
  }

  return { exportOrders, isExporting };
}

/**
 * Détail d'une commande + modification.
 * @param {string} orderId
 */
export function useAdminOrder(orderId) {
  const query = useApiQuery(`/admin/orders/${orderId}`);
  const mutation = useApiMutation((changes) => axiosClient.patch(`/admin/orders/${orderId}`, changes));

  /**
   * Modifie la commande puis met l'écran à jour avec la réponse du serveur.
   * @param {{status?: string, note?: string, adminNote?: string}} changes
   */
  async function updateOrder(changes) {
    const result = await mutation.mutate(changes);
    if (result.ok) {
      query.setData(result.data);
    }
    return result;
  }

  return {
    order: query.data ? query.data.order : null,
    isLoading: query.isLoading,
    loadError: query.error,
    updateOrder,
    isSaving: mutation.isLoading,
    saveError: mutation.error,
  };
}
