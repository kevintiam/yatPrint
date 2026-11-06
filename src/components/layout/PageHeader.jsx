/**
 * Grand bandeau de titre en haut des pages intérieures (Collection, Mentorat...).
 *
 * Exemple :
 *   <PageHeader eyebrow="Atelier" title="Personnalisez" highlight="votre style" text="..." accent="magenta" />
 * Le mot « highlight » est surligné en jaune, à la fin du titre.
 */
import { RegistrationMark } from "@/components/motion/Decorations";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils/cn";

const ACCENT_STYLES = {
  cyan: "bg-cyan-soft",
  magenta: "bg-magenta-soft",
  yellow: "bg-yellow-soft",
};

/**
 * @param {object} props
 * @param {string} props.eyebrow - petit texte au-dessus du titre
 * @param {string} props.title - titre principal
 * @param {string} [props.highlight] - fin du titre mise en valeur
 * @param {string} [props.text] - paragraphe d'introduction
 * @param {"cyan"|"magenta"|"yellow"} [props.accent] - couleur de fond
 * @param {React.ReactNode} [props.children] - boutons ou contenu sous le texte
 */
export function PageHeader({ eyebrow, title, highlight, text, accent = "yellow", children }) {
  return (
    <section className="px-4 pt-6 sm:px-6">
      <div
        className={cn(
          "relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border-2 border-ink px-6 py-14 sm:px-12 md:py-20",
          ACCENT_STYLES[accent]
        )}
      >
        <RegistrationMark className="absolute right-6 top-6 hidden text-ink/25 md:block" />

        <Reveal className="relative max-w-3xl">
          <p className="mb-4 inline-flex rounded-full border-2 border-ink bg-paper px-4 py-1 text-sm font-bold uppercase tracking-wider">
            {eyebrow}
          </p>
          <h1 className="text-4xl font-extrabold leading-[1.05] sm:text-5xl md:text-6xl">
            {title} {highlight && <span className="marker">{highlight}</span>}
          </h1>
          {text && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">{text}</p>}
          {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
        </Reveal>
      </div>
    </section>
  );
}

/**
 * Titre de section (petit sur-titre coloré + grand titre + texte).
 * @param {object} props
 * @param {string} props.eyebrow
 * @param {string} props.title
 * @param {string} [props.text]
 * @param {"left"|"center"} [props.align]
 */
export function SectionHeading({ eyebrow, title, text, align = "left", className }) {
  return (
    <Reveal className={cn("mb-10 max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      <p className="mb-3 font-script text-2xl text-magenta">{eyebrow}</p>
      <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">{title}</h2>
      {text && <p className="mt-4 text-lg leading-relaxed text-ink-soft">{text}</p>}
    </Reveal>
  );
}
