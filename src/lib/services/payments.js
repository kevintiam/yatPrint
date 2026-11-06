/**
 * Confirmation des paiements Stripe.
 *
 * Une commande devient « payée » de deux façons (la première qui arrive gagne,
 * markOrderAsPaid empêche de la confirmer deux fois) :
 * 1. Le webhook de Stripe (méthode officielle, fonctionne même si le client ferme la page).
 * 2. La page de remerciement, qui vérifie la session auprès de Stripe
 *    (utile en développement, quand le webhook n'est pas branché).
 */
import { retrieveStripeSession } from "./stripe";
import { notifyOrderPaid } from "./notifications";
import { findOrderByStripeSessionId, markOrderAsPaid } from "@/lib/db/orders";

/**
 * Passe la commande à « payée » et envoie les courriels (une seule fois).
 * @param {string} orderId
 * @returns {Promise<object|null>} la commande payée, ou null si elle l'était déjà
 */
async function confirmOrderPayment(orderId) {
  const paidOrder = await markOrderAsPaid(orderId);
  if (paidOrder) {
    await notifyOrderPaid(paidOrder);
  }
  return paidOrder;
}

/**
 * Traite un événement reçu par le webhook Stripe.
 * @param {import("stripe").Stripe.Event} event
 */
export async function handleStripeEvent(event) {
  const isCompleted =
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded";

  if (!isCompleted) {
    return; // les autres événements ne nous intéressent pas
  }

  const session = event.data.object;
  const orderId = session.metadata ? session.metadata.orderId : null;
  if (session.payment_status === "paid" && orderId) {
    await confirmOrderPayment(orderId);
  }
}

/**
 * Vérifie une session Stripe depuis la page de remerciement.
 * @param {string} sessionId
 * @returns {Promise<object|null>} la commande à jour (payée ou non), ou null si introuvable
 */
export async function syncOrderWithStripeSession(sessionId) {
  const order = await findOrderByStripeSessionId(sessionId);
  if (!order) {
    return null;
  }
  if (order.status !== "pending_payment") {
    return order; // déjà confirmée (par le webhook, probablement)
  }

  try {
    const session = await retrieveStripeSession(sessionId);
    if (session.payment_status === "paid") {
      const paidOrder = await confirmOrderPayment(order.id);
      return paidOrder || (await findOrderByStripeSessionId(sessionId));
    }
  } catch (error) {
    console.error("[Stripe] Vérification de la session impossible :", error);
  }
  return order;
}
