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
import dns from "node:dns";
import net from "node:net";
import { PrismaClient } from "../../generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";

/*
 * Connexion réseau plus fiable vers Neon (base en ligne) :
 * - « ipv4first » : on essaie d'abord l'adresse IPv4 du serveur. Sur beaucoup de réseaux
 *   domestiques, l'IPv6 est mal acheminé et fait perdre de longues secondes.
 * - On désactive l'essai « en parallèle » IPv4/IPv6 de Node.js : quand toutes les tentatives
 *   échouent, certaines versions de Node plantent avec « object null is not iterable »
 *   au lieu de renvoyer une erreur normale. Sans lui, une coupure réseau donne une erreur
 *   propre, gérée par le site (message d'erreur ou valeurs par défaut).
 */
dns.setDefaultResultOrder("ipv4first");
net.setDefaultAutoSelectFamily(false);

/**
 * Message clair dans le terminal quand une connexion à la base est coupée
 * (ex. Neon met la base en veille après quelques minutes sans visite).
 * Prisma rouvre automatiquement une connexion à la requête suivante.
 * @param {Error} error
 */
function logConnectionError(error) {
  console.warn("[Base de données] Connexion interrompue (elle sera rouverte au besoin) :", error.message);
}

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

  const adapter = new PrismaPg(
    {
      connectionString,
      // Abandonne une tentative de connexion bloquée après 15 s (au lieu d'attendre près d'une minute)
      connectionTimeoutMillis: 15000,
    },
    { onPoolError: logConnectionError, onConnectionError: logConnectionError }
  );

  const prisma = new PrismaClient({ adapter });
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