/**
 * Calcul des montants d'une commande : sous-total, livraison, taxes, total.
 *
 * Ce fichier est utilisé :
 * - dans le navigateur, pour afficher le récapitulatif du panier ;
 * - sur le serveur, pour calculer le montant RÉELLEMENT payé (seul celui-ci compte).
 *
 * Tous les montants sont en cents (nombres entiers) : on arrondit
 * chaque taxe au cent le plus proche.
 *
 * Le prix de l'expédition et l'activation des taxes viennent des réglages de
 * la boutique (`settings`, modifiables dans /admin/reglages).
 */
import { PROVINCES, WORKSHOP_PROVINCE } from "@/config/taxes";
import { getDeliveryPriceCents } from "@/config/shipping";
import { DEFAULT_STORE_SETTINGS } from "@/config/brand";

/**
 * Additionne prix × quantité pour chaque ligne.
 * @param {{unitPriceCents: number, quantity: number}[]} items
 * @returns {number} sous-total en cents
 */
export function computeSubtotalCents(items) {
  let subtotal = 0;
  for (const item of items) {
    subtotal += item.unitPriceCents * item.quantity;
  }
  return subtotal;
}

/**
 * Calcule chaque taxe d'une province sur un montant.
 * @param {number} taxableCents - montant taxable (articles + livraison)
 * @param {string} provinceCode - ex. "ON"
 * @param {boolean} [taxesEnabled] - false = aucune taxe (petit fournisseur)
 * @returns {{label: string, rate: number, amountCents: number}[]}
 */
export function computeTaxLines(taxableCents, provinceCode, taxesEnabled = true) {
  const province = PROVINCES[provinceCode];
  if (!taxesEnabled || !province) {
    return [];
  }

  const taxLines = [];
  for (const tax of province.taxes) {
    taxLines.push({
      label: tax.label,
      rate: tax.rate,
      amountCents: Math.round(taxableCents * tax.rate),
    });
  }
  return taxLines;
}

/**
 * Calcule tous les montants d'une commande.
 * @param {object} params
 * @param {{unitPriceCents: number, quantity: number}[]} params.items
 * @param {"shipping"|"pickup"} params.deliveryMethod
 * @param {string} [params.provinceCode] - province de livraison (ignorée pour un ramassage)
 * @param {{shippingPriceCents: number, taxesEnabled: boolean}} [params.settings] - réglages de la boutique
 * @returns {{subtotalCents: number, shippingCents: number, taxLines: object[],
 *            taxCents: number, totalCents: number, taxProvince: string}}
 */
export function computeOrderTotals({ items, deliveryMethod, provinceCode, settings = DEFAULT_STORE_SETTINGS }) {
  const subtotalCents = computeSubtotalCents(items);
  const shippingCents = getDeliveryPriceCents(deliveryMethod, settings);

  // Ramassage : ce sont les taxes de la province de l'atelier qui s'appliquent
  const taxProvince = deliveryMethod === "pickup" ? WORKSHOP_PROVINCE : provinceCode;

  // Au Canada, les frais de livraison sont taxables comme les articles
  const taxLines = computeTaxLines(subtotalCents + shippingCents, taxProvince, settings.taxesEnabled);

  let taxCents = 0;
  for (const taxLine of taxLines) {
    taxCents += taxLine.amountCents;
  }

  return {
    subtotalCents,
    shippingCents,
    taxLines,
    taxCents,
    totalCents: subtotalCents + shippingCents + taxCents,
    taxProvince: taxProvince || "",
  };
}

/**
 * Affiche un taux en pourcentage : 0.09975 -> "9,975 %".
 * @param {number} rate
 * @returns {string}
 */
export function formatTaxRate(rate) {
  const percent = Math.round(rate * 100000) / 1000; // garde jusqu'à 3 décimales
  return `${String(percent).replace(".", ",")} %`;
}
