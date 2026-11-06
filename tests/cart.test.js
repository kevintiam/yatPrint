/**
 * Tests des fonctions du panier et du configurateur.
 */
import { describe, expect, it } from "vitest";
import { addItemToCart, countCartItems, removeItemFromCart, toCheckoutItems, updateItemQuantity } from "@/lib/cart/cartUtils";
import { buildCartItem, getCustomizerErrors, getPreviewImage } from "@/lib/cart/customizerRules";

const HOODIE = {
  id: "h1",
  slug: "hoodie-personnalise",
  name: "Hoodie personnalisé",
  line: "service",
  category: "hoodie",
  priceCents: 6000,
  images: [],
  colors: [
    { name: "Noir", hex: "#1a1a1a", image: "/noir.webp" },
    { name: "Rose", hex: "#f48fb1", image: "/rose.webp" },
  ],
  sizes: ["S", "M", "L"],
  materials: [],
};

const BASE_CHOICES = {
  colorName: "Rose",
  isCustomColor: false,
  customColor: "",
  size: "M",
  materialKey: "",
  placement: "front",
  printText: "Équipe 2026",
  instructions: "",
  quantity: 2,
  designFileId: "",
  designFileName: "",
  isUploading: false,
};

describe("panier", () => {
  const line = { productId: "p1", color: "Noir", size: "M", quantity: 1, unitPriceCents: 3800 };

  it("fusionne deux ajouts identiques et sépare les options différentes", () => {
    let items = addItemToCart([], line, "l1");
    items = addItemToCart(items, { ...line, quantity: 2 }, "l2");
    items = addItemToCart(items, { ...line, size: "L" }, "l3");

    expect(items).toHaveLength(2);
    expect(items[0].quantity).toBe(3);
    expect(countCartItems(items)).toBe(4);
  });

  it("limite la quantité entre 1 et 100", () => {
    const items = addItemToCart([], line, "l1");
    expect(updateItemQuantity(items, "l1", 0)[0].quantity).toBe(1);
    expect(updateItemQuantity(items, "l1", 999)[0].quantity).toBe(100);
  });

  it("retire une ligne et n'envoie jamais le prix au serveur", () => {
    const items = addItemToCart([], line, "l1");
    expect(removeItemFromCart(items, "l1")).toEqual([]);
    expect(toCheckoutItems(items)[0]).not.toHaveProperty("unitPriceCents");
  });
});

describe("configurateur", () => {
  it("demande un design, un texte ou une description", () => {
    const errors = getCustomizerErrors(HOODIE, { ...BASE_CHOICES, printText: "" });
    expect(errors.design).toContain("Ajoutez un design");
  });

  it("exige la taille et la couleur sur demande", () => {
    const errors = getCustomizerErrors(HOODIE, { ...BASE_CHOICES, size: "", isCustomColor: true });
    expect(errors.size).toBe("Choisissez une taille.");
    expect(errors.color).toBe("Indiquez la couleur souhaitée.");
  });

  it("construit la ligne de panier avec la photo de la couleur choisie", () => {
    const item = buildCartItem(HOODIE, BASE_CHOICES);
    expect(item).toMatchObject({ color: "Rose", size: "M", placement: "front", quantity: 2, image: "/rose.webp" });
    expect(getPreviewImage(HOODIE, { ...BASE_CHOICES, colorName: "Noir" })).toBe("/noir.webp");
  });
});
