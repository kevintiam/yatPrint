/**
 * Fonctions ORM des demandes de devis (table quote_requests).
 */
import { getPrisma } from "./prisma";
import { toPlain } from "./serialize";
import { updateById, withoutUndefined } from "./helpers";

/**
 * Enregistre une nouvelle demande de devis.
 * @param {object} data - données validées du formulaire
 * @returns {Promise<object>}
 */
export async function createQuoteRequest(data) {
  const row = await getPrisma().quoteRequest.create({ data });
  return toPlain(row);
}

/**
 * Liste les demandes, les plus récentes en premier (300 maximum).
 * @param {{status?: string}} [filters]
 * @returns {Promise<object[]>}
 */
export async function listQuoteRequests(filters = {}) {
  const rows = await getPrisma().quoteRequest.findMany({
    where: filters.status ? { status: filters.status } : {},
    orderBy: { createdAt: "desc" },
    take: 300,
  });
  return toPlain(rows);
}

/**
 * Modifie le statut et/ou la note interne d'une demande.
 * @param {string} id
 * @param {{status?: string, adminNote?: string}} changes
 * @returns {Promise<object|null>}
 */
export async function updateQuoteRequest(id, changes) {
  return updateById(getPrisma().quoteRequest, id, withoutUndefined(changes));
}
