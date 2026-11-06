/**
 * Illustration dessinée d'un article, utilisée quand on n'a pas encore
 * de photo (ex. tasse, cadre). La couleur de l'article est personnalisable.
 *
 * Exemple : <ProductIllustration category="mug" color="#ffffff" />
 */

/** Dessins SVG simples, un par catégorie (zone de 200 × 240). */
function Shape({ category, color }) {
  const stroke = { stroke: "#141414", strokeWidth: 4, strokeLinejoin: "round" };

  switch (category) {
    case "mug":
      return (
        <g {...stroke}>
          <path d="M150 95c28 0 34 50 0 56" fill="none" strokeWidth="12" stroke="#141414" />
          <path d="M150 95c28 0 34 50 0 56" fill="none" strokeWidth="5" stroke={color} />
          <rect x="45" y="70" width="110" height="120" rx="14" fill={color} />
          <ellipse cx="100" cy="70" rx="55" ry="10" fill="#e2d8c8" />
        </g>
      );
    case "frame":
      return (
        <g {...stroke}>
          <rect x="35" y="45" width="130" height="160" rx="6" fill={color} />
          <rect x="55" y="65" width="90" height="120" rx="2" fill="#fffdf8" />
          <circle cx="85" cy="105" r="10" fill="#ffc21a" stroke="none" />
          <path d="M60 180l30-35 20 22 15-15 20 28z" fill="#00a3e0" stroke="none" />
        </g>
      );
    case "engraving":
      return (
        <g {...stroke}>
          <rect x="40" y="40" width="120" height="170" rx="16" fill={color} />
          <circle cx="100" cy="58" r="7" fill="#fffdf8" />
          <path d="M65 120h70M75 140h50" stroke="#6b4a2b" strokeWidth="5" strokeLinecap="round" />
        </g>
      );
    case "tote":
      return (
        <g {...stroke}>
          <path d="M75 85c0-40 50-40 50 0" fill="none" />
          <path d="M45 85h110l-8 125H53z" fill={color} />
        </g>
      );
    case "hoodie":
      return (
        <g {...stroke}>
          <path d="M70 55c5-25 55-25 60 0l40 20 10 80-28 6-4 70H52l-4-70-28-6 10-80z" fill={color} />
          <path d="M80 60c5 22 35 22 40 0" fill="none" />
          <path d="M75 175h50" fill="none" />
        </g>
      );
    default: // t-shirt
      return (
        <g {...stroke}>
          <path d="M70 45c10 18 50 18 60 0l45 22-15 38-20-8v108H60V97l-20 8-15-38z" fill={color} />
        </g>
      );
  }
}

/**
 * @param {object} props
 * @param {string} props.category - clé de catégorie (tshirt, hoodie, mug, frame, engraving, tote)
 * @param {string} [props.color] - couleur de l'article (#RRGGBB)
 * @param {string} [props.label] - texte alternatif
 */
export function ProductIllustration({ category, color = "#fffdf8", label, className }) {
  return (
    <svg viewBox="0 0 200 240" className={className} role="img" aria-label={label || "Illustration de l'article"}>
      <Shape category={category} color={color} />
    </svg>
  );
}
