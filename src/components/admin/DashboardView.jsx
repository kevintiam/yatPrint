"use client";

/**
 * Tableau de bord de l'admin.
 *
 * 1. Chiffres clés animés (ventes du mois, panier moyen, à traiter, demandes).
 * 2. Graphique des ventes des 30 derniers jours + commandes par statut.
 * 3. Meilleurs produits + dernières commandes.
 */
import Link from "next/link";
import { motion } from "motion/react";
import { DollarSign, Inbox, Package, Plus, ShoppingBag, Sparkles } from "lucide-react";
import { AdminPageHeader, StatusBadge } from "./AdminUi";
import { StatCard } from "./DashboardCards";
import { SalesChart } from "./SalesChart";
import { OrdersByStatus, TopProducts } from "./DashboardBreakdowns";
import { Button } from "@/components/ui/button";
import { Alert, LoadingBlock } from "@/components/ui/feedback";
import { useAdminDashboard } from "@/hooks/admin/useAdminDashboard";
import { ORDER_STATUSES } from "@/config/statuses";
import { formatDateTime, formatPrice, pluralize } from "@/lib/utils/format";

/** Mise en forme d'un montant animé (en cents). */
const formatCents = (value) => formatPrice(Math.round(value));

/**
 * Carte blanche avec un titre (et un lien facultatif à droite).
 * @param {{title: string, link?: {href: string, label: string}, className?: string, delay?: number}} props
 */
function Panel({ title, link, className, delay = 0, children }) {
  return (
    <motion.section
      className={`rounded-3xl border-2 border-ink bg-paper p-6 ${className || ""}`}
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="font-display text-xl font-bold">{title}</h2>
        {link && (
          <Link href={link.href} className="text-sm font-semibold text-magenta hover:underline">
            {link.label}
          </Link>
        )}
      </div>
      {children}
    </motion.section>
  );
}

/**
 * @param {object} props
 * @param {string} props.firstName - prénom de l'admin (salutation)
 * @param {string} props.todayLabel - date du jour déjà mise en forme, ex. « jeudi 5 novembre »
 * @param {string} props.previousMonthLabel - ex. « octobre »
 */
export function DashboardView({ firstName, todayLabel, previousMonthLabel }) {
  const { stats, isLoading, error } = useAdminDashboard();
  const newRequests = stats ? stats.newQuotes + stats.newMentorships + stats.newMessages : 0;

  return (
    <>
      <AdminPageHeader
        title={`Bonjour ${firstName} 👋`}
        text={`Nous sommes ${todayLabel}. Voici ce qui se passe chez Yat'Print.`}
        icon={Sparkles}
        accent="yellow"
        actions={
          <>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/commandes?statut=paid">
                <Package aria-hidden="true" />
                Commandes payées
              </Link>
            </Button>
            <Button asChild variant="accent" size="sm">
              <Link href="/admin/produits/nouveau">
                <Plus aria-hidden="true" />
                Nouveau produit
              </Link>
            </Button>
          </>
        }
      />

      {error && <Alert tone="error" className="mb-6">{error}</Alert>}
      {isLoading && !stats && <LoadingBlock />}

      {stats && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              index={0}
              label="Ventes du mois"
              value={stats.monthRevenueCents}
              format={formatCents}
              icon={DollarSign}
              color="magenta"
              change={{ percent: stats.revenueChangePercent, label: `vs ${previousMonthLabel}` }}
            />
            <StatCard
              index={1}
              label="Panier moyen"
              value={stats.averageOrderCents}
              format={formatCents}
              hint={`${pluralize(stats.monthOrderCount, "commande")} ce mois-ci`}
              icon={ShoppingBag}
              color="cyan"
            />
            <StatCard
              index={2}
              label="Commandes à traiter"
              value={stats.ordersToProcess}
              hint="Payées, en production ou prêtes"
              icon={Package}
              color="yellow"
            />
            <StatCard
              index={3}
              label="Nouvelles demandes"
              value={newRequests}
              hint={`${stats.newQuotes} devis · ${stats.newMentorships} mentorat · ${stats.newMessages} messages`}
              icon={Inbox}
              color="ink"
            />
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
            <Panel title="Ventes des 30 derniers jours" delay={0.15}>
              <SalesChart dailySales={stats.dailySales} />
            </Panel>
            <Panel title="Commandes par statut" link={{ href: "/admin/commandes", label: "Tout voir →" }} delay={0.2}>
              <OrdersByStatus ordersByStatus={stats.ordersByStatus} />
            </Panel>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-2">
            <Panel title="Meilleurs vendeurs (90 jours)" link={{ href: "/admin/produits", label: "Produits →" }} delay={0.25}>
              <TopProducts products={stats.topProducts} />
            </Panel>

            <Panel title="Dernières commandes" link={{ href: "/admin/commandes", label: "Tout voir →" }} delay={0.3}>
              {stats.latestOrders.length === 0 ? (
                <p className="py-8 text-center text-muted">Aucune commande pour le moment.</p>
              ) : (
                <ul className="divide-y-2 divide-dashed divide-ink/10">
                  {stats.latestOrders.map((order) => (
                    <li key={order.id}>
                      <Link
                        href={`/admin/commandes/${order.id}`}
                        className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl px-2 py-3 transition hover:bg-yellow-soft"
                      >
                        <span className="font-display font-bold">{order.orderNumber}</span>
                        <span className="text-ink-soft">
                          {order.customer.firstName} {order.customer.lastName}
                        </span>
                        <span className="text-sm text-muted">{formatDateTime(order.createdAt)}</span>
                        <span className="ml-auto flex items-center gap-3">
                          <StatusBadge statusList={ORDER_STATUSES} status={order.status} />
                          <span className="font-semibold tabular-nums">{formatPrice(order.totalCents)}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          </div>
        </>
      )}
    </>
  );
}
