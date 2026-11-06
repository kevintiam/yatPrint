/**
 * Taxes de vente par province et territoire (TPS, TVH, TVP, TVQ).
 *
 * Taux vérifiés en novembre 2026 sur le site de l'Agence du revenu du Canada
 * (ex. : TVH de la Nouvelle-Écosse réduite à 14 % le 1er avril 2025).
 * ⚠️ À faire valider par un comptable : certains articles peuvent être exemptés
 * de la TVP selon la province (ex. vêtements pour enfants).
 *
 * Petit fournisseur : sous 30 000 $ de ventes taxables par année, l'inscription
 * à la TPS/TVH n'est pas obligatoire. Dans ce cas, Gessica décoche
 * « Facturer les taxes » dans /admin/reglages (réglage `taxesEnabled`).
 */

/** Province de l'atelier : ses taxes s'appliquent aux ramassages sur place. */
export const WORKSHOP_PROVINCE = "ON";

/**
 * Provinces et territoires, avec la liste des taxes à appliquer.
 * Chaque taxe : { label, rate } où rate est un nombre décimal (0.13 = 13 %).
 */
export const PROVINCES = {
  AB: { name: "Alberta", taxes: [{ label: "TPS", rate: 0.05 }] },
  BC: {
    name: "Colombie-Britannique",
    taxes: [
      { label: "TPS", rate: 0.05 },
      { label: "TVP", rate: 0.07 },
    ],
  },
  MB: {
    name: "Manitoba",
    taxes: [
      { label: "TPS", rate: 0.05 },
      { label: "TVP", rate: 0.07 },
    ],
  },
  NB: { name: "Nouveau-Brunswick", taxes: [{ label: "TVH", rate: 0.15 }] },
  NL: { name: "Terre-Neuve-et-Labrador", taxes: [{ label: "TVH", rate: 0.15 }] },
  NS: { name: "Nouvelle-Écosse", taxes: [{ label: "TVH", rate: 0.14 }] },
  NT: { name: "Territoires du Nord-Ouest", taxes: [{ label: "TPS", rate: 0.05 }] },
  NU: { name: "Nunavut", taxes: [{ label: "TPS", rate: 0.05 }] },
  ON: { name: "Ontario", taxes: [{ label: "TVH", rate: 0.13 }] },
  PE: { name: "Île-du-Prince-Édouard", taxes: [{ label: "TVH", rate: 0.15 }] },
  QC: {
    name: "Québec",
    taxes: [
      { label: "TPS", rate: 0.05 },
      { label: "TVQ", rate: 0.09975 },
    ],
  },
  SK: {
    name: "Saskatchewan",
    taxes: [
      { label: "TPS", rate: 0.05 },
      { label: "TVP", rate: 0.06 },
    ],
  },
  YT: { name: "Yukon", taxes: [{ label: "TPS", rate: 0.05 }] },
};

/** Codes des provinces (pour la validation des formulaires). */
export const PROVINCE_CODES = Object.keys(PROVINCES);

/**
 * Liste triée par nom, pratique pour remplir un menu déroulant.
 * @returns {{code: string, name: string}[]}
 */
export function getProvinceOptions() {
  const options = [];
  for (const code of PROVINCE_CODES) {
    options.push({ code, name: PROVINCES[code].name });
  }
  options.sort((first, second) => first.name.localeCompare(second.name, "fr"));
  return options;
}
