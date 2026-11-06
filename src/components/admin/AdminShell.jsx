"use client";

/**
 * Coquille de l'admin : menu latéral noir + zone de contenu.
 *
 * - Bande CMJN en haut du menu (rappel des encres d'imprimante).
 * - Le lien actif prend la couleur de sa section ; la « pilule » colorée
 *   glisse d'un lien à l'autre (animation Motion « layoutId »).
 * - Pastilles avec le nombre de choses à traiter (commandes, devis, mentorat, messages).
 * - Sur mobile, le menu s'ouvre avec un bouton.
 */
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import {
  ExternalLink,
  GraduationCap,
  Images,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Package,
  ReceiptText,
  Settings,
  Shirt,
  X,
} from "lucide-react";
import { useAdminAuth } from "@/hooks/admin/useAdminAuth";
import { useAdminCounters } from "@/hooks/admin/useAdminDashboard";
import { BRAND } from "@/config/brand";
import { cn } from "@/lib/utils/cn";

/**
 * Liens du menu. `exact` : actif seulement sur l'adresse exacte.
 * `counter` : nom du compteur (voir /api/admin/counters) affiché en pastille.
 * `pill` et `text` : couleur de fond et du texte du lien quand on est sur sa page.
 */
const ADMIN_LINKS = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true, pill: "bg-yellow", text: "text-ink" },
  { href: "/admin/commandes", label: "Commandes", icon: Package, counter: "ordersToProcess", pill: "bg-magenta", text: "text-white" },
  { href: "/admin/produits", label: "Produits", icon: Shirt, pill: "bg-cyan", text: "text-white" },
  { href: "/admin/devis", label: "Devis entreprises", icon: ReceiptText, counter: "newQuotes", pill: "bg-yellow", text: "text-ink" },
  { href: "/admin/mentorat", label: "Mentorat", icon: GraduationCap, counter: "newMentorships", pill: "bg-magenta", text: "text-white" },
  { href: "/admin/messages", label: "Messages", icon: Mail, counter: "newMessages", pill: "bg-cyan", text: "text-white" },
  { href: "/admin/galerie", label: "Galerie", icon: Images, pill: "bg-yellow", text: "text-ink" },
  { href: "/admin/reglages", label: "Réglages", icon: Settings, pill: "bg-cream", text: "text-ink" },
];

/**
 * Initiales pour l'avatar : « Gessica Tiam » -> « GT ».
 * @param {string} name
 */
function getInitials(name) {
  const words = String(name || "?").trim().split(/\s+/);
  let initials = "";
  for (const word of words.slice(0, 2)) {
    initials += word.charAt(0).toUpperCase();
  }
  return initials || "?";
}

/**
 * @param {object} props
 * @param {string} props.adminName - nom affiché en bas du menu
 */
export function AdminShell({ adminName, children }) {
  const pathname = usePathname();
  const { logout } = useAdminAuth();
  const { counters } = useAdminCounters(pathname);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  /** Le lien correspond-il à la page affichée ? */
  function isActive(link) {
    if (link.exact) return pathname === link.href;
    return pathname === link.href || pathname.startsWith(`${link.href}/`);
  }

  return (
    <div className="lg:grid lg:min-h-dvh lg:grid-cols-[17rem_1fr]">
      {/* Barre du haut (mobile seulement) */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b-2 border-ink bg-ink px-4 py-3 text-cream lg:hidden">
        <span className="flex items-center gap-2 font-display text-lg font-bold">
          <Image src={BRAND.logoWhite} alt="" width={34} height={33} />
          Admin
        </span>
        <button type="button" onClick={() => setIsMenuOpen(!isMenuOpen)} className="grid size-10 place-items-center rounded-full border-2 border-cream/30" aria-label="Menu de l'admin" aria-expanded={isMenuOpen}>
          {isMenuOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
        </button>
      </div>

      {/* Menu latéral */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col overflow-hidden bg-ink text-cream transition-transform duration-300 lg:sticky lg:top-0 lg:h-dvh lg:w-auto lg:translate-x-0",
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Bande CMJN */}
        <div className="grid h-1.5 shrink-0 grid-cols-4" aria-hidden="true">
          <span className="bg-cyan" />
          <span className="bg-magenta" />
          <span className="bg-yellow" />
          <span className="bg-cream/30" />
        </div>
        {/* Trame de points décorative */}

        <Link href="/admin" className="relative flex items-center gap-3 px-6 py-6">
          <Image src={BRAND.logoWhite} alt="" width={52} height={50} className="transition hover:rotate-[-6deg]" />
          <div>
            <p className="font-display text-lg font-bold leading-tight">{BRAND.name}</p>
            <p className="font-script text-lg leading-none text-yellow">Espace admin</p>
          </div>
        </Link>

        <nav aria-label="Menu de l'admin" className="relative flex-1 overflow-y-auto px-3 pb-5">
          <ul className="flex flex-col gap-1">
            {ADMIN_LINKS.map((link) => {
              const Icon = link.icon;
              const active = isActive(link);
              const count = link.counter ? counters[link.counter] : 0;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group relative isolate flex items-center gap-3 rounded-xl px-4 py-2.5 font-semibold transition-colors",
                      active ? link.text : "text-cream/75 hover:bg-cream/10 hover:text-cream"
                    )}
                  >
                    {/* Pilule colorée qui glisse vers le lien actif */}
                    {active && (
                      <motion.span
                        layoutId="admin-active-link"
                        className={cn("absolute inset-0 -z-10 rounded-xl shadow-[3px_3px_0_0_rgb(246_241_233/0.25)]", link.pill)}
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                        aria-hidden="true"
                      />
                    )}
                    <Icon className="relative size-5 transition group-hover:scale-110" aria-hidden="true" />
                    <span className="relative flex-1">{link.label}</span>
                    {count > 0 && (
                      <span
                        className={cn(
                          "relative grid min-w-6 place-items-center rounded-full px-1.5 text-xs font-bold",
                          active ? "bg-ink text-cream" : "bg-magenta text-white"
                        )}
                        aria-label={`${count} à traiter`}
                      >
                        {count > 99 ? "99+" : count}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="relative flex flex-col gap-1 border-t border-cream/15 px-3 py-4">
          <div className="mb-2 flex items-center gap-3 px-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full border-2 border-cream bg-magenta font-display font-bold text-white">
              {getInitials(adminName)}
            </span>
            <div className="min-w-0">
              <p className="truncate font-semibold">{adminName}</p>
              <p className="text-xs text-cream/50">Connectée</p>
            </div>
          </div>
          <Link href="/" target="_blank" className="flex items-center gap-3 rounded-xl px-4 py-2 text-sm text-cream/80 transition hover:bg-cream/10 hover:text-cream">
            <ExternalLink className="size-4" aria-hidden="true" />
            Voir le site
          </Link>
          <button type="button" onClick={logout} className="flex items-center gap-3 rounded-xl px-4 py-2 text-left text-sm font-semibold text-cream transition hover:bg-magenta">
            <LogOut className="size-4" aria-hidden="true" />
            Se déconnecter
          </button>
        </div>
      </aside>

      {/* Fond sombre derrière le menu ouvert (mobile) */}
      {isMenuOpen && <button type="button" className="fixed inset-0 z-30 bg-ink/40 lg:hidden" onClick={() => setIsMenuOpen(false)} aria-label="Fermer le menu" />}

      <main className="relative min-w-0 overflow-hidden px-4 py-8 sm:px-8 lg:px-10">
        {/* Trames de points colorées en fond (décor) */}
        <div className="relative">{children}</div>
      </main>
    </div>
  );
}
