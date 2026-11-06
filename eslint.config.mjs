/**
 * Configuration ESLint (vérification automatique du code).
 *
 * En plus des règles recommandées par Next.js, on impose la règle du projet :
 * AUCUN fichier ne doit dépasser 300 lignes (lignes vides et commentaires compris).
 * `npm run lint` échoue si un fichier est trop long.
 */
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,

  {
    files: ["**/*.{js,jsx,mjs}"],
    rules: {
      // Règle du projet : 300 lignes maximum par fichier
      "max-lines": ["error", { max: 300, skipBlankLines: false, skipComments: false }],
      // Une variable déclarée mais jamais utilisée est souvent un oubli
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },

  // Dossiers ignorés par ESLint (src/generated = client Prisma créé automatiquement)
  globalIgnores([".next/**", "out/**", "build/**", "storage/**", "src/generated/**", "next-env.d.ts"]),
]);

export default eslintConfig;
