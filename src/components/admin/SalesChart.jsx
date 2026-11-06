"use client";

/**
 * Graphique des ventes des 30 derniers jours (colonnes SVG faites à la main).
 *
 * - Une colonne par jour, qui « pousse » depuis la ligne de base à l'affichage.
 * - Survol ou focus clavier d'une colonne : bulle avec le montant, la date et
 *   le nombre de commandes ; la colonne survolée s'éclaircit.
 * - Les mêmes chiffres sont disponibles dans un tableau (« Voir le tableau »),
 *   pour ne jamais dépendre du survol.
 */
import { useState } from "react";
import { motion } from "motion/react";
import { formatPrice, pluralize } from "@/lib/utils/format";
import { formatAxisDollars, getNiceTicks, roundedTopBarPath } from "@/lib/utils/chart";

// Dimensions du dessin (unités du viewBox : le SVG s'adapte à la largeur de la carte)
const WIDTH = 720;
const HEIGHT = 260;
const PADDING = { top: 16, right: 8, bottom: 32, left: 64 };
const PLOT_WIDTH = WIDTH - PADDING.left - PADDING.right;
const PLOT_HEIGHT = HEIGHT - PADDING.top - PADDING.bottom;
const BASELINE = PADDING.top + PLOT_HEIGHT;
const BAR_COLOR = "var(--color-magenta)";
const BAR_HOVER_COLOR = "#f04da6"; // magenta un peu plus clair au survol

/**
 * @param {object} props
 * @param {{day: string, label: string, totalCents: number, orderCount: number}[]} props.dailySales
 */
export function SalesChart({ dailySales }) {
  const [activeIndex, setActiveIndex] = useState(null);

  // 1. Échelle verticale en dollars, avec des graduations rondes
  let maxDollars = 0;
  for (const day of dailySales) {
    maxDollars = Math.max(maxDollars, day.totalCents / 100);
  }
  const ticks = getNiceTicks(maxDollars, 4, 1); // pas d'au moins 1 $
  const axisMax = ticks[ticks.length - 1];
  const toY = (dollars) => BASELINE - (dollars / axisMax) * PLOT_HEIGHT;

  // 2. Largeur des colonnes : une « case » par jour, colonne de 18 unités maximum
  const slotWidth = PLOT_WIDTH / Math.max(1, dailySales.length);
  const barWidth = Math.min(18, slotWidth - 4);

  let totalCents = 0;
  for (const day of dailySales) totalCents += day.totalCents;
  const activeDay = activeIndex === null ? null : dailySales[activeIndex];

  // Position de la bulle (en % de la largeur) ; près des bords, elle est
  // collée du côté intérieur pour ne pas sortir de la carte
  const tooltipLeft = activeIndex === null ? 0 : ((PADDING.left + (activeIndex + 0.5) * slotWidth) / WIDTH) * 100;
  let tooltipShift = "-translate-x-1/2";
  if (tooltipLeft > 75) tooltipShift = "-translate-x-full";
  else if (tooltipLeft < 25) tooltipShift = "translate-x-0";

  return (
    <div>
      {/* Sur téléphone, le graphique garde une largeur lisible et défile horizontalement */}
      <div className="overflow-x-auto">
        <div className="relative min-w-[36rem]">
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="h-auto w-full"
            role="img"
            aria-label={`Ventes des 30 derniers jours : ${formatPrice(totalCents)} au total.`}
            onPointerLeave={() => setActiveIndex(null)}
          >
            {/* Lignes de graduation (fines et discrètes) + montants à gauche */}
            {ticks.map((tick) => (
              <g key={tick}>
                <line x1={PADDING.left} x2={WIDTH - PADDING.right} y1={toY(tick)} y2={toY(tick)} stroke="var(--color-line)" strokeWidth="1" />
                <text x={PADDING.left - 10} y={toY(tick)} textAnchor="end" dominantBaseline="middle" className="fill-muted text-[13px] tabular-nums">
                  {formatAxisDollars(tick, axisMax)}
                </text>
              </g>
            ))}

            {dailySales.map((day, index) => {
              const slotX = PADDING.left + index * slotWidth;
              const barX = slotX + (slotWidth - barWidth) / 2;
              const barY = toY(day.totalCents / 100);
              const isActive = activeIndex === index;
              // Une date sur cinq sous l'axe (plus, ce serait illisible)
              const showLabel = index % 5 === 0 || index === dailySales.length - 1;

              return (
                <g key={day.day}>
                  {day.totalCents > 0 && (
                    <motion.path
                      d={roundedTopBarPath(barX, barY, barWidth, BASELINE)}
                      fill={isActive ? BAR_HOVER_COLOR : BAR_COLOR}
                      // Point d'appui de l'animation : en bas de la colonne (0 = haut, 1 = bas)
                      style={{ originX: 0.5, originY: 1 }}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ duration: 0.6, delay: index * 0.015, ease: [0.22, 1, 0.36, 1] }}
                    />
                  )}
                  {showLabel && (
                    <text x={slotX + slotWidth / 2} y={HEIGHT - 8} textAnchor="middle" className="fill-muted text-[13px]">
                      {day.label}
                    </text>
                  )}
                  {/* Zone de survol : toute la hauteur de la case, plus grande que la colonne */}
                  <rect
                    x={slotX}
                    y={PADDING.top}
                    width={slotWidth}
                    height={PLOT_HEIGHT}
                    fill="transparent"
                    tabIndex={0}
                    aria-label={`${day.label} : ${formatPrice(day.totalCents)}, ${pluralize(day.orderCount, "commande")}`}
                    className="cursor-pointer outline-none focus-visible:fill-cyan/10"
                    onPointerEnter={() => setActiveIndex(index)}
                    onFocus={() => setActiveIndex(index)}
                    onBlur={() => setActiveIndex(null)}
                  />
                </g>
              );
            })}

            {/* Ligne de base */}
            <line x1={PADDING.left} x2={WIDTH - PADDING.right} y1={BASELINE} y2={BASELINE} stroke="var(--color-ink)" strokeWidth="1" />
          </svg>

          {/* Bulle d'information (HTML par-dessus le SVG, placée en pourcentage) */}
          {activeDay && (
            <div
              className={`pointer-events-none absolute top-0 z-10 rounded-xl border-2 border-ink bg-paper px-3 py-2 text-sm shadow-hard-sm ${tooltipShift}`}
              style={{ left: `${tooltipLeft}%` }}
              role="status"
            >
              <p className="font-display text-lg font-bold leading-tight">{formatPrice(activeDay.totalCents)}</p>
              <p className="whitespace-nowrap text-muted">
                {activeDay.label} · {pluralize(activeDay.orderCount, "commande")}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Tableau des mêmes chiffres (accessibilité, pas besoin de survoler) */}
      <details className="mt-3 text-sm">
        <summary className="cursor-pointer font-semibold text-muted hover:text-ink">Voir le tableau des ventes</summary>
        <div className="mt-3 max-h-64 overflow-y-auto rounded-2xl border border-line">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-cream-dark text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-4 py-2">Jour</th>
                <th className="px-4 py-2 text-right">Commandes</th>
                <th className="px-4 py-2 text-right">Ventes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line tabular-nums">
              {dailySales.map((day) => (
                <tr key={day.day}>
                  <td className="px-4 py-1.5">{day.label}</td>
                  <td className="px-4 py-1.5 text-right">{day.orderCount}</td>
                  <td className="px-4 py-1.5 text-right font-semibold">{formatPrice(day.totalCents)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
