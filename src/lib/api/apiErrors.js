/**
 * Transforme une erreur Axios en informations faciles à afficher.
 *
 * Nos routes API renvoient toujours { message, fieldErrors } en cas d'erreur
 * (voir src/lib/server/responses.js) : on les récupère ici.
 */
import axios from "axios";

/**
 * Message d'erreur en français, prêt à afficher.
 * @param {unknown} error
 * @returns {string}
 */
export function getApiErrorMessage(error) {
  // Requête annulée volontairement (ex. le composant a disparu) : rien à afficher
  if (axios.isCancel(error)) {
    return "";
  }

  // Le serveur a répondu avec un code d'erreur
  if (error && error.response) {
    const data = error.response.data;
    if (data && typeof data.message === "string") {
      return data.message;
    }
    if (error.response.status === 413) {
      return "Le fichier est trop lourd.";
    }
    return `Erreur ${error.response.status}. Réessayez dans un instant.`;
  }

  // La requête est partie mais aucune réponse n'est revenue
  if (error && error.request) {
    return "Impossible de joindre le serveur. Vérifiez votre connexion internet.";
  }

  return "Une erreur inattendue est survenue.";
}

/**
 * Erreurs par champ renvoyées par le serveur, ex. { email: "Le courriel n'est pas valide." }.
 * @param {unknown} error
 * @returns {Record<string, string>}
 */
export function getApiFieldErrors(error) {
  const data = error && error.response ? error.response.data : null;
  if (data && data.fieldErrors && typeof data.fieldErrors === "object") {
    return data.fieldErrors;
  }
  return {};
}
