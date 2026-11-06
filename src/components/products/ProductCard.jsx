/**
 * Carte d'un produit dans une grille (accueil, collection, atelier).
 *
 * Effets au survol (en CSS) : la carte se soulève, son ombre « imprimée »
 * grandit, la photo zoome légèrement et un bouton apparaît.
 */
import Link from "next/link";
import { ProductImage } from "./ProductImage";
import { ColorDots } from "./ColorDots";
import { QuickAddToCart } from "./QuickAddToCart";
import { Badge } from "@/components/ui/badge";
import { PRODUCT_LINES, getCategoryLabel } from "@/config/catalog";
import { formatPrice } from "@/lib/utils/format";

/**
 * Adresse de la page d'un produit selon sa ligne.
 * @param {{line: string, slug: string}} product
 * @returns {string}
 */
export function getProductUrl(product) {
  return `${PRODUCT_LINES[product.line].path}/${product.slug}`;
}

/**
 * @param {object} props
 * @param {object} props.product - produit sérialisé (voir lib/db/products.js)
 * @param {boolean} [props.priority] - charger la photo en priorité
 */
export function ProductCard({ product, priority = false }) {
  const isService = product.line === "service";
  // Photo : la première photo du produit, sinon celle de la première couleur
  const firstColor = product.colors[0];
  const image = product.images[0] || (firstColor ? firstColor.image : "");

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border-2 border-ink bg-paper transition-all duration-300 hover:-translate-y-1.5 hover:shadow-hard-lg">
      <div className="relative aspect-[4/5] overflow-hidden border-b-2 border-ink">
        <ProductImage
          src={image}
          alt={product.name}
          category={product.category}
          color={firstColor ? firstColor.hex : undefined}
          priority={priority}
          className="transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <Badge tone={isService ? "cyan" : "magenta"} className="border-ink bg-paper">
            {isService ? "Personnalisable" : "Collection"}
          </Badge>
        </div>

        {/* Bouton qui apparaît au survol */}
        <span className="absolute bottom-3 right-3 flex translate-y-3 items-center gap-1 rounded-full border-2 border-ink bg-yellow px-4 py-2 text-sm font-bold opacity-0 shadow-hard-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          {isService ? "Personnaliser" : "Voir"}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-muted">{getCategoryLabel(product.category)}</p>
        <h3 className="font-display text-xl font-bold leading-tight transition-colors group-hover:text-magenta">
          {/* Lien étiré : toute la carte est cliquable, sauf le bouton panier */}
          <Link href={getProductUrl(product)} className="after:absolute after:inset-0 after:content-['']">
            {product.name}
          </Link>
        </h3>
        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <p className="text-lg font-extrabold">{formatPrice(product.priceCents)}</p>
          <ColorDots colors={product.colors} />
        </div>
        {!isService && (
          <div className="relative z-10 pt-2">
            <QuickAddToCart product={product} />
          </div>
        )}
      </div>
    </div>
  );
}
