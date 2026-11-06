/**
 * Fonctions ORM des demandes de mentorat (table mentorship_requests).
 */
import { getPrisma } from "./prisma";
import { isValidId, toPlain } from "./serialize";
import { updateById, withoutUndefined } from "./helpers";

/**
 * Enregistre une nouvelle demande de mentorat.
 * @param {object} data - données validées du formulaire
 * @returns {Promise<object>}
 */
export async function createMentorshipRequest(data) {
  const row = await getPrisma().mentorshipRequest.create({ data });
  return toPlain(row);
}

/**
 * Liste les demandes, les plus récentes en premier (300 maximum).
 * @param {{status?: string}} [filters]
 * @returns {Promise<object[]>}
 */
export async function listMentorshipRequests(filters = {}) {
  const rows = await getPrisma().mentorshipRequest.findMany({
    where: filters.status ? { status: filters.status } : {},
    orderBy: { createdAt: "desc" },
    take: 300,
  });
  return toPlain(rows);
}

/**
 * @param {string} id
 * @returns {Promise<object|null>}
 */
export async function findMentorshipRequestById(id) {
  if (!isValidId(id)) return null;
  const row = await getPrisma().mentorshipRequest.findUnique({ where: { id } });
  return toPlain(row);
}

/**
 * Modifie une demande (statut, date confirmée, note interne).
 * @param {string} id
 * @param {{status?: string, confirmedDate?: string, adminNote?: string}} changes
 * @returns {Promise<object|null>}
 */
export async function updateMentorshipRequest(id, changes) {
  return updateById(getPrisma().mentorshipRequest, id, withoutUndefined(changes));
}
