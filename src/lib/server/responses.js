/**
 * Outils communs à toutes les routes API (dossier src/app/api).
 *
 * Toutes les réponses ont la même forme, ce qui simplifie les hooks :
 *   succès : { ...données }
 *   erreur : { message: "...", fieldErrors: { champ: "..." } }
 */
import { NextResponse } from "next/server";
import { ApiError } from "./ApiError";
import { validateData } from "@/lib/validation/validate";

/**
 * Réponse de succès en JSON.
 * @param {object} data
 * @param {number} [status] - 200 par défaut, 201 après une création
 */
export function jsonSuccess(data, status = 200) {
  return NextResponse.json(data, { status });
}

/**
 * Transforme n'importe quelle erreur en réponse JSON propre.
 * @param {unknown} error
 * @returns {NextResponse}
 */
export function handleApiError(error) {
  if (error instanceof ApiError) {
    return NextResponse.json(
      { message: error.message, fieldErrors: error.fieldErrors },
      { status: error.status }
    );
  }

  // Erreur imprévue : détail dans le terminal, message générique pour le visiteur
  console.error("[API] Erreur inattendue :", error);
  return NextResponse.json(
    { message: "Une erreur est survenue sur le serveur. Réessayez dans un instant.", fieldErrors: {} },
    { status: 500 }
  );
}

/**
 * Lit le corps JSON d'une requête.
 * @param {Request} request
 * @returns {Promise<object>}
 * @throws {ApiError} si le corps n'est pas du JSON valide
 */
export async function readJsonBody(request) {
  try {
    return await request.json();
  } catch {
    throw new ApiError(400, "Les données envoyées sont illisibles.");
  }
}

/**
 * Valide des données avec un schéma Zod, ou lance une ApiError 400
 * contenant les erreurs de chaque champ.
 * @param {import("zod").ZodType} schema
 * @param {unknown} data
 * @returns {any} les données validées et nettoyées
 */
export function validateOrThrow(schema, data) {
  const result = validateData(schema, data);
  if (!result.success) {
    throw new ApiError(400, "Certains champs sont invalides. Vérifiez le formulaire.", result.fieldErrors);
  }
  return result.data;
}
