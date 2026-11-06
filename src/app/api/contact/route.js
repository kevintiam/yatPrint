/**
 * POST /api/contact
 * Enregistre un message du formulaire de contact et prévient l'admin.
 *
 * Corps : { name, email, phone?, subject, message }
 * Réponse : { ok: true }
 */
import { jsonSuccess, handleApiError, readJsonBody, validateOrThrow } from "@/lib/server/responses";
import { enforceRateLimit, RATE_LIMITS } from "@/lib/server/rateLimit";
import { isSpamSubmission } from "@/lib/validation/validate";
import { contactMessageSchema } from "@/lib/validation/forms";
import { createContactMessage } from "@/lib/db/contactMessages";
import { notifyContactReceived } from "@/lib/services/notifications";

export async function POST(request) {
  try {
    enforceRateLimit(request, "contact", RATE_LIMITS.form);
    const body = await readJsonBody(request);

    if (isSpamSubmission(body)) {
      return jsonSuccess({ ok: true }, 201);
    }

    const data = validateOrThrow(contactMessageSchema, body);
    const message = await createContactMessage(data);
    await notifyContactReceived(message);

    return jsonSuccess({ ok: true }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
