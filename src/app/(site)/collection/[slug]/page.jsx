/**
 * Fiche d'un article de la collection (/collection/<slug>),
 * suivie de quelques articles de la même catégorie.
 */
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { ProductDetail } from "@/components/shop/ProductDetail";
import { ProductCard } from "@/components/products/ProductCard";
import { SectionHeading } from "@/components/layout/PageHeader";
import { findProductBySlug, listProducts } from "@/lib/db/products";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await findProductBySlug(slug);
  if (!product) return { title: "Article introuvable" };
  return { title: product.name, description: product.shortDescription };
}

export default async function CollectionProductPage({ params }) {
  const { slug } = await params;
  const product = await findProductBySlug(slug);

  if (!product || product.line !== "collection") {
    notFound();
  }

  // Articles « vous aimerez aussi » : même catégorie, sans l'article affiché (4 maximum)
  const sameCategory = await listProducts({ line: "collection", category: product.category });
  const relatedProducts = [];
  for (const candidate of sameCategory) {
    if (candidate.id !== product.id && relatedProducts.length < 4) {
      relatedProducts.push(candidate);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Link href="/collection" className="mb-8 inline-flex items-center gap-1 font-semibold text-muted hover:text-ink">
        <ChevronLeft className="size-4" aria-hidden="true" />
        Retour à la collection
      </Link>

      <ProductDetail product={product} />

      {relatedProducts.length > 0 && (
        <section className="mt-24">
          <SectionHeading eyebrow="Dans le même style" title="Vous aimerez aussi" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((related) => (
              <ProductCard key={related.id} product={related} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
