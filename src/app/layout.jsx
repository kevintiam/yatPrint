/**
 * Gabarit racine : enveloppe TOUTES les pages (site public et admin).
 *
 * - Charge les polices (hébergées avec le site, aucune requête vers Google).
 * - Charge les styles globaux (Tailwind + thème Yat'Print).
 * - Définit les informations par défaut pour Google et les réseaux sociaux.
 * - Ajoute le système de notifications « toast » (sonner).
 */
import "@fontsource-variable/bricolage-grotesque"; // titres
import "@fontsource-variable/dm-sans"; // texte courant
import "@fontsource/caveat/600.css"; // touches manuscrites
import "@fontsource/caveat/700.css";
import "./globals.css";
import { Toaster } from "sonner";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { BRAND, getSiteUrl } from "@/config/brand";

export const metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${BRAND.name} — ${BRAND.slogan}`,
    template: `%s | ${BRAND.name}`, // ex. « Collection | Yat'Print »
  },
  description: BRAND.description,
  openGraph: {
    type: "website",
    locale: "fr_CA",
    siteName: BRAND.name,
    images: [{ url: "/brand/logo-black.png", width: 640, height: 615, alt: BRAND.name }],
  },
};

export const viewport = {
  themeColor: "#f6f1e9", // couleur de la barre du navigateur sur mobile
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr-CA">
      <body className="min-h-dvh">
        <MotionProvider>{children}</MotionProvider>
        <Toaster
          position="bottom-center"
          toastOptions={{
            className: "!rounded-2xl !border-2 !border-ink !bg-paper !font-sans !text-ink !shadow-[4px_4px_0_0_#141414]",
          }}
        />
      </body>
    </html>
  );
}
