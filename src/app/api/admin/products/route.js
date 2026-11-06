/**
 * /api/admin/products
 *
 * GET  : tous les produits, cachés compris -> { products }
 * POST : crée un produit -> { product }
 */
import { jsonSuccess, handleApiError, readJsonBody, validateOrThrow } from "@/lib/server/responses";
import { ApiError } from "@/lib/server/ApiError";
import { requireAdmin } from "@/lib/server/requireAdmin";
import { productSchema } from "@/lib/validation/admin";
import { createProduct, isSlugTaken, listProducts } from "@/lib/db/products";

export async function GET() {
  try {
    await requireAdmin();
    const products = await listProducts({ includeInactive: true });
    return jsonSuccess({ products });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request) {
  try {
    await requireAdmin();
    const data = validateOrThrow(productSchema, await readJsonBody(request));

    // Deux produits ne peuvent pas avoir la même adresse
    if (await isSlugTaken(data.slug)) {
      throw new ApiError(409, "Cette adresse est déjà utilisée par un autre produit.", {
        slug: "Choisissez une autre adresse.",
      });
    }

    const product = await createProduct(data);
    return jsonSuccess({ product }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
