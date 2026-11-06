"use client";

/**
 * Sélecteur de quantité : [ − ]  3  [ + ]
 *
 * Exemple : <QuantityStepper value={quantity} onChange={setQuantity} />
 */
import { Minus, Plus } from "lucide-react";
import { MAX_QUANTITY_PER_LINE } from "@/config/catalog";
import { cn } from "@/lib/utils/cn";

/**
 * @param {object} props
 * @param {number} props.value
 * @param {(value: number) => void} props.onChange
 * @param {"sm"|"md"} [props.size]
 * @param {string} [props.label] - nom lu par les lecteurs d'écran
 */
export function QuantityStepper({ value, onChange, size = "md", label = "Quantité", className }) {
  const buttonSize = size === "sm" ? "size-8" : "size-11";

  /** Garde la quantité entre 1 et le maximum. */
  function change(newValue) {
    const whole = Math.floor(Number(newValue) || 1);
    onChange(Math.min(Math.max(whole, 1), MAX_QUANTITY_PER_LINE));
  }

  return (
    <div
      role="group"
      aria-label={label}
      className={cn("inline-flex items-center rounded-full border-2 border-ink bg-paper", className)}
    >
      <button
        type="button"
        onClick={() => change(value - 1)}
        disabled={value <= 1}
        className={cn(buttonSize, "grid place-items-center rounded-full transition hover:bg-yellow disabled:opacity-30")}
        aria-label="Diminuer la quantité"
      >
        <Minus className="size-4" aria-hidden="true" />
      </button>

      <input
        type="number"
        inputMode="numeric"
        min={1}
        max={MAX_QUANTITY_PER_LINE}
        value={value}
        onChange={(event) => change(event.target.value)}
        aria-label={label}
        className="w-10 bg-transparent text-center font-semibold [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none"
      />

      <button
        type="button"
        onClick={() => change(value + 1)}
        disabled={value >= MAX_QUANTITY_PER_LINE}
        className={cn(buttonSize, "grid place-items-center rounded-full transition hover:bg-yellow disabled:opacity-30")}
        aria-label="Augmenter la quantité"
      >
        <Plus className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}
