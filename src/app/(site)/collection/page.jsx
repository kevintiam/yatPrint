/**
 * Page de la collection Yat'Print (/collection) : tous les articles de la marque,
 * avec les filtres par catégorie.
 */
import { PageHeader } from "@/components/layout/PageHeader";
import { CollectionShowcase } from "@/components/home/CollectionShowcase";
import { EmptyState } from "@/components/ui/feedback";
import { listProducts } from "@/lib/db/products";
import { Shirt } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "La collection",
  description: "T-shirts, hoodies, tasses et tote bags de la collection Yat'Print.",
};

export default async function CollectionPage() {
  const products = await listProducts({ line: "collection" });

  return (
    <>
      <PageHeader
        eyebrow="Collection"
        title="Les pièces signature"
        highlight="Yat'Print."
        text="Des messages qui inspirent, imprimés avec soin sur des articles du quotidien."
        accent="magenta"
      />

      {products.length === 0 ? (
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <EmptyState icon={Shirt} title="La collection arrive bientôt" text="Revenez nous voir très vite !" />
        </div>
      ) : (
        <CollectionShowcase
          products={products}
          eyebrow="Tous les articles"
          title="Choisissez votre favori"
          limit={100}
          showMoreLink={false}
        />
      )}
    </>
  );
}
