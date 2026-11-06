"use client";

/**
 * Galerie de réalisations : filtres par catégorie, grille en colonnes
 * façon « mosaïque », et agrandissement d'une photo au clic.
 */
import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { Expand } from "lucide-react";
import { Modal } from "@/components/ui/sheet";
import { GALLERY_CATEGORIES, getOptionLabel } from "@/config/options";
import { cn } from "@/lib/utils/cn";

/**
 * @param {object} props
 * @param {object[]} props.items - photos visibles de la galerie
 */
export function GalleryGrid({ items }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [openedItem, setOpenedItem] = useState(null);

  // Photos du filtre choisi
  const visibleItems = [];
  for (const item of items) {
    if (activeCategory === "all" || item.category === activeCategory) visibleItems.push(item);
  }

  const filters = [{ key: "all", label: "Tout" }];
  for (const [key, category] of Object.entries(GALLERY_CATEGORIES)) {
    filters.push({ key, label: category.label });
  }

  return (
    <>
      <div role="tablist" aria-label="Filtrer la galerie" className="scrollbar-none -mx-4 mb-10 flex gap-2 overflow-x-auto px-4">
        {filters.map((filter) => (
          <button
            key={filter.key}
            type="button"
            role="tab"
            aria-selected={filter.key === activeCategory}
            onClick={() => setActiveCategory(filter.key)}
            className={cn(
              "shrink-0 rounded-full border-2 border-ink px-5 py-2 font-semibold transition",
              filter.key === activeCategory ? "bg-ink text-cream shadow-[3px_3px_0_0_var(--color-yellow)]" : "bg-paper hover:bg-yellow"
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Colonnes CSS : les photos de hauteurs différentes s'empilent joliment */}
      <motion.div layout className="columns-2 gap-4 md:columns-3 lg:columns-4">
        <AnimatePresence mode="popLayout">
          {visibleItems.map((item, index) => (
            <motion.button
              key={item.id}
              type="button"
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.35, delay: (index % 8) * 0.04 }}
              onClick={() => setOpenedItem(item)}
              className="group relative mb-4 block w-full break-inside-avoid overflow-hidden rounded-3xl border-2 border-ink bg-white text-left"
              aria-label={`Agrandir : ${item.title}`}
            >
              <Image
                src={item.imageUrl}
                alt={item.title}
                width={600}
                height={index % 3 === 0 ? 750 : 600}
                unoptimized={item.imageUrl.startsWith("/api/")}
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                className={cn("w-full object-cover transition-transform duration-700 group-hover:scale-105", index % 3 === 0 ? "aspect-[4/5]" : "aspect-square")}
              />
              <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-ink/80 to-transparent p-4 pt-10 text-cream opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span>
                  <span className="block text-xs uppercase tracking-wider text-yellow">{getOptionLabel(GALLERY_CATEGORIES, item.category)}</span>
                  <span className="font-semibold">{item.title}</span>
                </span>
                <Expand className="size-5 shrink-0" aria-hidden="true" />
              </span>
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>

      <Modal open={Boolean(openedItem)} onOpenChange={(open) => !open && setOpenedItem(null)} title={openedItem ? openedItem.title : ""} className="max-w-3xl">
        {openedItem && (
          <figure>
            <div className="relative aspect-square overflow-hidden rounded-2xl border-2 border-ink bg-white">
              <Image
                src={openedItem.imageUrl}
                alt={openedItem.title}
                fill
                unoptimized={openedItem.imageUrl.startsWith("/api/")}
                sizes="(min-width: 768px) 48rem, 95vw"
                className="object-contain"
              />
            </div>
            {openedItem.description && <figcaption className="mt-3 text-ink-soft">{openedItem.description}</figcaption>}
          </figure>
        )}
      </Modal>
    </>
  );
}
