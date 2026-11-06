/**
 * Enregistrement des fichiers téléversés sur le disque du serveur.
 *
 * - Le fichier est écrit dans storage/uploads/<purpose>/<nom-unique>.<extension>
 * - Sa fiche (nom d'origine, type, taille...) est enregistrée dans PostgreSQL (table uploaded_files)
 * - On le relit ensuite par son identifiant via la route /api/files/<id>
 *
 * Le dossier est écrit « en dur » (storage/uploads) : Next.js peut ainsi savoir
 * à l'avance quels fichiers le serveur utilise, au lieu d'inclure tout le projet.
 *
 * ⚠️ Avant une mise en ligne sur Vercel (disque non permanent), il faudra
 * remplacer ce fichier par un service cloud (Cloudinary, S3...). Le reste
 * du code n'aura pas à changer : seul ce fichier écrit et lit les fichiers.
 */
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { createFileRecord, deleteFileRecord, findFileRecordById } from "@/lib/db/files";

// Extension à utiliser pour chaque type de fichier accepté
const EXTENSIONS = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/svg+xml": "svg",
  "application/pdf": "pdf",
};

/**
 * Dossier d'une catégorie de fichiers, ex. <projet>/storage/uploads/design
 * @param {string} purpose - "design", "product" ou "gallery"
 * @returns {string}
 */
function getFolderPath(purpose) {
  return path.join(process.cwd(), "storage", "uploads", purpose);
}

/**
 * Chemin complet d'un fichier sur le disque.
 * @param {{purpose: string, storedName: string}} record
 * @returns {string}
 */
function getFilePath(record) {
  return path.join(process.cwd(), "storage", "uploads", record.purpose, record.storedName);
}

/**
 * Enregistre un fichier envoyé par un formulaire.
 * Le type et la taille doivent avoir été vérifiés AVANT (voir validation/upload.js).
 * @param {File} file - fichier reçu par request.formData()
 * @param {{purpose: "design"|"product"|"gallery", isPublic: boolean}} options
 * @returns {Promise<object>} la fiche du fichier (avec son id)
 */
export async function saveUploadedFile(file, options) {
  const extension = EXTENSIONS[file.type] || "bin";
  // Nom unique au hasard : le nom d'origine n'est jamais utilisé sur le disque (sécurité)
  const storedName = `${randomUUID()}.${extension}`;

  await mkdir(getFolderPath(options.purpose), { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(getFilePath({ purpose: options.purpose, storedName }), buffer);

  return createFileRecord({
    originalName: String(file.name || "fichier").slice(0, 150),
    storedName,
    mimeType: file.type,
    sizeBytes: file.size,
    purpose: options.purpose,
    isPublic: options.isPublic,
  });
}

/**
 * Relit un fichier et sa fiche.
 * @param {string} fileId
 * @returns {Promise<{record: object, buffer: Buffer}|null>} null si introuvable
 */
export async function readStoredFile(fileId) {
  const record = await findFileRecordById(fileId);
  if (!record) {
    return null;
  }

  try {
    const buffer = await readFile(getFilePath(record));
    return { record, buffer };
  } catch {
    // La fiche existe mais le fichier a disparu du disque
    return null;
  }
}

/**
 * Supprime un fichier (disque + fiche).
 * @param {string} fileId
 */
export async function deleteStoredFile(fileId) {
  const record = await findFileRecordById(fileId);
  if (!record) {
    return;
  }

  try {
    await unlink(getFilePath(record));
  } catch {
    // Fichier déjà absent : rien à faire
  }
  await deleteFileRecord(fileId);
}

/**
 * Construit l'adresse publique d'un fichier : /api/files/<id>
 * @param {string} fileId
 * @returns {string}
 */
export function getFileUrl(fileId) {
  return `/api/files/${fileId}`;
}

/**
 * Retrouve l'identifiant d'un fichier à partir de son adresse.
 * « /api/files/65f... » -> « 65f... » ; une image du dossier public -> null.
 * @param {string} url
 * @returns {string|null}
 */
export function getFileIdFromUrl(url) {
  const prefix = "/api/files/";
  if (typeof url === "string" && url.startsWith(prefix)) {
    return url.slice(prefix.length);
  }
  return null;
}
