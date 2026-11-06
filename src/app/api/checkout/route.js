/**
 * POST /api/checkout
 * Crée la commande et renvoie l'adresse où envoyer le client :
 * la page de paiement Stripe, ou la page de confirmation en mode démo.
 *
 * Corps : { items, customer, delivery, customerNote } (voir validation/checkout.js)
 * Réponse : { orderNumber, redirectUrl }
 */
import { jsonSuccess, handleApiError, readJsonBody, validateOrThrow } from "@/lib/server/responses";
import { enforceRateLimit, RATE_LIMITS } from "@/lib/server/rateLimit";
import { checkoutSchema } from "@/lib/validation/checkout";
import { createCheckout } from "@/lib/services/checkout";

export async function POST(request) {
  try {
    await enforceRateLimit(request, "checkout", RATE_LIMITS.checkout);

    const body = await readJsonBody(request);
    const checkoutData = validateOrThrow(checkoutSchema, body);
    const result = await createCheckout(checkoutData);

    return jsonSuccess(result, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
