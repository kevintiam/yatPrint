/**
 * Liste des produits (/admin/produits).
 */
import { ProductsView } from "@/components/admin/ProductsView";

export const metadata = { title: "Produits" };

export default function AdminProductsPage() {
  return <ProductsView />;
}
