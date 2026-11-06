/**
 * Passage de commande : de la validation du panier jusqu'au paiement.
 *
 * Étapes :
 * 1. Relire les produits dans la base et construire des lignes fiables.
 * 2. Vérifier les fichiers de design téléversés.
 * 3. Calculer les montants (sous-total, livraison, taxes, total).
 * 4. Enregistrer la commande « en attente de paiement ».
 * 5. Créer la session Stripe et renvoyer son adresse.
 *    (Mode démo sans clé Stripe : la commande est confirmée tout de suite.)
 */
import { ApiError } from "@/lib/server/ApiError";
import { buildOrderItems } from "./checkoutItems";
import { computeOrderTotals } from "./pricing";
import { generateUniqueOrderNumber } from "./orderNumber";
import { createStripeCheckoutSession, isStripeConfigured } from "./stripe";
import { notifyOrderPaid } from "./notifications";
import { findProductsByIds } from "@/lib/db/products";
import { findFileRecordById } from "@/lib/db/files";
import { getStoreSettings } from "@/lib/db/settings";
import {
  createOrder,
  markOrderAsPaid,
  orderNumberExists,
  setOrderStripeSession,
} from "@/lib/db/orders";

/**
 * Relit les produits du panier et les range par identifiant.
 * @param {object[]} cartItems
 * @returns {Promise<Map<string, object>>}
 */
async function loadProductsById(cartItems) {
  const ids = [];
  for (const cartItem of cartItems) {
    if (!ids.includes(cartItem.productId)) ids.push(cartItem.productId);
  }

  const products = await findProductsByIds(ids);
  const productsById = new Map();
  for (const product of products) {
    productsById.set(product.id, product);
  }
  return productsById;
}

/**
 * Vérifie chaque fichier de design et ajoute son nom d'origine à la ligne.
 * @param {object[]} items - lignes de commande (modifiées sur place)
 * @throws {ApiError} si un fichier est introuvable
 */
async function attachDesignFiles(items) {
  for (const item of items) {
    if (!item.designFile) continue;

    const file = await findFileRecordById(item.designFile);
    if (!file || file.purpose !== "design") {
      throw new ApiError(400, `Le design de « ${item.productName} » est introuvable. Téléversez-le de nouveau.`);
    }
    item.designFileName = file.originalName;
  }
}

/**
 * Crée la commande et prépare le paiement.
 * @param {object} checkoutData - données validées par checkoutSchema
 * @returns {Promise<{redirectUrl: string, orderNumber: string}>}
 */
export async function createCheckout(checkoutData) {
  // 1. Lignes de commande fiables (prix de la base)
  const productsById = await loadProductsById(checkoutData.items);
  const { items, errorMessage } = buildOrderItems(checkoutData.items, productsById);
  if (errorMessage) {
    throw new ApiError(400, errorMessage);
  }

  // 2. Fichiers de design
  await attachDesignFiles(items);

  // 3. Montants, avec les réglages actuels de la boutique (prix de l'expédition, taxes)
  const settings = await getStoreSettings();
  if (checkoutData.delivery.method === "pickup" && !settings.pickupEnabled) {
    throw new ApiError(400, "Le ramassage à l'atelier n'est pas disponible pour le moment. Choisissez la livraison.");
  }
  const totals = computeOrderTotals({
    items,
    deliveryMethod: checkoutData.delivery.method,
    provinceCode: checkoutData.delivery.province,
    settings,
  });

  // Le mode démo est interdit en production : il faut une vraie clé Stripe
  const paymentMode = isStripeConfigured() ? "stripe" : "demo";
  if (paymentMode === "demo" && process.env.NODE_ENV === "production") {
    throw new ApiError(503, "Le paiement en ligne n'est pas encore disponible. Contactez-nous pour commander.");
  }

  // 4. Enregistrement de la commande
  const orderNumber = await generateUniqueOrderNumber(orderNumberExists);
  const order = await createOrder({
    orderNumber,
    customer: checkoutData.customer,
    delivery: {
      method: checkoutData.delivery.method,
      province: totals.taxProvince,
      address: checkoutData.delivery.address,
    },
    items,
    subtotalCents: totals.subtotalCents,
    shippingCents: totals.shippingCents,
    taxLines: totals.taxLines,
    taxCents: totals.taxCents,
    totalCents: totals.totalCents,
    paymentMode,
    customerNote: checkoutData.customerNote,
  });

  // 5a. Mode démo : commande confirmée immédiatement
  if (paymentMode === "demo") {
    const paidOrder = await markOrderAsPaid(order.id);
    await notifyOrderPaid(paidOrder);
    return {
      orderNumber,
      redirectUrl: `/commande/merci?commande=${encodeURIComponent(orderNumber)}`,
    };
  }

  // 5b. Vrai paiement : redirection vers Stripe
  const session = await createStripeCheckoutSession(order);
  await setOrderStripeSession(order.id, session.id);
  return { orderNumber, redirectUrl: session.url };
}
