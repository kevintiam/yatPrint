/**
 * Configuration de la connexion à l'espace admin avec Auth.js (next-auth v5).
 *
 * Fonctionnement :
 * 1. Gessica saisit son courriel et son mot de passe sur /admin/connexion.
 * 2. `authorize` cherche le compte dans PostgreSQL et compare le mot de passe
 *    avec son empreinte bcrypt.
 * 3. Si c'est bon, Auth.js crée une session dans un cookie chiffré (JWT).
 *
 * Exports :
 * - handlers : routes GET/POST de /api/auth/... (voir src/app/api/auth)
 * - auth()   : lit la session côté serveur (pages admin, routes API admin)
 */
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { findAdminByEmail } from "@/lib/db/admins";
import { loginSchema } from "@/lib/validation/admin";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Session stockée dans un cookie chiffré, valable 8 heures
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 },

  // Notre propre page de connexion (au lieu de celle d'Auth.js)
  pages: { signIn: "/admin/connexion" },

  // Accepte l'adresse du site telle qu'elle est (localhost, domaine en ligne...)
  trustHost: true,

  providers: [
    Credentials({
      credentials: {
        email: { label: "Courriel", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },

      /**
       * Vérifie le courriel et le mot de passe.
       * @returns {Promise<object|null>} l'utilisateur, ou null si refusé
       */
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const admin = await findAdminByEmail(parsed.data.email);
        if (!admin) {
          return null;
        }

        const isPasswordCorrect = await bcrypt.compare(parsed.data.password, admin.passwordHash);
        if (!isPasswordCorrect) {
          return null;
        }

        // Seules ces informations sont gardées dans la session (jamais le mot de passe)
        return { id: admin.id, email: admin.email, name: admin.name };
      },
    }),
  ],
});
