/**
 * Routes d'Auth.js : /api/auth/signin, /api/auth/session, /api/auth/signout...
 * Tout est géré par la configuration de src/auth.js.
 */
import { handlers } from "@/auth";

export const { GET, POST } = handlers;
