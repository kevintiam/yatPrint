/**
 * Page 404 : adresse inconnue ou produit introuvable.
 */
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Page introuvable" };

export default function NotFound() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4">
      <div className="relative flex max-w-xl flex-col items-center gap-5 text-center">
        <p className="text-misprint font-display text-[8rem] font-extrabold leading-none sm:text-[11rem]">404</p>
        <h1 className="text-3xl font-extrabold sm:text-4xl">Cette page n&apos;est pas sortie de l&apos;imprimante.</h1>
        <p className="text-lg text-ink-soft">Elle n&apos;existe pas ou a été déplacée.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild variant="accent">
            <Link href="/">Retour à l&apos;accueil</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/personnaliser">Personnaliser un article</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
