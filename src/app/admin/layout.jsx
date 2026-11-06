/**
 * Gabarit de base de l'espace admin (/admin/...).
 * Il ne reprend pas l'en-tête du site public. L'admin n'apparaît pas dans Google.
 */
export const metadata = {
  title: { default: "Admin", template: "%s | Admin Yat'Print" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }) {
  return <div className="min-h-dvh bg-cream">{children}</div>;
}
