"use client";

/**
 * Configurateur d'un article à personnaliser (/personnaliser/<slug>).
 *
 * À gauche : l'aperçu en direct. À droite : les étapes numérotées
 * (couleur, taille, emplacement, design, quantité) puis « Ajouter au panier ».
 * Les étapes affichées dépendent du produit (une tasse n'a pas de taille).
 */
import { useState } from "react";
import { toast } from "sonner";
import { ShoppingBag } from "lucide-react";
import { LivePreview } from "./LivePreview";
import { CustomizerStep } from "./CustomizerStep";
import { DesignUploader } from "./DesignUploader";
import { ColorPicker, MaterialPicker, PlacementPicker, SizePicker } from "./OptionPickers";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Textarea } from "@/components/ui/form-controls";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { useCart } from "@/hooks/useCart";
import { useDesignUpload } from "@/hooks/useDesignUpload";
import { buildCartItem, getCustomizerErrors, getPreviewImage, isTextileProduct } from "@/lib/cart/customizerRules";
import { getCategoryLabel } from "@/config/catalog";
import { formatPrice } from "@/lib/utils/format";

/**
 * @param {object} props
 * @param {object} props.product - produit de la ligne « service »
 */
export function Customizer({ product }) {
  const { addItem } = useCart();
  const upload = useDesignUpload();
  const isTextile = isTextileProduct(product);

  // Choix du client (valeurs de départ : première couleur, premier matériau, devant)
  const [colorName, setColorName] = useState(product.colors.length > 0 ? product.colors[0].name : "");
  const [isCustomColor, setIsCustomColor] = useState(false);
  const [customColor, setCustomColor] = useState("");
  const [size, setSize] = useState("");
  const [materialKey, setMaterialKey] = useState(product.materials.length > 0 ? product.materials[0].key : "");
  const [placement, setPlacement] = useState(isTextile ? "front" : "");
  const [printText, setPrintText] = useState("");
  const [instructions, setInstructions] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [errors, setErrors] = useState({});

  // Couleur affichée dans l'aperçu (pour l'illustration et la couleur du texte)
  let colorHex = "";
  for (const color of product.colors) {
    if (color.name === colorName) colorHex = color.hex;
  }

  const choices = {
    colorName,
    isCustomColor,
    customColor,
    size,
    materialKey,
    placement,
    printText,
    instructions,
    quantity,
    designFileId: upload.uploadedFile ? upload.uploadedFile.id : "",
    designFileName: upload.uploadedFile ? upload.uploadedFile.name : "",
    isUploading: upload.isUploading,
  };

  /** Efface l'erreur d'une étape quand le client la corrige. */
  function clearError(stepKey) {
    if (!errors[stepKey]) return;
    const nextErrors = { ...errors };
    delete nextErrors[stepKey];
    setErrors(nextErrors);
  }

  function handleAddToCart() {
    const foundErrors = getCustomizerErrors(product, choices);
    setErrors(foundErrors);
    if (Object.keys(foundErrors).length > 0) {
      toast.error("Il manque une information pour ajouter l'article.");
      return;
    }

    addItem(buildCartItem(product, choices));
    toast.success(`${product.name} ajouté au panier !`);
  }

  // Liste des étapes affichées, dans l'ordre (certaines dépendent du produit)
  const stepKeys = [];
  if (product.colors.length > 0) stepKeys.push("color");
  if (product.materials.length > 0) stepKeys.push("material");
  if (product.sizes.length > 0) stepKeys.push("size");
  if (isTextile) stepKeys.push("placement");
  stepKeys.push("design", "quantity");

  /** Numéro d'une étape : sa position dans la liste + 1. */
  function stepNumberOf(stepKey) {
    return stepKeys.indexOf(stepKey) + 1;
  }

  return (
    <div className="grid gap-12 lg:grid-cols-2">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <LivePreview
          image={getPreviewImage(product, choices)}
          category={product.category}
          colorHex={isCustomColor ? "" : colorHex}
          productName={product.name}
          placement={placement}
          designPreviewUrl={upload.previewUrl}
          printText={printText}
          badge={isCustomColor && customColor ? `Couleur sur demande : ${customColor}` : ""}
        />
      </div>

      <div>
        <Badge tone="cyan">{getCategoryLabel(product.category)} à personnaliser</Badge>
        <h1 className="mt-3 text-4xl font-extrabold leading-tight sm:text-5xl">{product.name}</h1>
        <p className="mt-3 font-display text-3xl font-extrabold text-magenta">{formatPrice(product.priceCents)}</p>
        {product.description && <p className="mt-4 text-lg leading-relaxed text-ink-soft">{product.description}</p>}

        <ol className="mt-10">
          {product.colors.length > 0 && (
            <CustomizerStep number={stepNumberOf("color")} title="Couleur" hint={isCustomColor ? "Sur demande" : colorName} error={errors.color}>
              <ColorPicker
                colors={product.colors}
                selectedName={colorName}
                isCustom={isCustomColor}
                allowCustom={product.allowCustomColor}
                onSelect={(name) => {
                  setColorName(name);
                  setIsCustomColor(false);
                  clearError("color");
                }}
                onSelectCustom={() => setIsCustomColor(true)}
              />
              {isCustomColor && (
                <Input
                  className="mt-3"
                  placeholder="Ex. : vert sapin, lilas, sable…"
                  value={customColor}
                  onChange={(event) => {
                    setCustomColor(event.target.value);
                    clearError("color");
                  }}
                  aria-label="Couleur souhaitée"
                  invalid={Boolean(errors.color)}
                  maxLength={60}
                />
              )}
            </CustomizerStep>
          )}

          {product.materials.length > 0 && (
            <CustomizerStep number={stepNumberOf("material")} title="Matériau" error={errors.material}>
              <MaterialPicker materials={product.materials} selected={materialKey} onSelect={setMaterialKey} />
            </CustomizerStep>
          )}

          {product.sizes.length > 0 && (
            <CustomizerStep number={stepNumberOf("size")} title="Taille" error={errors.size}>
              <SizePicker
                sizes={product.sizes}
                selected={size}
                invalid={Boolean(errors.size)}
                onSelect={(value) => {
                  setSize(value);
                  clearError("size");
                }}
              />
            </CustomizerStep>
          )}

          {isTextile && (
            <CustomizerStep number={stepNumberOf("placement")} title="Emplacement de l'impression" error={errors.placement}>
              <PlacementPicker selected={placement} onSelect={setPlacement} />
            </CustomizerStep>
          )}

          <CustomizerStep number={stepNumberOf("design")} title="Votre design" hint="Fichier, texte ou les deux" error={errors.design}>
            <div className="flex flex-col gap-4">
              <DesignUploader upload={upload} />
              <Input
                placeholder="Texte à imprimer (facultatif)"
                value={printText}
                maxLength={80}
                onChange={(event) => {
                  setPrintText(event.target.value);
                  clearError("design");
                }}
                aria-label="Texte à imprimer"
              />
              <Textarea
                rows={3}
                placeholder="Décrivez votre idée ou donnez des précisions (police, couleurs, taille du logo…)"
                value={instructions}
                maxLength={500}
                onChange={(event) => {
                  setInstructions(event.target.value);
                  clearError("design");
                }}
                aria-label="Précisions sur votre design"
              />
            </div>
          </CustomizerStep>

          <CustomizerStep number={stepNumberOf("quantity")} title="Quantité" isLast>
            <QuantityStepper value={quantity} onChange={setQuantity} />
          </CustomizerStep>
        </ol>

        {/* Total + bouton (collé en bas de l'écran sur mobile) */}
        <div className="sticky bottom-4 z-10 mt-10 flex items-center justify-between gap-4 rounded-3xl border-2 border-ink bg-paper p-4 shadow-hard sm:p-5">
          <div>
            <p className="text-sm text-muted">Total</p>
            <p className="font-display text-2xl font-extrabold">{formatPrice(product.priceCents * quantity)}</p>
          </div>
          <Button variant="accent" size="lg" onClick={handleAddToCart} disabled={upload.isUploading}>
            <ShoppingBag aria-hidden="true" />
            Ajouter au panier
          </Button>
        </div>
      </div>
    </div>
  );
}
