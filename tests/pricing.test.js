/**
 * Tests du calcul des montants (sous-total, livraison, taxes, total).
 * Lancer : npm run test
 */
import { describe, expect, it } from "vitest";
import { computeOrderTotals, computeTaxLines, formatTaxRate } from "@/lib/services/pricing";

// Panier type : un hoodie (60 $) et deux tasses (2 × 20 $)
const ITEMS = [
  { unitPriceCents: 6000, quantity: 1 },
  { unitPriceCents: 2000, quantity: 2 },
];

describe("computeOrderTotals", () => {
  it("calcule la TVH de l'Ontario sur les articles ET la livraison", () => {
    const totals = computeOrderTotals({ items: ITEMS, deliveryMethod: "shipping", provinceCode: "ON" });

    expect(totals.subtotalCents).toBe(10000); // 100 $
    expect(totals.shippingCents).toBe(1500); // 15 $
    expect(totals.taxCents).toBe(1495); // 13 % de 115 $
    expect(totals.totalCents).toBe(12995);
  });

  it("applique les taxes de l'atelier (Ontario) pour un ramassage, même si une autre province est indiquée", () => {
    const totals = computeOrderTotals({ items: ITEMS, deliveryMethod: "pickup", provinceCode: "QC" });

    expect(totals.shippingCents).toBe(0);
    expect(totals.taxProvince).toBe("ON");
    expect(totals.taxCents).toBe(1300);
  });

  it("calcule séparément la TPS et la TVQ au Québec", () => {
    const totals = computeOrderTotals({ items: ITEMS, deliveryMethod: "shipping", provinceCode: "QC" });

    expect(totals.taxLines).toHaveLength(2);
    expect(totals.taxLines[0]).toMatchObject({ label: "TPS", amountCents: 575 });
    expect(totals.taxLines[1]).toMatchObject({ label: "TVQ", amountCents: 1147 }); // 9,975 % de 115 $, arrondi
  });

  it("utilise la TVH de 14 % de la Nouvelle-Écosse (depuis avril 2025)", () => {
    const lines = computeTaxLines(10000, "NS");
    expect(lines).toEqual([{ label: "TVH", rate: 0.14, amountCents: 1400 }]);
  });

  it("ne calcule aucune taxe si la province est inconnue", () => {
    expect(computeTaxLines(10000, "XX")).toEqual([]);
  });
});

describe("computeOrderTotals avec les réglages de la boutique", () => {
  const SETTINGS = { shippingPriceCents: 900, pickupEnabled: true, taxesEnabled: true };

  it("utilise le prix de livraison choisi dans l'admin", () => {
    const totals = computeOrderTotals({ items: ITEMS, deliveryMethod: "shipping", provinceCode: "ON", settings: SETTINGS });
    expect(totals.shippingCents).toBe(900);
    expect(totals.taxCents).toBe(1417); // 13 % de 109 $
  });

  it("ne facture aucune taxe si les taxes sont désactivées (petit fournisseur)", () => {
    const totals = computeOrderTotals({
      items: ITEMS,
      deliveryMethod: "shipping",
      provinceCode: "QC",
      settings: { ...SETTINGS, taxesEnabled: false },
    });
    expect(totals.taxLines).toEqual([]);
    expect(totals.totalCents).toBe(10900);
  });

  it("offre la livraison si le prix est 0", () => {
    const totals = computeOrderTotals({ items: ITEMS, deliveryMethod: "shipping", provinceCode: "AB", settings: { ...SETTINGS, shippingPriceCents: 0 } });
    expect(totals.shippingCents).toBe(0);
    expect(totals.taxCents).toBe(500); // TPS 5 % de 100 $
  });
});

describe("formatTaxRate", () => {
  it("affiche les taux à la française", () => {
    expect(formatTaxRate(0.13)).toBe("13 %");
    expect(formatTaxRate(0.09975)).toBe("9,975 %");
  });
});
