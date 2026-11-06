/**
 * Produits de départ, ajoutés par « npm run db:seed ».
 * Prix tirés de la liste de Gessica (en cents : 3800 = 38,00 $).
 *
 * Après le premier lancement, tout se modifie dans l'admin (/admin/produits).
 */
const SIZES = ["XS", "S", "M", "L", "XL", "2XL"];

/** Couleurs des t-shirts à personnaliser, avec la photo correspondante. */
const TSHIRT_COLORS = [
  { name: "Blanc", hex: "#ffffff", image: "/images/customize/tshirt-white.webp" },
  { name: "Crème", hex: "#efe6d2", image: "/images/customize/tshirt-cream.webp" },
  { name: "Noir", hex: "#1a1a1a", image: "/images/customize/tshirt-black.webp" },
  { name: "Charbon", hex: "#4a4a4d", image: "/images/customize/tshirt-charcoal.webp" },
  { name: "Marine", hex: "#1f2a44", image: "/images/customize/tshirt-navy.webp" },
  { name: "Bordeaux", hex: "#6d1f33", image: "/images/customize/tshirt-maroon.webp" },
  { name: "Brun", hex: "#6b4a2b", image: "/images/customize/tshirt-brown.webp" },
  { name: "Olive foncé", hex: "#3b4a2f", image: "/images/customize/tshirt-dark-olive.webp" },
];

/** Couleurs des hoodies à personnaliser. */
const HOODIE_COLORS = [
  { name: "Gris chiné", hex: "#d6d6d6", image: "/images/customize/hoodie-ash.webp" },
  { name: "Framboise", hex: "#c2185b", image: "/images/customize/hoodie-berry.webp" },
  { name: "Noir", hex: "#1a1a1a", image: "/images/customize/hoodie-black.webp" },
  { name: "Charbon", hex: "#4a4a4d", image: "/images/customize/hoodie-charcoal.webp" },
  { name: "Crème", hex: "#ede4cf", image: "/images/customize/hoodie-cream.webp" },
  { name: "Olive foncé", hex: "#2f3b2a", image: "/images/customize/hoodie-dark-olive.webp" },
  { name: "Marine", hex: "#1c2541", image: "/images/customize/hoodie-navy.webp" },
  { name: "Rose", hex: "#f48fb1", image: "/images/customize/hoodie-pink.webp" },
];

/** Articles de l'atelier de personnalisation (line = "service"). */
const SERVICE_PRODUCTS = [
  {
    name: "T-shirt personnalisé",
    slug: "t-shirt-personnalise",
    category: "tshirt",
    priceCents: 3800,
    shortDescription: "Votre design, votre texte ou votre logo sur un t-shirt, dans la couleur de votre choix.",
    description:
      "Choisissez la couleur, la taille et l'emplacement, puis ajoutez votre design. Couleur absente de la liste ? Utilisez « Choisir ma couleur ».",
    colors: TSHIRT_COLORS,
    allowCustomColor: true,
    sizes: SIZES,
    isFeatured: true,
  },
  {
    name: "Hoodie personnalisé",
    slug: "hoodie-personnalise",
    category: "hoodie",
    priceCents: 6000,
    shortDescription: "Un hoodie chaud et confortable, à votre image.",
    description:
      "Parfait pour une équipe, un événement ou un cadeau. Choisissez la couleur, la taille et l'emplacement de l'impression.",
    colors: HOODIE_COLORS,
    allowCustomColor: true,
    sizes: SIZES,
    isFeatured: true,
  },
  {
    name: "Tasse personnalisée",
    slug: "tasse-personnalisee",
    category: "mug",
    priceCents: 2000,
    shortDescription: "Votre photo, votre logo ou votre message sur une tasse à café.",
    description: "Une idée cadeau simple et toujours appréciée. Ajoutez une image, un texte, ou les deux.",
  },
  {
    name: "Cadre décoratif personnalisé",
    slug: "cadre-personnalise",
    category: "frame",
    priceCents: 2000,
    shortDescription: "Un cadre décoratif avec votre photo, citation ou création.",
    description: "Pour décorer, offrir ou souligner un moment important. Décrivez-nous votre idée.",
  },
  {
    name: "Gravure sur bois ou acrylique",
    slug: "gravure-bois-acrylique",
    category: "engraving",
    priceCents: 2000,
    shortDescription: "Un prénom, un logo ou un message gravé sur bois ou acrylique.",
    description:
      "Planches, plaques, lampes en acrylique : choisissez le matériau et indiquez votre texte ou votre logo.",
    images: ["/images/customize/engraving-wood.webp"],
    materials: [
      { key: "wood", name: "Bois", image: "/images/customize/engraving-wood.webp" },
      { key: "acrylic", name: "Acrylique", image: "/images/customize/engraving-acrylic.webp" },
    ],
  },
];

