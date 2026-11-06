/**
 * Page du configurateur (/personnaliser/<slug>), ex. /personnaliser/hoodie-personnalise.
 * Le serveur lit le produit dans la base, puis le configurateur (client) prend le relais.
 */
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Customizer } from "@/components/customizer/Customizer";
import { findProductBySlug } from "@/lib/db/products";

export const dynamic = "force-dynamic";

/** Titre de l'onglet et description pour Google, selon le produit. */
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await findProductBySlug(slug);
  if (!product) return { title: "Article introuvable" };
  return { title: product.name, description: product.shortDescription };
}

export default async function CustomizeProductPage({ params }) {
  const { slug } = await params;
  const product = await findProductBySlug(slug);

  // Produit inconnu, caché, ou qui n'est pas un article à personnaliser : page 404
  if (!product || product.line !== "service") {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Link href="/personnaliser" className="mb-8 inline-flex items-center gap-1 font-semibold text-muted hover:text-ink">
        <ChevronLeft className="size-4" aria-hidden="true" />
        Retour à l&apos;atelier
      </Link>
      <Customizer product={product} />
    </div>
  );
}
