/**
 * Filtres de la liste des produits dans l'admin (calculés dans le navigateur :
 * la boutique a quelques dizaines de produits, pas besoin d'interroger le serveur).
 */

/**
 * Texte sans accents et en minuscules : « Tasse Café » -> « tasse cafe ».
 * @param {string} text
 */
export function normalizeText(text) {
  return String(text || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

/**
 * Garde les produits qui correspondent à TOUS les filtres remplis.
 * @param {object[]} products
 * @param {object} filters
 * @param {string} [filters.search] - mot cherché dans le nom ou l'adresse (slug)
 * @param {""|"service"|"collection"} [filters.line]
 * @param {string} [filters.category] - ex. "tshirt"
 * @param {""|"visible"|"hidden"} [filters.visibility]
 * @returns {object[]}
 */
export function filterProducts(products, filters) {
  const search = normalizeText(filters.search);
  const result = [];

  for (const product of products) {
    if (filters.line && product.line !== filters.line) continue;
    if (filters.category && product.category !== filters.category) continue;
    if (filters.visibility === "visible" && !product.isActive) continue;
    if (filters.visibility === "hidden" && product.isActive) continue;
    if (search) {
      const haystack = normalizeText(`${product.name} ${product.slug}`);
      if (!haystack.includes(search)) continue;
    }
    result.push(product);
  }
  return result;
}
