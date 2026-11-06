/**
 * Création des numéros de commande lisibles, ex. « YP-261105-K7QF ».
 *
 * - « YP »     : Yat'Print
 * - « 261105 » : date (année 26, mois 11, jour 05)
 * - « K7QF »   : 4 caractères au hasard
 *
 * L'alphabet évite les caractères qu'on confond facilement (0/O, 1/I/L).
 */
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const RANDOM_LENGTH = 4;

/**
 * Ajoute un zéro devant un nombre à un chiffre : 5 -> "05".
 * @param {number} value
 * @returns {string}
 */
function twoDigits(value) {
  return String(value).padStart(2, "0");
}

/**
 * Génère un numéro de commande (sans vérifier s'il existe déjà).
 * @param {Date} [date] - date de la commande (aujourd'hui par défaut)
 * @returns {string}
 */
export function generateOrderNumber(date = new Date()) {
  const datePart =
    twoDigits(date.getFullYear() % 100) + twoDigits(date.getMonth() + 1) + twoDigits(date.getDate());

  // Nombres aléatoires sûrs (fonctionne dans Node.js et dans le navigateur)
  const randomValues = new Uint32Array(RANDOM_LENGTH);
  globalThis.crypto.getRandomValues(randomValues);

  let randomPart = "";
  for (const value of randomValues) {
    randomPart += ALPHABET[value % ALPHABET.length];
  }

  return `YP-${datePart}-${randomPart}`;
}

/**
 * Génère un numéro qui n'existe pas encore dans la base.
 * @param {(orderNumber: string) => Promise<boolean>} existsFn - fonction qui vérifie l'existence
 * @returns {Promise<string>}
 */
export async function generateUniqueOrderNumber(existsFn) {
  // 10 essais suffisent largement : il y a plus de 900 000 combinaisons par jour
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const orderNumber = generateOrderNumber();
    const alreadyUsed = await existsFn(orderNumber);
    if (!alreadyUsed) {
      return orderNumber;
    }
  }
  throw new Error("Impossible de générer un numéro de commande unique.");
}
