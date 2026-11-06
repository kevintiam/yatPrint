/**
 * Tests des outils de l'admin : rapports de ventes, graphiques, pagination,
 * filtres de produits, export CSV et validation des réglages.
 * Lancer : npm run test
 */
import { describe, expect, it } from "vitest";
import { buildDailySales, buildTopProducts, computeChangePercent, toDayKey } from "@/lib/services/salesReport";
import { getNiceTicks, roundedTopBarPath } from "@/lib/utils/chart";
import { getPageNumbers, paginate } from "@/lib/utils/pagination";
import { filterProducts, normalizeText } from "@/lib/utils/productFilters";
import { buildOrdersCsv, escapeCsvValue, formatCsvAmount } from "@/lib/services/ordersCsv";
import { accountSchema, storeSettingsSchema } from "@/lib/validation/settings";
import { validateData } from "@/lib/validation/validate";

describe("rapport des ventes", () => {
  // 5 novembre 2026 à midi, heure de Toronto (17 h UTC)
  const NOW = new Date("2026-11-05T17:00:00Z");

  it("crée une case par jour, y compris les jours sans vente", () => {
    const days = buildDailySales([], 30, NOW);
    expect(days).toHaveLength(30);
    expect(days[29].day).toBe("2026-11-05");
    expect(days[0].day).toBe("2026-10-07");
    expect(days.every((day) => day.totalCents === 0)).toBe(true);
  });

  it("range les ventes dans le jour de Toronto (pas le jour UTC)", () => {
    // 2 h UTC le 5 novembre = 21 h le 4 novembre à Toronto
    expect(toDayKey("2026-11-05T02:00:00Z")).toBe("2026-11-04");

    const days = buildDailySales(
      [
        { paidAt: "2026-11-05T02:00:00Z", totalCents: 1000 },
        { paidAt: "2026-11-05T15:00:00Z", totalCents: 2500 },
        { paidAt: "2026-11-05T16:00:00Z", totalCents: 500 },
      ],
      30,
      NOW
    );
    expect(days[28]).toMatchObject({ day: "2026-11-04", totalCents: 1000, orderCount: 1 });
    expect(days[29]).toMatchObject({ day: "2026-11-05", totalCents: 3000, orderCount: 2 });
  });

  it("classe les produits par quantité vendue", () => {
    const top = buildTopProducts(
      [
        { productName: "Tasse", quantity: 2, unitPriceCents: 2000 },
        { productName: "Hoodie", quantity: 1, unitPriceCents: 6000 },
        { productName: "Tasse", quantity: 3, unitPriceCents: 2000 },
      ],
      5
    );
    expect(top[0]).toMatchObject({ name: "Tasse", quantity: 5, revenueCents: 10000 });
    expect(top[1]).toMatchObject({ name: "Hoodie", quantity: 1 });
  });

  it("calcule l'évolution par rapport au mois précédent", () => {
    expect(computeChangePercent(12500, 10000)).toBe(25);
    expect(computeChangePercent(5000, 10000)).toBe(-50);
    expect(computeChangePercent(5000, 0)).toBeNull(); // pas de comparaison possible
  });
});

describe("graphiques", () => {
  it("choisit des graduations rondes", () => {
    expect(getNiceTicks(437)).toEqual([0, 100, 200, 300, 400, 500]);
    expect(getNiceTicks(80)).toEqual([0, 20, 40, 60, 80]);
    expect(getNiceTicks(0)).toEqual([0, 25, 50, 75, 100]);
  });

  it("dessine une colonne vide quand la valeur est nulle", () => {
    expect(roundedTopBarPath(10, 100, 18, 100)).toBe("");
    expect(roundedTopBarPath(10, 50, 18, 100)).toMatch(/^M10,100/);
  });
});

describe("pagination", () => {
  it("affiche les pages proches et les extrémités", () => {
    expect(getPageNumbers(1, 3)).toEqual([1, 2, 3]);
    expect(getPageNumbers(6, 12)).toEqual([1, null, 5, 6, 7, null, 12]);
  });

  it("découpe une liste et ramène une page trop grande à la dernière", () => {
    const list = [1, 2, 3, 4, 5];
    expect(paginate(list, 2, 2)).toEqual({ items: [3, 4], page: 2, pageCount: 3, total: 5 });
    expect(paginate(list, 9, 2).items).toEqual([5]);
  });
});

