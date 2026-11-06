/**
 * Schémas des formulaires publics : devis entreprise, mentorat, contact
 * et suivi de commande.
 */
import { z } from "zod";
import {
  requiredText,
  optionalText,
  emailField,
  optionalEmailField,
  phoneField,
  optionalPhoneField,
  enumFromOptions,
} from "./common";
import {
  CONTACT_SUBJECTS,
  MENTORSHIP_FORMATS,
  MENTORSHIP_LEVELS,
  MENTORSHIP_TOPICS,
} from "@/config/options";

/** Formulaire de la page Entreprises (champs demandés : nom, prénom, téléphone, commentaire). */
export const quoteRequestSchema = z.object({
  firstName: requiredText("Le prénom", 60),
  lastName: requiredText("Le nom", 60),
  phone: phoneField,
  email: optionalEmailField,
  company: optionalText(120),
  comment: requiredText("Le commentaire", 2000),
});

/** Formulaire de réservation de mentorat. */
export const mentorshipRequestSchema = z.object({
  firstName: requiredText("Le prénom", 60),
  lastName: requiredText("Le nom", 60),
  email: emailField,
  phone: optionalPhoneField,
  topic: enumFromOptions(MENTORSHIP_TOPICS, "Choisissez un thème."),
  level: enumFromOptions(MENTORSHIP_LEVELS, "Choisissez votre niveau."),
  format: enumFromOptions(MENTORSHIP_FORMATS, "Choisissez un format."),
  preferredDates: requiredText("Vos disponibilités", 300),
  message: optionalText(2000),
});

/** Formulaire de contact. */
export const contactMessageSchema = z.object({
  name: requiredText("Le nom", 100),
  email: emailField,
  phone: optionalPhoneField,
  subject: enumFromOptions(CONTACT_SUBJECTS, "Choisissez un sujet."),
  message: requiredText("Le message", 3000),
});

/** Formulaire de suivi de commande : numéro + courriel utilisés pour la commande. */
export const orderTrackingSchema = z.object({
  orderNumber: requiredText("Le numéro de commande", 30).transform((value) => value.toUpperCase()),
  email: emailField,
});
