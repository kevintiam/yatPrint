/**
 * « Traducteurs » entre les tables PostgreSQL et les objets utilisés par le site.
 *
 * Dans la base, une commande est répartie sur plusieurs tables (orders,
 * order_items, order_tax_lines, order_status_events) et ses colonnes sont
 * « à plat » (customerFirstName, addressCity...). Le reste du code, lui,
 * utilise des objets regroupés : order.customer.firstName, order.delivery.address.city...
 * Ces fonctions font la conversion dans les deux sens.
 */
import { toPlain } from "./serialize";

/** Relations à charger avec un produit (couleurs et matériaux dans l'ordre). */
export const PRODUCT_INCLUDE = {
  colors: { orderBy: { position: "asc" } },
  materials: { orderBy: { position: "asc" } },
};

/** Relations à charger avec une commande. */
export const ORDER_INCLUDE = {
  items: { orderBy: { position: "asc" } },
  taxLines: { orderBy: { position: "asc" } },
  statusHistory: { orderBy: { changedAt: "asc" } },
};

/**
 * Produit de la base -> objet du site (couleurs et matériaux sans leurs identifiants techniques).
 * @param {object|null} row
 */
export function toProduct(row) {
  if (!row) return null;

  const colors = [];
  for (const color of row.colors || []) {
    colors.push({ name: color.name, hex: color.hex, image: color.image });
  }
  const materials = [];
  for (const material of row.materials || []) {
    materials.push({ key: material.key, name: material.name, image: material.image });
  }

  return toPlain({ ...row, colors, materials });
}

/**
 * Données d'un produit (formulaire admin) -> données Prisma, avec les
 * couleurs et matériaux à créer dans leurs tables.
 * @param {object} data - produit validé par productSchema
 */
export function toProductData(data) {
  const { colors = [], materials = [], ...fields } = data;

  const colorRows = [];
  for (let index = 0; index < colors.length; index += 1) {
    colorRows.push({ ...colors[index], position: index });
  }
  const materialRows = [];
  for (let index = 0; index < materials.length; index += 1) {
    materialRows.push({ ...materials[index], position: index });
  }

  return { fields, colorRows, materialRows };
}

/**
 * Commande de la base -> objet du site.
 * @param {object|null} row - commande avec ses relations (ORDER_INCLUDE)
 */
export function toOrder(row) {
  if (!row) return null;

  const items = [];
  for (const item of row.items || []) {
    items.push({
      ...item,
      product: item.productId, // identifiant du produit (ou null s'il a été supprimé)
      designFile: item.designFileId, // identifiant du fichier de design (ou null)
    });
  }

  return toPlain({
    id: row.id,
    orderNumber: row.orderNumber,
    customer: {
      firstName: row.customerFirstName,
      lastName: row.customerLastName,
      email: row.customerEmail,
      phone: row.customerPhone,
    },
    delivery: {
      method: row.deliveryMethod,
      province: row.deliveryProvince,
      address: {
        line1: row.addressLine1,
        line2: row.addressLine2,
        city: row.addressCity,
        postalCode: row.addressPostalCode,
      },
    },
    items,
    taxLines: row.taxLines || [],
    statusHistory: row.statusHistory || [],
    subtotalCents: row.subtotalCents,
    shippingCents: row.shippingCents,
    taxCents: row.taxCents,
    totalCents: row.totalCents,
    status: row.status,
    paymentMode: row.paymentMode,
    stripeSessionId: row.stripeSessionId || "",
    paidAt: row.paidAt,
    customerNote: row.customerNote,
    adminNote: row.adminNote,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  });
}

/**
 * Commande préparée par le paiement -> données Prisma (création imbriquée).
 * @param {object} order - voir services/checkout.js
 */
export function toOrderCreateData(order) {
  const address = order.delivery.address || {};

  const itemRows = [];
  for (let index = 0; index < order.items.length; index += 1) {
    const { product, designFile, ...item } = order.items[index];
    itemRows.push({ ...item, productId: product, designFileId: designFile || null, position: index });
  }
  const taxRows = [];
  for (let index = 0; index < order.taxLines.length; index += 1) {
    taxRows.push({ ...order.taxLines[index], position: index });
  }

  return {
    orderNumber: order.orderNumber,
    customerFirstName: order.customer.firstName,
    customerLastName: order.customer.lastName,
    customerEmail: order.customer.email,
    customerPhone: order.customer.phone || "",
    deliveryMethod: order.delivery.method,
    deliveryProvince: order.delivery.province,
    addressLine1: address.line1 || "",
    addressLine2: address.line2 || "",
    addressCity: address.city || "",
    addressPostalCode: address.postalCode || "",
    subtotalCents: order.subtotalCents,
    shippingCents: order.shippingCents,
    taxCents: order.taxCents,
    totalCents: order.totalCents,
    paymentMode: order.paymentMode,
    customerNote: order.customerNote || "",
    items: { create: itemRows },
    taxLines: { create: taxRows },
    statusHistory: { create: [{ status: "pending_payment" }] },
  };
}
