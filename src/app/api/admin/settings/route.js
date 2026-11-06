/**
 * /api/admin/settings
 *
 * GET : réglages actuels de la boutique -> { settings }
 * PUT : enregistre tous les réglages -> { settings }
 *       Corps : { email, phone, city, instagramUrl, instagramHandle,
 *                 shippingPriceCents, pickupEnabled, taxesEnabled }
 *
 * Les changements s'appliquent tout de suite sur le site (coordonnées,
 * prix de la livraison au panier, taxes au paiement).
 */
import { jsonSuccess, handleApiError, readJsonBody, validateOrThrow } from "@/lib/server/responses";
import { requireAdmin } from "@/lib/server/requireAdmin";
import { storeSettingsSchema } from "@/lib/validation/settings";
import { getStoreSettings, saveStoreSettings } from "@/lib/db/settings";

export async function GET() {
  try {
    await requireAdmin();
    const settings = await getStoreSettings();
    return jsonSuccess({ settings });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request) {
  try {
    await requireAdmin();
    const data = validateOrThrow(storeSettingsSchema, await readJsonBody(request));
    const settings = await saveStoreSettings(data);
    return jsonSuccess({ settings });
  } catch (error) {
    return handleApiError(error);
  }
}
