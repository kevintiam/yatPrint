/**
 * Schémas de la page Réglages de l'admin :
 * - storeSettingsSchema : coordonnées, livraison et taxes de la boutique ;
 * - accountSchema       : nom et mot de passe du compte admin.
 */
import { z } from "zod";
import { requiredText, optionalText, emailField, optionalPhoneField } from "./common";

/** Adresse Instagram : vide, ou une adresse https://www.instagram.com/... */
const instagramUrlField = z
  .string()
  .trim()
  .max(200, "Adresse trop longue.")
  .refine(
    (value) => value === "" || /^https:\/\/(www\.)?instagram\.com\/[A-Za-z0-9._-]+\/?$/.test(value),
    "Adresse invalide (ex. https://www.instagram.com/yatprint.ca/)."
  )
  .optional()
  .default("");

/** Réglages de la boutique (tous les champs sont envoyés à chaque enregistrement). */
export const storeSettingsSchema = z.object({
  email: emailField,
  phone: optionalPhoneField,
  city: requiredText("La ville", 80),
  instagramUrl: instagramUrlField,
  instagramHandle: optionalText(40),
  shippingPriceCents: z.coerce
    .number({ error: "Prix invalide." })
    .int("Le prix doit être en cents (nombre entier).")
    .min(0, "Le prix ne peut pas être négatif.")
    .max(20000, "200 $ maximum pour la livraison."),
  pickupEnabled: z.boolean({ error: "Valeur invalide." }),
  taxesEnabled: z.boolean({ error: "Valeur invalide." }),
});

/**
 * Compte admin. Le mot de passe actuel est TOUJOURS demandé :
 * quelqu'un qui trouverait la session ouverte ne peut pas changer le mot de passe.
 * Laisser « nouveau mot de passe » vide = garder l'ancien.
 */
export const accountSchema = z
  .object({
    name: requiredText("Le nom", 60),
    currentPassword: z
      .string({ error: "Le mot de passe actuel est obligatoire." })
      .min(1, "Le mot de passe actuel est obligatoire."),
    newPassword: z
      .string()
      .max(100, "100 caractères maximum.")
      .refine((value) => value === "" || value.length >= 10, "10 caractères minimum.")
      .optional()
      .default(""),
    confirmPassword: z.string().optional().default(""),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les deux mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  });