describe("filtres des produits", () => {
  const PRODUCTS = [
    { name: "Tasse café", slug: "tasse-cafe", line: "service", category: "mug", isActive: true },
    { name: "Hoodie Yat'Print", slug: "hoodie-yatprint", line: "collection", category: "hoodie", isActive: false },
  ];

  it("ignore les accents et les majuscules dans la recherche", () => {
    expect(normalizeText("  Café ÉTÉ ")).toBe("cafe ete");
    expect(filterProducts(PRODUCTS, { search: "CAFE" })).toHaveLength(1);
  });

  it("combine les filtres", () => {
    expect(filterProducts(PRODUCTS, { line: "collection" })[0].category).toBe("hoodie");
    expect(filterProducts(PRODUCTS, { visibility: "hidden" })).toHaveLength(1);
    expect(filterProducts(PRODUCTS, { visibility: "visible", category: "hoodie" })).toHaveLength(0);
  });
});

describe("export CSV des commandes", () => {
  it("protège les valeurs pour Excel", () => {
    expect(formatCsvAmount(3850)).toBe("38,50");
    expect(escapeCsvValue('Dupont; "Marie"')).toBe('"Dupont; ""Marie"""');
    expect(escapeCsvValue("=SOMME(A1)")).toBe("'=SOMME(A1)"); // pas de formule exécutée
  });

  it("commence par le BOM et une ligne de titres", () => {
    const csv = buildOrdersCsv([
      {
        orderNumber: "YP-2611-ABCD",
        createdAt: "2026-11-05T17:00:00Z",
        paidAt: null,
        status: "paid",
        customer: { firstName: "Marie", lastName: "Dupont", email: "marie@example.com", phone: "6135550101" },
        delivery: { method: "pickup", province: "ON", address: { city: "" } },
        items: [{ quantity: 2, productName: "Tasse" }],
        subtotalCents: 4000,
        shippingCents: 0,
        taxCents: 520,
        totalCents: 4520,
      },
    ]);
    const lines = csv.split("\r\n");
    expect(csv.charCodeAt(0)).toBe(0xfeff);
    expect(lines[0]).toContain("Numéro;Date;Statut");
    expect(lines[1]).toContain("YP-2611-ABCD");
    expect(lines[1]).toContain("2 × Tasse");
    expect(lines[1]).toContain("45,20");
  });
});

describe("réglages de l'admin", () => {
  const SETTINGS = {
    email: " Info@YatPrint.ca ",
    phone: "",
    city: "Ottawa, Ontario",
    instagramUrl: "https://www.instagram.com/yatprint.ca/",
    instagramHandle: "@yatprint.ca",
    shippingPriceCents: 1500,
    pickupEnabled: true,
    taxesEnabled: true,
  };

  it("accepte des réglages complets et nettoie le courriel", () => {
    const result = validateData(storeSettingsSchema, SETTINGS);
    expect(result.success).toBe(true);
    expect(result.data.email).toBe("info@yatprint.ca");
  });

  it("refuse un prix négatif et une adresse Instagram invalide", () => {
    const result = validateData(storeSettingsSchema, { ...SETTINGS, shippingPriceCents: -1, instagramUrl: "http://exemple.com" });
    expect(result.fieldErrors.shippingPriceCents).toBe("Le prix ne peut pas être négatif.");
    expect(result.fieldErrors.instagramUrl).toMatch(/Adresse invalide/);
  });

  it("vérifie le nouveau mot de passe et sa confirmation", () => {
    const base = { name: "Gessica", currentPassword: "AncienMotDePasse1" };
    expect(validateData(accountSchema, { ...base, newPassword: "court", confirmPassword: "court" }).fieldErrors.newPassword).toBe("10 caractères minimum.");
    expect(validateData(accountSchema, { ...base, newPassword: "NouveauMotDePasse2026", confirmPassword: "autre" }).fieldErrors.confirmPassword).toBe(
      "Les deux mots de passe ne correspondent pas."
    );
    expect(validateData(accountSchema, base).success).toBe(true); // garder l'ancien mot de passe
  });
});
