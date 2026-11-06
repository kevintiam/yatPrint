"use client";

/**
 * Liste des commandes dans l'admin :
 * - pastilles de statut pour filtrer d'un clic ;
 * - recherche (numéro, nom, courriel) ;
 * - pagination (15 commandes par page, calculée par le serveur) ;
 * - export CSV des commandes filtrées (à ouvrir dans Excel).
 */
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Download, Package, Search, X } from "lucide-react";
import { AdminPageHeader, Pagination, StatusBadge } from "./AdminUi";
import { Input } from "@/components/ui/form-controls";
import { Button } from "@/components/ui/button";
import { Alert, EmptyState, LoadingBlock } from "@/components/ui/feedback";
import { useAdminOrders, useAdminOrdersExport } from "@/hooks/admin/useAdminOrders";
import { ORDER_STATUSES } from "@/config/statuses";
import { DELIVERY_METHODS } from "@/config/shipping";
import { formatDateTime, formatPrice, pluralize } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

/**
 * Nombre total d'articles d'une commande.
 * @param {object} order
 */
function countItems(order) {
  let count = 0;
  for (const item of order.items) count += item.quantity;
  return count;
}

/** Pastilles de filtre : « Toutes » + un statut par pastille. */
const STATUS_FILTERS = [{ key: "", label: "Toutes" }];
for (const [key, status] of Object.entries(ORDER_STATUSES)) {
  STATUS_FILTERS.push({ key, label: status.label });
}

/**
 * @param {object} props
 * @param {string} [props.initialStatus] - statut lu dans l'adresse (?statut=paid)
 */
export function OrdersView({ initialStatus = "" }) {
  const [status, setStatus] = useState(initialStatus);
  const [searchText, setSearchText] = useState(""); // ce qui est tapé
  const [search, setSearch] = useState(""); // ce qui est réellement recherché
  const [page, setPage] = useState(1);
  const { orders, total, pageCount, isLoading, error } = useAdminOrders({ status, search, page });
  const { exportOrders, isExporting } = useAdminOrdersExport();

  /** Change de filtre et revient à la première page. */
  function changeStatus(nextStatus) {
    setStatus(nextStatus);
    setPage(1);
  }

  function handleSearch(event) {
    event.preventDefault();
    setSearch(searchText.trim());
    setPage(1);
  }

  function clearSearch() {
    setSearchText("");
    setSearch("");
    setPage(1);
  }

  async function handleExport() {
    const result = await exportOrders({ status, search });
    if (result.ok) toast.success("Fichier CSV téléchargé.");
    else toast.error(result.message);
  }

  return (
    <>
      <AdminPageHeader
        title="Commandes"
        text="Cliquez sur une commande pour voir le détail et changer son statut."
        icon={Package}
        accent="magenta"
        actions={
          <Button variant="yellow" size="sm" onClick={handleExport} disabled={isExporting || total === 0}>
            <Download aria-hidden="true" />
            {isExporting ? "Préparation…" : "Exporter en CSV"}
          </Button>
        }
      />

      {/* Filtres par statut */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1 scrollbar-none" role="group" aria-label="Filtrer par statut">
        {STATUS_FILTERS.map((filter) => {
          const isSelected = status === filter.key;
          return (
            <button
              key={filter.key || "all"}
              type="button"
              onClick={() => changeStatus(filter.key)}
              aria-pressed={isSelected}
              className={cn(
                "shrink-0 rounded-full border-2 px-4 py-1.5 text-sm font-semibold transition",
                isSelected ? "border-ink bg-ink text-cream shadow-[2px_2px_0_0_var(--color-magenta)]" : "border-ink/20 bg-paper hover:border-ink"
              )}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <Input
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Numéro, nom ou courriel du client"
            aria-label="Rechercher une commande"
            className="h-10 pl-9"
          />
        </div>
        <Button type="submit" variant="primary" size="sm" className="h-10">
          Rechercher
        </Button>
        {search && (
          <Button type="button" variant="ghost" size="sm" className="h-10" onClick={clearSearch}>
            <X aria-hidden="true" />
            Effacer
          </Button>
        )}
      </form>

      {error && <Alert tone="error" className="mb-6">{error}</Alert>}
      {isLoading && orders.length === 0 && <LoadingBlock />}

      {!isLoading && orders.length === 0 && !error && (
        <EmptyState icon={Package} title="Aucune commande" text="Aucune commande ne correspond à ces critères." />
      )}

      {orders.length > 0 && (
        // Pendant un rechargement, l'ancienne page reste affichée (un peu pâlie)
        <div className={cn("overflow-x-auto rounded-3xl border-2 border-ink bg-paper transition-opacity", isLoading && "opacity-60")}>
          <table className="w-full min-w-[46rem] text-left text-sm">
            <thead className="border-b-2 border-ink bg-cream-dark/60 text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-5 py-3">Commande</th>
                <th className="px-5 py-3">Client</th>
                <th className="px-5 py-3">Livraison</th>
                <th className="px-5 py-3 text-right">Articles</th>
                <th className="px-5 py-3 text-right">Total</th>
                <th className="px-5 py-3">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {orders.map((order) => (
                <tr key={order.id} className="transition hover:bg-yellow-soft/60">
                  <td className="px-5 py-3">
                    <Link href={`/admin/commandes/${order.id}`} className="font-display font-bold hover:text-magenta">
                      {order.orderNumber}
                    </Link>
                    <p className="text-xs text-muted">{formatDateTime(order.createdAt)}</p>
                  </td>
                  <td className="px-5 py-3">
                    {order.customer.firstName} {order.customer.lastName}
                    <p className="text-xs text-muted">{order.customer.email}</p>
                  </td>
                  <td className="px-5 py-3">{DELIVERY_METHODS[order.delivery.method]?.label}</td>
                  <td className="px-5 py-3 text-right tabular-nums">{countItems(order)}</td>
                  <td className="px-5 py-3 text-right font-semibold tabular-nums">{formatPrice(order.totalCents)}</td>
                  <td className="px-5 py-3">
                    <StatusBadge statusList={ORDER_STATUSES} status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={page} pageCount={pageCount} onPageChange={setPage} summary={total > 0 ? pluralize(total, "commande") : ""} />
    </>
  );
}
