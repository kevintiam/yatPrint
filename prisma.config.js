/**
 * Configuration de Prisma (outil en ligne de commande : migrations, seed, Studio).
 *
 * Prisma 7 ne lit plus le fichier .env tout seul : on le charge ici avec
 * process.loadEnvFile(), une fonction intégrée à Node.js (pas de paquet à installer).
 *
 * Neon fournit deux adresses :
 * - DATABASE_URL : connexion « poolée » (avec -pooler), utilisée par le site ;
 * - DIRECT_URL   : connexion directe, conseillée pour les migrations.
 */
import { defineConfig } from "prisma/config";

try {
  process.loadEnvFile(); // lit .env s'il existe
} catch {
  // Pas de fichier .env : les variables viennent de l'hébergeur (ex. Vercel)
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node scripts/seed.js",
  },
  datasource: {
    url: process.env.DIRECT_URL || process.env.DATABASE_URL,
  },
});
