/**
 * Lecture des filtres de commandes dans l'adresse d'une requête admin
 * (?status=paid&search=dupont&page=2). Partagé par la liste et l'export CSV.
 */
import { ORDER_STATUSES } from "@/config/statuses";

/**
 * @param {URLSearchParams} searchParams
 * @returns {{status: string, search: string, page: number}}
 */
export function readOrderFilters(searchParams) {
  const status = searchParams.get("status") || "";
  const search = (searchParams.get("search") || "").trim().slice(0, 80);
  const page = Number.parseInt(searchParams.get("page") || "1", 10);

  return {
    // On ignore un statut inconnu au lieu de renvoyer une erreur
    status: ORDER_STATUSES[status] ? status : "",
    search,
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}
