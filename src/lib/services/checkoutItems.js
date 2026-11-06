/**
 * Transforme les lignes du panier (envoyées par le navigateur) en lignes
 * de commande fiables.
 *
 * Pour chaque ligne, on vérifie avec le produit lu dans la BASE :
 * - qu'il est toujours en vente ;
 * - que la couleur, la taille, le matériau et l'emplacement existent bien ;
 * - qu'un article à personnaliser contient un design, un texte ou une description.
 * Le prix utilisé est TOUJOURS celui de la base, jamais celui du navigateur.
 *
 * Ce fichier ne touche pas à la base : il est donc facile à tester (tests/).
 */
import { CATEGORIES, PLACEMENT_KEYS } from "@/config/catalog";

/**
 * Cherche une couleur par son nom dans la liste du produit.
 * @param {object} product
 * @param {string} colorName
 * @returns {object|null}
 */
function findColor(product, colorName) {
  for (const color of product.colors) {
    if (color.name === colorName) return color;
  }
  return null;
}

/**
 * Cherche un matériau par sa clé dans la liste du produit.
 * @param {object} product
 * @param {string} materialKey
 * @returns {object|null}
 */
function findMaterial(product, materialKey) {
  for (const material of product.materials) {
    if (material.key === materialKey) return material;
  }
  return null;
}

/**
 * Construit UNE ligne de commande à partir d'une ligne de panier.
 * @param {object} cartItem - ligne validée par cartItemSchema
 * @param {object|undefined} product - produit lu dans la base
 * @returns {{item: object}|{error: string}}
 */
export function buildOrderItem(cartItem, product) {
  if (!product || !product.isActive) {
    return { error: "Un article de votre panier n'est plus disponible. Retirez-le pour continuer." };
  }

  const name = product.name;
  const isService = product.line === "service";
  const isTextile = Boolean(CATEGORIES[product.category]?.isTextile);
  let image = product.images[0] || "";

  // --- Couleur ---
  let color = "";
  let customColor = "";
  if (product.colors.length > 0) {
    if (cartItem.customColor && product.allowCustomColor) {
      customColor = cartItem.customColor;
    } else {
      const chosenColor = findColor(product, cartItem.color);
      if (!chosenColor) {
        return { error: `Choisissez une couleur pour « ${name} ».` };
      }
      color = chosenColor.name;
      if (chosenColor.image) image = chosenColor.image;
    }
  }

  // --- Taille ---
  let size = "";
  if (product.sizes.length > 0) {
    if (!product.sizes.includes(cartItem.size)) {
      return { error: `Choisissez une taille pour « ${name} ».` };
    }
    size = cartItem.size;
  }

  // --- Matériau (gravure) ---
  let material = "";
  if (product.materials.length > 0) {
    const chosenMaterial = findMaterial(product, cartItem.material);
    if (!chosenMaterial) {
      return { error: `Choisissez un matériau pour « ${name} ».` };
    }
    material = chosenMaterial.name;
    if (chosenMaterial.image) image = chosenMaterial.image;
  }

  // --- Personnalisation (seulement pour les articles de l'atelier) ---
  let placement = "";
  let printText = "";
  let instructions = "";
  let designFile = null;
  if (isService) {
    if (isTextile) {
      if (!PLACEMENT_KEYS.includes(cartItem.placement)) {
        return { error: `Choisissez l'emplacement de l'impression pour « ${name} ».` };
      }
      placement = cartItem.placement;
    }
    printText = cartItem.printText;
    instructions = cartItem.instructions;
    designFile = cartItem.designFileId || null;

    if (!designFile && !printText && !instructions) {
      return { error: `Ajoutez un design, un texte ou une description pour « ${name} ».` };
    }
  }

  return {
    item: {
      product: product.id,
      productName: name,
      productSlug: product.slug,
      line: product.line,
      category: product.category,
      image,
      unitPriceCents: product.priceCents, // prix lu dans la base
      quantity: cartItem.quantity,
      color,
      customColor,
      size,
      material,
      placement,
      printText,
      instructions,
      designFile,
      designFileName: "",
    },
  };
}

/**
 * Construit toutes les lignes de la commande.
 * @param {object[]} cartItems - lignes validées du panier
 * @param {Map<string, object>} productsById - produits lus dans la base, par identifiant
 * @returns {{items: object[], errorMessage: string|null}}
 */
export function buildOrderItems(cartItems, productsById) {
  const items = [];

  for (const cartItem of cartItems) {
    const result = buildOrderItem(cartItem, productsById.get(cartItem.productId));
    if (result.error) {
      return { items: [], errorMessage: result.error };
    }
    items.push(result.item);
  }

  return { items, errorMessage: null };
}
