"use client";

/**
 * Cartes de chiffres du tableau de bord, avec un chiffre qui « compte »
 * de 0 jusqu'à sa valeur (animation à ressort de Motion).
 */
import { useEffect } from "react";
import { motion, useSpring, useTransform } from "motion/react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/**
 * Nombre animé.
 * @param {object} props
 * @param {number} props.value - valeur finale
 * @param {(value: number) => string} [props.format] - mise en forme (ex. prix)
 */
export function CountUp({ value, format = (number) => String(Math.round(number)) }) {
  // La valeur « ressort » part de 0 et rejoint `value` en douceur
  const spring = useSpring(0, { stiffness: 120, damping: 26 });
  const text = useTransform(spring, (latest) => format(latest));

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{text}</motion.span>;
}

/** Couleurs de la pastille d'icône. */
const ICON_COLORS = {
  cyan: "bg-cyan text-white",
  magenta: "bg-magenta text-white",
  yellow: "bg-yellow text-ink",
  ink: "bg-ink text-cream",
};

/** Petit trait de couleur en haut de la carte. */
const TOP_BARS = {
  cyan: "bg-cyan",
  magenta: "bg-magenta",
  yellow: "bg-yellow",
  ink: "bg-ink",
};

/**
 * Évolution par rapport à la période précédente : « ↗ +25 % vs octobre ».
 * @param {{percent: number|null, label: string}} props
 */
function ChangeBadge({ percent, label }) {
  if (percent === null || percent === undefined) {
    return <p className="mt-2 text-sm text-muted">Pas de comparaison {label}</p>;
  }
  const isUp = percent >= 0;
  const Icon = isUp ? TrendingUp : TrendingDown;
  return (
    <p className="mt-2 flex items-center gap-1.5 text-sm">
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold",
          isUp ? "bg-success-soft text-success" : "bg-danger-soft text-danger"
        )}
      >
        <Icon className="size-3.5" aria-hidden="true" />
        {isUp ? "+" : ""}
        {percent} %
      </span>
      <span className="text-muted">{label}</span>
    </p>
  );
}

/**
 * Carte d'un chiffre clé.
 * @param {object} props
 * @param {string} props.label
 * @param {number} props.value
 * @param {(value: number) => string} [props.format]
 * @param {React.ComponentType} props.icon
 * @param {keyof ICON_COLORS} props.color
 * @param {string} [props.hint] - petite ligne sous le chiffre
 * @param {{percent: number|null, label: string}} [props.change] - évolution
 * @param {number} [props.index] - position (petit décalage de l'animation d'apparition)
 */
export function StatCard({ label, value, format, icon: Icon, color, hint, change, index = 0 }) {
  return (
    <motion.div
      className="relative overflow-hidden rounded-3xl border-2 border-ink bg-paper p-5"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: "4px 4px 0 0 var(--color-ink)" }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className={cn("absolute inset-x-0 top-0 h-1.5", TOP_BARS[color])} aria-hidden="true" />
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-muted">{label}</p>
        <span className={cn("grid size-10 place-items-center rounded-xl border-2 border-ink", ICON_COLORS[color])}>
          <Icon className="size-5" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 font-display text-3xl font-extrabold">
        <CountUp value={value} format={format} />
      </p>
      {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
      {change && <ChangeBadge percent={change.percent} label={change.label} />}
    </motion.div>
  );
}
