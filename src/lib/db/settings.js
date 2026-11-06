/**
 * Fonctions ORM des réglages de la boutique (table store_settings, une seule ligne).
 *
 * Tant que Gessica n'a rien enregistré dans l'admin, ce sont les valeurs
 * par défaut de src/config/brand.js qui s'appliquent.
 */
import { getPrisma } from "./prisma";
import { DEFAULT_STORE_SETTINGS } from "../../config/brand.js";

const SETTINGS_ID = 1;

/**
 * Garde seulement les champs utiles (sans id ni date de modification).
 * @param {object} row
 */
function toSettings(row) {
  return {
    email: row.email,
    phone: row.phone,
    city: row.city,
    instagramUrl: row.instagramUrl,
    instagramHandle: row.instagramHandle,
    shippingPriceCents: row.shippingPriceCents,
    pickupEnabled: row.pickupEnabled,
    taxesEnabled: row.taxesEnabled,
  };
}

/**
 * Lit les réglages (ou les valeurs par défaut s'ils n'ont jamais été enregistrés).
 * Ces informations sont publiques : elles s'affichent sur le site.
 * @returns {Promise<object>}
 */
export async function getStoreSettings() {
  const row = await getPrisma().storeSettings.findUnique({ where: { id: SETTINGS_ID } });
  return row ? toSettings(row) : { ...DEFAULT_STORE_SETTINGS };
}

/**
 * Enregistre les réglages (crée la ligne si elle n'existe pas encore).
 * @param {object} data - validé par storeSettingsSchema
 * @returns {Promise<object>}
 */
export async function saveStoreSettings(data) {
  const row = await getPrisma().storeSettings.upsert({
    where: { id: SETTINGS_ID },
    create: { id: SETTINGS_ID, ...data },
    update: data,
  });
  return toSettings(row);
}
