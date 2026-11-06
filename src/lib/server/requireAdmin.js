/**
 * Protection des routes API de l'admin.
 *
 * À appeler au tout début de chaque route du dossier src/app/api/admin :
 *   const admin = await requireAdmin();
 * Si personne n'est connecté, une erreur 401 est renvoyée au navigateur.
 */
import { auth } from "@/auth";
import { ApiError } from "./ApiError";

/**
 * @returns {Promise<{id?: string, email: string, name: string}>} l'admin connecté
 * @throws {ApiError} 401 si aucune session valide
 */
export async function requireAdmin() {
  const session = await auth();

  if (!session || !session.user) {
    throw new ApiError(401, "Votre session a expiré. Reconnectez-vous à l'espace admin.");
  }

  return session.user;
}
