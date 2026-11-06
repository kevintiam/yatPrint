/**
 * Modification d'un produit (/admin/produits/<id>).
 */
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminUi";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata = { title: "Modifier un produit" };

export default async function EditProductPage({ params }) {
  const { id } = await params;

  return (
    <>
      <Link href="/admin/produits" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-ink">
        <ChevronLeft className="size-4" aria-hidden="true" />
        Tous les produits
      </Link>
      <AdminPageHeader title="Modifier le produit" />
      <ProductForm productId={id} />
    </>
  );
}
