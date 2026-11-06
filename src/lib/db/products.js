/**
 * Fonctions ORM des produits (tables products, product_colors, product_materials).
 * Elles renvoient toujours des objets simples (voir mappers.js).
 */
import { getPrisma } from "./prisma";
import { isValidId } from "./serialize";
import {toProduct, toProductData } from "./mappers";

/**
 * Convertit une liste de produits de la base.
 * @param {object[]} rows
 */
function toProducts(rows) {
  const products = [];
  for (const row of rows) {
    products.push(toProduct(row));
  }
  return products;
}

/**
 * Liste les produits, triés par ordre d'affichage.
 * @param {object} [filters]
 * @param {"service"|"collection"} [filters.line] - une seule ligne de produits
 * @param {string} [filters.category] - ex. "hoodie"
 * @param {boolean} [filters.featuredOnly] - seulement les produits mis en avant
 * @param {boolean} [filters.includeInactive] - inclure les produits cachés (admin)
 * @returns {Promise<object[]>}
 */
export async function listProducts(filters = {}) {
  const where = {};
  if (filters.line) where.line = filters.line;
  if (filters.category) where.category = filters.category;
  if (filters.featuredOnly) where.isFeatured = true;
  if (!filters.includeInactive) where.isActive = true;

  const rows = await getPrisma().product.findMany({
    where,
    include: {
      colors: { orderBy: { position: "asc" } },
      materials: { orderBy: { position: "asc" } },
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return toProducts(rows);
}

/**
 * Trouve un produit par son slug (partie de l'adresse web).
 * @param {string} slug - ex. "hoodie-personnalise"
 * @param {{includeInactive?: boolean}} [options]
 * @returns {Promise<object|null>}
 */
export async function findProductBySlug(slug, options = {}) {
  const row = await getPrisma().product.findUnique({
    where: { slug: String(slug).toLowerCase() },
    include: {
      colors: { orderBy: { position: "asc" } },
      materials: { orderBy: { position: "asc" } },
    },
  });
  if (!row || (!row.isActive && !options.includeInactive)) {
    return null;
  }
  return toProduct(row);
}

/**
 * @param {string} id
 * @returns {Promise<object|null>}
 */
export async function findProductById(id) {
  if (!isValidId(id)) return null;

  const row = await getPrisma().product.findUnique({
    where: { id },
    include: {
      colors: { orderBy: { position: "asc" } },
      materials: { orderBy: { position: "asc" } },
    },
  });
  return toProduct(row);
}

/**
 * Trouve plusieurs produits d'un coup (paiement : relecture des vrais prix).
 * @param {string[]} ids
 * @returns {Promise<object[]>}
 */
export async function findProductsByIds(ids) {
  const validIds = [];
  for (const id of ids) {
    if (isValidId(id)) validIds.push(id);
  }

  const rows = await getPrisma().product.findMany({
    where: { id: { in: validIds } },
    include: {
      colors: { orderBy: { position: "asc" } },
      materials: { orderBy: { position: "asc" } },
    },
  });
  return toProducts(rows);
}

/**
 * Le slug est-il déjà utilisé par un autre produit ?
 * @param {string} slug
 * @param {string} [exceptId] - produit en cours de modification
 * @returns {Promise<boolean>}
 */
export async function isSlugTaken(slug, exceptId) {
  const existing = await getPrisma().product.findUnique({
    where: { slug },
    select: { id: true },
  });
  return Boolean(existing) && existing.id !== exceptId;
}

/**
 * Crée un produit avec ses couleurs et ses matériaux.
 * @param {object} data - validé par productSchema
 * @returns {Promise<object>}
 */
export async function createProduct(data) {
  const { fields, colorRows, materialRows } = toProductData(data);

  const row = await getPrisma().product.create({
    data: {
      ...fields,
      colors: { create: colorRows },
      materials: { create: materialRows },
    },
    include: {
      colors: { orderBy: { position: "asc" } },
      materials: { orderBy: { position: "asc" } },
    },
  });
  return toProduct(row);
}

/**
 * Modifie un produit. Les couleurs et matériaux sont remplacés par la nouvelle liste
 * (Prisma fait tout dans une seule transaction : tout réussit ou rien ne change).
 * @param {string} id
 * @param {object} data - validé par productSchema
 * @returns {Promise<object|null>} null si le produit n'existe pas
 */
export async function updateProduct(id, data) {
  if (!isValidId(id)) return null;
  const { fields, colorRows, materialRows } = toProductData(data);

  try {
    const row = await getPrisma().product.update({
      where: { id },
      data: {
        ...fields,
        colors: { deleteMany: {}, create: colorRows },
        materials: { deleteMany: {}, create: materialRows },
      },
      include: {
        colors: { orderBy: { position: "asc" } },
        materials: { orderBy: { position: "asc" } },
      },
    });
    return toProduct(row);
  } catch (error) {
    if (error.code === "P2025") return null; // P2025 = enregistrement introuvable
    throw error;
  }
}

/**
 * Affiche ou cache un produit.
 * @param {string} id
 * @param {boolean} isActive
 * @returns {Promise<object|null>}
 */
export async function setProductVisibility(id, isActive) {
  if (!isValidId(id)) return null;

  const result = await getPrisma().product.updateMany({
    where: { id },
    data: { isActive },
  });
  return result.count === 1 ? findProductById(id) : null;
}

/**
 * Supprime un produit. Ses couleurs et matériaux sont supprimés avec lui ;
 * les commandes passées gardent leur copie du nom et du prix.
 * @param {string} id
 * @returns {Promise<boolean>}
 */
export async function deleteProduct(id) {
  if (!isValidId(id)) return false;

  const result = await getPrisma().product.deleteMany({ where: { id } });
  return result.count === 1;
}
