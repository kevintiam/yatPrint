/**
 * /api/admin/products/<id>
 *
 * GET    : un produit -> { product }
 * PUT    : remplace toutes les informations du produit -> { product }
 * PATCH  : affiche ou cache le produit. Corps : { isActive } -> { product }
 * DELETE : supprime le produit -> { ok: true }
 */
import { z } from "zod";
import { jsonSuccess, handleApiError, readJsonBody, validateOrThrow } from "@/lib/server/responses";
import { ApiError } from "@/lib/server/ApiError";
import { requireAdmin } from "@/lib/server/requireAdmin";
import { productSchema } from "@/lib/validation/admin";
import { deleteProduct, findProductById, isSlugTaken, setProductVisibility, updateProduct } from "@/lib/db/products";

const visibilitySchema = z.object({ isActive: z.boolean({ error: "Valeur invalide." }) });

export async function GET(request, { params }) {
  try {
    await requireAdmin();
    const { id } = await params;

    const product = await findProductById(id);
    if (!product) throw new ApiError(404, "Produit introuvable.");
    return jsonSuccess({ product });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request, { params }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const data = validateOrThrow(productSchema, await readJsonBody(request));

    if (await isSlugTaken(data.slug, id)) {
      throw new ApiError(409, "Cette adresse est déjà utilisée par un autre produit.", {
        slug: "Choisissez une autre adresse.",
      });
    }

    const product = await updateProduct(id, data);
    if (!product) throw new ApiError(404, "Produit introuvable.");
    return jsonSuccess({ product });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request, { params }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const { isActive } = validateOrThrow(visibilitySchema, await readJsonBody(request));

    // Change seulement la visibilité (les couleurs et matériaux ne sont pas touchés)
    const product = await setProductVisibility(id, isActive);
    if (!product) throw new ApiError(404, "Produit introuvable.");
    return jsonSuccess({ product });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request, { params }) {
  try {
    await requireAdmin();
    const { id } = await params;

    // Les commandes passées gardent leur copie du nom et du prix : rien n'est cassé
    const deleted = await deleteProduct(id);
    if (!deleted) throw new ApiError(404, "Produit introuvable.");
    return jsonSuccess({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
