"use client";

/**
 * Vide le panier une fois la commande confirmée (page de remerciement).
 * Ce composant n'affiche rien.
 */
import { useEffect } from "react";
import { cartStore } from "@/lib/cart/cartStore";

export function ClearCartOnMount() {
  useEffect(() => {
    cartStore.clear();
  }, []);

  return null;
}
