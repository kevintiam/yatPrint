/**
 * POST /api/orders/track
 * Suivi de commande : le client donne son numéro de commande ET son courriel.
 *
 * Corps : { orderNumber, email }
 * Réponse : { order: {...} } avec seulement des informations non sensibles
 * (pas d'adresse, pas de téléphone).
 */
import { jsonSuccess, handleApiError, readJsonBody, validateOrThrow } from "@/lib/server/responses";
import { ApiError } from "@/lib/server/ApiError";
import { enforceRateLimit, RATE_LIMITS } from "@/lib/server/rateLimit";
import { orderTrackingSchema } from "@/lib/validation/forms";
import { findOrderByNumber } from "@/lib/db/orders";
import { getItemOptionList } from "@/lib/utils/itemOptions";

/**
 * Garde uniquement ce que le client a besoin de voir.
 * @param {object} order
 */
function toPublicOrder(order) {
  const items = [];
  for (const item of order.items) {
    items.push({
      name: item.productName,
      quantity: item.quantity,
      image: item.image,
      options: getItemOptionList(item),
    });
  }

  return {
    orderNumber: order.orderNumber,
    firstName: order.customer.firstName,
    status: order.status,
    statusHistory: order.statusHistory,
    deliveryMethod: order.delivery.method,
    totalCents: order.totalCents,
    createdAt: order.createdAt,
    items,
  };
}

export async function POST(request) {
  try {
   await enforceRateLimit(request, "tracking", RATE_LIMITS.tracking);

    const body = await readJsonBody(request);
    const { orderNumber, email } = validateOrThrow(orderTrackingSchema, body);

    const order = await findOrderByNumber(orderNumber);

    // Même message si le numéro OU le courriel est faux : on ne révèle rien
    if (!order || order.customer.email !== email) {
      throw new ApiError(404, "Aucune commande ne correspond à ce numéro et à ce courriel.");
    }

    return jsonSuccess({ order: toPublicOrder(order) });
  } catch (error) {
    return handleApiError(error);
  }
}
