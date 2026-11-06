/**
 * Remplit la base avec les données de départ : produits, galerie, réglages
 * de la boutique et compte admin.
 *
 * Utilisation : npm run db:seed   (lit le fichier .env)
 * Prérequis   : les tables existent (npm run db:migrate).
 *
 * Le script peut être relancé sans risque : un produit (même slug) ou une
 * photo (même image) qui existe déjà est mis à jour, pas dupliqué.
 * ⚠️ Relancer le script remet donc les produits de départ à leurs valeurs d'origine.
 */
import bcrypt from "bcryptjs";
import { getPrisma, disconnectPrisma } from "../src/lib/db/prisma.js";
import { DEFAULT_STORE_SETTINGS } from "../src/config/brand.js";
import { getSeedProducts } from "./seed-data/products.js";
import { getSeedGalleryItems } from "./seed-data/gallery.js";

/**
 * Ajoute un numéro d'ordre (position) à chaque élément d'une liste.
 * @param {object[]} list
 * @returns {object[]}
 */
function withPositions(list = []) {
  const rows = [];
  for (let index = 0; index < list.length; index += 1) {
    rows.push({ ...list[index], position: index });
  }
  return rows;
}

/** Ajoute ou met à jour les produits (repérés par leur slug). */
async function seedProducts(prisma) {
  const products = getSeedProducts();

  for (const product of products) {
    const { colors, materials, ...fields } = product;
    const colorRows = withPositions(colors);
    const materialRows = withPositions(materials);

    await prisma.product.upsert({
      where: { slug: product.slug },
      create: { ...fields, colors: { create: colorRows }, materials: { create: materialRows } },
      // Mise à jour : on efface les anciennes couleurs/matériaux et on recrée les bons
      update: {
        ...fields,
        colors: { deleteMany: {}, create: colorRows },
        materials: { deleteMany: {}, create: materialRows },
      },
    });
  }
  console.log(`✅ ${products.length} produits prêts.`);
}

/** Ajoute ou met à jour les photos de la galerie (repérées par leur image). */
async function seedGallery(prisma) {
  const items = getSeedGalleryItems();
  for (const item of items) {
    await prisma.galleryItem.upsert({ where: { imageUrl: item.imageUrl }, create: item, update: item });
  }
  console.log(`✅ ${items.length} photos de galerie prêtes.`);
}

/** Crée les réglages de la boutique s'ils n'existent pas encore (ceux de l'admin sont conservés). */
async function seedSettings(prisma) {
  await prisma.storeSettings.upsert({
    where: { id: 1 },
    create: { id: 1, ...DEFAULT_STORE_SETTINGS },
    update: {}, // rien : on ne remplace jamais ce que Gessica a enregistré
  });
  console.log("✅ Réglages de la boutique prêts.");
}

/** Crée le compte admin s'il n'existe pas encore (le mot de passe existant n'est pas changé). */
async function seedAdmin(prisma) {
  const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "";

  if (!email || password.length < 10) {
    console.warn("⚠️  Compte admin non créé : indiquez ADMIN_EMAIL et ADMIN_PASSWORD (10 caractères min.) dans .env.");
    return;
  }

  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) {
    console.log(`ℹ️  Le compte admin ${email} existe déjà (mot de passe inchangé).`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.admin.create({ data: { email, name: process.env.ADMIN_NAME || "Admin", passwordHash } });
  console.log(`✅ Compte admin créé : ${email}`);
}

async function main() {
  console.log("Connexion à PostgreSQL…");
  const prisma = getPrisma();

  await seedProducts(prisma);
  await seedGallery(prisma);
  await seedSettings(prisma);
  await seedAdmin(prisma);

  await disconnectPrisma();
  console.log("🎉 Base prête ! Lancez « npm run dev » puis ouvrez http://localhost:3000");
}

main().catch(async (error) => {
  console.error("❌ Erreur pendant le remplissage de la base :", error.message);
  if (error.code === "P2021") {
    console.error("   Les tables n'existent pas encore : lancez d'abord « npm run db:migrate ».");
  }
  await disconnectPrisma();
  process.exit(1);
});
