"use client";

/**
 * Hooks de la page Réglages de l'admin.
 *
 * - useAdminSettings() -> GET /api/admin/settings, PUT /api/admin/settings
 * - useAdminAccount()  -> GET /api/admin/account,  PATCH /api/admin/account
 */
import { axiosClient } from "@/lib/api/axiosClient";
import { useApiQuery } from "../useApiQuery";
import { useApiMutation } from "../useApiMutation";

/** Réglages de la boutique (coordonnées, livraison, taxes). */
export function useAdminSettings() {
  const query = useApiQuery("/admin/settings");
  const mutation = useApiMutation((values) => axiosClient.put("/admin/settings", values));

  /**
   * Enregistre les réglages puis affiche la version renvoyée par le serveur.
   * @param {object} values
   */
  async function saveSettings(values) {
    const result = await mutation.mutate(values);
    if (result.ok) {
      query.setData(result.data);
    }
    return result;
  }

  return {
    settings: query.data ? query.data.settings : null,
    isLoading: query.isLoading,
    loadError: query.error,
    saveSettings,
    isSaving: mutation.isLoading,
    fieldErrors: mutation.fieldErrors,
  };
}

/** Compte de l'admin connecté (nom, mot de passe). */
export function useAdminAccount() {
  const query = useApiQuery("/admin/account");
  const mutation = useApiMutation((values) => axiosClient.patch("/admin/account", values));

  /**
   * @param {{name: string, currentPassword: string, newPassword?: string, confirmPassword?: string}} values
   */
  async function updateAccount(values) {
    const result = await mutation.mutate(values);
    if (result.ok) {
      query.setData({ account: result.data.account });
    }
    return result;
  }

  return {
    account: query.data ? query.data.account : null,
    isLoading: query.isLoading,
    loadError: query.error,
    updateAccount,
    isSaving: mutation.isLoading,
    fieldErrors: mutation.fieldErrors,
  };
}
