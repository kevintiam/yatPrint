"use client";

/**
 * Animations d'apparition au défilement (bibliothèque Motion).
 *
 * - <Reveal>       : un bloc qui apparaît en glissant vers le haut quand il entre à l'écran.
 * - <StaggerGroup> + <StaggerItem> : une liste dont les éléments apparaissent
 *   l'un après l'autre (effet « cascade »), ex. une grille de produits.
 *
 * Les animations ne se jouent qu'une fois (viewport once) et sont désactivées
 * si l'utilisateur a demandé moins d'animations (voir MotionProvider).
 */
import { motion } from "motion/react";

/**
 * @param {object} props
 * @param {number} [props.delay] - délai en secondes
 * @param {number} [props.y] - distance de départ en pixels (vers le bas)
 * @param {string} [props.as] - balise HTML à utiliser ("div", "section", "li"...)
 */
export function Reveal({ children, delay = 0, y = 28, as = "div", className }) {
  const MotionTag = motion[as] || motion.div;

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
}

// « Recette » de l'animation en cascade : le parent déclenche ses enfants un par un
const groupVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

/** Conteneur d'une liste animée en cascade. */
export function StaggerGroup({ children, className, as = "div" }) {
  const MotionTag = motion[as] || motion.div;
  return (
    <MotionTag
      className={className}
      variants={groupVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
    >
      {children}
    </MotionTag>
  );
}

/** Élément d'une liste animée en cascade (à placer dans un StaggerGroup). */
export function StaggerItem({ children, className, as = "div" }) {
  const MotionTag = motion[as] || motion.div;
  return (
    <MotionTag className={className} variants={itemVariants}>
      {children}
    </MotionTag>
  );
}
