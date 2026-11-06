/**
 * Gestion de la galerie (/admin/galerie).
 */
import { GalleryManager } from "@/components/admin/GalleryManager";

export const metadata = { title: "Galerie" };

export default function AdminGalleryPage() {
  return <GalleryManager />;
}
