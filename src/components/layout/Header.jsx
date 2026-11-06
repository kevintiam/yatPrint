"use client";

/**
 * En-tête du site : logo, menu principal, bouton « Personnaliser » et panier.
 *
 * - Il reste collé en haut de l'écran pendant le défilement (sticky).
 * - Dès qu'on descend, il prend un fond flouté et une bordure.
 * - Le lien de la page actuelle est souligné en magenta.
 * - Sur mobile, le menu s'ouvre dans un panneau latéral (MobileMenu).
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Sparkles } from "lucide-react";
import { Logo } from "./Logo";
import { CartButton } from "./CartButton";
import { MobileMenu } from "./MobileMenu";
import { Button } from "@/components/ui/button";
import { MAIN_NAVIGATION } from "@/config/navigation";
import { cn } from "@/lib/utils/cn";

/**
 * Le lien correspond-il à la page affichée ? (/collection/abc active « Collection »)
 * @param {string} pathname
 * @param {string} href
 */
function isActiveLink(pathname, href) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Écoute le défilement pour changer l'apparence de l'en-tête
  useEffect(() => {
    function handleScroll() {
      setHasScrolled(window.scrollY > 12);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        hasScrolled ? "border-b-2 border-ink bg-cream/90 backdrop-blur-md" : "border-b-2 border-transparent bg-cream"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Logo size={hasScrolled ? 52 : 64} priority className="transition-all duration-300" />

        {/* Menu principal (ordinateur) */}
        <nav aria-label="Navigation principale" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {MAIN_NAVIGATION.map((link) => {
              const isActive = isActiveLink(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "group relative rounded-full px-4 py-2 text-[0.95rem] font-semibold transition-colors hover:text-magenta",
                      isActive && "text-magenta"
                    )}
                  >
                    {link.label}
                    {/* Soulignement animé */}
                    <span
                      className={cn(
                        "absolute inset-x-4 -bottom-0.5 h-[3px] origin-left rounded-full bg-magenta transition-transform duration-300",
                        isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      )}
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="accent" size="sm" className="hidden sm:inline-flex">
            <Link href="/personnaliser">
              <Sparkles aria-hidden="true" />
              Personnaliser
            </Link>
          </Button>

          <CartButton />

          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            className="grid size-11 place-items-center rounded-full border-2 border-ink bg-paper transition hover:bg-yellow lg:hidden"
            aria-label="Ouvrir le menu"
            aria-expanded={isMenuOpen}
          >
            <Menu className="size-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <MobileMenu open={isMenuOpen} onOpenChange={setIsMenuOpen} pathname={pathname} />
    </header>
  );
}
