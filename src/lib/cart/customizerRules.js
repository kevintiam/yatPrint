/**
 * Règles du configurateur : vérification des choix et création de la ligne
 * de panier. Fonctions « pures », sans React : faciles à tester.
 */
import { CATEGORIES } from "@/config/catalog";

/**
 * Le produit est-il un vêtement (tailles + emplacement d'impression) ?
 * @param {object} product
 * @returns {boolean}
 */
export function isTextileProduct(product) {
  return Boolean(CATEGORIES[product.category]?.isTextile);
}

/**
 * Vérifie les choix du client avant l'ajout au panier.
 * @param {object} product
 * @param {object} choices - { isCustomColor, customColor, size, materialKey, placement, printText, instructions, designFileId, isUploading }
 * @returns {Record<string, string>} erreurs par étape (objet vide = tout est bon)
 */
export function getCustomizerErrors(product, choices) {
  const errors = {};

  if (choices.isCustomColor && choices.customColor.trim() === "") {
    errors.color = "Indiquez la couleur souhaitée.";
  }
  if (product.sizes.length > 0 && !product.sizes.includes(choices.size)) {
    errors.size = "Choisissez une taille.";
  }
  if (product.materials.length > 0 && !choices.materialKey) {
    errors.material = "Choisissez un matériau.";
  }
  if (isTextileProduct(product) && !choices.placement) {
    errors.placement = "Choisissez l'emplacement de l'impression.";
  }
  if (choices.isUploading) {
    errors.design = "Patientez : votre fichier est en cours d'envoi.";
  } else if (!choices.designFileId && !choices.printText.trim() && !choices.instructions.trim()) {
    errors.design = "Ajoutez un design, un texte à imprimer ou une description de votre idée.";
  }

  return errors;
}

/**
 * Photo à montrer pour les choix actuels (couleur > matériau > photo du produit).
 * @param {object} product
 * @param {{colorName: string, isCustomColor: boolean, materialKey: string}} choices
 * @returns {string}
 */
export function getPreviewImage(product, choices) {
  if (!choices.isCustomColor) {
    for (const color of product.colors) {
      if (color.name === choices.colorName && color.image) return color.image;
    }
  }
  for (const material of product.materials) {
    if (material.key === choices.materialKey && material.image) return material.image;
  }
  if (product.images.length > 0) return product.images[0];
  // Couleur sur demande : on garde la photo de la première couleur
  return product.colors.length > 0 ? product.colors[0].image : "";
}

/**
 * Construit la ligne à ajouter au panier.
 * @param {object} product
 * @param {object} choices - voir getCustomizerErrors, + colorName et quantity
 * @returns {object} ligne de panier (sans lineId)
 */
export function buildCartItem(product, choices) {
  let materialName = "";
  for (const material of product.materials) {
    if (material.key === choices.materialKey) materialName = material.name;
  }

  return {
    productId: product.id,
    slug: product.slug,
    line: product.line,
    category: product.category,
    name: product.name,
    image: getPreviewImage(product, choices),
    unitPriceCents: product.priceCents,
    quantity: choices.quantity,
    color: product.colors.length > 0 && !choices.isCustomColor ? choices.colorName : "",
    customColor: choices.isCustomColor ? choices.customColor.trim() : "",
    size: product.sizes.length > 0 ? choices.size : "",
    material: choices.materialKey || "",
    materialName,
    placement: isTextileProduct(product) ? choices.placement : "",
    printText: (choices.printText || "").trim(),
    instructions: (choices.instructions || "").trim(),
    designFileId: choices.designFileId || "",
    designFileName: choices.designFileName || "",
  };
}
