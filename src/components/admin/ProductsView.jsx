"use client";

/**
 * Liste des produits dans l'admin :
 * - recherche par nom, filtres (ligne, catégorie, visibilité) ;
 * - pagination dans le navigateur (12 produits par page) ;
 * - actions rapides sur chaque carte (voir AdminProductCard).
 */
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Plus, Search, Shirt, X } from "lucide-react";
import { AdminPageHeader, Pagination } from "./AdminUi";
import { AdminProductCard } from "./AdminProductCard";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/form-controls";
import { Modal } from "@/components/ui/sheet";
import { Alert, EmptyState, LoadingBlock } from "@/components/ui/feedback";
import { useAdminProducts } from "@/hooks/admin/useAdminProducts";
import { CATEGORIES, PRODUCT_LINES } from "@/config/catalog";
import { filterProducts } from "@/lib/utils/productFilters";
import { paginate } from "@/lib/utils/pagination";
import { pluralize } from "@/lib/utils/format";

const PAGE_SIZE = 12;
const EMPTY_FILTERS = { search: "", line: "", category: "", visibility: "" };

export function ProductsView() {
  const { products, isLoading, error, toggleActive, removeProduct } = useAdminProducts();
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const [productToDelete, setProductToDelete] = useState(null);

  // Filtres puis découpage en pages (recalculés à chaque affichage : c'est rapide)
  const filteredProducts = filterProducts(products, filters);
  const pageData = paginate(filteredProducts, page, PAGE_SIZE);
  const hasFilters = filters.search || filters.line || filters.category || filters.visibility;

  /** Change un filtre et revient à la première page. */
  function setFilter(name, value) {
    setFilters((previous) => ({ ...previous, [name]: value }));
    setPage(1);
  }

  function resetFilters() {
    setFilters(EMPTY_FILTERS);
    setPage(1);
  }

  async function handleToggle(product) {
    const result = await toggleActive(product);
    if (result.ok) toast.success(product.isActive ? "Produit caché du site." : "Produit visible sur le site.");
  }

  async function confirmDelete() {
    const result = await removeProduct(productToDelete.id);
    if (result.ok) toast.success("Produit supprimé.");
    setProductToDelete(null);
  }

  return (
    <>
      <AdminPageHeader
        title="Produits"
        text="Articles de l'atelier et de la collection."
        icon={Shirt}
        accent="cyan"
        actions={
          <Button asChild variant="accent">
            <Link href="/admin/produits/nouveau">
              <Plus aria-hidden="true" />
              Nouveau produit
            </Link>
          </Button>
        }
      />

      {/* Barre de filtres */}
      <div className="mb-6 flex flex-col gap-3 rounded-3xl border-2 border-ink bg-paper p-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <Input
            value={filters.search}
            onChange={(event) => setFilter("search", event.target.value)}
            placeholder="Rechercher un produit"
            aria-label="Rechercher un produit"
            className="h-10 pl-9"
          />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:flex">
          <Select aria-label="Filtrer par ligne" value={filters.line} onChange={(event) => setFilter("line", event.target.value)} className="h-10 text-sm lg:w-auto lg:min-w-44">
            <option value="">Toutes les lignes</option>
            {Object.entries(PRODUCT_LINES).map(([key, line]) => (
              <option key={key} value={key}>{key === "service" ? "Atelier" : line.label}</option>
            ))}
          </Select>
          <Select aria-label="Filtrer par catégorie" value={filters.category} onChange={(event) => setFilter("category", event.target.value)} className="h-10 text-sm lg:w-auto lg:min-w-44">
            <option value="">Toutes les catégories</option>
            {Object.entries(CATEGORIES).map(([key, category]) => (
              <option key={key} value={key}>{category.pluralLabel}</option>
            ))}
          </Select>
          <Select aria-label="Filtrer par visibilité" value={filters.visibility} onChange={(event) => setFilter("visibility", event.target.value)} className="h-10 text-sm lg:w-auto lg:min-w-44">
            <option value="">Visibles et cachés</option>
            <option value="visible">Visibles</option>
            <option value="hidden">Cachés</option>
          </Select>
        </div>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={resetFilters} className="self-start lg:self-auto">
            <X aria-hidden="true" />
            Effacer
          </Button>
        )}
      </div>

      {error && <Alert tone="error" className="mb-6">{error}</Alert>}
      {isLoading && products.length === 0 && <LoadingBlock />}
      {!isLoading && products.length === 0 && !error && (
        <EmptyState icon={Shirt} title="Aucun produit" text="Ajoutez votre premier produit, ou lancez « npm run db:seed »." />
      )}
      {products.length > 0 && filteredProducts.length === 0 && (
        <EmptyState
          icon={Search}
          title="Aucun résultat"
          text="Aucun produit ne correspond à ces filtres."
          action={<Button variant="outline" onClick={resetFilters}>Effacer les filtres</Button>}
        />
      )}

      <ul className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {pageData.items.map((product, index) => (
          <AdminProductCard key={product.id} product={product} index={index} onToggle={handleToggle} onDelete={setProductToDelete} />
        ))}
      </ul>

      <Pagination
        page={pageData.page}
        pageCount={pageData.pageCount}
        onPageChange={setPage}
        summary={pageData.total > 0 ? `${pluralize(pageData.total, "produit")} sur ${products.length}` : ""}
      />

      <Modal open={Boolean(productToDelete)} onOpenChange={(open) => !open && setProductToDelete(null)} title="Supprimer ce produit ?">
        <p className="text-ink-soft">
          « {productToDelete?.name} » sera supprimé définitivement. Les commandes déjà passées ne sont pas touchées.
          Pour le retirer temporairement, utilisez plutôt « Cacher ».
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setProductToDelete(null)}>Annuler</Button>
          <Button variant="danger" onClick={confirmDelete}>Supprimer</Button>
        </div>
      </Modal>
    </>
  );
}
