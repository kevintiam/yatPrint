/**
 * Page de l'atelier (/personnaliser) : la liste des articles personnalisables.
 */
import { Sparkles } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProductCard } from "@/components/products/ProductCard";
import { StaggerGroup, StaggerItem } from "@/components/motion/Reveal";
import { HowItWorks } from "@/components/home/HowItWorks";
import { EmptyState } from "@/components/ui/feedback";
import { listProducts } from "@/lib/db/products";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Atelier de personnalisation",
  description: "Personnalisez un t-shirt, un hoodie, une tasse, un cadre ou une gravure sur bois ou acrylique.",
};

export default async function CustomizeListPage() {
  const products = await listProducts({ line: "service" });

  return (
    <>
      <PageHeader
        eyebrow="Atelier"
        title="Créez un article"
        highlight="à votre image."
        text="Choisissez un article, ajoutez votre design ou votre texte, vérifiez l'aperçu : nous nous occupons de l'impression."
        accent="cyan"
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        {products.length === 0 ? (
          <EmptyState icon={Sparkles} title="L'atelier se prépare" text="Les articles personnalisables arrivent très bientôt." />
        ) : (
          <StaggerGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, index) => (
              <StaggerItem key={product.id}>
                <ProductCard product={product} priority={index < 3} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        )}
      </section>

      <HowItWorks />
    </>
  );
}
