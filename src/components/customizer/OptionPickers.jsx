"use client";

/**
 * Sélecteurs d'options du configurateur et de la fiche produit :
 * couleur, taille, matériau et emplacement d'impression.
 *
 * Ce sont des groupes de boutons « radio » accessibles : on navigue au
 * clavier et le lecteur d'écran annonce l'option choisie.
 */
import { Check, Palette } from "lucide-react";
import { PLACEMENTS } from "@/config/catalog";
import { cn } from "@/lib/utils/cn";

/**
 * Pastilles de couleur + option « Choisir ma couleur ».
 * @param {object} props
 * @param {{name: string, hex: string}[]} props.colors
 * @param {string} props.selectedName - couleur choisie
 * @param {boolean} props.isCustom - « Choisir ma couleur » est sélectionné
 * @param {boolean} props.allowCustom - l'option « Choisir ma couleur » existe
 * @param {(name: string) => void} props.onSelect
 * @param {() => void} props.onSelectCustom
 */
export function ColorPicker({ colors, selectedName, isCustom, allowCustom, onSelect, onSelectCustom }) {
  return (
    <div role="radiogroup" aria-label="Couleur" className="flex flex-wrap items-center gap-3">
      {colors.map((color) => {
        const isSelected = !isCustom && color.name === selectedName;
        return (
          <button
            key={color.name}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={color.name}
            title={color.name}
            onClick={() => onSelect(color.name)}
            className={cn(
              "relative grid size-11 place-items-center rounded-full border-2 transition-all duration-200 hover:scale-110",
              isSelected ? "scale-110 border-ink shadow-hard-sm" : "border-ink/20"
            )}
            style={{ backgroundColor: color.hex }}
          >
            {isSelected && (
              <span className="grid size-5 place-items-center rounded-full bg-paper">
                <Check className="size-3.5 text-ink" aria-hidden="true" />
              </span>
            )}
          </button>
        );
      })}

      {allowCustom && (
        <button
          type="button"
          role="radio"
          aria-checked={isCustom}
          onClick={onSelectCustom}
          className={cn(
            "flex h-11 items-center gap-2 rounded-full border-2 px-4 text-sm font-semibold transition",
            isCustom ? "border-ink bg-yellow shadow-hard-sm" : "border-dashed border-ink/40 hover:border-ink"
          )}
        >
          <Palette className="size-4" aria-hidden="true" />
          Choisir ma couleur
        </button>
      )}
    </div>
  );
}

/**
 * Groupe de « puces » texte (tailles, matériaux, emplacements).
 * @param {object} props
 * @param {string} props.label - nom du groupe (accessibilité)
 * @param {{value: string, label: string}[]} props.options
 * @param {string} props.selected
 * @param {(value: string) => void} props.onSelect
 * @param {boolean} [props.invalid] - entoure le groupe en rouge
 */
export function ChipPicker({ label, options, selected, onSelect, invalid = false }) {
  return (
    <div role="radiogroup" aria-label={label} className={cn("flex flex-wrap gap-2", invalid && "rounded-2xl ring-2 ring-danger ring-offset-4 ring-offset-cream")}>
      {options.map((option) => {
        const isSelected = option.value === selected;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onSelect(option.value)}
            className={cn(
              "min-w-14 rounded-xl border-2 px-4 py-2.5 font-semibold transition-all duration-200",
              isSelected
                ? "-translate-y-0.5 border-ink bg-ink text-cream shadow-[3px_3px_0_0_var(--color-cyan)]"
                : "border-ink/20 bg-paper hover:border-ink"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Tailles (XS à 2XL).
 * @param {{sizes: string[], selected: string, onSelect: Function, invalid?: boolean}} props
 */
export function SizePicker({ sizes, selected, onSelect, invalid }) {
  const options = [];
  for (const size of sizes) {
    options.push({ value: size, label: size });
  }
  return <ChipPicker label="Taille" options={options} selected={selected} onSelect={onSelect} invalid={invalid} />;
}

/**
 * Matériaux (gravure : bois ou acrylique).
 * @param {{materials: {key: string, name: string}[], selected: string, onSelect: Function}} props
 */
export function MaterialPicker({ materials, selected, onSelect }) {
  const options = [];
  for (const material of materials) {
    options.push({ value: material.key, label: material.name });
  }
  return <ChipPicker label="Matériau" options={options} selected={selected} onSelect={onSelect} />;
}

/**
 * Emplacement de l'impression sur un vêtement (devant, dos, cœur).
 * @param {{selected: string, onSelect: Function}} props
 */
export function PlacementPicker({ selected, onSelect }) {
  const options = [];
  for (const placement of PLACEMENTS) {
    options.push({ value: placement.key, label: placement.label });
  }
  return <ChipPicker label="Emplacement de l'impression" options={options} selected={selected} onSelect={onSelect} />;
}
