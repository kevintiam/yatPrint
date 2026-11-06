"use client";

/**
 * Hooks des produits dans l'admin.
 *
 * - useAdminProducts()         -> GET    /api/admin/products
 *                                 PATCH  /api/admin/products/<id>  (afficher / cacher)
 *                                 DELETE /api/admin/products/<id>
 * - useAdminProductEditor(id)  -> GET    /api/admin/products/<id>   (si modification)
 *                                 POST   /api/admin/products         (création)
 *                                 PUT    /api/admin/products/<id>   (modification)
 */
import { axiosClient } from "@/lib/api/axiosClient";
import { useApiQuery } from "../useApiQuery";
import { useApiMutation } from "../useApiMutation";

/** Liste des produits avec actions rapides. */
export function useAdminProducts() {
  const query = useApiQuery("/admin/products");
  const toggleMutation = useApiMutation(({ id, isActive }) =>
    axiosClient.patch(`/admin/products/${id}`, { isActive })
  );
  const deleteMutation = useApiMutation((id) => axiosClient.delete(`/admin/products/${id}`));

  /** Affiche ou cache un produit sur le site. */
  async function toggleActive(product) {
    const result = await toggleMutation.mutate({ id: product.id, isActive: !product.isActive });
    if (result.ok) query.refetch();
    return result;
  }

  /** Supprime définitivement un produit. */
  async function removeProduct(productId) {
    const result = await deleteMutation.mutate(productId);
    if (result.ok) query.refetch();
    return result;
  }

  return {
    products: query.data ? query.data.products : [],
    isLoading: query.isLoading,
    error: query.error || toggleMutation.error || deleteMutation.error,
    toggleActive,
    removeProduct,
  };
}

/**
 * Création ou modification d'un produit.
 * @param {string|null} productId - null pour un nouveau produit
 */
export function useAdminProductEditor(productId) {
  const query = useApiQuery(productId ? `/admin/products/${productId}` : null);
  const saveMutation = useApiMutation((values) => {
    if (productId) {
      return axiosClient.put(`/admin/products/${productId}`, values);
    }
    return axiosClient.post("/admin/products", values);
  });

  return {
    product: query.data ? query.data.product : null,
    isLoading: query.isLoading,
    loadError: query.error,
    saveProduct: saveMutation.mutate,
    isSaving: saveMutation.isLoading,
    saveError: saveMutation.error,
    fieldErrors: saveMutation.fieldErrors,
  };
}
