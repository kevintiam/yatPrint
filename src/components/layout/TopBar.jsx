/**
 * Fin bandeau noir tout en haut du site (comme sur le site modèle) :
 * ville et activités à gauche, Instagram, courriel et suivi de commande à droite.
 * Les coordonnées viennent des réglages de la boutique (/admin/reglages).
 */
import Link from "next/link";
import { Mail, MapPin, PackageSearch } from "lucide-react";
import { InstagramIcon } from "./InstagramIcon";

/**
 * @param {object} props
 * @param {{city: string, email: string, instagramUrl: string, instagramHandle: string}} props.settings
 */
export function TopBar({ settings }) {
  return (
    <div className="bg-ink text-cream">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-xs font-medium sm:px-6">
        <p className="flex items-center gap-2 uppercase tracking-wider">
          <MapPin className="size-3.5 text-yellow" aria-hidden="true" />
          <span>{settings.city}</span>
          <span className="hidden text-cream/40 sm:inline">•</span>
          <span className="hidden sm:inline">Personnalisation &amp; mentorat d&apos;impression</span>
        </p>

        <div className="flex items-center gap-4">
          <Link href="/suivi-commande" className="hidden items-center gap-1.5 transition hover:text-yellow md:flex">
            <PackageSearch className="size-3.5" aria-hidden="true" />
            Suivre ma commande
          </Link>
          <a href={`mailto:${settings.email}`} className="hidden items-center gap-1.5 transition hover:text-yellow sm:flex">
            <Mail className="size-3.5" aria-hidden="true" />
            {settings.email}
          </a>
          <a
            href={settings.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 transition hover:text-magenta"
            aria-label={`Instagram ${settings.instagramHandle} (nouvel onglet)`}
          >
            <InstagramIcon className="size-4" />
            <span className="hidden lg:inline">{settings.instagramHandle}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
