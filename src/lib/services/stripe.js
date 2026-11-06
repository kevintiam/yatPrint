/**
 * Paiement en ligne avec Stripe Checkout.
 *
 * Le client est redirigé vers la page de paiement sécurisée de Stripe :
 * le numéro de carte ne passe jamais par notre site. Quand le paiement
 * réussit, Stripe prévient notre serveur avec un « webhook »
 * (voir src/app/api/webhooks/stripe/route.js), et c'est SEULEMENT à ce
 * moment-là que la commande devient « payée ».
 */
import Stripe from "stripe";
import { getSiteUrl } from "@/config/brand";
import { formatTaxRate } from "./pricing";
import { describeItemOptions } from "@/lib/utils/itemOptions";

let stripeClient = null;

/**
 * Indique si une clé Stripe est configurée dans .env.
 * @returns {boolean}
 */
export function isStripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

/**
 * Renvoie le client Stripe (créé une seule fois).
 * @returns {Stripe}
 */
function getStripe() {
  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripeClient;
}

/**
 * Crée une ligne de la page de paiement Stripe.
 * @param {string} name - texte affiché
 * @param {number} amountCents - prix unitaire en cents
 * @param {number} quantity
 * @param {string} [description]
 */
function buildLineItem(name, amountCents, quantity, description) {
  const productData = { name };
  if (description) {
    productData.description = description.slice(0, 500);
  }
  return {
    quantity,
    price_data: { currency: "cad", unit_amount: amountCents, product_data: productData },
  };
}

/**
 * Crée la session de paiement Stripe d'une commande.
 * Les articles, la livraison et chaque taxe apparaissent sur des lignes séparées.
 * @param {object} order - commande enregistrée (montants déjà calculés par le serveur)
 * @returns {Promise<{id: string, url: string}>}
 */
export async function createStripeCheckoutSession(order) {
  const lineItems = [];

  for (const item of order.items) {
    lineItems.push(
      buildLineItem(item.productName, item.unitPriceCents, item.quantity, describeItemOptions(item))
    );
  }
  if (order.shippingCents > 0) {
    lineItems.push(buildLineItem("Livraison", order.shippingCents, 1));
  }
  for (const taxLine of order.taxLines) {
    const label = `${taxLine.label} (${formatTaxRate(taxLine.rate)})`;
    lineItems.push(buildLineItem(label, taxLine.amountCents, 1));
  }

  const siteUrl = getSiteUrl();
  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    locale: "fr-CA",
    line_items: lineItems,
    customer_email: order.customer.email,
    client_reference_id: order.id,
    metadata: { orderId: order.id, orderNumber: order.orderNumber },
    // {CHECKOUT_SESSION_ID} est remplacé par Stripe par le vrai identifiant
    success_url: `${siteUrl}/commande/merci?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/panier?paiement=annule`,
  });

  return { id: session.id, url: session.url };
}

/**
 * Relit une session de paiement auprès de Stripe (pour vérifier si elle est payée).
 * @param {string} sessionId
 * @returns {Promise<import("stripe").Stripe.Checkout.Session>}
 */
export async function retrieveStripeSession(sessionId) {
  return getStripe().checkout.sessions.retrieve(sessionId);
}

/**
 * Vérifie qu'un webhook vient vraiment de Stripe (signature) et le décode.
 * @param {string} rawBody - corps BRUT de la requête (texte, pas JSON)
 * @param {string} signature - en-tête « stripe-signature »
 * @returns {Stripe.Event}
 * @throws si la signature est invalide
 */
export function constructStripeEvent(rawBody, signature) {
  return getStripe().webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
}
