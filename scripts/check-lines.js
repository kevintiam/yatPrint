/**
 * Vérifie la règle du projet : aucun fichier ne dépasse 300 lignes.
 *
 * ESLint contrôle déjà les fichiers JavaScript ; ce script contrôle AUSSI
 * les fichiers CSS, JSON et Markdown du projet.
 *
 * Utilisation : npm run check:lines
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const MAX_LINES = 300;
const CHECKED_EXTENSIONS = [".js", ".jsx", ".mjs", ".css", ".json", ".md"];
// « generated » : client Prisma créé automatiquement ; « migrations » : SQL écrit par Prisma
const IGNORED_FOLDERS = ["node_modules", ".next", ".git", "storage", "public", "generated", "migrations"];
// Fichiers générés automatiquement (pas écrits à la main)
const IGNORED_FILES = ["package-lock.json"];

/**
 * Parcourt un dossier et renvoie la liste des fichiers à vérifier.
 * @param {string} folder - dossier de départ
 * @returns {string[]} chemins des fichiers
 */
function listFiles(folder) {
  const files = [];
  const entries = readdirSync(folder);

  for (const entry of entries) {
    const fullPath = join(folder, entry);
    const isFolder = statSync(fullPath).isDirectory();

    if (isFolder) {
      if (!IGNORED_FOLDERS.includes(entry)) {
        const subFiles = listFiles(fullPath);
        for (const file of subFiles) {
          files.push(file);
        }
      }
    } else if (CHECKED_EXTENSIONS.includes(extname(entry)) && !IGNORED_FILES.includes(entry)) {
      files.push(fullPath);
    }
  }

  return files;
}

const allFiles = listFiles(".");
const tooLongFiles = [];
let longestFile = { path: "", lines: 0 };

for (const file of allFiles) {
  const lineCount = readFileSync(file, "utf8").split("\n").length;

  if (lineCount > longestFile.lines) {
    longestFile = { path: file, lines: lineCount };
  }
  if (lineCount > MAX_LINES) {
    tooLongFiles.push(`${file} (${lineCount} lignes)`);
  }
}

if (tooLongFiles.length > 0) {
  console.error(`❌ ${tooLongFiles.length} fichier(s) dépassent ${MAX_LINES} lignes :`);
  for (const file of tooLongFiles) {
    console.error(`   - ${file}`);
  }
  process.exit(1);
}

console.log(`✅ ${allFiles.length} fichiers vérifiés : tous font ${MAX_LINES} lignes ou moins.`);
console.log(`   Le plus long : ${longestFile.path} (${longestFile.lines} lignes).`);
