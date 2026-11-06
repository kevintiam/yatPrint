"use client";

/**
 * Fiche d'un article de la collection (/collection/<slug>) :
 * photos, prix, taille, quantité, ajout au panier et détails.
 */
import { useState } from "react";
import { toast } from "sonner";
import { ShoppingBag, Truck } from "lucide-react";
import { ProductImage } from "@/components/products/ProductImage";
import { ColorPicker, SizePicker } from "@/components/customizer/OptionPickers";
import { Accordion } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { useCart } from "@/hooks/useCart";
import { buildCartItem, getPreviewImage } from "@/lib/cart/customizerRules";
import { CATEGORIES, getCategoryLabel } from "@/config/catalog";
import { formatPrice } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

/**
 * Détails affichés dans l'accordéon sous le bouton.
 * @param {object} product
 */
function getDetailItems(product) {
  const items = [{ id: "description", title: "Description", content: product.description || product.shortDescription }];

  if (CATEGORIES[product.category]?.isTextile) {
    items.push({
      id: "entretien",
      title: "Entretien",
      content:
        "Attendez 24 à 48 heures avant le premier lavage. Ensuite, lavez à l'envers à l'eau froide et évitez de repasser sur l'impression.",
    });
  }
  items.push({
    id: "livraison",
    title: "Livraison",
    content: "Expédition partout au Canada au tarif unique, ou ramassage gratuit à l'atelier.",
  });
  return items;
}

/**
 * @param {object} props
 * @param {object} props.product - produit de la ligne « collection »
 */
export function ProductDetail({ product }) {
  const { addItem } = useCart();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [colorName, setColorName] = useState(product.colors.length > 0 ? product.colors[0].name : "");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState("");

  // Mêmes « choix » que le configurateur, sans personnalisation (article de la collection)
  const choices = {
    colorName,
    isCustomColor: false,
    customColor: "",
    size,
    materialKey: "",
    placement: "",
    printText: "",
    instructions: "",
    quantity,
  };
  // Photo principale : celle choisie dans les miniatures, sinon celle de la couleur
  const mainImage = product.images[activeImageIndex] || getPreviewImage(product, choices);

  function handleAddToCart() {
    if (product.sizes.length > 0 && !size) {
      setSizeError("Choisissez une taille.");
      toast.error("Choisissez une taille avant d'ajouter l'article.");
      return;
    }
    addItem(buildCartItem(product, choices));
    toast.success(`${product.name} ajouté au panier !`);
  }

  return (
    <div className="grid gap-12 lg:grid-cols-2">
      {/* ---------- Photos ---------- */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border-2 border-ink shadow-hard-lg">
          <ProductImage src={mainImage} alt={product.name} category={product.category} priority sizes="(min-width: 1024px) 45vw, 95vw" />
        </div>

        {product.images.length > 1 && (
          <div className="mt-4 flex gap-3">
            {product.images.map((image, index) => (
              <button
                key={image}
                type="button"
                onClick={() => setActiveImageIndex(index)}
                className={cn(
                  "relative size-20 overflow-hidden rounded-xl border-2 transition",
                  index === activeImageIndex ? "border-ink shadow-hard-sm" : "border-ink/20 hover:border-ink"
                )}
                aria-label={`Voir la photo ${index + 1}`}
              >
                <ProductImage src={image} alt="" category={product.category} sizes="80px" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ---------- Informations ---------- */}
      <div>
        <Badge tone="magenta">Collection {getCategoryLabel(product.category).toLowerCase()}</Badge>
        <h1 className="mt-3 text-4xl font-extrabold leading-tight sm:text-5xl">{product.name}</h1>
        <p className="mt-3 font-display text-3xl font-extrabold text-magenta">{formatPrice(product.priceCents)}</p>
        <p className="mt-4 text-lg leading-relaxed text-ink-soft">{product.shortDescription}</p>

        <div className="mt-8 flex flex-col gap-7">
          {product.colors.length > 0 && (
            <div>
              <p className="mb-3 font-display font-bold">Couleur : <span className="font-normal">{colorName}</span></p>
              <ColorPicker colors={product.colors} selectedName={colorName} isCustom={false} allowCustom={false} onSelect={setColorName} />
            </div>
          )}

          {product.sizes.length > 0 && (
            <div>
              <p className="mb-3 font-display font-bold">Taille</p>
              <SizePicker
                sizes={product.sizes}
                selected={size}
                invalid={Boolean(sizeError)}
                onSelect={(value) => {
                  setSize(value);
                  setSizeError("");
                }}
              />
              {sizeError && <p role="alert" className="mt-2 text-sm font-medium text-danger">{sizeError}</p>}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4">
            <QuantityStepper value={quantity} onChange={setQuantity} />
            <Button variant="accent" size="lg" onClick={handleAddToCart} className="flex-1">
              <ShoppingBag aria-hidden="true" />
              Ajouter au panier · {formatPrice(product.priceCents * quantity)}
            </Button>
          </div>

          <p className="flex items-center gap-2 text-sm text-muted">
            <Truck className="size-4" aria-hidden="true" />
            Livraison partout au Canada ou ramassage gratuit à l&apos;atelier.
          </p>
        </div>

        <Accordion items={getDetailItems(product)} defaultOpenId="description" className="mt-10" />
      </div>
    </div>
  );
}
