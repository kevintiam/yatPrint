/**
 * Réglages du catalogue : catégories, lignes de produits, tailles,
 * emplacements d'impression et règles de téléversement.
 *
 * Les clés (ex. "tshirt") sont enregistrées dans la base de données :
 * on peut changer un libellé, mais il ne faut pas renommer une clé existante.
 */

/** Les deux « lignes » de produits du site. */
export const PRODUCT_LINES = {
  service: { label: "Personnalisation", path: "/personnaliser" },
  collection: { label: "Collection", path: "/collection" },
};

/** Catégories d'articles. `isTextile` = vêtement (tailles + emplacement d'impression). */
export const CATEGORIES = {
  tshirt: { label: "T-shirt", pluralLabel: "T-shirts", isTextile: true },
  hoodie: { label: "Hoodie", pluralLabel: "Hoodies", isTextile: true },
  mug: { label: "Tasse", pluralLabel: "Tasses", isTextile: false },
  frame: { label: "Cadre", pluralLabel: "Cadres", isTextile: false },
  engraving: { label: "Gravure", pluralLabel: "Gravures", isTextile: false },
  tote: { label: "Tote bag", pluralLabel: "Tote bags", isTextile: false },
};

/** Liste des clés de catégories, pratique pour la validation (Zod). */
export const CATEGORY_KEYS = Object.keys(CATEGORIES);

/** Tailles proposées pour les vêtements, de la plus petite à la plus grande. */
export const SIZES = ["XS", "S", "M", "L", "XL", "2XL"];

/**
 * Emplacements d'impression pour les vêtements.
 * `zone` = position de l'aperçu sur la photo (en % de l'image).
 */
export const PLACEMENTS = [
  { key: "front", label: "Devant", zone: { top: 30, left: 31, width: 38, height: 34 } },
  { key: "back", label: "Dos", zone: { top: 26, left: 29, width: 42, height: 40 } },
  { key: "chest", label: "Cœur (petit logo)", zone: { top: 30, left: 54, width: 14, height: 12 } },
];

/** Clés des emplacements (pour la validation). */
export const PLACEMENT_KEYS = PLACEMENTS.map((placement) => placement.key);

/** Règles des fichiers de design envoyés par les clients. */
export const DESIGN_UPLOAD_RULES = {
  maxSizeMb: 10,
  acceptedTypes: ["image/png", "image/jpeg", "image/webp", "image/svg+xml", "application/pdf"],
  acceptedLabel: "PNG, JPG, WEBP, SVG ou PDF",
};

/** Règles des photos ajoutées par l'admin (produits, galerie). */
export const IMAGE_UPLOAD_RULES = {
  maxSizeMb: 8,
  acceptedTypes: ["image/png", "image/jpeg", "image/webp"],
  acceptedLabel: "PNG, JPG ou WEBP",
};

/** Quantité maximale d'un même article dans le panier. */
export const MAX_QUANTITY_PER_LINE = 100;

/**
 * Renvoie le libellé d'une catégorie (ou la clé si elle est inconnue).
 * @param {string} categoryKey - ex. "hoodie"
 * @returns {string} ex. "Hoodie"
 */
export function getCategoryLabel(categoryKey) {
  const category = CATEGORIES[categoryKey];
  return category ? category.label : categoryKey;
}

/**
 * Renvoie le libellé d'un emplacement d'impression.
 * @param {string} placementKey - ex. "front"
 * @returns {string} ex. "Devant"
 */
export function getPlacementLabel(placementKey) {
  for (const placement of PLACEMENTS) {
    if (placement.key === placementKey) {
      return placement.label;
    }
  }
  return placementKey;
}
