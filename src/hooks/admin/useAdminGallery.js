"use client";

/**
 * Gestion de la galerie dans l'admin.
 *
 * GET    /api/admin/gallery        liste (photos cachées comprises)
 * POST   /api/admin/gallery        ajout
 * PATCH  /api/admin/gallery/<id>   modification (visibilité, titre, ordre)
 * DELETE /api/admin/gallery/<id>   suppression
 */
import { axiosClient } from "@/lib/api/axiosClient";
import { useApiQuery } from "../useApiQuery";
import { useApiMutation } from "../useApiMutation";

export function useAdminGallery() {
  const query = useApiQuery("/admin/gallery");
  const createMutation = useApiMutation((values) => axiosClient.post("/admin/gallery", values));
  const updateMutation = useApiMutation(({ id, changes }) => axiosClient.patch(`/admin/gallery/${id}`, changes));
  const deleteMutation = useApiMutation((id) => axiosClient.delete(`/admin/gallery/${id}`));

  /** Ajoute une photo puis recharge la liste. */
  async function addItem(values) {
    const result = await createMutation.mutate(values);
    if (result.ok) query.refetch();
    return result;
  }

  /** Modifie une photo puis recharge la liste. */
  async function updateItem(id, changes) {
    const result = await updateMutation.mutate({ id, changes });
    if (result.ok) query.refetch();
    return result;
  }

  /** Supprime une photo puis recharge la liste. */
  async function removeItem(id) {
    const result = await deleteMutation.mutate(id);
    if (result.ok) query.refetch();
    return result;
  }

  return {
    items: query.data ? query.data.items : [],
    isLoading: query.isLoading,
    error: query.error || updateMutation.error || deleteMutation.error,
    addItem,
    isAdding: createMutation.isLoading,
    addError: createMutation.error,
    addFieldErrors: createMutation.fieldErrors,
    updateItem,
    removeItem,
  };
}
