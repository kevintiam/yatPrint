/**
 * Création du fichier CSV des commandes (à ouvrir dans Excel ou Google Sheets).
 *
 * Choix faits pour qu'Excel en français l'ouvre correctement :
 * - séparateur « ; » (Excel français utilise la virgule pour les décimales) ;
 * - montants écrits « 38,00 » ;
 * - caractère BOM au début : Excel comprend alors les accents (UTF-8).
 */
import { ORDER_STATUSES } from "@/config/statuses";
import { DELIVERY_METHODS } from "@/config/shipping";

const SEPARATOR = ";";
const BOM = "﻿";

const dateFormatter = new Intl.DateTimeFormat("fr-CA", {
  timeZone: "America/Toronto",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

/** Colonnes du fichier : titre + fonction qui lit la valeur dans la commande. */
const COLUMNS = [
  { title: "Numéro", read: (order) => order.orderNumber },
  { title: "Date", read: (order) => formatCsvDate(order.createdAt) },
  { title: "Statut", read: (order) => ORDER_STATUSES[order.status]?.label || order.status },
  { title: "Client", read: (order) => `${order.customer.firstName} ${order.customer.lastName}` },
  { title: "Courriel", read: (order) => order.customer.email },
  { title: "Téléphone", read: (order) => order.customer.phone },
  { title: "Mode de livraison", read: (order) => DELIVERY_METHODS[order.delivery.method]?.label || order.delivery.method },
  { title: "Province", read: (order) => order.delivery.province },
  { title: "Ville", read: (order) => order.delivery.address.city },
  { title: "Articles", read: (order) => describeItems(order.items) },
  { title: "Sous-total ($)", read: (order) => formatCsvAmount(order.subtotalCents) },
  { title: "Livraison ($)", read: (order) => formatCsvAmount(order.shippingCents) },
  { title: "Taxes ($)", read: (order) => formatCsvAmount(order.taxCents) },
  { title: "Total ($)", read: (order) => formatCsvAmount(order.totalCents) },
  { title: "Payée le", read: (order) => formatCsvDate(order.paidAt) },
];

/**
 * Montant en cents -> « 38,00 ».
 * @param {number} cents
 */
export function formatCsvAmount(cents) {
  return ((cents || 0) / 100).toFixed(2).replace(".", ",");
}

/**
 * Date -> « 2026-11-05 14 h 30 » (vide si absente).
 * @param {string|Date|null} value
 */
function formatCsvDate(value) {
  return value ? dateFormatter.format(new Date(value)) : "";
}

/**
 * Résumé des articles : « 2 × T-shirt personnalisé | 1 × Tasse ».
 * @param {object[]} items
 */
function describeItems(items = []) {
  const parts = [];
  for (const item of items) {
    parts.push(`${item.quantity} × ${item.productName}`);
  }
  return parts.join(" | ");
}

/**
 * Protège une valeur pour le CSV : guillemets doublés, et valeur entourée de
 * guillemets si elle contient un séparateur, un guillemet ou un retour à la ligne.
 * Une valeur qui commence par = + - @ est précédée d'une apostrophe pour
 * qu'Excel ne l'exécute pas comme une formule.
 * @param {unknown} value
 * @returns {string}
 */
export function escapeCsvValue(value) {
  let text = value === null || value === undefined ? "" : String(value);
  if (/^[=+\-@]/.test(text)) {
    text = `'${text}`;
  }
  if (/[";\n\r]/.test(text)) {
    text = `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

/**
 * Construit le contenu complet du fichier CSV.
 * @param {object[]} orders - commandes au format du site (voir db/mappers.js)
 * @returns {string}
 */
export function buildOrdersCsv(orders) {
  const lines = [];

  const titles = [];
  for (const column of COLUMNS) {
    titles.push(escapeCsvValue(column.title));
  }
  lines.push(titles.join(SEPARATOR));

  for (const order of orders) {
    const cells = [];
    for (const column of COLUMNS) {
      cells.push(escapeCsvValue(column.read(order)));
    }
    lines.push(cells.join(SEPARATOR));
  }

  // \r\n : fin de ligne attendue par Excel
  return BOM + lines.join("\r\n");
}
