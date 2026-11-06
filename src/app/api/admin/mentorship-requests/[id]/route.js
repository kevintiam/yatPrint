/**
 * PATCH /api/admin/mentorship-requests/<id>
 * Confirme, refuse ou commente une demande de mentorat.
 * Corps : { status?, confirmedDate?, adminNote? }   Réponse : { item }
 *
 * Passer à « confirmée » ou « refusée » envoie un courriel à la personne.
 */
import { jsonSuccess, handleApiError, readJsonBody, validateOrThrow } from "@/lib/server/responses";
import { ApiError } from "@/lib/server/ApiError";
import { requireAdmin } from "@/lib/server/requireAdmin";
import { mentorshipUpdateSchema } from "@/lib/validation/admin";
import { findMentorshipRequestById, updateMentorshipRequest } from "@/lib/db/mentorshipRequests";
import { notifyMentorshipStatusChanged } from "@/lib/services/notifications";

export async function PATCH(request, { params }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const changes = validateOrThrow(mentorshipUpdateSchema, await readJsonBody(request));

    const before = await findMentorshipRequestById(id);
    if (!before) throw new ApiError(404, "Demande introuvable.");

    // Une confirmation doit préciser la date retenue
    const nextStatus = changes.status || before.status;
    const nextDate = changes.confirmedDate !== undefined ? changes.confirmedDate : before.confirmedDate;
    if (nextStatus === "confirmed" && !nextDate) {
      throw new ApiError(400, "Indiquez la date de la séance avant de confirmer.", {
        confirmedDate: "Date et heure obligatoires pour confirmer.",
      });
    }

    const updated = await updateMentorshipRequest(id, changes);

    // Courriel seulement si le statut a réellement changé
    if (changes.status && changes.status !== before.status) {
      await notifyMentorshipStatusChanged(updated);
    }

    return jsonSuccess({ item: updated });
  } catch (error) {
    return handleApiError(error);
  }
}
