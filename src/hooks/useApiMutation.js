"use client";

/**
 * Hook générique pour ENVOYER des données (POST, PATCH, DELETE).
 *
 * On lui donne une fonction qui fait la requête Axios ; il gère pour nous
 * l'état de chargement, le message d'erreur et les erreurs par champ.
 *
 * Exemple :
 *   const { mutate, isLoading, error, fieldErrors } = useApiMutation(
 *     (values) => axiosClient.post("/quotes", values)
 *   );
 *   const result = await mutate(formValues);
 *   if (result.ok) { ... }
 */
import { useState } from "react";
import { getApiErrorMessage, getApiFieldErrors } from "@/lib/api/apiErrors";

/**
 * @param {(variables: any) => Promise<import("axios").AxiosResponse>} requestFn
 * @returns {{
 *   mutate: (variables?: any) => Promise<{ok: boolean, data?: any, message?: string, fieldErrors?: object}>,
 *   isLoading: boolean, error: string, fieldErrors: Record<string, string>,
 *   data: any, reset: Function, setFieldErrors: Function
 * }}
 */
export function useApiMutation(requestFn) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [data, setData] = useState(null);

  /**
   * Lance la requête. Renvoie toujours un objet { ok, ... } : pas besoin de try/catch.
   * @param {any} [variables] - données transmises à requestFn
   */
  async function mutate(variables) {
    setIsLoading(true);
    setError("");
    setFieldErrors({});

    try {
      const response = await requestFn(variables);
      setData(response.data);
      return { ok: true, data: response.data };
    } catch (requestError) {
      const message = getApiErrorMessage(requestError);
      const errorsByField = getApiFieldErrors(requestError);
      setError(message);
      setFieldErrors(errorsByField);
      return { ok: false, message, fieldErrors: errorsByField };
    } finally {
      setIsLoading(false);
    }
  }

  /** Remet le hook à zéro (ex. pour remplir à nouveau un formulaire). */
  function reset() {
    setError("");
    setFieldErrors({});
    setData(null);
  }

  return { mutate, isLoading, error, fieldErrors, data, reset, setFieldErrors };
}
