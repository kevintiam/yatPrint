"use client";

/**
 * Connexion et déconnexion de l'espace admin (Auth.js).
 *
 * signIn et signOut appellent les routes /api/auth/... d'Auth.js :
 * on les garde dans ce hook pour respecter la règle « appels d'API dans les hooks ».
 */
import { useState } from "react";
import { signIn, signOut } from "next-auth/react";

export function useAdminAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * Tente la connexion.
   * @param {{email: string, password: string}} credentials
   * @returns {Promise<boolean>} true si la connexion a réussi
   */
  async function login(credentials) {
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: credentials.email,
        password: credentials.password,
        redirect: false, // on gère nous-mêmes la redirection
      });

      if (!result || result.error) {
        setError("Courriel ou mot de passe incorrect.");
        return false;
      }
      return true;
    } catch {
      setError("Connexion impossible pour le moment. Réessayez.");
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  /** Déconnecte l'admin et revient à la page de connexion. */
  async function logout() {
    await signOut({ redirectTo: "/admin/connexion" });
  }

  return { login, logout, isLoading, error };
}
