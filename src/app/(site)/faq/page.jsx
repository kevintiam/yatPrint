/**
 * Page Questions fréquentes (/faq), regroupées par thème.
 */
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/Reveal";
import { FAQ_SECTIONS } from "@/content/faq";

export const metadata = {
  title: "Questions fréquentes",
  description: "Commande, fichiers, livraison, entretien, entreprises et mentorat : les réponses à vos questions.",
};

export default function FaqPage() {
  return (
    <>
      <PageHeader
        eyebrow="FAQ"
        title="Vos questions,"
        highlight="nos réponses."
        text="Vous ne trouvez pas ce que vous cherchez ? Écrivez-nous, nous répondons à tous les messages."
        accent="cyan"
      />

      <section className="mx-auto flex max-w-3xl flex-col gap-14 px-4 py-16 sm:px-6">
        {FAQ_SECTIONS.map((section) => {
          // Format attendu par l'accordéon : { id, title, content }
          const items = [];
          for (const question of section.questions) {
            items.push({ id: question.id, title: question.question, content: question.answer });
          }
          return (
            <Reveal key={section.id}>
              <h2 className="mb-5 font-display text-2xl font-extrabold">{section.title}</h2>
              <Accordion items={items} />
            </Reveal>
          );
        })}

        <div className="rounded-3xl border-2 border-ink bg-yellow-soft p-8 text-center">
          <p className="font-display text-2xl font-bold">Encore une question ?</p>
          <Button asChild variant="accent" className="mt-5">
            <Link href="/contact">Nous écrire</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
