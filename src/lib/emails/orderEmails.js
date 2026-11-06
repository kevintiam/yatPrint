/**
 * Courriels liés aux commandes : confirmation (client), alerte (admin)
 * et changement de statut (client).
 * Chaque fonction renvoie { subject, html, text }.
 */
import { escapeHtml, renderEmailLayout, renderEmailText, renderDetailsTable } from "./layout";
import { getSiteUrl } from "@/config/brand";
import { DELIVERY_METHODS } from "@/config/shipping";
import { ORDER_STATUSES, getStatusInfo } from "@/config/statuses";
import { formatPrice } from "@/lib/utils/format";
import { describeItemOptions } from "@/lib/utils/itemOptions";
import { formatTaxRate } from "@/lib/services/pricing";

/**
 * Tableau HTML des articles et des montants d'une commande.
 * @param {object} order
 * @returns {string}
 */
function renderOrderTable(order) {
  let rows = "";
  for (const item of order.items) {
    const options = describeItemOptions(item);
    rows +=
      "<tr>" +
      '<td style="padding:8px 0;border-bottom:1px solid #e2d8c8;">' +
      `<strong>${escapeHtml(item.productName)}</strong> × ${item.quantity}` +
      (options ? `<br><span style="color:#6b645b;font-size:13px;">${escapeHtml(options)}</span>` : "") +
      "</td>" +
      `<td style="padding:8px 0;border-bottom:1px solid #e2d8c8;text-align:right;white-space:nowrap;">${formatPrice(item.unitPriceCents * item.quantity)}</td>` +
      "</tr>";
  }

  // Lignes de totaux (sous-total, livraison, taxes, total)
  const totals = [["Sous-total", order.subtotalCents], ["Livraison", order.shippingCents]];
  for (const taxLine of order.taxLines) {
    totals.push([`${taxLine.label} (${formatTaxRate(taxLine.rate)})`, taxLine.amountCents]);
  }
  for (const [label, amount] of totals) {
    rows += `<tr><td style="padding:4px 0;color:#6b645b;">${escapeHtml(label)}</td><td style="padding:4px 0;text-align:right;">${formatPrice(amount)}</td></tr>`;
  }
  rows += `<tr><td style="padding:8px 0;font-weight:bold;">Total</td><td style="padding:8px 0;text-align:right;font-weight:bold;">${formatPrice(order.totalCents)}</td></tr>`;

  return `<table role="presentation" style="width:100%;border-collapse:collapse;margin:16px 0;">${rows}</table>`;
}

/**
 * Lignes texte des articles (version texte du courriel).
 * @param {object} order
 * @returns {string[]}
 */
function orderTextLines(order) {
  const lines = [];
  for (const item of order.items) {
    lines.push(`- ${item.productName} × ${item.quantity} : ${formatPrice(item.unitPriceCents * item.quantity)}`);
  }
  lines.push(`Total : ${formatPrice(order.totalCents)}`);
  return lines;
}

/** Courriel de confirmation envoyé au client après le paiement. * @param {object} [settings] - réglages de la boutique (pied du courriel)
 */
export function orderConfirmationEmail(order, settings) {
  const title = `Merci ${order.customer.firstName}, votre commande est confirmée !`;
  const deliveryLabel = DELIVERY_METHODS[order.delivery.method]?.label || "";
  const paragraphs = [
    `Nous avons bien reçu votre commande ${order.orderNumber}.`,
    "Pour les articles personnalisés, nous vous écrirons si nous avons besoin d'une précision avant l'impression.",
    `Mode de livraison : ${deliveryLabel}.`,
  ];
  const trackingUrl = `${getSiteUrl()}/suivi-commande?commande=${encodeURIComponent(order.orderNumber)}`;

  return {
    subject: `Commande ${order.orderNumber} confirmée — Yat'Print`,
    html: renderEmailLayout({
      settings,
      title,
      paragraphs,
      bodyHtml: renderOrderTable(order),
      button: { label: "Suivre ma commande", url: trackingUrl },
    }),
    text: renderEmailText(title, [...paragraphs, "", ...orderTextLines(order), "", `Suivi : ${trackingUrl}`]),
  };
}

/** Alerte envoyée à l'admin pour chaque nouvelle commande payée. * @param {object} [settings] - réglages de la boutique (pied du courriel)
 */
export function adminNewOrderEmail(order, settings) {
  const title = `Nouvelle commande ${order.orderNumber}`;
  const customer = order.customer;
  const address = order.delivery.address || {};
  const details = renderDetailsTable([
    { label: "Client", value: `${customer.firstName} ${customer.lastName}` },
    { label: "Courriel", value: customer.email },
    { label: "Téléphone", value: customer.phone },
    { label: "Livraison", value: DELIVERY_METHODS[order.delivery.method]?.label },
    { label: "Adresse", value: [address.line1, address.line2, address.city, address.postalCode].filter(Boolean).join(", ") },
    { label: "Note du client", value: order.customerNote },
  ]);

  return {
    subject: `🧾 Nouvelle commande ${order.orderNumber} (${formatPrice(order.totalCents)})`,
    html: renderEmailLayout({
      settings,
      title,
      paragraphs: ["Une nouvelle commande vient d'être payée."],
      bodyHtml: details + renderOrderTable(order),
      button: { label: "Ouvrir dans l'admin", url: `${getSiteUrl()}/admin/commandes/${order.id}` },
    }),
    text: renderEmailText(title, [`Client : ${customer.firstName} ${customer.lastName}`, ...orderTextLines(order)]),
  };
}

/** Courriel envoyé au client quand le statut de sa commande change. * @param {object} [settings] - réglages de la boutique (pied du courriel)
 */
export function orderStatusEmail(order, note, settings) {
  const status = getStatusInfo(ORDER_STATUSES, order.status);
  const title = `Votre commande ${order.orderNumber} : ${status.label.toLowerCase()}`;
  const paragraphs = [`Bonjour ${order.customer.firstName},`, status.description || ""];
  if (note) {
    paragraphs.push(`Précision : ${note}`);
  }
  const trackingUrl = `${getSiteUrl()}/suivi-commande?commande=${encodeURIComponent(order.orderNumber)}`;

  return {
    subject: `${status.label} — commande ${order.orderNumber}`,
    html: renderEmailLayout({ settings, title, paragraphs, button: { label: "Voir le suivi", url: trackingUrl } }),
    text: renderEmailText(title, [...paragraphs, `Suivi : ${trackingUrl}`]),
  };
}