/**
 * Crée un article de la collection.
 * @param {string} name
 * @param {string} slug
 * @param {string} category
 * @param {number} priceCents
 * @param {string} image - nom du fichier dans public/images/collection
 * @param {string} description
 */
function collectionItem(name, slug, category, priceCents, image, description) {
  const isClothing = category === "tshirt" || category === "hoodie";
  return {
    name,
    slug,
    category,
    priceCents,
    images: [`/images/collection/${image}.webp`],
    sizes: isClothing ? SIZES : [],
    shortDescription: description,
    description: `${description} Impression soignée, préparée à la commande dans notre atelier.`,
  };
}

/** Articles de la marque Yat'Print (line = "collection"). Prix : t-shirt 35 $, hoodie 60 $, tasse 20 $, tote 10 $. */
const COLLECTION_PRODUCTS = [
  collectionItem("Hoodie Endless Grace", "hoodie-endless-grace", "hoodie", 6000, "hoodie-endless-grace", "Hoodie vert forêt, motif « Endless Grace » en blanc."),
  collectionItem("T-shirt Endless Grace", "t-shirt-endless-grace", "tshirt", 3500, "tshirt-endless-grace", "T-shirt noir, motif « Endless Grace » en blanc."),
  collectionItem("T-shirt Grace Looks Good", "t-shirt-grace-looks-good", "tshirt", 3500, "tshirt-grace-looks-good", "T-shirt olive, message « Grace looks good on me »."),
  collectionItem("Hoodie Ordinary Days", "hoodie-ordinary-days", "hoodie", 6000, "hoodie-ordinary-days", "Hoodie vert forêt, message « Made for ordinary days »."),
  collectionItem("T-shirt Ordinary Days", "t-shirt-ordinary-days", "tshirt", 3500, "tshirt-ordinary-days", "T-shirt blanc, message « Made for ordinary days »."),
  collectionItem("T-shirt Sought Out", "t-shirt-sought-out", "tshirt", 3500, "tshirt-sought-out", "T-shirt olive, motif « Sought Out »."),
  collectionItem("Hoodie Faith In-Between", "hoodie-faith-in-between", "hoodie", 6000, "hoodie-faith-in-between", "Hoodie sable, message « Faith for the in-between »."),
  collectionItem("T-shirt Every Name", "t-shirt-every-name", "tshirt", 3500, "tshirt-every-name", "T-shirt olive, message « Grace for every name I've worn »."),
  collectionItem("Hoodie Every Name", "hoodie-every-name", "hoodie", 6000, "hoodie-every-name", "Hoodie sable, motif rond « Grace for every name I've worn »."),
  collectionItem("Tasse Endless Grace", "tasse-endless-grace", "mug", 2000, "mug-endless-grace", "Tasse blanche, motif « Endless Grace » en noir."),
  collectionItem("Tote bag Faith In-Between", "tote-bag-faith-in-between", "tote", 1000, "tote-faith-in-between", "Sac en toile naturelle, message « Faith for the in-between »."),
];

/**
 * Liste finale, avec la ligne de produits et l'ordre d'affichage.
 * @returns {object[]}
 */
export function getSeedProducts() {
  const products = [];
  let order = 1;

  for (const product of SERVICE_PRODUCTS) {
    products.push({ ...product, line: "service", sortOrder: order });
    order += 1;
  }
  for (const product of COLLECTION_PRODUCTS) {
    // Les 4 premiers articles de la collection sont mis en avant
    products.push({ ...product, line: "collection", sortOrder: order, isFeatured: order <= 9 });
    order += 1;
  }

  return products;
}
