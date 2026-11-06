/**
 * Fonctions ORM des commandes (tables orders, order_items, order_tax_lines,
 * order_status_events). Elles renvoient des commandes « regroupées » (voir mappers.js).
 */
import { getPrisma } from "./prisma";
import { isValidId } from "./serialize";
import { ORDER_INCLUDE, toOrder, toOrderCreateData } from "./mappers";

/** Nombre de commandes par page dans l'admin. */
export const ORDERS_PAGE_SIZE = 15;

/**
 * Crée une commande avec ses lignes, ses taxes et son premier statut.
 * @param {object} order - commande complète (prix recalculés par le serveur)
 * @returns {Promise<object>}
 */
export async function createOrder(order) {
  const row = await getPrisma().order.create({ data: toOrderCreateData(order), include: ORDER_INCLUDE });
  return toOrder(row);
}

/**
 * Un numéro de commande existe-t-il déjà ?
 * @param {string} orderNumber
 * @returns {Promise<boolean>}
 */
export async function orderNumberExists(orderNumber) {
  const count = await getPrisma().order.count({ where: { orderNumber } });
  return count > 0;
}

/** @param {string} id */
export async function findOrderById(id) {
  if (!isValidId(id)) return null;
  const row = await getPrisma().order.findUnique({ where: { id }, include: ORDER_INCLUDE });
  return toOrder(row);
}

/** @param {string} orderNumber - ex. "YP-261105-K7QF" */
export async function findOrderByNumber(orderNumber) {
  const row = await getPrisma().order.findUnique({
    where: { orderNumber: String(orderNumber).toUpperCase() },
    include: ORDER_INCLUDE,
  });
  return toOrder(row);
}

/** @param {string} sessionId - session de paiement Stripe « cs_... » */
export async function findOrderByStripeSessionId(sessionId) {
  if (!sessionId) return null;
  const row = await getPrisma().order.findUnique({ where: { stripeSessionId: sessionId }, include: ORDER_INCLUDE });
  return toOrder(row);
}

/**
 * Filtre Prisma commun à la liste et à l'export CSV.
 * @param {{status?: string, search?: string}} filters
 */
export function buildOrderFilter(filters) {
  const where = {};
  if (filters.status) {
    where.status = filters.status;
  }
  if (filters.search) {
    // « contains » + mode « insensitive » : la recherche ignore les majuscules
    const contains = { contains: filters.search, mode: "insensitive" };
    where.OR = [
      { orderNumber: contains },
      { customerEmail: contains },
      { customerFirstName: contains },
      { customerLastName: contains },
    ];
  }
  return where;
}

/**
 * Liste paginée des commandes pour l'admin (les plus récentes en premier).
 * @param {{status?: string, search?: string, page?: number}} filters
 * @returns {Promise<{orders: object[], total: number, page: number, pageCount: number}>}
 */
export async function listOrders(filters = {}) {
  const prisma = getPrisma();
  const where = buildOrderFilter(filters);

  const total = await prisma.order.count({ where });
  const pageCount = Math.max(1, Math.ceil(total / ORDERS_PAGE_SIZE));
  const page = Math.min(Math.max(1, filters.page || 1), pageCount);

  const rows = await prisma.order.findMany({
    where,
    include: ORDER_INCLUDE,
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * ORDERS_PAGE_SIZE,
    take: ORDERS_PAGE_SIZE,
  });

  const orders = [];
  for (const row of rows) {
    orders.push(toOrder(row));
  }
  return { orders, total, page, pageCount };
}

/**
 * Toutes les commandes d'un filtre (export CSV), limitées à 5 000 par sécurité.
 * @param {{status?: string, search?: string}} filters
 * @returns {Promise<object[]>}
 */
export async function listOrdersForExport(filters = {}) {
  const rows = await getPrisma().order.findMany({
    where: buildOrderFilter(filters),
    include: ORDER_INCLUDE,
    orderBy: { createdAt: "desc" },
    take: 5000,
  });

  const orders = [];
  for (const row of rows) {
    orders.push(toOrder(row));
  }
  return orders;
}

/**
 * Enregistre l'identifiant de la session de paiement Stripe.
 * @param {string} id
 * @param {string} sessionId
 */
export async function setOrderStripeSession(id, sessionId) {
  await getPrisma().order.update({ where: { id }, data: { stripeSessionId: sessionId } });
}

/**
 * Passe une commande à « payée », SEULEMENT si elle était en attente de paiement.
 * Stripe peut envoyer le même événement plusieurs fois : on ne veut pas
 * confirmer (et envoyer les courriels) deux fois.
 * @param {string} id
 * @returns {Promise<object|null>} la commande payée, ou null si rien n'a changé
 */
export async function markOrderAsPaid(id) {
  if (!isValidId(id)) return null;
  const prisma = getPrisma();

  // Transaction : les deux écritures réussissent ensemble, ou aucune
  const wasUpdated = await prisma.$transaction(async (transaction) => {
    const result = await transaction.order.updateMany({
      where: { id, status: "pending_payment" },
      data: { status: "paid", paidAt: new Date() },
    });
    if (result.count === 0) return false;

    await transaction.orderStatusEvent.create({ data: { orderId: id, status: "paid" } });
    return true;
  });

  return wasUpdated ? findOrderById(id) : null;
}

/**
 * Change le statut d'une commande et l'ajoute à l'historique.
 * @param {string} id
 * @param {string} status
 * @param {string} [note] - précision visible par le client (ex. numéro de suivi)
 * @returns {Promise<object|null>}
 */
export async function updateOrderStatus(id, status, note = "") {
  if (!isValidId(id)) return null;
  const prisma = getPrisma();

  await prisma.$transaction([
    prisma.order.update({ where: { id }, data: { status } }),
    prisma.orderStatusEvent.create({ data: { orderId: id, status, note } }),
  ]);
  return findOrderById(id);
}

/**
 * Modifie la note interne d'une commande.
 * @param {string} id
 * @param {string} adminNote
 * @returns {Promise<object|null>}
 */
export async function updateOrderAdminNote(id, adminNote) {
  if (!isValidId(id)) return null;
  await getPrisma().order.update({ where: { id }, data: { adminNote } });
  return findOrderById(id);
}
