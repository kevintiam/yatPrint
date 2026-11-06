/**
 * /api/admin/account  (compte de l'admin connecté)
 *
 * GET   : -> { account: { email, name } }
 * PATCH : change le nom et, si demandé, le mot de passe -> { account }
 *         Corps : { name, currentPassword, newPassword?, confirmPassword? }
 *
 * Sécurité : le mot de passe actuel est vérifié à chaque fois, et le nombre
 * d'essais est limité (6 toutes les 15 minutes).
 */
import bcrypt from "bcryptjs";
import { jsonSuccess, handleApiError, readJsonBody, validateOrThrow } from "@/lib/server/responses";
import { ApiError } from "@/lib/server/ApiError";
import { requireAdmin } from "@/lib/server/requireAdmin";
import { enforceRateLimit, RATE_LIMITS } from "@/lib/server/rateLimit";
import { accountSchema } from "@/lib/validation/settings";
import { findAdminByEmail, updateAdminAccount } from "@/lib/db/admins";

export async function GET() {
  try {
    const sessionUser = await requireAdmin();
    const admin = await findAdminByEmail(sessionUser.email);
    if (!admin) throw new ApiError(404, "Compte introuvable.");

    // On ne renvoie jamais l'empreinte du mot de passe
    return jsonSuccess({ account: { email: admin.email, name: admin.name } });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request) {
  try {
    const sessionUser = await requireAdmin();
    enforceRateLimit(request, "admin-password", RATE_LIMITS.password);
    const data = validateOrThrow(accountSchema, await readJsonBody(request));

    // 1. Vérifie le mot de passe actuel
    const admin = await findAdminByEmail(sessionUser.email);
    if (!admin) throw new ApiError(404, "Compte introuvable.");
    const isPasswordCorrect = await bcrypt.compare(data.currentPassword, admin.passwordHash);
    if (!isPasswordCorrect) {
      throw new ApiError(400, "Le mot de passe actuel est incorrect.", {
        currentPassword: "Mot de passe incorrect.",
      });
    }

    // 2. Prépare les changements (nouveau mot de passe seulement s'il est rempli)
    const changes = { name: data.name };
    if (data.newPassword) {
      changes.passwordHash = await bcrypt.hash(data.newPassword, 12);
    }

    const account = await updateAdminAccount(admin.email, changes);
    return jsonSuccess({ account, passwordChanged: Boolean(data.newPassword) });
  } catch (error) {
    return handleApiError(error);
  }
}
