/**
 * Gabarit des pages admin PROTÉGÉES.
 *
 * Vérifie la session côté serveur : sans connexion, redirection vers
 * /admin/connexion. (Les routes /api/admin vérifient aussi la session
 * de leur côté : double sécurité.)
 *
 * Le dossier « (protected) » est un groupe de routes : il n'apparaît pas dans l'adresse.
 */
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function ProtectedAdminLayout({ children }) {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/admin/connexion");
  }

  return <AdminShell adminName={session.user.name || session.user.email}>{children}</AdminShell>;
}
