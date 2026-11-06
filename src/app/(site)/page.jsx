/**
 * Page d'accueil (/).
 *
 * C'est un composant SERVEUR : il lit directement les produits et la galerie
 * dans la base (via lib/db), puis les transmet aux sections de la page.
 * Les sections interactives (carrousel, filtres) sont des composants « client ».
 */
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { UniverseCards } from "@/components/home/UniverseCards";
import { CollectionShowcase } from "@/components/home/CollectionShowcase";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { CustomMadeSection } from "@/components/home/CustomMadeSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { GalleryPreview } from "@/components/home/GalleryPreview";
import { DuoCta } from "@/components/home/DuoCta";
import { Testimonials } from "@/components/home/Testimonials";
import { listProducts } from "@/lib/db/products";
import { listGalleryItems } from "@/lib/db/gallery";

// Page rendue à chaque visite : elle affiche toujours les produits à jour
export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Les deux lectures sont lancées en même temps
  const [collectionProducts, galleryItems] = await Promise.all([
    listProducts({ line: "collection" }),
    listGalleryItems({ limit: 5 }),
  ]);

  return (
    <>
      <HeroCarousel />
      <UniverseCards />
      <CollectionShowcase products={collectionProducts} />
      <WhyChooseUs />
      <CustomMadeSection />
      <HowItWorks />
      <GalleryPreview items={galleryItems} />
      <DuoCta />
      <Testimonials />
    </>
  );
}
