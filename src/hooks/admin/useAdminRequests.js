"use client";

/**
 * Hooks des demandes reçues, dans l'admin :
 *
 * - useAdminQuotes(status)      -> /api/admin/quotes                (devis entreprise)
 * - useAdminMentorships(status) -> /api/admin/mentorship-requests   (mentorat)
 * - useAdminMessages(status)    -> /api/admin/messages              (contact)
 *
 * Les trois fonctionnent pareil : une liste (GET) + une modification (PATCH /<id>).
 */
import { axiosClient } from "@/lib/api/axiosClient";
import { useApiQuery } from "../useApiQuery";
import { useApiMutation } from "../useApiMutation";

/**
 * Hook commun aux trois listes.
 * @param {string} basePath - ex. "/admin/quotes"
 * @param {string} listKey - nom de la liste dans la réponse, ex. "quotes"
 * @param {string} [status] - filtre facultatif
 */
function useRequestList(basePath, listKey, status) {
  const params = status ? { status } : {};
  const query = useApiQuery(basePath, { params });
  const mutation = useApiMutation(({ id, changes }) => axiosClient.patch(`${basePath}/${id}`, changes));

  /**
   * Modifie une demande, puis remplace la ligne affichée par la version du serveur.
   * @param {string} id
   * @param {object} changes - ex. { status: "contacted" }
   */
  async function updateRequest(id, changes) {
    const result = await mutation.mutate({ id, changes });
    if (result.ok) {
      const updated = result.data.item;
      query.setData((previous) => {
        if (!previous) return previous;
        const newList = [];
        for (const entry of previous[listKey]) {
          newList.push(entry.id === id ? updated : entry);
        }
        return { ...previous, [listKey]: newList };
      });
    }
    return result;
  }

  return {
    items: query.data ? query.data[listKey] : [],
    isLoading: query.isLoading,
    error: query.error || mutation.error,
    isSaving: mutation.isLoading,
    updateRequest,
    refetch: query.refetch,
  };
}

/** Demandes de devis entreprise. */
export function useAdminQuotes(status) {
  return useRequestList("/admin/quotes", "quotes", status);
}

/** Demandes de mentorat. */
export function useAdminMentorships(status) {
  return useRequestList("/admin/mentorship-requests", "requests", status);
}

/** Messages de contact. */
export function useAdminMessages(status) {
  return useRequestList("/admin/messages", "messages", status);
}
