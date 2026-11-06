/**
 * Image d'un produit avec solution de secours.
 *
 * - S'il y a une photo : elle est affichée avec next/image (optimisée).
 * - Sinon : une illustration dessinée de l'article est affichée à la place.
 *
 * Les photos téléversées dans l'admin (/api/files/...) ne passent pas par
 * l'optimiseur de Next.js (« unoptimized ») car elles sont déjà servies par notre API.
 */
import Image from "next/image";
import { ProductIllustration } from "./ProductIllustration";
import { cn } from "@/lib/utils/cn";

/**
 * @param {object} props
 * @param {string} [props.src] - adresse de la photo
 * @param {string} props.alt - description de l'image (accessibilité)
 * @param {string} props.category - pour l'illustration de secours
 * @param {string} [props.color] - couleur de l'illustration de secours
 * @param {string} [props.sizes] - tailles d'affichage (aide le navigateur à choisir la bonne image)
 * @param {boolean} [props.priority] - à charger en premier (image visible dès l'ouverture)
 * @param {"cover"|"contain"} [props.fit]
 */
export function ProductImage({
  src,
  alt,
  category,
  color,
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw",
  priority = false,
  fit = "cover",
  className,
}) {
  if (!src) {
    return (
      <div className={cn("relative grid size-full place-items-center bg-paper p-8", className)}>
        <ProductIllustration category={category} color={color} label={alt} className="h-full max-h-72 w-auto" />
      </div>
    );
  }

  return (
    <div className={cn("relative size-full bg-white", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        unoptimized={src.startsWith("/api/")}
        className={fit === "contain" ? "object-contain p-4" : "object-cover"}
      />
    </div>
  );
}
