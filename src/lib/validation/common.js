/**
 * Champs de validation réutilisables (Zod), avec des messages d'erreur en français.
 *
 * Ces schémas sont utilisés des DEUX côtés :
 * - dans le navigateur, pour afficher les erreurs avant l'envoi ;
 * - sur le serveur (routes API), car on ne fait jamais confiance au navigateur.
 */
import { z } from "zod";

/**
 * Texte obligatoire, espaces retirés au début et à la fin.
 * @param {string} label - nom du champ dans le message, ex. "Le prénom"
 * @param {number} [maxLength]
 */
export function requiredText(label, maxLength = 120) {
  return z
    .string({ error: `${label} est obligatoire.` })
    .trim()
    .min(1, `${label} est obligatoire.`)
    .max(maxLength, `${label} doit faire ${maxLength} caractères maximum.`);
}

/**
 * Texte facultatif : vaut "" s'il est absent.
 * @param {number} [maxLength]
 */
export function optionalText(maxLength = 500) {
  return z
    .string()
    .trim()
    .max(maxLength, `Ce champ doit faire ${maxLength} caractères maximum.`)
    .optional()
    .default("");
}

/** Courriel obligatoire, mis en minuscules. */
export const emailField = z
  .string({ error: "Le courriel est obligatoire." })
  .trim()
  .toLowerCase()
  .min(1, "Le courriel est obligatoire.")
  .max(160, "Le courriel est trop long.")
  .pipe(z.email("Le courriel n'est pas valide (ex. nom@exemple.com)."));

/** Courriel facultatif : "" ou un courriel valide. */
export const optionalEmailField = z.union([z.literal(""), emailField]).optional().default("");

/**
 * Compte les chiffres d'un texte : « (613) 555-0101 » -> 10.
 * @param {string} text
 * @returns {number}
 */
function countDigits(text) {
  let count = 0;
  for (const character of text) {
    if (character >= "0" && character <= "9") count += 1;
  }
  return count;
}

/** Téléphone obligatoire : au moins 10 chiffres (espaces, tirets et parenthèses acceptés). */
export const phoneField = z
  .string({ error: "Le téléphone est obligatoire." })
  .trim()
  .min(1, "Le téléphone est obligatoire.")
  .max(25, "Le numéro de téléphone est trop long.")
  .refine((value) => /^[0-9+().\s-]+$/.test(value), "Utilisez seulement des chiffres, espaces et tirets.")
  .refine((value) => countDigits(value) >= 10, "Le numéro doit contenir au moins 10 chiffres.");

/** Téléphone facultatif : "" ou un numéro valide. */
export const optionalPhoneField = z.union([z.literal(""), phoneField]).optional().default("");

/** Code postal canadien : « k1a0b1 » devient « K1A 0B1 ». */
export const postalCodeField = z
  .string({ error: "Le code postal est obligatoire." })
  .trim()
  .toUpperCase()
  .refine((value) => /^[A-Z]\d[A-Z][ -]?\d[A-Z]\d$/.test(value), "Code postal invalide (ex. K1A 0B1).")
  .transform((value) => `${value.slice(0, 3)} ${value.slice(-3)}`);

/**
 * Identifiant d'une ligne de la base (cuid créé par Prisma),
 * ex. « cmh3k2x0a0000qz8l5d2v7f1p » : lettres minuscules et chiffres.
 */
export const idField = z
  .string({ error: "Identifiant manquant." })
  .regex(/^[a-z0-9]{10,40}$/i, "Identifiant invalide.");

/**
 * Liste de choix à partir d'un objet de configuration.
 * Ex. : enumFromOptions(MENTORSHIP_TOPICS, "Choisissez un thème.")
 * @param {object} options - objet dont les clés sont les valeurs acceptées
 * @param {string} message - message si la valeur n'est pas dans la liste
 */
export function enumFromOptions(options, message) {
  return z.enum(Object.keys(options), { error: message });
}
