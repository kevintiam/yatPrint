/**
 * Outils pour dessiner les graphiques de l'admin (sans bibliothèque externe).
 */

/**
 * Graduations « rondes » d'un axe, de 0 jusqu'à au moins la valeur maximale.
 * Exemple : max 437 -> [0, 100, 200, 300, 400, 500]
 * @param {number} maxValue - plus grande valeur à afficher (même unité que le résultat)
 * @param {number} [tickCount] - nombre approximatif d'intervalles
 * @param {number} [minStep] - plus petit pas accepté (ex. 1 pour éviter les graduations en cents)
 * @returns {number[]}
 */
export function getNiceTicks(maxValue, tickCount = 4, minStep = 0) {
  // Aucune donnée : un axe par défaut de 0 à 100
  if (!maxValue || maxValue <= 0) {
    return [0, 25, 50, 75, 100];
  }

  // 1. On essaie des pas « ronds » (1, 2, 2,5, 5 × une puissance de 10), du plus
  //    petit au plus grand, et on garde le premier qui donne au plus tickCount + 1
  //    intervalles. Ex. 437 -> pas de 100 (5 intervalles) plutôt que 200 (0 à 600).
  const magnitude = 10 ** Math.floor(Math.log10(maxValue / tickCount));
  const candidates = [1, 2, 2.5, 5, 10, 20, 25, 50];
  let step = candidates[candidates.length - 1] * magnitude;
  for (const candidate of candidates) {
    const candidateStep = candidate * magnitude;
    if (Math.ceil(maxValue / candidateStep) <= tickCount + 1) {
      step = candidateStep;
      break;
    }
  }
  step = Math.max(step, minStep);

  // 2. Graduations jusqu'à couvrir la valeur maximale
  const ticks = [];
  const top = Math.ceil(maxValue / step) * step;
  for (let value = 0; value <= top + step / 1000; value += step) {
    ticks.push(Math.round(value * 100) / 100);
  }
  return ticks;
}

const axisFormatter = new Intl.NumberFormat("fr-CA", {
  style: "currency",
  currency: "CAD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2, // « 2,5 $ » si le pas n'est pas entier
});
const compactAxisFormatter = new Intl.NumberFormat("fr-CA", {
  style: "currency",
  currency: "CAD",
  notation: "compact",
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
});

/**
 * Libellé d'une graduation en dollars : « 250 $ », ou « 12 k$ » au-delà de 10 000 $.
 * @param {number} dollars
 * @param {number} axisMax - plus grande graduation de l'axe (même style pour tout l'axe)
 */
export function formatAxisDollars(dollars, axisMax) {
  return axisMax >= 10000 ? compactAxisFormatter.format(dollars) : axisFormatter.format(dollars);
}

/**
 * Tracé SVG d'une colonne au sommet arrondi (4 px) et à la base carrée.
 * @param {number} x - bord gauche
 * @param {number} y - sommet
 * @param {number} width
 * @param {number} baseline - position de la ligne de base (bas de la colonne)
 * @param {number} [radius]
 * @returns {string} attribut « d » d'un <path>
 */
export function roundedTopBarPath(x, y, width, baseline, radius = 4) {
  const height = baseline - y;
  if (height <= 0) return "";
  const r = Math.min(radius, height, width / 2);
  return (
    `M${x},${baseline} V${y + r} Q${x},${y} ${x + r},${y} ` +
    `H${x + width - r} Q${x + width},${y} ${x + width},${y + r} V${baseline} Z`
  );
}
