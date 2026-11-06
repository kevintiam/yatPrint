"use client";

/**
 * Téléversement d'une photo par l'admin (produit ou galerie) :
 * POST /api/admin/uploads  (champ « file » + champ « purpose »)
 *
 * Renvoie l'adresse publique de la photo (/api/files/<id>),
 * à enregistrer ensuite dans le produit ou la galerie.
 */
import { useState } from "react";
import { axiosClient } from "@/lib/api/axiosClient";
import { getApiErrorMessage } from "@/lib/api/apiErrors";
import { getFileError } from "@/lib/validation/upload";
import { IMAGE_UPLOAD_RULES } from "@/config/catalog";

/**
 * @param {"product"|"gallery"} purpose - à quoi servira la photo
 */
export function useAdminImageUpload(purpose) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  /**
   * @param {File} file
   * @returns {Promise<string|null>} l'adresse de la photo, ou null en cas d'erreur
   */
  async function uploadImage(file) {
    const fileError = getFileError(file, IMAGE_UPLOAD_RULES);
    if (fileError) {
      setError(fileError);
      return null;
    }

    setError("");
    setIsUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("purpose", purpose);

    try {
      const response = await axiosClient.post("/admin/uploads", formData, {
        onUploadProgress(event) {
          if (event.total) setProgress(Math.round((event.loaded / event.total) * 100));
        },
      });
      return response.data.url;
    } catch (uploadError) {
      setError(getApiErrorMessage(uploadError));
      return null;
    } finally {
      setIsUploading(false);
    }
  }

  return { uploadImage, isUploading, progress, error };
}
