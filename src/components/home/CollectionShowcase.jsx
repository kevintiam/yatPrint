"use client";

/**
 * Section « Nouvelle collection » : grille de produits avec filtres
 * (Tout, T-shirts, Hoodies, Accessoires). Les cartes se réorganisent
 * en douceur quand on change de filtre (animation « layout » de Motion).
 *
 * Les produits sont lus dans la base par la page (serveur) puis passés ici.
 */
import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ProductCard } from "@/components/products/ProductCard";
import { SectionHeading } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

// Filtres : chaque filtre garde une liste de catégories (vide = tout)
const FILTERS = [
  { key: "all", label: "Tout", categories: [] },
  { key: "tshirt", label: "T-shirts", categories: ["tshirt"] },
  { key: "hoodie", label: "Hoodies", categories: ["hoodie"] },
  { key: "accessories", label: "Accessoires", categories: ["mug", "tote", "frame", "engraving"] },
];

/**
 * Garde les produits d'un filtre.
 * @param {object[]} products
 * @param {{categories: string[]}} filter
 */
function filterProducts(products, filter) {
  if (filter.categories.length === 0) return products;

  const result = [];
  for (const product of products) {
    if (filter.categories.includes(product.category)) result.push(product);
  }
  return result;
}

/**
 * @param {object} props
 * @param {object[]} props.products - produits de la collection
 * @param {string} [props.eyebrow]
 * @param {string} [props.title]
 * @param {number} [props.limit] - nombre maximum de cartes affichées
 * @param {boolean} [props.showMoreLink] - bouton « Voir toute la collection »
 */
export function CollectionShowcase({
  products,
  eyebrow = "Explorer",
  title = "Notre nouvelle collection",
  limit = 8,
  showMoreLink = true,
}) {
  const [activeFilterKey, setActiveFilterKey] = useState("all");

  let activeFilter = FILTERS[0];
  for (const filter of FILTERS) {
    if (filter.key === activeFilterKey) activeFilter = filter;
  }
  const visibleProducts = filterProducts(products, activeFilter).slice(0, limit);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading eyebrow={eyebrow} title={title} className="mb-0" />

        <div role="tablist" aria-label="Filtrer par catégorie" className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:px-0">
          {FILTERS.map((filter) => {
            const isActive = filter.key === activeFilterKey;
            return (
              <button
                key={filter.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveFilterKey(filter.key)}
                className={cn(
                  "shrink-0 rounded-full border-2 border-ink px-5 py-2 font-semibold transition",
                  isActive ? "bg-ink text-cream shadow-[3px_3px_0_0_var(--color-magenta)]" : "bg-paper hover:bg-yellow"
                )}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      <motion.ul layout className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {visibleProducts.map((product, index) => (
            <motion.li
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.35, delay: index * 0.04 }}
            >
              <ProductCard product={product} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      {visibleProducts.length === 0 && (
        <p className="mt-10 text-center text-muted">Aucun article dans cette catégorie pour le moment.</p>
      )}

      {showMoreLink && (
        <div className="mt-12 flex justify-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/collection">
              Voir toute la collection
            </Link>
          </Button>
        </div>
      )}
    </section>
  );
}
