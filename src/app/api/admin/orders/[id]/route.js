/**
 * /api/admin/orders/<id>
 *
 * GET   : détail d'une commande -> { order }
 * PATCH : modifie le statut et/ou la note interne -> { order }
 *         Corps : { status?, note?, adminNote? }
 *         Un changement de statut envoie un courriel au client.
 */
import { jsonSuccess, handleApiError, readJsonBody, validateOrThrow } from "@/lib/server/responses";
import { ApiError } from "@/lib/server/ApiError";
import { requireAdmin } from "@/lib/server/requireAdmin";
import { orderUpdateSchema } from "@/lib/validation/admin";
import { findOrderById, updateOrderAdminNote, updateOrderStatus } from "@/lib/db/orders";
import { notifyOrderStatusChanged } from "@/lib/services/notifications";

export async function GET(request, { params }) {
  try {
    await requireAdmin();
    const { id } = await params;

    const order = await findOrderById(id);
    if (!order) {
      throw new ApiError(404, "Commande introuvable.");
    }
    return jsonSuccess({ order });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request, { params }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const changes = validateOrThrow(orderUpdateSchema, await readJsonBody(request));

    let order = await findOrderById(id);
    if (!order) {
      throw new ApiError(404, "Commande introuvable.");
    }

    // 1. Note interne
    if (changes.adminNote !== undefined) {
      order = await updateOrderAdminNote(id, changes.adminNote);
    }

    // 2. Statut (seulement s'il change vraiment)
    if (changes.status && changes.status !== order.status) {
      order = await updateOrderStatus(id, changes.status, changes.note);
      if (changes.status !== "pending_payment") {
        await notifyOrderStatusChanged(order, changes.note);
      }
    }

    return jsonSuccess({ order });
  } catch (error) {
    return handleApiError(error);
  }
}
