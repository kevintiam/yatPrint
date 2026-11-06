"use client";

/**
 * Hook du paiement : envoie le panier et les coordonnées à POST /api/checkout,
 * puis redirige le client vers la page de paiement Stripe
 * (ou vers la page de confirmation en mode démo).
 */
import { axiosClient } from "@/lib/api/axiosClient";
import { useApiMutation } from "./useApiMutation";

export function useCheckout() {
  const mutation = useApiMutation((payload) => axiosClient.post("/checkout", payload));

  /**
   * @param {object} payload - { items, customer, delivery, customerNote }
   * @returns {Promise<{ok: boolean, message?: string, fieldErrors?: object}>}
   */
  async function submitCheckout(payload) {
    const result = await mutation.mutate(payload);

    if (result.ok) {
      // Changement de page complet : la page Stripe est sur un autre site
      window.location.assign(result.data.redirectUrl);
    }
    return result;
  }

  return {
    submitCheckout,
    isSubmitting: mutation.isLoading,
    error: mutation.error,
    fieldErrors: mutation.fieldErrors,
  };
}
