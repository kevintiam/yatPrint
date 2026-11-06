/**
 * Page À propos (/a-propos) : l'histoire et les valeurs de Yat'Print.
 * ⚠️ Texte provisoire (voir src/content/pages.js).
 */
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/Reveal";
import { SpinningSticker } from "@/components/motion/Decorations";
import { ABOUT } from "@/content/pages";
import { BRAND } from "@/config/brand";
import { cn } from "@/lib/utils/cn";

export const metadata = {
  title: "À propos",
  description: "Découvrez Yat'Print : un atelier de personnalisation, une collection et du mentorat.",
};

const VALUE_COLORS = { cyan: "bg-cyan-soft", magenta: "bg-magenta-soft", yellow: "bg-yellow-soft" };

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="À propos" title="Derrière chaque impression," highlight="une histoire." accent="magenta" />

      <section className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-20 sm:px-6 lg:grid-cols-2">
        <Reveal className="relative mx-auto w-full max-w-md">
          <div className="relative aspect-square rotate-2 overflow-hidden rounded-[2rem] border-2 border-ink bg-paper p-10 shadow-hard-lg">
            <Image src={BRAND.logoBlack} alt={BRAND.name} fill sizes="28rem" className="object-contain p-10" />
          </div>
          <SpinningSticker id="about-sticker" text="Imprimer • Créer • Partager • " center="♥" className="absolute -bottom-8 -right-4" />
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="text-3xl font-extrabold sm:text-4xl">Notre histoire</h2>
          {ABOUT.story.map((paragraph) => (
            <p key={paragraph.slice(0, 30)} className="mt-5 text-lg leading-relaxed text-ink-soft">
              {paragraph}
            </p>
          ))}
          <Button asChild variant="accent" className="mt-8">
            <Link href="/personnaliser">Créer avec nous</Link>
          </Button>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6">
        <h2 className="mb-8 text-center text-3xl font-extrabold">Ce qui nous guide</h2>
        <StaggerGroup className="grid gap-5 md:grid-cols-3">
          {ABOUT.values.map((value) => (
            <StaggerItem key={value.title} className={cn("rounded-3xl border-2 border-ink p-7", VALUE_COLORS[value.accent])}>
              <h3 className="font-display text-2xl font-bold">{value.title}</h3>
              <p className="mt-3 text-ink-soft">{value.text}</p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>
    </>
  );
}
