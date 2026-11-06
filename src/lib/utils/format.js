/**
 * Fonctions de mise en forme réutilisées partout (prix, dates, texte).
 * Elles fonctionnent aussi bien côté serveur que dans le navigateur.
 */

// Formateurs créés une seule fois (plus rapide que d'en créer un à chaque appel)
const priceFormatter = new Intl.NumberFormat("fr-CA", { style: "currency", currency: "CAD" });
const dateFormatter = new Intl.DateTimeFormat("fr-CA", { dateStyle: "long" });
const dateTimeFormatter = new Intl.DateTimeFormat("fr-CA", {
  dateStyle: "medium",
  timeStyle: "short",
});

/**
 * Affiche un prix en dollars canadiens à partir d'un montant en cents.
 * @param {number} cents - ex. 3800
 * @returns {string} ex. "38,00 $"
 */
export function formatPrice(cents) {
  return priceFormatter.format((cents || 0) / 100);
}

/**
 * Convertit un prix tapé en dollars en cents : « 38,50 » ou « 38.5 » -> 3850.
 * @param {string|number} text
 * @returns {number} cents, ou NaN si le texte n'est pas un nombre
 */
export function parsePriceToCents(text) {
  const normalized = String(text ?? "").trim().replace(/\s|\$/g, "").replace(",", ".");
  if (normalized === "") return NaN;
  return Math.round(Number(normalized) * 100);
}

/**
 * Affiche des cents en dollars pour un champ de formulaire : 3850 -> « 38.50 ».
 * @param {number} cents
 * @returns {string}
 */
export function centsToPriceInput(cents) {
  return ((cents || 0) / 100).toFixed(2);
}

/**
 * Affiche une date longue : « 5 novembre 2026 ».
 * @param {string|Date} value
 * @returns {string}
 */
export function formatDate(value) {
  if (!value) return "";
  return dateFormatter.format(new Date(value));
}

/**
 * Affiche une date avec l'heure : « 5 nov. 2026, 14 h 30 ».
 * @param {string|Date} value
 * @returns {string}
 */
export function formatDateTime(value) {
  if (!value) return "";
  return dateTimeFormatter.format(new Date(value));
}

/**
 * Transforme un texte en « slug » utilisable dans une adresse web.
 * « Hoodie Endless Grace ! » -> « hoodie-endless-grace »
 * @param {string} text
 * @returns {string}
 */
export function slugify(text) {
  return String(text || "")
    .normalize("NFD") // sépare les lettres de leurs accents
    .replace(/[̀-ͯ]/g, "") // enlève les accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // tout ce qui n'est pas lettre/chiffre devient « - »
    .replace(/^-+|-+$/g, ""); // enlève les « - » au début et à la fin
}

/**
 * Met au pluriel un mot simple selon un nombre : (2, "article") -> "2 articles".
 * @param {number} count
 * @param {string} word - mot au singulier
 * @returns {string}
 */
export function pluralize(count, word) {
  return `${count} ${word}${count > 1 ? "s" : ""}`;
}

/**
 * Convertit une taille de fichier en texte lisible : 2621440 -> "2,5 Mo".
 * @param {number} bytes
 * @returns {string}
 */
export function formatFileSize(bytes) {
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} Ko`;
  }
  const megabytes = bytes / (1024 * 1024);
  return `${megabytes.toFixed(1).replace(".", ",")} Mo`;
}
