"use client";

/**
 * Éditeurs du formulaire produit : photos, couleurs et matériaux.
 * Chacun reçoit une liste et renvoie une NOUVELLE liste via onChange.
 */
import { ArrowUpToLine, Plus, Trash2 } from "lucide-react";
import { ImageUploadButton } from "./ImageUploadButton";
import { ProductImage } from "@/components/products/ProductImage";
import { Input } from "@/components/ui/form-controls";
import { Button } from "@/components/ui/button";

/** Copie d'une liste sans l'élément à la position donnée. */
function withoutIndex(list, indexToRemove) {
  const result = [];
  for (let index = 0; index < list.length; index += 1) {
    if (index !== indexToRemove) result.push(list[index]);
  }
  return result;
}

/** Copie d'une liste où l'élément à la position donnée est modifié. */
function withChangedField(list, indexToChange, field, value) {
  const result = [];
  for (let index = 0; index < list.length; index += 1) {
    result.push(index === indexToChange ? { ...list[index], [field]: value } : list[index]);
  }
  return result;
}

/**
 * Photos du produit (la première est la photo principale).
 * @param {{images: string[], onChange: (images: string[]) => void, category: string}} props
 */
export function ImageListEditor({ images, onChange, category }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-3">
        {images.map((image, index) => (
          <div key={image} className="relative w-28">
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl border-2 border-ink">
              <ProductImage src={image} alt="" category={category} sizes="112px" />
            </div>
            {index === 0 && <span className="absolute left-1 top-1 rounded-full bg-yellow px-2 text-[0.65rem] font-bold">Principale</span>}
            <div className="mt-1 flex justify-between">
              {index > 0 && (
                <button type="button" onClick={() => onChange([image, ...withoutIndex(images, index)])} className="rounded p-1 hover:bg-yellow-soft" aria-label="Mettre en photo principale">
                  <ArrowUpToLine className="size-4" aria-hidden="true" />
                </button>
              )}
              <button type="button" onClick={() => onChange(withoutIndex(images, index))} className="ml-auto rounded p-1 text-danger hover:bg-danger-soft" aria-label="Retirer la photo">
                <Trash2 className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <ImageUploadButton purpose="product" onUploaded={(url) => onChange([...images, url])} />
    </div>
  );
}

/**
 * Couleurs proposées : nom, couleur et photo de l'article dans cette couleur.
 * @param {{colors: object[], onChange: (colors: object[]) => void}} props
 */
export function ColorListEditor({ colors, onChange }) {
  return (
    <div className="flex flex-col gap-3">
      {colors.map((color, index) => (
        <div key={index} className="flex flex-wrap items-center gap-3 rounded-2xl border-2 border-ink/15 bg-cream/50 p-3">
          <input
            type="color"
            value={color.hex}
            onChange={(event) => onChange(withChangedField(colors, index, "hex", event.target.value))}
            className="size-11 cursor-pointer rounded-lg border-2 border-ink"
            aria-label="Couleur"
          />
          <Input
            value={color.name}
            onChange={(event) => onChange(withChangedField(colors, index, "name", event.target.value))}
            placeholder="Nom (ex. Marine)"
            aria-label="Nom de la couleur"
            className="h-11 w-44"
          />
          {color.image ? (
            <div className="relative size-11 overflow-hidden rounded-lg border-2 border-ink">
              <ProductImage src={color.image} alt="" category="tshirt" sizes="44px" />
            </div>
          ) : (
            <span className="text-xs text-muted">Pas de photo</span>
          )}
          <ImageUploadButton purpose="product" label="Photo" onUploaded={(url) => onChange(withChangedField(colors, index, "image", url))} />
          <button type="button" onClick={() => onChange(withoutIndex(colors, index))} className="ml-auto rounded-full p-2 text-danger hover:bg-danger-soft" aria-label="Retirer la couleur">
            <Trash2 className="size-4" aria-hidden="true" />
          </button>
        </div>
      ))}
      <Button variant="ghost" size="sm" className="w-fit" onClick={() => onChange([...colors, { name: "", hex: "#ffffff", image: "" }])}>
        <Plus aria-hidden="true" />
        Ajouter une couleur
      </Button>
    </div>
  );
}

/**
 * Matériaux au choix (utile pour la gravure : bois, acrylique...).
 * @param {{materials: object[], onChange: (materials: object[]) => void}} props
 */
export function MaterialListEditor({ materials, onChange }) {
  return (
    <div className="flex flex-col gap-3">
      {materials.map((material, index) => (
        <div key={index} className="flex flex-wrap items-center gap-3 rounded-2xl border-2 border-ink/15 bg-cream/50 p-3">
          <Input
            value={material.name}
            onChange={(event) => onChange(withChangedField(materials, index, "name", event.target.value))}
            placeholder="Nom (ex. Bois)"
            aria-label="Nom du matériau"
            className="h-11 w-40"
          />
          <Input
            value={material.key}
            onChange={(event) => onChange(withChangedField(materials, index, "key", event.target.value.toLowerCase()))}
            placeholder="clé (ex. wood)"
            aria-label="Clé du matériau"
            className="h-11 w-36"
          />
          <ImageUploadButton purpose="product" label="Photo" onUploaded={(url) => onChange(withChangedField(materials, index, "image", url))} />
          <button type="button" onClick={() => onChange(withoutIndex(materials, index))} className="ml-auto rounded-full p-2 text-danger hover:bg-danger-soft" aria-label="Retirer le matériau">
            <Trash2 className="size-4" aria-hidden="true" />
          </button>
        </div>
      ))}
      <Button variant="ghost" size="sm" className="w-fit" onClick={() => onChange([...materials, { key: "", name: "", image: "" }])}>
        <Plus aria-hidden="true" />
        Ajouter un matériau
      </Button>
    </div>
  );
}
