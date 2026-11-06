"use client";

/**
 * Menu du site sur téléphone et tablette : panneau qui glisse depuis la gauche.
 * Chaque lien ferme le panneau quand on clique dessus.
 */
import Link from "next/link";
import { ArrowRight, PackageSearch } from "lucide-react";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { InstagramIcon } from "./InstagramIcon";
import { MAIN_NAVIGATION } from "@/config/navigation";
import { useStoreSettings } from "@/hooks/useStoreSettings";
import { cn } from "@/lib/utils/cn";

// Couleur de la pastille devant chaque lien, à tour de rôle
const DOT_COLORS = ["bg-cyan", "bg-magenta", "bg-yellow"];

/**
 * @param {object} props
 * @param {boolean} props.open
 * @param {(open: boolean) => void} props.onOpenChange
 * @param {string} props.pathname - adresse de la page actuelle
 */
export function MobileMenu({ open, onOpenChange, pathname }) {
  const settings = useStoreSettings();

  function close() {
    onOpenChange(false);
  }

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title="Menu"
      side="left"
      footer={
        <a
          href={settings.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 font-semibold hover:text-magenta"
        >
          <InstagramIcon className="size-5" />
          {settings.instagramHandle}
        </a>
      }
    >
      <nav aria-label="Menu mobile">
        <ul className="flex flex-col gap-1">
          {MAIN_NAVIGATION.map((link, index) => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={close}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex items-center justify-between rounded-2xl px-4 py-3 font-display text-2xl font-bold transition hover:bg-paper",
                    isActive && "bg-paper text-magenta"
                  )}
                >
                  <span className="flex items-center gap-3">
                    <span className={cn("size-3 rounded-full", DOT_COLORS[index % DOT_COLORS.length])} aria-hidden="true" />
                    {link.label}
                  </span>
                  <ArrowRight className="size-5" aria-hidden="true" />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-8 flex flex-col gap-3">
        <Button asChild variant="accent" size="lg">
          <Link href="/personnaliser" onClick={close}>
            Personnaliser un article
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/suivi-commande" onClick={close}>
            <PackageSearch aria-hidden="true" />
            Suivre ma commande
          </Link>
        </Button>
      </div>
    </Sheet>
  );
}
