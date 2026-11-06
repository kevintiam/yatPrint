"use client";

/**
 * Rend les réglages de la boutique disponibles dans tous les composants
 * « client » du site public (menu mobile, panier, formulaire de paiement).
 *
 * Le gabarit (app/(site)/layout.jsx) lit les réglages sur le serveur et les
 * donne à ce fournisseur. Les composants les lisent avec le hook useStoreSettings().
 */
import { createContext } from "react";
import { DEFAULT_STORE_SETTINGS } from "@/config/brand";

export const StoreSettingsContext = createContext(DEFAULT_STORE_SETTINGS);

/**
 * @param {object} props
 * @param {object} props.settings - réglages lus dans la base
 * @param {React.ReactNode} props.children
 */
export function StoreSettingsProvider({ settings, children }) {
  return <StoreSettingsContext.Provider value={settings}>{children}</StoreSettingsContext.Provider>;
}
