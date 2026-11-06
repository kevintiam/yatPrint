"use client";

/**
 * Bouton du panier dans l'en-tête, avec une pastille jaune qui indique
 * le nombre d'articles. La pastille « rebondit » à chaque ajout.
 */
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/useCart";

export function CartButton() {
  const { itemCount, openDrawer } = useCart();

  const label =
    itemCount === 0 ? "Panier vide" : `Panier : ${itemCount} article${itemCount > 1 ? "s" : ""}`;

  return (
    <button
      type="button"
      onClick={openDrawer}
      className="relative grid size-11 place-items-center rounded-full border-2 border-ink bg-paper transition hover:-translate-y-0.5 hover:bg-yellow hover:shadow-hard-sm"
      aria-label={label}
    >
      <ShoppingBag className="size-5" aria-hidden="true" />

      <AnimatePresence>
        {itemCount > 0 && (
          <motion.span
            // La clé change avec le nombre : Motion rejoue l'animation à chaque ajout
            key={itemCount}
            initial={{ scale: 0.4 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
            className="absolute -right-1.5 -top-1.5 grid min-w-6 place-items-center rounded-full border-2 border-ink bg-magenta px-1 text-xs font-bold text-white"
            aria-hidden="true"
          >
            {itemCount}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
