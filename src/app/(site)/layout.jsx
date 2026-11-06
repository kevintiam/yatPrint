/**
 * Gabarit du site public : bandeau du haut, en-tête, contenu, pied de page
 * et tiroir du panier.
 *
 * Le dossier « (site) » est un « groupe de routes » : les parenthèses
 * n'apparaissent pas dans l'adresse. Il permet de donner ce gabarit à toutes
 * les pages publiques, sans l'appliquer à l'espace admin.
 *
 * Les réglages de la boutique (coordonnées, livraison, taxes) sont lus dans
 * la base à chaque visite : un changement fait dans l'admin se voit tout de suite.
 */
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { StoreSettingsProvider } from "@/components/providers/StoreSettingsProvider";
import { loadStoreSettings } from "@/lib/server/storeSettings";

// Pages calculées à chaque visite (elles dépendent des réglages de la base)
export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }) {
  const settings = await loadStoreSettings();

  return (
    <StoreSettingsProvider settings={settings}>
      {/* Lien d'accessibilité : passer directement au contenu avec le clavier */}
      <a
        href="#contenu"
        className="sr-only z-50 rounded-full bg-ink px-4 py-2 text-cream focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Aller au contenu
      </a>

      <TopBar settings={settings} />
      <Header />
      <main id="contenu" className="min-h-[60vh]">
        {children}
      </main>
      <Footer settings={settings} />
      <CartDrawer />
    </StoreSettingsProvider>
  );
}
