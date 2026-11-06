/**
 * Tests des règles de commande côté serveur (lignes de commande fiables)
 * et des petits outils (numéro de commande, formats, couleurs).
 */
import { describe, expect, it } from "vitest";
import { buildOrderItem, buildOrderItems } from "@/lib/services/checkoutItems";
import { generateOrderNumber } from "@/lib/services/orderNumber";
import { formatPrice, parsePriceToCents, slugify } from "@/lib/utils/format";
import { isDarkColor } from "@/lib/utils/color";

const TSHIRT = {
  id: "t1",
  name: "T-shirt personnalisé",
  slug: "t-shirt-personnalise",
  line: "service",
  category: "tshirt",
  priceCents: 3800,
  isActive: true,
  images: [],
  colors: [{ name: "Noir", hex: "#1a1a1a", image: "/noir.webp" }],
  allowCustomColor: true,
  sizes: ["M", "L"],
  materials: [],
};

const CART_ITEM = {
  productId: "t1",
  quantity: 2,
  color: "Noir",
  customColor: "",
  size: "M",
  material: "",
  placement: "front",
  printText: "Bonjour",
  instructions: "",
  designFileId: "",
};

describe("buildOrderItem", () => {
  it("utilise le prix de la base, pas celui du navigateur", () => {
    const { item } = buildOrderItem({ ...CART_ITEM, unitPriceCents: 1 }, TSHIRT);
    expect(item.unitPriceCents).toBe(3800);
    expect(item.image).toBe("/noir.webp");
  });

  it("refuse une couleur ou une taille qui n'existe pas", () => {
    expect(buildOrderItem({ ...CART_ITEM, color: "Violet" }, TSHIRT).error).toContain("couleur");
    expect(buildOrderItem({ ...CART_ITEM, size: "XS" }, TSHIRT).error).toContain("taille");
  });

  it("accepte « Choisir ma couleur » seulement si le produit le permet", () => {
    const custom = { ...CART_ITEM, color: "", customColor: "Lilas" };
    expect(buildOrderItem(custom, TSHIRT).item.customColor).toBe("Lilas");
    expect(buildOrderItem(custom, { ...TSHIRT, allowCustomColor: false }).error).toContain("couleur");
  });

  it("refuse un produit caché ou un article sans personnalisation", () => {
    expect(buildOrderItem(CART_ITEM, { ...TSHIRT, isActive: false }).error).toContain("n'est plus disponible");
    expect(buildOrderItem({ ...CART_ITEM, printText: "" }, TSHIRT).error).toContain("Ajoutez un design");
  });

  it("s'arrête à la première ligne invalide", () => {
    const products = new Map([["t1", TSHIRT]]);
    const result = buildOrderItems([CART_ITEM, { ...CART_ITEM, productId: "inconnu" }], products);
    expect(result.items).toEqual([]);
    expect(result.errorMessage).toContain("n'est plus disponible");
  });
});

describe("outils", () => {
  it("génère un numéro de commande lisible", () => {
    const number = generateOrderNumber(new Date(2026, 10, 5));
    expect(number).toMatch(/^YP-261105-[A-HJ-NP-Z2-9]{4}$/);
  });

  it("formate et lit les prix", () => {
    expect(formatPrice(3850)).toMatch(/^38,50\s\$$/);
    expect(parsePriceToCents("38,50")).toBe(3850);
    expect(parsePriceToCents("abc")).toBeNaN();
  });

  it("crée des adresses web propres et repère les couleurs foncées", () => {
    expect(slugify("Hoodie Évènement 2026 !")).toBe("hoodie-evenement-2026");
    expect(isDarkColor("#1f2a44")).toBe(true);
    expect(isDarkColor("#ffffff")).toBe(false);
  });
});
