/**
 * Pied de page : bande de couleurs CMJN, logo, liens, coordonnées.
 * Les coordonnées viennent des réglages de la boutique (/admin/reglages).
 */
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "./Logo";
import { InstagramIcon } from "./InstagramIcon";
import { BackToTopButton } from "./BackToTopButton";
import { BRAND } from "@/config/brand";
import { FOOTER_EXPLORE_LINKS, FOOTER_HELP_LINKS } from "@/config/navigation";

/**
 * Colonne de liens.
 * @param {{title: string, links: {href: string, label: string}[]}} props
 */
function LinkColumn({ title, links }) {
  return (
    <div>
      <h2 className="mb-4 font-display text-lg font-bold text-yellow">{title}</h2>
      <ul className="flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-cream/80 transition hover:pl-1 hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * @param {object} props
 * @param {{city: string, email: string, phone: string, instagramUrl: string, instagramHandle: string}} props.settings
 */
export function Footer({ settings }) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-24 bg-ink text-cream">
      {/* Bande cyan / magenta / jaune / noir, comme les encres d'imprimante */}
      <div className="grid h-2 grid-cols-4" aria-hidden="true">
        <span className="bg-cyan" />
        <span className="bg-magenta" />
        <span className="bg-yellow" />
        <span className="bg-cream/20" />
      </div>

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-5">
          <Logo color="white" size={96} />
          <p className="max-w-xs text-cream/75">{BRAND.description}</p>
          <a
            href={settings.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-2 rounded-full border-2 border-cream/30 px-4 py-2 font-semibold transition hover:border-magenta hover:bg-magenta"
          >
            <InstagramIcon className="size-5" />
            {settings.instagramHandle}
          </a>
        </div>

        <LinkColumn title="Explorer" links={FOOTER_EXPLORE_LINKS} />
        <LinkColumn title="Aide" links={FOOTER_HELP_LINKS} />

        <div>
          <h2 className="mb-4 font-display text-lg font-bold text-yellow">Nous joindre</h2>
          <ul className="flex flex-col gap-3 text-cream/80">
            <li className="flex items-center gap-2">
              <MapPin className="size-4 text-cyan" aria-hidden="true" />
              {settings.city}
            </li>
            <li>
              <a href={`mailto:${settings.email}`} className="flex items-center gap-2 hover:text-white">
                <Mail className="size-4 text-magenta" aria-hidden="true" />
                {settings.email}
              </a>
            </li>
            {settings.phone && (
              <li>
                <a href={`tel:${settings.phone}`} className="flex items-center gap-2 hover:text-white">
                  <Phone className="size-4 text-yellow" aria-hidden="true" />
                  {settings.phone}
                </a>
              </li>
            )}
          </ul>
          <Link
            href="/contact"
            className="mt-6 inline-block font-script text-3xl text-yellow transition hover:rotate-[-3deg]"
          >
            Écrivez-nous
          </Link>
        </div>
      </div>

      <div className="border-t border-cream/15">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-cream/60 sm:flex-row sm:px-6">
          <p>
            © {year} {BRAND.name}. Tous droits réservés.
          </p>
          <BackToTopButton />
        </div>
      </div>
    </footer>
  );
}
