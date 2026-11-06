"use client";

/**
 * Hook du panier : donne accès au contenu du panier et aux actions
 * (ajouter, modifier la quantité, retirer, vider, ouvrir le tiroir).
 *
 * Le panier vit dans le navigateur (voir lib/cart/cartStore.js) :
 * ce hook ne fait AUCUN appel d'API.
 */
import { useSyncExternalStore } from "react";
import { cartStore } from "@/lib/cart/cartStore";
import { countCartItems } from "@/lib/cart/cartUtils";
import { computeSubtotalCents } from "@/lib/services/pricing";

export function useCart() {
  // useSyncExternalStore redessine le composant à chaque changement du panier
  const items = useSyncExternalStore(cartStore.subscribe, cartStore.getItems, cartStore.getServerItems);
  const isDrawerOpen = useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getDrawerState,
    cartStore.getServerDrawerState
  );

  return {
    items,
    itemCount: countCartItems(items),
    subtotalCents: computeSubtotalCents(items),
    isDrawerOpen,

    /** Ajoute un article puis ouvre le tiroir pour montrer l'ajout. */
    addItem(item) {
      cartStore.addItem(item);
      cartStore.setDrawerOpen(true);
    },
    updateQuantity: cartStore.updateQuantity,
    removeItem: cartStore.removeItem,
    clearCart: cartStore.clear,
    openDrawer() {
      cartStore.setDrawerOpen(true);
    },
    closeDrawer() {
      cartStore.setDrawerOpen(false);
    },
    setDrawerOpen: cartStore.setDrawerOpen,
  };
}
