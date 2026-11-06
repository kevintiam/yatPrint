"use client";

/**
 * Réglage global des animations Motion.
 * reducedMotion="user" : si l'ordinateur ou le téléphone du visiteur demande
 * « moins d'animations » (accessibilité), les mouvements sont désactivés.
 */
import { MotionConfig } from "motion/react";

export function MotionProvider({ children }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
