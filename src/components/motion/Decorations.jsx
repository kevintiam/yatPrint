/**
 * Décorations « atelier d'impression » qui rendent le site vivant.
 * Ce sont de simples éléments visuels (aria-hidden) animés en CSS.
 *
 * - <Marquee>          : bandeau de texte qui défile sans fin
 * - <RegistrationMark> : repère de calage des imprimeurs (cercle + croix)
 * - <SpinningSticker>  : autocollant rond avec texte qui tourne
 */
import { cn } from "@/lib/utils/cn";

// Couleurs des étoiles du bandeau, utilisées à tour de rôle
const STAR_COLORS = ["text-magenta", "text-cyan", "text-yellow"];

/**
 * Bandeau défilant. Le contenu est répété 2 fois pour boucler sans saut.
 * @param {object} props
 * @param {string[]} props.items - textes à faire défiler
 */
export function Marquee({ items, className }) {
  const loop = [...items, ...items];

  return (
    <div className={cn("relative overflow-hidden", className)} aria-hidden="true">
      <div className="flex w-max animate-marquee items-center gap-8 py-4 hover:[animation-play-state:paused]">
        {loop.map((text, index) => (
          <span key={`${text}-${index}`} className="flex items-center gap-8 font-display text-2xl font-extrabold uppercase md:text-4xl">
            {text}
            <Star className={STAR_COLORS[index % STAR_COLORS.length]} />
          </span>
        ))}
      </div>
    </div>
  );
}

/** Étoile à 4 branches (séparateur décoratif). */
export function Star({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("size-6 md:size-8", className)} fill="currentColor" aria-hidden="true">
      <path d="M12 0c.7 6.4 5 10.7 12 12-7 1.3-11.3 5.6-12 12-.7-6.4-5-10.7-12-12C7 10.7 11.3 6.4 12 0Z" />
    </svg>
  );
}

/** Repère de calage d'imprimeur (cercle barré d'une croix). */
export function RegistrationMark({ className }) {
  return (
    <svg viewBox="0 0 40 40" className={cn("size-10", className)} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="20" cy="20" r="11" />
      <path d="M20 2v36M2 20h36" />
    </svg>
  );
}

/**
 * Autocollant rond : texte disposé en cercle qui tourne lentement.
 * @param {object} props
 * @param {string} props.text - texte du cercle (environ 30 caractères)
 * @param {React.ReactNode} [props.center] - contenu au centre (icône, emoji...)
 * @param {string} [props.id] - identifiant unique si plusieurs autocollants sont sur la page
 */
export function SpinningSticker({ text, center, id = "sticker-circle", className }) {
  return (
    <div className={cn("relative grid size-28 place-items-center rounded-full border-2 border-ink bg-yellow shadow-hard", className)} aria-hidden="true">
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full animate-spin-slow">
        <defs>
          <path id={id} d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0" />
        </defs>
        <text className="fill-ink font-display text-[9px] font-bold uppercase tracking-[0.14em]">
          <textPath href={`#${id}`}>{text}</textPath>
        </text>
      </svg>
      <span className="relative font-script text-2xl font-bold">{center}</span>
    </div>
  );
}
