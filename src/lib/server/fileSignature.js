/**
 * Vérifie que le CONTENU réel d'un fichier correspond au type annoncé.
 * Le type (file.type) vient du navigateur et peut être falsifié :
 * on lit donc les premiers octets du fichier (sa « signature »).
 * Serveur uniquement.
 */

/**
 * @param {Uint8Array} bytes
 * @param {number[]} signature
 * @param {number} [offset]
 */
function startsWith(bytes, signature, offset = 0) {
  return signature.every((byte, i) => bytes[offset + i] === byte);
}

const ascii = (text) => [...text].map((c) => c.charCodeAt(0));

// Une fonction de contrôle par type accepté
const CHECKS = {
  "image/png": (b) => startsWith(b, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  "image/jpeg": (b) => startsWith(b, [0xff, 0xd8, 0xff]),
  "image/webp": (b) => startsWith(b, ascii("RIFF")) && startsWith(b, ascii("WEBP"), 8),
  "application/pdf": (b) => startsWith(b, ascii("%PDF-")),
  "image/svg+xml": (b) => {
    // Texte : on enlève l'éventuel BOM et les espaces, puis on cherche <svg
    const text = new TextDecoder().decode(b).replace(/^\uFEFF/, "").trimStart();
    return text.startsWith("<") && /<svg[\s>]/i.test(text);
  },
};

/**
 * @param {File} file - fichier reçu par request.formData()
 * @returns {Promise<boolean>} true si le contenu correspond à file.type
 */
export async function hasValidSignature(file) {
  const check = CHECKS[file.type];
  if (!check) {
    return false; // type inconnu : refusé par défaut
  }
  // On ne lit que le début du fichier (inutile de tout charger)
  const bytes = new Uint8Array(await file.slice(0, 1024).arrayBuffer());
  return check(bytes);
}
