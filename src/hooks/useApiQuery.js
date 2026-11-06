"use client";

/**
 * Hook générique pour LIRE des données avec une requête GET.
 * Les hooks spécialisés (useAdminOrders, useAdminQuotes...) s'appuient dessus.
 *
 * Exemple :
 *   const { data, isLoading, error, refetch } = useApiQuery("/admin/orders", { params: { status: "paid" } });
 *
 * Fonctionnement : chaque requête a une « clé » (adresse + paramètres + compteur).
 * Tant que la réponse de la clé actuelle n'est pas arrivée, isLoading vaut true.
 */
import { useCallback, useEffect, useState } from "react";
import { axiosClient } from "@/lib/api/axiosClient";
import { getApiErrorMessage } from "@/lib/api/apiErrors";

/**
 * @param {string|null} url - adresse après /api (null = ne rien charger)
 * @param {object} [options]
 * @param {object} [options.params] - paramètres ajoutés à l'adresse (?status=paid)
 * @returns {{data: any, isLoading: boolean, error: string, refetch: Function, setData: Function}}
 */
export function useApiQuery(url, options = {}) {
  const paramsText = JSON.stringify(options.params || {});
  const [reloadCount, setReloadCount] = useState(0);
  const requestKey = url ? `${url}?${paramsText}#${reloadCount}` : null;

  // Dernier résultat reçu : à quelle requête il correspond, les données, l'erreur
  const [result, setResult] = useState({ key: null, data: null, error: "" });

  useEffect(() => {
    if (!requestKey) return undefined;

    // AbortController permet d'annuler la requête si le composant disparaît
    const controller = new AbortController();

    async function load() {
      try {
        const response = await axiosClient.get(url, {
          params: JSON.parse(paramsText),
          signal: controller.signal,
        });
        setResult({ key: requestKey, data: response.data, error: "" });
      } catch (error) {
        if (controller.signal.aborted) return;
        // En cas d'erreur, on garde les anciennes données affichées
        setResult((previous) => ({ key: requestKey, data: previous.data, error: getApiErrorMessage(error) }));
      }
    }

    load();
    return () => controller.abort();
  }, [requestKey, url, paramsText]);

  /** Relance la requête (ex. après une modification). */
  const refetch = useCallback(() => {
    setReloadCount((count) => count + 1);
  }, []);

  /** Modifie les données affichées sans recharger (mise à jour immédiate de l'écran). */
  const setData = useCallback((updater) => {
    setResult((previous) => ({
      ...previous,
      data: typeof updater === "function" ? updater(previous.data) : updater,
    }));
  }, []);

  return {
    data: result.data,
    isLoading: Boolean(requestKey) && result.key !== requestKey,
    error: result.error,
    refetch,
    setData,
  };
}
