/**
 * Page de connexion à l'admin (/admin/connexion).
 * Si l'admin est déjà connecté, on l'envoie directement au tableau de bord.
 */
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LoginForm } from "@/components/admin/LoginForm";
import { Logo } from "@/components/layout/Logo";

export const metadata = { title: "Connexion" };

export default async function AdminLoginPage() {
  const session = await auth();
  if (session && session.user) {
    redirect("/admin");
  }

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-12">
      <div className="relative w-full max-w-md rounded-[2rem] border-2 border-ink bg-paper p-8 shadow-hard-lg sm:p-10">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <Logo size={88} />
          <h1 className="font-display text-3xl font-extrabold">Espace admin</h1>
          <p className="text-muted">Connectez-vous pour gérer les commandes, les produits et les demandes.</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
