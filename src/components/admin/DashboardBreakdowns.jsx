"use client";

/**
 * Deux blocs du tableau de bord, en barres horizontales :
 * - <OrdersByStatus> : nombre de commandes à chaque étape (lien vers la liste filtrée) ;
 * - <TopProducts>    : produits les plus vendus des 90 derniers jours.
 *
 * Les barres partent toutes du même bord gauche : c'est la façon la plus
 * simple de comparer des quantités d'un coup d'œil. Le nombre est écrit
 * au bout de chaque barre (pas besoin de survoler).
 */
import Link from "next/link";
import { motion } from "motion/react";
import { StatusBadge } from "./AdminUi";
import { ORDER_STATUSES } from "@/config/statuses";
import { formatPrice, pluralize } from "@/lib/utils/format";

/**
 * Barre horizontale animée (largeur en pourcentage).
 * @param {{percent: number, color: string, delay?: number}} props
 */
function HorizontalBar({ percent, color, delay = 0 }) {
  return (
    <div className="h-3 flex-1 overflow-hidden rounded-full bg-cream-dark">
      {percent > 0 && (
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(percent, 3)}%` }}
          transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
        />
      )}
    </div>
  );
}

/**
 * Commandes par statut, dans l'ordre normal de traitement.
 * @param {{ordersByStatus: Record<string, number>}} props
 */
export function OrdersByStatus({ ordersByStatus }) {
  const statusKeys = Object.keys(ORDER_STATUSES);

  let maxCount = 0;
  let total = 0;
  for (const key of statusKeys) {
    const count = ordersByStatus[key] || 0;
    maxCount = Math.max(maxCount, count);
    total += count;
  }

  return (
    <div>
      <p className="mb-4 text-sm text-muted">{pluralize(total, "commande")} au total</p>
      <ul className="flex flex-col gap-1">
        {statusKeys.map((key, index) => {
          const count = ordersByStatus[key] || 0;
          return (
            <li key={key}>
              <Link
                href={`/admin/commandes?statut=${key}`}
                className="grid grid-cols-[11.5rem_1fr_2rem] items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-yellow-soft"
                aria-label={`${ORDER_STATUSES[key].label} : ${count}. Voir ces commandes`}
              >
                <span className="whitespace-nowrap">
                  <StatusBadge statusList={ORDER_STATUSES} status={key} />
                </span>
                <HorizontalBar percent={maxCount ? (count / maxCount) * 100 : 0} color="var(--color-cyan-dark)" delay={index * 0.05} />
                <span className="text-right font-display font-bold tabular-nums">{count}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Couleurs des médailles du podium (1er, 2e, 3e). */
const RANK_COLORS = ["bg-yellow text-ink", "bg-cyan text-white", "bg-magenta text-white"];

/**
 * Produits les plus vendus.
 * @param {{products: {name: string, quantity: number, revenueCents: number}[]}} props
 */
export function TopProducts({ products }) {
  if (products.length === 0) {
    return <p className="py-8 text-center text-muted">Les meilleurs vendeurs apparaîtront ici après les premières ventes.</p>;
  }

  const maxQuantity = products[0].quantity;

  return (
    <ol className="flex flex-col gap-4">
      {products.map((product, index) => (
        <li key={product.name} className="flex items-center gap-3">
          <span
            className={`grid size-8 shrink-0 place-items-center rounded-full border-2 border-ink font-display text-sm font-bold ${RANK_COLORS[index] || "bg-paper"}`}
            aria-hidden="true"
          >
            {index + 1}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-2">
              <p className="truncate font-semibold">{product.name}</p>
              <p className="shrink-0 text-sm text-muted">{formatPrice(product.revenueCents)}</p>
            </div>
            <div className="mt-1.5 flex items-center gap-3">
              <HorizontalBar percent={(product.quantity / maxQuantity) * 100} color="var(--color-magenta-dark)" delay={index * 0.06} />
              <span className="w-16 shrink-0 text-right text-sm font-semibold tabular-nums">
                {pluralize(product.quantity, "vendu")}
              </span>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
