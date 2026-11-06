/**
 * Tests des schémas de validation (Zod) : messages en français,
 * nettoyage des données et règles de la livraison.
 */
import { describe, expect, it } from "vitest";
import { validateData, isSpamSubmission } from "@/lib/validation/validate";
import { quoteRequestSchema, orderTrackingSchema } from "@/lib/validation/forms";
import { checkoutSchema } from "@/lib/validation/checkout";
import { productSchema, galleryUpdateSchema } from "@/lib/validation/admin";
import { getFileError } from "@/lib/validation/upload";
import { DESIGN_UPLOAD_RULES } from "@/config/catalog";

const VALID_ITEM = { productId: "cmh3k2x0a0000qz8l5d2v7f1p", quantity: 1 };
const VALID_CUSTOMER = { firstName: "Kevin", lastName: "Tiam", email: "kevin@example.com", phone: "613 555-0101" };

describe("formulaire de devis", () => {
  it("renvoie un message en français par champ manquant", () => {
    const result = validateData(quoteRequestSchema, { firstName: "", phone: "123" });
    expect(result.success).toBe(false);
    expect(result.fieldErrors.firstName).toBe("Le prénom est obligatoire.");
    expect(result.fieldErrors.phone).toBe("Le numéro doit contenir au moins 10 chiffres.");
    expect(result.fieldErrors.comment).toBe("Le commentaire est obligatoire.");
  });

  it("accepte un formulaire complet, sans courriel (facultatif)", () => {
    const result = validateData(quoteRequestSchema, {
      firstName: " Marie ",
      lastName: "Dupont",
      phone: "(613) 555-0199",
      comment: "50 t-shirts",
    });
    expect(result.success).toBe(true);
    expect(result.data.firstName).toBe("Marie"); // espaces retirés
    expect(result.data.email).toBe("");
  });
});

describe("suivi de commande", () => {
  it("met le numéro en majuscules et le courriel en minuscules", () => {
    const result = validateData(orderTrackingSchema, { orderNumber: "yp-261105-k7qf", email: " Kevin@Example.COM " });
    expect(result.data).toEqual({ orderNumber: "YP-261105-K7QF", email: "kevin@example.com" });
  });
});

describe("paiement", () => {
  it("exige l'adresse et la province pour une expédition", () => {
    const result = validateData(checkoutSchema, {
      items: [VALID_ITEM],
      customer: VALID_CUSTOMER,
      delivery: { method: "shipping", address: {} },
    });
    expect(result.success).toBe(false);
    expect(result.fieldErrors["delivery.province"]).toBe("Choisissez une province.");
    expect(result.fieldErrors["delivery.address.line1"]).toBe("L'adresse est obligatoire.");
  });

  it("ignore l'adresse d'un ramassage et applique la province de l'atelier", () => {
    const result = validateData(checkoutSchema, {
      items: [VALID_ITEM],
      customer: VALID_CUSTOMER,
      delivery: { method: "pickup", province: "BC", address: { line1: "inutile" } },
    });
    expect(result.success).toBe(true);
    expect(result.data.delivery).toEqual({ method: "pickup", province: "ON", address: {} });
  });

  it("met le code postal au bon format", () => {
    const result = validateData(checkoutSchema, {
      items: [VALID_ITEM],
      customer: VALID_CUSTOMER,
      delivery: { method: "shipping", province: "ON", address: { line1: "1 rue A", city: "Ottawa", postalCode: "k1a0b1" } },
    });
    expect(result.data.delivery.address.postalCode).toBe("K1A 0B1");
  });

  it("refuse un panier vide", () => {
    const result = validateData(checkoutSchema, { items: [], customer: VALID_CUSTOMER, delivery: { method: "pickup" } });
    expect(result.fieldErrors.items).toBe("Votre panier est vide.");
  });
});

describe("admin", () => {
  it("refuse une adresse de produit avec des espaces ou des accents", () => {
    const result = validateData(productSchema, { name: "Test", slug: "mon produit", line: "service", category: "mug", priceCents: 100 });
    expect(result.fieldErrors.slug).toContain("Adresse invalide");
  });

  it("ne met aucune valeur par défaut dans une mise à jour partielle de la galerie", () => {
    const result = validateData(galleryUpdateSchema, { isVisible: false });
    expect(result.data).toEqual({ isVisible: false });
  });
});

describe("fichiers et anti-pourriel", () => {
  it("refuse un fichier trop lourd ou d'un mauvais type", () => {
    expect(getFileError({ type: "image/png", size: 11 * 1024 * 1024 }, DESIGN_UPLOAD_RULES)).toBe("Fichier trop lourd : 10 Mo maximum.");
    expect(getFileError({ type: "application/zip", size: 100 }, DESIGN_UPLOAD_RULES)).toContain("Format non accepté");
    expect(getFileError({ type: "image/png", size: 100 }, DESIGN_UPLOAD_RULES)).toBeNull();
  });

  it("détecte le champ piège rempli par un robot", () => {
    expect(isSpamSubmission({ website: "http://spam.example" })).toBe(true);
    expect(isSpamSubmission({ website: "" })).toBe(false);
  });
});
