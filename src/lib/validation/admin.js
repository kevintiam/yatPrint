/**
 * Schémas utilisés par l'espace admin : connexion, produits, commandes,
 * demandes et galerie.
 */
import { z } from "zod";
import { requiredText, optionalText, emailField, enumFromOptions } from "./common";
import { CATEGORY_KEYS, SIZES } from "@/config/catalog";
import { GALLERY_CATEGORIES } from "@/config/options";
import {
  MENTORSHIP_STATUSES,
  MESSAGE_STATUSES,
  ORDER_STATUSES,
  QUOTE_STATUSES,
} from "@/config/statuses";

/** Connexion à l'admin. */
export const loginSchema = z.object({
  email: emailField,
  password: z.string({ error: "Le mot de passe est obligatoire." }).min(1, "Le mot de passe est obligatoire."),
});

/** Adresse d'une image : fichier du site (/images/...) ou fichier téléversé (/api/files/...). */
const imagePathField = z
  .string()
  .trim()
  .max(300)
  .refine((value) => value === "" || value.startsWith("/"), "Chemin d'image invalide.");

/** Une couleur d'un produit. */
const colorSchema = z.object({
  name: requiredText("Le nom de la couleur", 40),
  hex: z.string().trim().regex(/^#[0-9a-f]{6}$/i, "Couleur invalide (format #RRGGBB)."),
  image: imagePathField.optional().default(""),
});

/** Un matériau d'un produit (gravure). */
const materialSchema = z.object({
  key: z.string().trim().regex(/^[a-z0-9-]{1,30}$/, "Clé invalide (minuscules, chiffres et tirets)."),
  name: requiredText("Le nom du matériau", 40),
  image: imagePathField.optional().default(""),
});

/** Création et modification d'un produit. */
export const productSchema = z.object({
  name: requiredText("Le nom", 120),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Adresse invalide : lettres minuscules, chiffres et tirets."),
  line: z.enum(["service", "collection"], { error: "Choisissez une ligne de produits." }),
  category: z.enum(CATEGORY_KEYS, { error: "Choisissez une catégorie." }),
  shortDescription: optionalText(200),
  description: optionalText(3000),
  priceCents: z.coerce
    .number({ error: "Prix invalide." })
    .int("Le prix doit être en cents (nombre entier).")
    .min(0, "Le prix ne peut pas être négatif.")
    .max(1000000, "Prix trop élevé."),
  images: z.array(imagePathField).max(8, "8 photos maximum.").default([]),
  colors: z.array(colorSchema).max(20, "20 couleurs maximum.").default([]),
  allowCustomColor: z.boolean().default(false),
  sizes: z.array(z.enum(SIZES)).default([]),
  materials: z.array(materialSchema).max(6, "6 matériaux maximum.").default([]),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  sortOrder: z.coerce.number().int().min(0).max(9999).default(0),
});

/**
 * Texte facultatif SANS valeur par défaut, pour les mises à jour :
 * un champ absent reste absent et ne remplace donc pas la valeur enregistrée.
 * @param {number} maxLength
 */
function updateText(maxLength) {
  return z.string().trim().max(maxLength, `${maxLength} caractères maximum.`).optional();
}

/** Changement de statut et/ou de note interne d'une commande. */
export const orderUpdateSchema = z.object({
  status: enumFromOptions(ORDER_STATUSES, "Statut invalide.").optional(),
  note: optionalText(300), // précision visible par le client dans le suivi
  adminNote: updateText(2000), // note interne
});

/** Mise à jour d'une demande de devis. */
export const quoteUpdateSchema = z.object({
  status: enumFromOptions(QUOTE_STATUSES, "Statut invalide.").optional(),
  adminNote: updateText(2000),
});

/** Mise à jour d'une demande de mentorat. */
export const mentorshipUpdateSchema = z.object({
  status: enumFromOptions(MENTORSHIP_STATUSES, "Statut invalide.").optional(),
  confirmedDate: updateText(120),
  adminNote: updateText(2000),
});

/** Mise à jour d'un message de contact. */
export const messageUpdateSchema = z.object({
  status: enumFromOptions(MESSAGE_STATUSES, "Statut invalide."),
});

/** Ajout d'une photo dans la galerie. */
export const galleryItemSchema = z.object({
  title: requiredText("Le titre", 80),
  category: enumFromOptions(GALLERY_CATEGORIES, "Choisissez une catégorie."),
  imageUrl: imagePathField.refine((value) => value !== "", "Ajoutez une photo."),
  description: optionalText(300),
  sortOrder: z.coerce.number().int().min(0).max(9999).default(0),
  isVisible: z.boolean().default(true),
});

/**
 * Modification d'une photo de la galerie : tous les champs sont facultatifs
 * et SANS valeur par défaut (on ne modifie que ce qui est envoyé).
 */
export const galleryUpdateSchema = z.object({
  title: requiredText("Le titre", 80).optional(),
  category: enumFromOptions(GALLERY_CATEGORIES, "Catégorie invalide.").optional(),
  description: updateText(300),
  sortOrder: z.coerce.number().int().min(0).max(9999).optional(),
  isVisible: z.boolean().optional(),
});
