"use client";

/**
 * Hooks des formulaires publics. Chacun envoie les données à sa route API :
 *
 * - useQuoteRequest       -> POST /api/quotes                (page Entreprises)
 * - useMentorshipRequest  -> POST /api/mentorship-requests   (page Mentorat)
 * - useContactMessage     -> POST /api/contact               (page Contact)
 * - useOrderTracking      -> POST /api/orders/track          (page Suivi de commande)
 *
 * Tous renvoient : { submit(values), isLoading, error, fieldErrors, data, reset }
 */
import { axiosClient } from "@/lib/api/axiosClient";
import { useApiMutation } from "./useApiMutation";

/**
 * Met en forme le résultat de useApiMutation avec un nom d'action commun : submit.
 * @param {ReturnType<typeof useApiMutation>} mutation
 */
function toFormHook(mutation) {
  return {
    submit: mutation.mutate,
    isLoading: mutation.isLoading,
    error: mutation.error,
    fieldErrors: mutation.fieldErrors,
    data: mutation.data,
    reset: mutation.reset,
  };
}

/** Demande de devis entreprise. */
export function useQuoteRequest() {
  const mutation = useApiMutation((values) => axiosClient.post("/quotes", values));
  return toFormHook(mutation);
}

/** Demande de réservation de mentorat. */
export function useMentorshipRequest() {
  const mutation = useApiMutation((values) => axiosClient.post("/mentorship-requests", values));
  return toFormHook(mutation);
}

/** Message de contact. */
export function useContactMessage() {
  const mutation = useApiMutation((values) => axiosClient.post("/contact", values));
  return toFormHook(mutation);
}

/** Recherche d'une commande (numéro + courriel) pour afficher son suivi. */
export function useOrderTracking() {
  const mutation = useApiMutation((values) => axiosClient.post("/orders/track", values));
  return toFormHook(mutation);
}
