/**
 * Logo Yat'Print cliquable (retour à l'accueil).
 *
 * @param {object} props
 * @param {"black"|"white"} [props.color] - noir sur fond clair, blanc sur fond foncé
 * @param {number} [props.size] - hauteur en pixels
 */
import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/config/brand";
import { cn } from "@/lib/utils/cn";

export function Logo({ color = "black", size = 60, className, priority = false }) {
  const src = color === "white" ? BRAND.logoWhite : BRAND.logoBlack;

  return (
    <Link
      href="/"
      className={cn("inline-flex shrink-0 transition-transform duration-300 hover:-rotate-6 hover:scale-105", className)}
      aria-label={`${BRAND.name} — retour à l'accueil`}
    >
      <Image
        src={src}
        alt={BRAND.name}
        width={size}
        height={Math.round(size * 0.96)}
        priority={priority}
        style={{ height: size, width: "auto" }}
      />
    </Link>
  );
}
