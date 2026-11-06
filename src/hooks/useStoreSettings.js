"use client";

/**
 * Réglages de la boutique (courriel, téléphone, Instagram, prix de la
 * livraison, ramassage, taxes) dans un composant client du site public.
 *
 * Exemple :
 *   const settings = useStoreSettings();
 *   <a href={`mailto:${settings.email}`}>{settings.email}</a>
 *
 * Aucune requête : les réglages sont fournis par StoreSettingsProvider.
 */
import { useContext } from "react";
import { StoreSettingsContext } from "@/components/providers/StoreSettingsProvider";

/** @returns {{email: string, phone: string, city: string, instagramUrl: string, instagramHandle: string,
 *             shippingPriceCents: number, pickupEnabled: boolean, taxesEnabled: boolean}} */
export function useStoreSettings() {
  return useContext(StoreSettingsContext);
}
