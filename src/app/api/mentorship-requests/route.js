/**
 * POST /api/mentorship-requests
 * Enregistre une demande de réservation de mentorat, prévient l'admin
 * et envoie un accusé de réception à la personne.
 *
 * Corps : { firstName, lastName, email, phone?, topic, level, format, preferredDates, message? }
 * Réponse : { ok: true }
 */
import { jsonSuccess, handleApiError, readJsonBody, validateOrThrow } from "@/lib/server/responses";
import { enforceRateLimit, RATE_LIMITS } from "@/lib/server/rateLimit";
import { isSpamSubmission } from "@/lib/validation/validate";
import { mentorshipRequestSchema } from "@/lib/validation/forms";
import { createMentorshipRequest } from "@/lib/db/mentorshipRequests";
import { notifyMentorshipReceived } from "@/lib/services/notifications";

export async function POST(request) {
  try {
    await enforceRateLimit(request, "mentorship", RATE_LIMITS.form);
    const body = await readJsonBody(request);

    if (isSpamSubmission(body)) {
      return jsonSuccess({ ok: true }, 201);
    }

    const data = validateOrThrow(mentorshipRequestSchema, body);
    const mentorshipRequest = await createMentorshipRequest(data);
    await notifyMentorshipReceived(mentorshipRequest);

    return jsonSuccess({ ok: true }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
