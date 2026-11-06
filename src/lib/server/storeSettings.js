/**
 * Lecture des réglages de la boutique pour l'AFFICHAGE des pages
 * (coordonnées, prix de la livraison, taxes).
 *
 * - `cache` (React) : pendant l'affichage d'une page, la base n'est lue qu'une
 *   seule fois même si le gabarit et la page demandent tous les deux les réglages.
 * - Si la base ne répond pas, on affiche les valeurs par défaut plutôt qu'une
 *   page d'erreur (le paiement, lui, relit toujours les vrais réglages).
 */
import { cache } from "react";
import { getStoreSettings } from "@/lib/db/settings";
import { DEFAULT_STORE_SETTINGS } from "@/config/brand";

export const loadStoreSettings = cache(async function loadStoreSettings() {
  try {
    return await getStoreSettings();
  } catch (error) {
    console.error("[réglages] Lecture impossible, valeurs par défaut utilisées :", error.message);
    return { ...DEFAULT_STORE_SETTINGS };
  }
});
