/**
 * Fonctions « pures » du panier : elles reçoivent une liste et renvoient
 * une NOUVELLE liste, sans rien modifier d'autre. Faciles à tester.
 *
 * Forme d'une ligne de panier :
 * {
 *   lineId, productId, slug, line, category, name, image,
 *   unitPriceCents,   // prix indicatif : le serveur relit le vrai prix au paiement
 *   quantity,
 *   color, customColor, size, material, materialName, placement,
 *   printText, instructions, designFileId, designFileName
 * }
 */
import { MAX_QUANTITY_PER_LINE } from "@/config/catalog";

/** Options qui rendent deux lignes différentes (deux hoodies de couleurs différentes = deux lignes). */
const OPTION_FIELDS = [
  "productId",
  "color",
  "customColor",
  "size",
  "material",
  "placement",
  "printText",
  "instructions",
  "designFileId",
];

/**
 * Clé qui résume les options d'une ligne.
 * @param {object} item
 * @returns {string}
 */
export function getLineKey(item) {
  const parts = [];
  for (const field of OPTION_FIELDS) {
    parts.push(item[field] || "");
  }
  return parts.join("|");
}

/**
 * Limite une quantité entre 1 et le maximum autorisé.
 * @param {number} quantity
 * @returns {number}
 */
export function clampQuantity(quantity) {
  const whole = Math.floor(Number(quantity) || 1);
  return Math.min(Math.max(whole, 1), MAX_QUANTITY_PER_LINE);
}

/**
 * Ajoute un article. S'il existe déjà avec les mêmes options, on augmente la quantité.
 * @param {object[]} items - panier actuel
 * @param {object} newItem - article à ajouter (sans lineId)
 * @param {string} newLineId - identifiant à donner à la nouvelle ligne
 * @returns {object[]} nouveau panier
 */
export function addItemToCart(items, newItem, newLineId) {
  const newKey = getLineKey(newItem);
  const result = [];
  let merged = false;

  for (const item of items) {
    if (!merged && getLineKey(item) === newKey) {
      result.push({ ...item, quantity: clampQuantity(item.quantity + newItem.quantity) });
      merged = true;
    } else {
      result.push(item);
    }
  }

  if (!merged) {
    result.push({ ...newItem, lineId: newLineId, quantity: clampQuantity(newItem.quantity) });
  }
  return result;
}

/**
 * Change la quantité d'une ligne.
 * @param {object[]} items
 * @param {string} lineId
 * @param {number} quantity
 * @returns {object[]}
 */
export function updateItemQuantity(items, lineId, quantity) {
  const result = [];
  for (const item of items) {
    if (item.lineId === lineId) {
      result.push({ ...item, quantity: clampQuantity(quantity) });
    } else {
      result.push(item);
    }
  }
  return result;
}

/**
 * Retire une ligne du panier.
 * @param {object[]} items
 * @param {string} lineId
 * @returns {object[]}
 */
export function removeItemFromCart(items, lineId) {
  const result = [];
  for (const item of items) {
    if (item.lineId !== lineId) result.push(item);
  }
  return result;
}

/**
 * Nombre total d'articles (somme des quantités).
 * @param {object[]} items
 * @returns {number}
 */
export function countCartItems(items) {
  let count = 0;
  for (const item of items) {
    count += item.quantity;
  }
  return count;
}

/**
 * Prépare les lignes pour POST /api/checkout : seulement les champs attendus
 * par le serveur (ni le nom, ni le prix, ni l'image).
 * @param {object[]} items
 * @returns {object[]}
 */
export function toCheckoutItems(items) {
  const result = [];
  for (const item of items) {
    result.push({
      productId: item.productId,
      quantity: item.quantity,
      color: item.color || "",
      customColor: item.customColor || "",
      size: item.size || "",
      material: item.material || "",
      placement: item.placement || "",
      printText: item.printText || "",
      instructions: item.instructions || "",
      designFileId: item.designFileId || "",
    });
  }
  return result;
}
