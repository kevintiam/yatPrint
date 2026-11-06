"use client";

/**
 * Hook de téléversement du design d'un client (configurateur).
 *
 * - Vérifie le fichier dans le navigateur (type, taille) avant l'envoi.
 * - Envoie le fichier à POST /api/uploads avec une barre de progression.
 * - Crée un aperçu local de l'image pour l'afficher sur l'article.
 */
import { useEffect, useState } from "react";
import { axiosClient } from "@/lib/api/axiosClient";
import { getApiErrorMessage } from "@/lib/api/apiErrors";
import { getFileError } from "@/lib/validation/upload";
import { DESIGN_UPLOAD_RULES } from "@/config/catalog";

export function useDesignUpload() {
  const [uploadedFile, setUploadedFile] = useState(null); // { id, name, size, type }
  const [previewUrl, setPreviewUrl] = useState("");
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  // Libère la mémoire de l'aperçu quand il change ou quand le composant disparaît
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  /**
   * Envoie un fichier choisi par le client.
   * @param {File} file
   * @returns {Promise<boolean>} true si le téléversement a réussi
   */
  async function upload(file) {
    const fileError = getFileError(file, DESIGN_UPLOAD_RULES);
    if (fileError) {
      setError(fileError);
      return false;
    }

    setError("");
    setIsUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axiosClient.post("/uploads", formData, {
        // Axios appelle cette fonction pendant l'envoi : on calcule le pourcentage
        onUploadProgress(event) {
          if (event.total) setProgress(Math.round((event.loaded / event.total) * 100));
        },
      });

      setUploadedFile(response.data.file);
      // Aperçu seulement pour les images (pas pour un PDF)
      setPreviewUrl(file.type.startsWith("image/") ? URL.createObjectURL(file) : "");
      return true;
    } catch (uploadError) {
      setError(getApiErrorMessage(uploadError));
      return false;
    } finally {
      setIsUploading(false);
    }
  }

  /** Retire le design choisi. */
  function clear() {
    setUploadedFile(null);
    setPreviewUrl("");
    setProgress(0);
    setError("");
  }

  return { upload, clear, uploadedFile, previewUrl, progress, isUploading, error };
}
