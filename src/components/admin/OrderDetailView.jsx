"use client";

/**
 * Fiche d'une commande dans l'admin : client, livraison, articles,
 * et panneau de gestion du statut.
 */
import Link from "next/link";
import { ChevronLeft, Mail, MapPin, Package, Phone } from "lucide-react";
import { AdminPageHeader, StatusBadge } from "./AdminUi";
import { OrderItemsCard } from "./OrderItemsCard";
import { OrderStatusPanel } from "./OrderStatusPanel";
import { Alert, LoadingBlock } from "@/components/ui/feedback";
import { useAdminOrder } from "@/hooks/admin/useAdminOrders";
import { ORDER_STATUSES } from "@/config/statuses";
import { DELIVERY_METHODS } from "@/config/shipping";
import { PROVINCES } from "@/config/taxes";
import { formatDateTime } from "@/lib/utils/format";

/**
 * @param {{orderId: string}} props
 */
export function OrderDetailView({ orderId }) {
  const { order, isLoading, loadError, updateOrder, isSaving } = useAdminOrder(orderId);

  if (isLoading && !order) return <LoadingBlock />;
  if (loadError && !order) return <Alert tone="error">{loadError}</Alert>;
  if (!order) return null;

  const address = order.delivery.address || {};

  return (
    <>
      <Link href="/admin/commandes" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-ink">
        <ChevronLeft className="size-4" aria-hidden="true" />
        Toutes les commandes
      </Link>

      <AdminPageHeader
        title={`Commande ${order.orderNumber}`}
        icon={Package}
        accent="magenta"
        text={`Passée le ${formatDateTime(order.createdAt)}${order.paymentMode === "demo" ? " · mode démo (sans paiement réel)" : ""}`}
        actions={<StatusBadge statusList={ORDER_STATUSES} status={order.status} />}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_24rem]">
        <div className="flex flex-col gap-6">
          <div className="grid gap-6 md:grid-cols-2">
            <section className="rounded-3xl border-2 border-ink bg-paper p-6">
              <h2 className="mb-3 font-display text-xl font-bold">Client</h2>
              <p className="font-semibold">
                {order.customer.firstName} {order.customer.lastName}
              </p>
              <a href={`mailto:${order.customer.email}`} className="mt-2 flex items-center gap-2 text-sm hover:text-magenta">
                <Mail className="size-4" aria-hidden="true" />
                {order.customer.email}
              </a>
              {order.customer.phone && (
                <a href={`tel:${order.customer.phone}`} className="mt-1 flex items-center gap-2 text-sm hover:text-magenta">
                  <Phone className="size-4" aria-hidden="true" />
                  {order.customer.phone}
                </a>
              )}
            </section>

            <section className="rounded-3xl border-2 border-ink bg-paper p-6">
              <h2 className="mb-3 font-display text-xl font-bold">Livraison</h2>
              <p className="font-semibold">{DELIVERY_METHODS[order.delivery.method]?.label}</p>
              {order.delivery.method === "shipping" && (
                <p className="mt-2 flex items-start gap-2 text-sm">
                  <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <span>
                    {address.line1}
                    {address.line2 && <>, {address.line2}</>}
                    <br />
                    {address.city}, {PROVINCES[order.delivery.province]?.name} {address.postalCode}
                  </span>
                </p>
              )}
            </section>
          </div>

          {order.customerNote && (
            <Alert tone="warning">
              <span className="font-semibold">Note du client : </span>
              {order.customerNote}
            </Alert>
          )}

          <OrderItemsCard order={order} />
        </div>

        {/* La clé force la remise à zéro du panneau quand la commande change */}
        <OrderStatusPanel key={`${order.status}-${order.statusHistory.length}`} order={order} onUpdate={updateOrder} isSaving={isSaving} />
      </div>
    </>
  );
}
