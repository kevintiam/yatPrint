/**
 * Outils de couleur.
 */

/**
 * Indique si une couleur est foncée (pour écrire en blanc par-dessus).
 * Calcul de la « luminance perçue » : l'œil voit le vert plus clair que le bleu.
 * @param {string} hex - ex. "#1f2a44"
 * @returns {boolean} true si la couleur est foncée
 */
export function isDarkColor(hex) {
  const match = /^#?([0-9a-f]{6})$/i.exec(String(hex || ""));
  if (!match) {
    return false;
  }

  const value = parseInt(match[1], 16);
  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;

  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;
  return luminance < 0.55;
}
