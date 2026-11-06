/**
 * Calculs des rapports du tableau de bord : ventes par jour, meilleurs
 * produits, évolution par rapport au mois précédent.
 *
 * Fonctions « pures » (aucun accès à la base) : faciles à tester.
 */
import { STORE_TIME_ZONE } from "@/config/brand";

const dayKeyFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: STORE_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
const dayLabelFormatter = new Intl.DateTimeFormat("fr-CA", {
  timeZone: STORE_TIME_ZONE,
  day: "numeric",
  month: "short",
});

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Clé du jour dans le fuseau de la boutique : « 2026-11-05 ».
 * @param {Date|string} date
 * @returns {string}
 */
export function toDayKey(date) {
  return dayKeyFormatter.format(new Date(date));
}

/**
 * Ventes jour par jour sur une période (jours sans vente compris, à 0).
 * @param {{paidAt: string|Date, totalCents: number}[]} paidOrders
 * @param {number} dayCount - nombre de jours (ex. 30)
 * @param {Date} [now]
 * @returns {{day: string, label: string, totalCents: number, orderCount: number}[]}
 */
export function buildDailySales(paidOrders, dayCount, now = new Date()) {
  // 1. Prépare une case par jour, du plus ancien au plus récent
  const days = [];
  const daysByKey = new Map();
  for (let offset = dayCount - 1; offset >= 0; offset -= 1) {
    const date = new Date(now.getTime() - offset * ONE_DAY_MS);
    const entry = { day: toDayKey(date), label: dayLabelFormatter.format(date), totalCents: 0, orderCount: 0 };
    days.push(entry);
    daysByKey.set(entry.day, entry);
  }

  // 2. Range chaque commande dans la case de son jour
  for (const order of paidOrders) {
    const entry = daysByKey.get(toDayKey(order.paidAt));
    if (entry) {
      entry.totalCents += order.totalCents;
      entry.orderCount += 1;
    }
  }
  return days;
}

/**
 * Produits les plus vendus (quantités et chiffre d'affaires).
 * @param {{productName: string, quantity: number, unitPriceCents: number, image?: string, category?: string}[]} soldItems
 * @param {number} limit
 * @returns {{name: string, quantity: number, revenueCents: number, image: string, category: string}[]}
 */
export function buildTopProducts(soldItems, limit) {
  const totalsByName = new Map();

  for (const item of soldItems) {
    let total = totalsByName.get(item.productName);
    if (!total) {
      total = { name: item.productName, quantity: 0, revenueCents: 0, image: item.image || "", category: item.category || "" };
      totalsByName.set(item.productName, total);
    }
    total.quantity += item.quantity;
    total.revenueCents += item.quantity * item.unitPriceCents;
  }

  const ranking = [...totalsByName.values()];
  ranking.sort((first, second) => second.quantity - first.quantity || second.revenueCents - first.revenueCents);
  return ranking.slice(0, limit);
}

/**
 * Évolution en pourcentage entre deux montants (null si on ne peut pas comparer).
 * @param {number} current
 * @param {number} previous
 * @returns {number|null} ex. 25 pour +25 %
 */
export function computeChangePercent(current, previous) {
  if (!previous) return null;
  return Math.round(((current - previous) / previous) * 100);
}

/**
 * Début du mois (et du mois précédent) dans le fuseau du serveur.
 * @param {Date} [now]
 * @returns {{startOfMonth: Date, startOfPreviousMonth: Date}}
 */
export function getMonthBoundaries(now = new Date()) {
  return {
    startOfMonth: new Date(now.getFullYear(), now.getMonth(), 1),
    startOfPreviousMonth: new Date(now.getFullYear(), now.getMonth() - 1, 1),
  };
}
