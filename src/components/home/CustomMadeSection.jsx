/**
 * Section « La personnalisation, à votre façon » : un collage de photos
 * inclinées à gauche, le texte et les avantages à droite.
 */
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
import { RegistrationMark } from "@/components/motion/Decorations";
import { CUSTOM_MADE } from "@/content/home";

// Les 3 photos du collage, avec leur position et leur inclinaison
const COLLAGE = [
  { src: "/images/customize/hoodie-pink.webp", alt: "Hoodie rose à personnaliser", className: "left-0 top-6 w-[52%] -rotate-6 z-10" },
  { src: "/images/customize/tshirt-white.webp", alt: "T-shirt blanc à personnaliser", className: "right-0 top-0 w-[50%] rotate-3" },
  { src: "/images/customize/engraving-wood.webp", alt: "Planche en bois gravée", className: "bottom-0 left-[24%] w-[48%] rotate-2 z-20" },
];

// Couleur de la coche devant chaque avantage
const CHECK_COLORS = ["bg-cyan", "bg-magenta", "bg-yellow", "bg-ink"];

export function CustomMadeSection() {
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-16 px-4 py-24 sm:px-6 lg:grid-cols-2">
      <Reveal className="relative mx-auto aspect-square w-full max-w-lg">
        <RegistrationMark className="absolute -right-2 bottom-10 size-14 text-cyan" />
        {COLLAGE.map((photo) => (
          <div
            key={photo.src}
            className={`absolute aspect-[4/5] overflow-hidden rounded-3xl border-2 border-ink bg-white shadow-hard transition-transform duration-500 hover:z-30 hover:scale-105 hover:rotate-0 ${photo.className}`}
          >
            <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1024px) 16rem, 45vw" className="object-cover" />
          </div>
        ))}
      </Reveal>

      <Reveal delay={0.1}>
        <p className="mb-3 font-script text-2xl text-magenta">{CUSTOM_MADE.eyebrow}</p>
        <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">{CUSTOM_MADE.title}</h2>
        <p className="mt-5 text-lg leading-relaxed text-ink-soft">{CUSTOM_MADE.text}</p>

        <ul className="mt-8 flex flex-col gap-4">
          {CUSTOM_MADE.bullets.map((bullet, index) => {
            const circleColor = CHECK_COLORS[index % CHECK_COLORS.length];
            // Coche noire sur le jaune (plus lisible), blanche sur les autres couleurs
            const checkColor = circleColor === "bg-yellow" ? "text-ink" : "text-white";
            return (
              <li key={bullet} className="flex items-start gap-3">
                <span className={`mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border-2 border-ink ${circleColor}`}>
                  <Check className={`size-4 ${checkColor}`} aria-hidden="true" />
                </span>
                <span className="text-lg">{bullet}</span>
              </li>
            );
          })}
        </ul>

        <Button asChild variant="primary" size="lg" className="mt-10">
          <Link href="/personnaliser">
            Ouvrir l&apos;atelier
          </Link>
        </Button>
      </Reveal>
    </section>
  );
}
