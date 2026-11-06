/**
 * Client Prisma partagé : la porte d'entrée vers PostgreSQL.
 *
 * - Prisma 7 se connecte à PostgreSQL grâce à un « adaptateur » (ici @prisma/adapter-pg),
 *   qui fonctionne aussi bien avec Neon qu'avec un PostgreSQL installé sur l'ordinateur.
 * - Le client est créé UNE seule fois, au premier besoin (getPrisma). En développement,
 *   Next.js recharge le code souvent : on garde le client dans `globalThis` pour ne pas
 *   ouvrir des dizaines de connexions.
 *
 * Ce fichier utilise des imports relatifs (pas « @/ ») car le script scripts/seed.js l'importe aussi.
 */
import { PrismaClient } from "../../generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Renvoie le client Prisma (le crée au premier appel).
 * @returns {PrismaClient}
 */
export function getPrisma() {
  if (globalThis.__yatprintPrisma) {
    return globalThis.__yatprintPrisma;
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "La variable DATABASE_URL est absente. Copiez .env.example en .env et collez l'adresse de votre base Neon."
    );
  }

  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  globalThis.__yatprintPrisma = prisma;
  return prisma;
}

/**
 * Ferme la connexion (à la fin d'un script, jamais dans le site).
 */
export async function disconnectPrisma() {
  if (globalThis.__yatprintPrisma) {
    await globalThis.__yatprintPrisma.$disconnect();
    globalThis.__yatprintPrisma = undefined;
  }
}
