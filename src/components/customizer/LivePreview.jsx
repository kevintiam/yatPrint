"use client";

/**
 * Aperçu en direct de l'article personnalisé.
 *
 * - Affiche la photo de l'article dans la couleur (ou le matériau) choisi.
 * - Dessine la zone d'impression en pointillés à l'emplacement choisi.
 * - Place le design téléversé et/ou le texte dans cette zone.
 *
 * C'est un aperçu INDICATIF : le rendu final est vérifié avant l'impression.
 */
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ProductIllustration } from "@/components/products/ProductIllustration";
import { PLACEMENTS } from "@/config/catalog";
import { isDarkColor } from "@/lib/utils/color";
import { cn } from "@/lib/utils/cn";

// Zone utilisée pour les objets (tasse, cadre, gravure) : au centre
const OBJECT_ZONE = { top: 30, left: 24, width: 52, height: 36 };

/**
 * Cherche la zone d'impression d'un emplacement.
 * @param {string} placementKey
 */
function getZone(placementKey) {
  for (const placement of PLACEMENTS) {
    if (placement.key === placementKey) return placement.zone;
  }
  return OBJECT_ZONE;
}

/**
 * @param {object} props
 * @param {string} props.image - photo de l'article (peut être vide)
 * @param {string} props.category
 * @param {string} [props.colorHex] - couleur de l'illustration de secours
 * @param {string} props.productName
 * @param {string} [props.placement] - emplacement choisi (vêtements)
 * @param {string} [props.designPreviewUrl] - aperçu local de l'image téléversée
 * @param {string} [props.printText] - texte à imprimer
 * @param {string} [props.badge] - petite étiquette (ex. couleur sur demande)
 */
export function LivePreview({ image, category, colorHex, productName, placement, designPreviewUrl, printText, badge }) {
  const zone = placement ? getZone(placement) : OBJECT_ZONE;
  const hasContent = Boolean(designPreviewUrl || printText);

  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border-2 border-ink bg-white shadow-hard-lg">
      {/* Photo (fondu quand la couleur change) */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={image || colorHex || category}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="absolute inset-0"
        >
          {image ? (
            <Image src={image} alt={productName} fill priority sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover" />
          ) : (
            <div className="grid size-full place-items-center bg-paper p-10">
              <ProductIllustration category={category} color={colorHex} label={productName} className="h-full w-auto" />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Zone d'impression, déplacée en douceur quand l'emplacement change */}
      <motion.div
        className="absolute flex items-center justify-center rounded-lg border-2 border-dashed border-magenta/70 bg-magenta/5"
        animate={{ top: `${zone.top}%`, left: `${zone.left}%`, width: `${zone.width}%`, height: `${zone.height}%` }}
        transition={{ type: "spring", stiffness: 200, damping: 24 }}
        aria-hidden="true"
      >
        {!hasContent && (
          <span className="px-2 text-center text-[0.65rem] font-bold uppercase tracking-wider text-magenta sm:text-xs">
            Zone d&apos;impression
          </span>
        )}
        {hasContent && (
          <div className="flex size-full flex-col items-center justify-center gap-1 overflow-hidden p-1">
            {designPreviewUrl && (
              // Image locale (aperçu du fichier choisi) : <img> classique, pas besoin d'optimisation
              // eslint-disable-next-line @next/next/no-img-element
              <img src={designPreviewUrl} alt="" className="max-h-full min-h-0 max-w-full flex-1 object-contain" />
            )}
            {printText && (
              <span
                className={cn(
                  "line-clamp-2 break-words text-center font-display text-[clamp(0.6rem,2.2vw,1.2rem)] font-extrabold leading-tight",
                  // Texte blanc sur un article foncé, noir sur un article clair
                  colorHex && isDarkColor(colorHex) ? "text-white" : "text-ink"
                )}
              >
                {printText}
              </span>
            )}
          </div>
        )}
      </motion.div>

      {badge && (
        <span className="absolute left-4 top-4 rounded-full border-2 border-ink bg-yellow px-3 py-1 text-xs font-bold">
          {badge}
        </span>
      )}
      <span className="absolute bottom-4 right-4 rounded-full bg-ink/80 px-3 py-1 text-xs font-semibold text-cream">
        Aperçu indicatif
      </span>
    </div>
  );
}
