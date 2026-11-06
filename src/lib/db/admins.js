/**
 * Fonctions ORM des comptes admin (table admins).
 */
import { getPrisma } from "./prisma";

/**
 * Trouve un admin par son courriel.
 * ⚠️ Renvoie aussi l'empreinte du mot de passe : à utiliser seulement
 * pour vérifier un mot de passe, jamais pour l'afficher ou l'envoyer au navigateur.
 * @param {string} email
 * @returns {Promise<{id: string, email: string, name: string, passwordHash: string}|null>}
 */
export async function findAdminByEmail(email) {
  const admin = await getPrisma().admin.findUnique({
    where: { email: String(email).trim().toLowerCase() },
    select: { id: true, email: true, name: true, passwordHash: true },
  });
  return admin;
}

/**
 * Modifie le nom et/ou l'empreinte du mot de passe d'un admin.
 * @param {string} email - courriel du compte (celui de la session)
 * @param {{name?: string, passwordHash?: string}} changes
 * @returns {Promise<{email: string, name: string}>}
 */
export async function updateAdminAccount(email, changes) {
  const data = {};
  if (changes.name !== undefined) data.name = changes.name;
  if (changes.passwordHash !== undefined) data.passwordHash = changes.passwordHash;

  const admin = await getPrisma().admin.update({
    where: { email: String(email).trim().toLowerCase() },
    data,
    select: { email: true, name: true },
  });
  return admin;
}
