"use client";

/**
 * Carte d'un produit dans la liste de l'admin : photo, badges, nom, prix
 * et actions rapides (modifier, afficher/cacher, supprimer, voir sur le site).
 */
import Link from "next/link";
import { motion } from "motion/react";
import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { ProductImage } from "@/components/products/ProductImage";
import { getProductUrl } from "@/components/products/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCategoryLabel } from "@/config/catalog";
import { formatPrice } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

/**
 * @param {object} props
 * @param {object} props.product
 * @param {(product: object) => void} props.onToggle - afficher / cacher
 * @param {(product: object) => void} props.onDelete - demande de suppression
 * @param {number} [props.index] - position (décalage de l'animation)
 */
export function AdminProductCard({ product, onToggle, onDelete, index = 0 }) {
  const firstColor = product.colors[0];
  const image = product.images[0] || (firstColor ? firstColor.image : "");
  const isService = product.line === "service";

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index, 8) * 0.04 }}
      className={cn(
        "group flex gap-4 rounded-3xl border-2 border-ink bg-paper p-4 transition hover:-translate-y-1 hover:shadow-hard",
        !product.isActive && "bg-cream-dark/40"
      )}
    >
      <div className={cn("relative h-28 w-24 shrink-0 overflow-hidden rounded-2xl border-2 border-ink", !product.isActive && "opacity-50 grayscale")}>
        <ProductImage src={image} alt={product.name} category={product.category} color={firstColor?.hex} sizes="96px" />
        {/* Petite bande de couleur : cyan = atelier, magenta = collection */}
        <span className={cn("absolute inset-x-0 bottom-0 h-1.5", isService ? "bg-cyan" : "bg-magenta")} aria-hidden="true" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap gap-1.5">
          <Badge tone={isService ? "cyan" : "magenta"}>{isService ? "Atelier" : "Collection"}</Badge>
          {!product.isActive && <Badge tone="neutral">Caché</Badge>}
          {product.isFeatured && <Badge tone="yellow">★ En avant</Badge>}
        </div>
        <p className="truncate font-display text-lg font-bold">{product.name}</p>
        <p className="text-sm text-muted">
          {getCategoryLabel(product.category)} · <span className="font-semibold text-ink">{formatPrice(product.priceCents)}</span>
        </p>

        <div className="mt-auto flex flex-wrap gap-1 pt-2">
          <Button asChild variant="ghost" size="sm">
            <Link href={`/admin/produits/${product.id}`}>
              <Pencil aria-hidden="true" />
              Modifier
            </Link>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onToggle(product)}>
            {product.isActive ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
            {product.isActive ? "Cacher" : "Afficher"}
          </Button>
          <Button variant="ghost" size="sm" className="text-danger" onClick={() => onDelete(product)}>
            <Trash2 aria-hidden="true" />
            <span className="sr-only">Supprimer {product.name}</span>
          </Button>
          {product.isActive && (
            <Link href={getProductUrl(product)} target="_blank" className="self-center px-2 text-sm font-semibold text-magenta hover:underline">
              Voir ↗
            </Link>
          )}
        </div>
      </div>
    </motion.li>
  );
}
