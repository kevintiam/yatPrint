/**
 * Description lisible des options d'un article (panier, commande, courriels, Stripe).
 *
 * Exemple de résultat :
 *   [{ label: "Couleur", value: "Marine" }, { label: "Taille", value: "M" }, ...]
 */
import { getPlacementLabel } from "@/config/catalog";

/**
 * Construit la liste des options choisies pour un article.
 * Les options vides sont ignorées.
 * @param {object} item - ligne de panier ou de commande
 * @returns {{label: string, value: string}[]}
 */
export function getItemOptionList(item) {
  const options = [];

  if (item.customColor) {
    options.push({ label: "Couleur", value: `${item.customColor} (sur demande)` });
  } else if (item.color) {
    options.push({ label: "Couleur", value: item.color });
  }
  if (item.size) {
    options.push({ label: "Taille", value: item.size });
  }
  if (item.material) {
    options.push({ label: "Matériau", value: item.materialName || item.material });
  }
  if (item.placement) {
    options.push({ label: "Emplacement", value: getPlacementLabel(item.placement) });
  }
  if (item.printText) {
    options.push({ label: "Texte", value: `« ${item.printText} »` });
  }
  if (item.designFileName) {
    options.push({ label: "Design", value: item.designFileName });
  }

  return options;
}

/**
 * Même chose, en une seule ligne de texte : « Couleur : Marine · Taille : M ».
 * @param {object} item
 * @returns {string}
 */
export function describeItemOptions(item) {
  const parts = [];
  for (const option of getItemOptionList(item)) {
    parts.push(`${option.label} : ${option.value}`);
  }
  return parts.join(" · ");
}
