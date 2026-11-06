"use client";

/**
 * Petite pluie de confettis aux couleurs CMJN, pour fêter une commande.
 * Les positions sont calculées une seule fois, de façon déterministe
 * (pas de Math.random pendant l'affichage, comme l'exige React).
 */
import { motion } from "motion/react";

const COLORS = ["#00a3e0", "#e6007e", "#ffc21a", "#141414"];
const PIECE_COUNT = 36;

// Liste des confettis : position, couleur, délai et rotation « pseudo-aléatoires »
const PIECES = [];
for (let index = 0; index < PIECE_COUNT; index += 1) {
  PIECES.push({
    id: index,
    left: (index * 37) % 100, // répartis sur toute la largeur
    color: COLORS[index % COLORS.length],
    delay: (index % 9) * 0.12,
    rotate: (index * 47) % 360,
    isCircle: index % 3 === 0,
  });
}

export function Confetti() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] overflow-hidden" aria-hidden="true">
      {PIECES.map((piece) => (
        <motion.span
          key={piece.id}
          className={piece.isCircle ? "absolute size-3 rounded-full" : "absolute h-4 w-2 rounded-sm"}
          style={{ left: `${piece.left}%`, backgroundColor: piece.color }}
          initial={{ y: -40, opacity: 1, rotate: 0 }}
          animate={{ y: 420, opacity: 0, rotate: piece.rotate + 360 }}
          transition={{ duration: 2.6, delay: piece.delay, ease: "easeIn" }}
        />
      ))}
    </div>
  );
}
