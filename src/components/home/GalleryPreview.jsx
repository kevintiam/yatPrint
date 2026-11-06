/**
 * Aperçu de la galerie sur l'accueil : 5 réalisations dans une grille
 * « mosaïque », avec leur titre qui apparaît au survol.
 */
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { StaggerGroup, StaggerItem } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

// Mosaïque : une grande case (2 × 2) + quatre petites = grille remplie sans trou
const TILE_SIZES = ["col-span-2 row-span-2", "", "", "", ""];

/**
 * @param {object} props
 * @param {object[]} props.items - photos de la galerie (au moins 1)
 */
export function GalleryPreview({ items }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading
          eyebrow="Fraîchement imprimé"
          title="Nos réalisations"
          text="Gravure, textile, cadeaux : un aperçu de ce qui sort de l'atelier."
          className="mb-0"
        />
        <Button asChild variant="outline">
          <Link href="/galerie">
            Toute la galerie
          </Link>
        </Button>
      </div>

      <StaggerGroup className="mt-10 grid auto-rows-[180px] grid-cols-2 gap-4 sm:auto-rows-[200px] sm:grid-cols-4">
        {items.slice(0, TILE_SIZES.length).map((item, index) => (
          <StaggerItem
            key={item.id}
            className={cn(
              "group relative overflow-hidden rounded-3xl border-2 border-ink bg-white",
              TILE_SIZES[index]
            )}
          >
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              unoptimized={item.imageUrl.startsWith("/api/")}
              sizes="(min-width: 640px) 25vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <span className="absolute inset-x-3 bottom-3 translate-y-2 rounded-full border-2 border-ink bg-paper px-4 py-1.5 text-sm font-bold opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              {item.title}
            </span>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  );
}
