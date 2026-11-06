/**
 * Chiffres du tableau de bord et compteurs du menu de l'admin.
 */
import { getPrisma } from "./prisma";
import { toPlain } from "./serialize";
import {
  buildDailySales,
  buildTopProducts,
  computeChangePercent,
  getMonthBoundaries,
} from "@/lib/services/salesReport";

// Commandes payées dont le travail n'est pas terminé
const STATUSES_TO_PROCESS = ["paid", "in_production", "ready"];
// Commandes dont l'argent est encaissé
const PAID_STATUSES = ["paid", "in_production", "ready", "shipped", "completed"];

const CHART_DAYS = 30;
const TOP_PRODUCTS_DAYS = 90;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Compteurs affichés dans le menu de l'admin (pastilles).
 * @returns {Promise<{ordersToProcess: number, newQuotes: number, newMentorships: number, newMessages: number}>}
 */
export async function getAdminCounters() {
  const prisma = getPrisma();
  const [ordersToProcess, newQuotes, newMentorships, newMessages] = await Promise.all([
    prisma.order.count({ where: { status: { in: STATUSES_TO_PROCESS } } }),
    prisma.quoteRequest.count({ where: { status: "new" } }),
    prisma.mentorshipRequest.count({ where: { status: "new" } }),
    prisma.contactMessage.count({ where: { status: "new" } }),
  ]);
  return { ordersToProcess, newQuotes, newMentorships, newMessages };
}

/**
 * Toutes les données du tableau de bord.
 * @returns {Promise<object>}
 */
export async function getDashboardStats() {
  const prisma = getPrisma();
  const now = new Date();
  const { startOfMonth, startOfPreviousMonth } = getMonthBoundaries(now);
  const chartStart = new Date(now.getTime() - CHART_DAYS * ONE_DAY_MS);
  const topStart = new Date(now.getTime() - TOP_PRODUCTS_DAYS * ONE_DAY_MS);
  const paid = { in: PAID_STATUSES };

  // Toutes les requêtes indépendantes partent en même temps
  const [counters, monthSales, previousMonthSales, statusGroups, chartOrders, soldItems, latestOrders] =
    await Promise.all([
      getAdminCounters(),
      prisma.order.aggregate({ where: { status: paid, paidAt: { gte: startOfMonth } }, _sum: { totalCents: true }, _count: { _all: true } }),
      prisma.order.aggregate({ where: { status: paid, paidAt: { gte: startOfPreviousMonth, lt: startOfMonth } }, _sum: { totalCents: true } }),
      prisma.order.groupBy({ by: ["status"], _count: { _all: true } }),
      prisma.order.findMany({ where: { status: paid, paidAt: { gte: chartStart } }, select: { paidAt: true, totalCents: true } }),
      prisma.orderItem.findMany({
        where: { order: { status: paid, paidAt: { gte: topStart } } },
        select: { productName: true, quantity: true, unitPriceCents: true, image: true, category: true },
      }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 6,
        select: { id: true, orderNumber: true, customerFirstName: true, customerLastName: true, status: true, totalCents: true, createdAt: true },
      }),
    ]);

  // Nombre de commandes par statut : { paid: 3, ready: 1, ... }
  const ordersByStatus = {};
  for (const group of statusGroups) {
    ordersByStatus[group.status] = group._count._all;
  }

  // Même forme que le reste du site : order.customer.firstName
  const recentOrders = [];
  for (const order of latestOrders) {
    recentOrders.push({
      id: order.id,
      orderNumber: order.orderNumber,
      customer: { firstName: order.customerFirstName, lastName: order.customerLastName },
      status: order.status,
      totalCents: order.totalCents,
      createdAt: order.createdAt,
    });
  }

  const monthRevenueCents = monthSales._sum.totalCents || 0;
  const monthOrderCount = monthSales._count._all;
  const previousMonthRevenueCents = previousMonthSales._sum.totalCents || 0;

  return toPlain({
    ...counters,
    monthRevenueCents,
    monthOrderCount,
    averageOrderCents: monthOrderCount > 0 ? Math.round(monthRevenueCents / monthOrderCount) : 0,
    previousMonthRevenueCents,
    revenueChangePercent: computeChangePercent(monthRevenueCents, previousMonthRevenueCents),
    dailySales: buildDailySales(chartOrders, CHART_DAYS, now),
    ordersByStatus,
    topProducts: buildTopProducts(soldItems, 5),
    latestOrders: recentOrders,
  });
}
