/**
 * Schéma du paiement : contenu du panier + coordonnées + livraison.
 *
 * ⚠️ Le prix n'est PAS accepté depuis le navigateur : le serveur relit
 * toujours le prix de chaque produit dans la base (voir services/checkout).
 */
import { z } from "zod";
import { requiredText, optionalText, emailField, phoneField, postalCodeField, idField } from "./common";
import { MAX_QUANTITY_PER_LINE, PLACEMENT_KEYS, SIZES } from "@/config/catalog";
import { DELIVERY_METHOD_KEYS } from "@/config/shipping";
import { PROVINCE_CODES, WORKSHOP_PROVINCE } from "@/config/taxes";

/** Une ligne du panier telle qu'envoyée par le navigateur. */
export const cartItemSchema = z.object({
  productId: idField,
  quantity: z.coerce
    .number({ error: "Quantité invalide." })
    .int("La quantité doit être un nombre entier.")
    .min(1, "La quantité minimale est 1.")
    .max(MAX_QUANTITY_PER_LINE, `Maximum ${MAX_QUANTITY_PER_LINE} par article.`),
  color: optionalText(40),
  customColor: optionalText(60),
  size: z.union([z.literal(""), z.enum(SIZES)]).optional().default(""),
  material: optionalText(30),
  placement: z.union([z.literal(""), z.enum(PLACEMENT_KEYS)]).optional().default(""),
  printText: optionalText(80),
  instructions: optionalText(500),
  designFileId: z.union([z.literal(""), idField]).optional().default(""),
});

/** Coordonnées du client. */
export const customerSchema = z.object({
  firstName: requiredText("Le prénom", 60),
  lastName: requiredText("Le nom", 60),
  email: emailField,
  phone: phoneField,
});

/** Adresse de livraison (seulement si le client choisit l'expédition). */
export const addressSchema = z.object({
  line1: requiredText("L'adresse", 120),
  line2: optionalText(120),
  city: requiredText("La ville", 80),
  postalCode: postalCodeField,
});

/**
 * Mode de livraison.
 * - Ramassage : l'adresse est ignorée et la province est celle de l'atelier
 *   (ce sont ses taxes qui s'appliquent).
 * - Expédition : la province et l'adresse sont obligatoires.
 */
export const deliverySchema = z
  .object({
    method: z.enum(DELIVERY_METHOD_KEYS, { error: "Choisissez un mode de livraison." }),
    province: z.union([z.literal(""), z.enum(PROVINCE_CODES)]).optional().default(""),
    address: z.any().optional(),
  })
  .transform((delivery, context) => {
    if (delivery.method === "pickup") {
      return { method: "pickup", province: WORKSHOP_PROVINCE, address: {} };
    }

    let hasError = false;

    if (!delivery.province) {
      context.addIssue({ code: "custom", path: ["province"], message: "Choisissez une province." });
      hasError = true;
    }

    // On valide l'adresse et on remonte chaque erreur sur le bon champ
    const addressResult = addressSchema.safeParse(delivery.address || {});
    if (!addressResult.success) {
      for (const issue of addressResult.error.issues) {
        context.addIssue({ code: "custom", path: ["address", ...issue.path], message: issue.message });
      }
      hasError = true;
    }

    if (hasError) {
      return z.NEVER; // valeur spéciale de Zod : « pas de résultat, voir les erreurs »
    }
    return { method: "shipping", province: delivery.province, address: addressResult.data };
  });

/** Données complètes envoyées à POST /api/checkout. */
export const checkoutSchema = z.object({
  items: z
    .array(cartItemSchema, { error: "Le panier est invalide." })
    .min(1, "Votre panier est vide.")
    .max(50, "Votre panier contient trop de lignes (50 maximum)."),
  customer: customerSchema,
  delivery: deliverySchema,
  customerNote: optionalText(1000),
});
