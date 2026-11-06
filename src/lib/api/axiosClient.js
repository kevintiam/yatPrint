/**
 * Instance Axios partagée par TOUS les hooks (dossier src/hooks).
 *
 * - baseURL "/api" : on écrit axiosClient.get("/products") au lieu de "/api/products".
 * - Pas d'en-tête Content-Type fixé ici : Axios choisit tout seul
 *   (JSON pour un objet, multipart pour un FormData avec fichier).
 *
 * Règle du projet : aucun composant n'appelle Axios ou fetch directement.
 * Les composants utilisent un hook, et le hook utilise cette instance.
 */
import axios from "axios";

export const axiosClient = axios.create({
  baseURL: "/api",
  timeout: 60000, // 60 s : laisse le temps de téléverser un fichier de 10 Mo
});
