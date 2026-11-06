"use client";

/**
 * Carrousel du haut de la page d'accueil (3 messages, comme le site modèle).
 *
 * - Change de diapositive toutes les 6 secondes, se met en pause au survol.
 * - La couleur de fond change à chaque diapositive (cyan, magenta, jaune).
 * - Le texte et la photo glissent avec la bibliothèque Motion.
 * - Les points du bas montrent la progression et permettent de choisir.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import {  ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HERO_SLIDES } from "@/content/home";
import { cn } from "@/lib/utils/cn";

const SLIDE_DURATION_MS = 6000;

// Couleurs selon l'accent de chaque diapositive
const BACKGROUNDS = { cyan: "bg-cyan-soft", magenta: "bg-magenta-soft", yellow: "bg-yellow-soft" };
const BLOCK_COLORS = { cyan: "bg-cyan", magenta: "bg-magenta", yellow: "bg-yellow" };

export function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slide = HERO_SLIDES[activeIndex];

  // Défilement automatique (arrêté pendant la pause)
  useEffect(() => {
    if (isPaused) return undefined;
    const timer = setTimeout(() => {
      setActiveIndex((index) => (index + 1) % HERO_SLIDES.length);
    }, SLIDE_DURATION_MS);
    return () => clearTimeout(timer);
  }, [activeIndex, isPaused]);

  /** Va à la diapositive précédente (-1) ou suivante (+1). */
  function goBy(step) {
    setActiveIndex((index) => (index + step + HERO_SLIDES.length) % HERO_SLIDES.length);
  }

  return (
    <section className="px-4 pt-4 sm:px-6" aria-roledescription="carrousel" aria-label="Présentation de Yat'Print">
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
        className={cn(
          "relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] border-2 border-ink transition-colors duration-700",
          BACKGROUNDS[slide.accent]
        )}
      >

        <div className="relative grid min-h-[600px] items-center gap-12 px-6 pb-24 pt-12 sm:px-12 lg:grid-cols-[1.1fr_1fr] lg:py-20">
          {/* ---------- Texte ---------- */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              aria-live="polite"
            >
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-paper px-4 py-1.5 text-sm font-bold uppercase tracking-wider">
                <span className={cn("size-2.5 rounded-full", BLOCK_COLORS[slide.accent])} aria-hidden="true" />
                {slide.eyebrow}
              </p>
              <h1 className="text-[2.5rem] font-extrabold leading-[1] sm:text-6xl xl:text-7xl">
                {slide.title}
                <br />
                <span className="marker">{slide.highlight}</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft sm:text-xl">{slide.text}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild variant="accent" size="lg">
                  <Link href={slide.primaryCta.href}>
                    {slide.primaryCta.label}
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="bg-paper/60">
                  <Link href={slide.secondaryCta.href}>{slide.secondaryCta.label}</Link>
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* ---------- Photo ---------- */}
          <div className="relative mx-auto w-full max-w-md">
            <span
              className={cn(
                "absolute inset-0 -rotate-6 rounded-[2rem] border-2 border-ink transition-colors duration-700",
                BLOCK_COLORS[slide.accent]
              )}
              aria-hidden="true"
            />
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.image}
                initial={{ opacity: 0, rotate: 8, scale: 0.92 }}
                animate={{ opacity: 1, rotate: 2, scale: 1 }}
                exit={{ opacity: 0, rotate: -4, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 120, damping: 16 }}
                className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border-2 border-ink bg-white shadow-hard-lg"
              >
                <Image
                  src={slide.image}
                  alt={slide.imageAlt}
                  fill
                  priority={activeIndex === 0}
                  sizes="(min-width: 1024px) 28rem, 90vw"
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>

            <p className="absolute -right-3 top-8 flex rotate-3 items-center gap-2 rounded-full border-2 border-ink bg-paper px-4 py-2 text-sm font-bold shadow-hard-sm sm:-right-8">
              <Eye className="size-4 text-magenta" aria-hidden="true" />
              Aperçu avant commande
            </p>
          </div>
        </div>

        {/* ---------- Commandes du carrousel ---------- */}
        <div className="absolute inset-x-0 bottom-6 flex items-center justify-center gap-4 px-6 lg:justify-start lg:px-12">
          <button type="button" onClick={() => goBy(-1)} className="grid size-10 place-items-center rounded-full border-2 border-ink bg-paper transition hover:bg-ink hover:text-cream" aria-label="Diapositive précédente">
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>

          <div className="flex gap-2">
            {HERO_SLIDES.map((item, index) => (
              <button
                key={item.eyebrow}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Diapositive ${index + 1} : ${item.eyebrow}`}
                aria-current={index === activeIndex ? "true" : undefined}
                className={cn(
                  "relative h-3 overflow-hidden rounded-full border-2 border-ink bg-paper transition-all duration-300",
                  index === activeIndex ? "w-16" : "w-3 hover:bg-ink/30"
                )}
              >
                {/* Barre de progression : se remplit pendant les 6 secondes */}
                {index === activeIndex && (
                  <span
                    key={`progress-${activeIndex}`}
                    className="absolute inset-y-0 left-0 bg-ink"
                    style={{
                      animation: `hero-progress ${SLIDE_DURATION_MS}ms linear forwards`,
                      animationPlayState: isPaused ? "paused" : "running",
                    }}
                  />
                )}
              </button>
            ))}
          </div>

          <button type="button" onClick={() => goBy(1)} className="grid size-10 place-items-center rounded-full border-2 border-ink bg-paper transition hover:bg-ink hover:text-cream" aria-label="Diapositive suivante">
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
