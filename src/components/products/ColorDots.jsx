/**
 * Petites pastilles qui montrent les couleurs disponibles d'un article.
 * Au-delà de `max` couleurs, on affiche « +3 ».
 */
import { cn } from "@/lib/utils/cn";

/**
 * @param {object} props
 * @param {{name: string, hex: string}[]} props.colors
 * @param {number} [props.max]
 */
export function ColorDots({ colors, max = 6, className }) {
  if (!colors || colors.length === 0) {
    return null;
  }

  const visibleColors = colors.slice(0, max);
  const hiddenCount = colors.length - visibleColors.length;

  return (
    <div className={cn("flex items-center", className)} aria-label={`${colors.length} couleurs disponibles`}>
      {visibleColors.map((color) => (
        <span
          key={color.name}
          title={color.name}
          className="-ml-1 size-5 rounded-full border-2 border-paper shadow-[0_0_0_1px_rgb(20_20_20/0.25)] first:ml-0"
          style={{ backgroundColor: color.hex }}
        />
      ))}
      {hiddenCount > 0 && <span className="ml-1.5 text-xs font-semibold text-muted">+{hiddenCount}</span>}
    </div>
  );
}
