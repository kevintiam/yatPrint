/**
 * Configuration de Next.js pour le site Yat'Print.
 *
 * - « Cache Components » est volontairement désactivé : les pages qui lisent
 *   la base de données sont simplement rendues à chaque visite
 *   (`export const dynamic = "force-dynamic"`). Le code reste ainsi plus simple
 *   à lire. On pourra l'activer plus tard pour gagner en performance.
 * - Tailwind CSS v4 est branché directement dans Turbopack (le compilateur de Next.js).
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },

  // Images : formats modernes et qualités autorisées pour <Image quality={...} />
  // (Mongoose est déjà traité comme un module Node.js externe par Next.js.)
  images: {
    formats: ["image/webp"], // WebP : léger et rapide à générer (AVIF est beaucoup plus lent)
    qualities: [75, 85],
  },
};

export default nextConfig;
