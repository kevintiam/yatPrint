/**
 * Page Galerie (/galerie) : les réalisations de l'atelier.
 */
import { Images } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { EmptyState } from "@/components/ui/feedback";
import { listGalleryItems } from "@/lib/db/gallery";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Nos réalisations",
  description: "Gravures, vêtements, cadeaux : découvrez les créations sorties de l'atelier Yat'Print.",
};

export default async function GalleryPage() {
  const items = await listGalleryItems();

  return (
    <>
      <PageHeader
        eyebrow="Galerie"
        title="Fraîchement sorti"
        highlight="de l'atelier."
        text="Un aperçu de nos créations. Cliquez sur une photo pour l'agrandir."
        accent="yellow"
      />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        {items.length === 0 ? (
          <EmptyState icon={Images} title="La galerie se remplit bientôt" text="Les premières réalisations arrivent." />
        ) : (
          <GalleryGrid items={items} />
        )}
      </section>
    </>
  );
}
