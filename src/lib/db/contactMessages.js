/**
 * Fonctions ORM des messages de contact (table contact_messages).
 */
import { getPrisma } from "./prisma";
import { toPlain } from "./serialize";
import { updateById } from "./helpers";

/**
 * Enregistre un nouveau message.
 * @param {object} data - données validées du formulaire
 * @returns {Promise<object>}
 */
export async function createContactMessage(data) {
  const row = await getPrisma().contactMessage.create({ data });
  return toPlain(row);
}

/**
 * Liste les messages, les plus récents en premier (300 maximum).
 * @param {{status?: string}} [filters]
 * @returns {Promise<object[]>}
 */
export async function listContactMessages(filters = {}) {
  const rows = await getPrisma().contactMessage.findMany({
    where: filters.status ? { status: filters.status } : {},
    orderBy: { createdAt: "desc" },
    take: 300,
  });
  return toPlain(rows);
}

/**
 * Change le statut d'un message (non lu, lu, archivé).
 * @param {string} id
 * @param {string} status
 * @returns {Promise<object|null>}
 */
export async function updateContactMessageStatus(id, status) {
  return updateById(getPrisma().contactMessage, id, { status });
}
