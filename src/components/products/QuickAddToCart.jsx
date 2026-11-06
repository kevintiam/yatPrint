"use client";

/**
 * Ajout rapide au panier depuis une carte produit (articles de la collection).
 *
 * - Article sans taille : un clic l'ajoute directement (1 exemplaire, 1re couleur).
 * - Article avec tailles : le premier clic affiche les tailles,
 *   choisir une taille ajoute l'article.
 */
import { useState } from "react";
import { toast } from "sonner";
import { ShoppingBag, X } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { buildCartItem } from "@/lib/cart/customizerRules";

/**
 * @param {object} props
 * @param {object} props.product - produit de la ligne « collection »
 */
export function QuickAddToCart({ product }) {
  const { addItem } = useCart();
  const [isChoosingSize, setIsChoosingSize] = useState(false);

  function add(size) {
    const choices = {
      colorName: product.colors.length > 0 ? product.colors[0].name : "",
      isCustomColor: false,
      customColor: "",
      size,
      materialKey: "",
      placement: "",
      printText: "",
      instructions: "",
      quantity: 1,
    };
    addItem(buildCartItem(product, choices));
    toast.success(size ? `${product.name} (${size}) ajouté au panier !` : `${product.name} ajouté au panier !`);
    setIsChoosingSize(false);
  }

  function handleMainClick() {
    if (product.sizes.length > 0) {
      setIsChoosingSize(true);
    } else {
      add("");
    }
  }

  if (isChoosingSize) {
    return (
      <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label={`Taille pour ${product.name}`}>
        {product.sizes.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => add(size)}
            className="min-w-10 rounded-full border-2 border-ink bg-paper px-2.5 py-1 text-sm font-bold transition hover:bg-yellow"
          >
            {size}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setIsChoosingSize(false)}
          className="ml-auto rounded-full p-1.5 text-muted transition hover:bg-ink/5 hover:text-ink"
          aria-label="Annuler"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleMainClick}
      className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-ink bg-ink px-4 py-2.5 text-sm font-bold text-cream transition hover:bg-magenta hover:shadow-hard-sm"
    >
      <ShoppingBag className="size-4" aria-hidden="true" />
      Ajouter au panier
    </button>
  );
}
