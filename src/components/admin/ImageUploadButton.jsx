"use client";

/**
 * Bouton « Ajouter une photo » de l'admin : ouvre le sélecteur de fichier,
 * téléverse l'image (hook useAdminImageUpload) puis renvoie son adresse.
 */
import { useRef } from "react";
import { ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/feedback";
import { useAdminImageUpload } from "@/hooks/admin/useAdminImageUpload";
import { IMAGE_UPLOAD_RULES } from "@/config/catalog";

/**
 * @param {object} props
 * @param {"product"|"gallery"} props.purpose
 * @param {(url: string) => void} props.onUploaded - reçoit l'adresse de la photo
 * @param {string} [props.label]
 * @param {"sm"|"md"} [props.size]
 */
export function ImageUploadButton({ purpose, onUploaded, label = "Ajouter une photo", size = "sm" }) {
  const inputRef = useRef(null);
  const { uploadImage, isUploading, progress, error } = useAdminImageUpload(purpose);

  async function handleChange(event) {
    const file = event.target.files && event.target.files[0];
    event.target.value = ""; // permet de rechoisir le même fichier
    if (!file) return;

    const url = await uploadImage(file);
    if (url) onUploaded(url);
  }

  return (
    <div className="flex flex-col gap-1">
      <Button variant="outline" size={size} onClick={() => inputRef.current?.click()} disabled={isUploading}>
        {isUploading ? <Spinner label="Envoi" /> : <ImagePlus aria-hidden="true" />}
        {isUploading ? `Envoi… ${progress} %` : label}
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept={IMAGE_UPLOAD_RULES.acceptedTypes.join(",")}
        onChange={handleChange}
        className="sr-only"
        tabIndex={-1}
        aria-label={label}
      />
      {error && <p role="alert" className="text-xs font-medium text-danger">{error}</p>}
    </div>
  );
}
