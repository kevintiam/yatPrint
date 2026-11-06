"use client";

/**
 * Une ligne du panier : photo, nom, options choisies, quantité, prix, suppression.
 * Utilisée dans le tiroir du panier (version compacte) et sur la page Panier.
 */
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { ProductImage } from "@/components/products/ProductImage";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { useCart } from "@/hooks/useCart";
import { PRODUCT_LINES } from "@/config/catalog";
import { formatPrice } from "@/lib/utils/format";
import { getItemOptionList } from "@/lib/utils/itemOptions";
import { cn } from "@/lib/utils/cn";

/**
 * @param {object} props
 * @param {object} props.item - ligne du panier
 * @param {boolean} [props.compact] - version réduite pour le tiroir
 * @param {() => void} [props.onNavigate] - appelé quand on clique sur le nom (ex. fermer le tiroir)
 */
export function CartLine({ item, compact = false, onNavigate }) {
  const { updateQuantity, removeItem } = useCart();
  const options = getItemOptionList(item);
  const productUrl = `${PRODUCT_LINES[item.line]?.path || ""}/${item.slug}`;

  return (
    <li className={cn("flex gap-4", compact ? "py-4" : "rounded-3xl border-2 border-ink bg-paper p-4 sm:p-5")}>
      <div
        className={cn(
          "relative shrink-0 overflow-hidden rounded-2xl border-2 border-ink",
          compact ? "size-20" : "size-24 sm:size-28"
        )}
      >
        <ProductImage src={item.image} alt={item.name} category={item.category} sizes="120px" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <Link href={productUrl} onClick={onNavigate} className="font-display text-lg font-bold leading-tight hover:text-magenta">
            {item.name}
          </Link>
          <p className="shrink-0 font-bold">{formatPrice(item.unitPriceCents * item.quantity)}</p>
        </div>

        {options.length > 0 && (
          <ul className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted">
            {options.map((option) => (
              <li key={option.label} className="max-w-full truncate">
                <span className="font-semibold text-ink-soft">{option.label} :</span> {option.value}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex items-center justify-between gap-3">
          <QuantityStepper
            size="sm"
            value={item.quantity}
            onChange={(quantity) => updateQuantity(item.lineId, quantity)}
            label={`Quantité de ${item.name}`}
          />
          <button
            type="button"
            onClick={() => removeItem(item.lineId)}
            className="flex items-center gap-1 rounded-full px-2 py-1 text-sm font-semibold text-muted transition hover:bg-danger-soft hover:text-danger"
          >
            <Trash2 className="size-4" aria-hidden="true" />
            Retirer
          </button>
        </div>
      </div>
    </li>
  );
}
