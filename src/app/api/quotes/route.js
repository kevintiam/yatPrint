/**
 * POST /api/quotes
 * Enregistre une demande de devis entreprise et prévient l'admin par courriel.
 *
 * Corps : { firstName, lastName, phone, email?, company?, comment }
 * Réponse : { ok: true }
 */
import { jsonSuccess, handleApiError, readJsonBody, validateOrThrow } from "@/lib/server/responses";
import { enforceRateLimit, RATE_LIMITS } from "@/lib/server/rateLimit";
import { isSpamSubmission } from "@/lib/validation/validate";
import { quoteRequestSchema } from "@/lib/validation/forms";
import { createQuoteRequest } from "@/lib/db/quoteRequests";
import { notifyQuoteReceived } from "@/lib/services/notifications";

export async function POST(request) {
  try {
    enforceRateLimit(request, "quotes", RATE_LIMITS.form);
    const body = await readJsonBody(request);

    // Robot détecté : on fait semblant que tout va bien, sans rien enregistrer
    if (isSpamSubmission(body)) {
      return jsonSuccess({ ok: true }, 201);
    }

    const data = validateOrThrow(quoteRequestSchema, body);
    const quote = await createQuoteRequest(data);
    await notifyQuoteReceived(quote);

    return jsonSuccess({ ok: true }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
