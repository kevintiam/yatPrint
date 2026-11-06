/**
 * Erreur « prévue » d'une route API : elle porte un code HTTP et un message
 * en français destiné au visiteur.
 *
 * Exemple : throw new ApiError(404, "Produit introuvable.");
 *
 * Les autres erreurs (bug, base injoignable...) sont transformées en
 * « Erreur serveur » par handleApiError (voir responses.js), pour ne jamais
 * montrer de détails techniques au public.
 */
export class ApiError extends Error {
  /**
   * @param {number} status - code HTTP (400 = données invalides, 401 = non connecté, 404 = introuvable...)
   * @param {string} message - message lisible en français
   * @param {Record<string, string>} [fieldErrors] - erreurs par champ de formulaire
   */
  constructor(status, message, fieldErrors = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}
