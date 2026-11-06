/**
 * GET /api/files/<id>
 * Renvoie un fichier téléversé.
 *
 * - Fichier PUBLIC (photo de produit ou de galerie) : affiché pour tout le monde,
 *   gardé en cache par le navigateur (le nom ne change jamais).
 * - Fichier PRIVÉ (design d'un client) : réservé à l'admin connecté,
 *   proposé en téléchargement (jamais affiché dans la page, par sécurité).
 */
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { readStoredFile } from "@/lib/services/storage";

export async function GET(request, { params }) {
  const { id } = await params;
  const stored = await readStoredFile(id);

  if (!stored) {
    return NextResponse.json({ message: "Fichier introuvable." }, { status: 404 });
  }

  const { record, buffer } = stored;

  if (record.isPublic) {
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": record.mimeType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  }

  // Fichier privé : il faut être connecté à l'admin
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ message: "Accès réservé à l'admin." }, { status: 401 });
  }

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": record.mimeType,
      // « attachment » = téléchargement ; le nom d'origine est encodé pour les accents
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(record.originalName)}`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      // Empêche tout script contenu dans le fichier (ex. SVG piégé) de s'exécuter
      "Content-Security-Policy": "sandbox",
    },
  });
}
