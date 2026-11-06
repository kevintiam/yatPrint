/**
 * Photos de départ de la galerie de réalisations (« npm run db:seed »).
 * Ensuite, Gessica ajoute, cache ou supprime des photos dans /admin/galerie.
 */
const GALLERY_ITEMS = [
  { title: "Planche « The Graceful Kitchen »", category: "engraving", imageUrl: "/images/customize/engraving-wood.webp" },
  { title: "Lampe acrylique « Grace »", category: "engraving", imageUrl: "/images/customize/engraving-acrylic.webp" },
  { title: "Hoodie « Endless Grace »", category: "textile", imageUrl: "/images/collection/hoodie-endless-grace.webp" },
  { title: "Gourde au prénom", category: "gift", imageUrl: "/images/gallery/tumbler-julia.webp" },
  { title: "Planche et cuillère gravées", category: "engraving", imageUrl: "/images/gallery/board-grace-grows.webp" },
  { title: "Tapis « Grace in Motion »", category: "accessory", imageUrl: "/images/gallery/mousepad-grace-in-motion.webp" },
  { title: "Carnet en cuir personnalisé", category: "gift", imageUrl: "/images/gallery/leather-journal.webp" },
  { title: "Porte-clés en cuir gravés", category: "accessory", imageUrl: "/images/gallery/keychains-leather.webp" },
  { title: "T-shirt « Grace Looks Good »", category: "textile", imageUrl: "/images/collection/tshirt-grace-looks-good.webp" },
  { title: "Porte-clés « Still Becoming »", category: "accessory", imageUrl: "/images/gallery/keychain-modern.webp" },
  { title: "Hoodie « Faith for the In-Between »", category: "textile", imageUrl: "/images/collection/hoodie-faith-in-between.webp" },
  { title: "Porte-clés en bois", category: "accessory", imageUrl: "/images/gallery/keychain-premium.webp" },
  { title: "Tapis « Made for Ordinary Days »", category: "accessory", imageUrl: "/images/gallery/mousepad-ordinary-days.webp" },
  { title: "Porte-clés rose gravé", category: "accessory", imageUrl: "/images/gallery/keychain-creative.webp" },
  { title: "Tapis « Still Becoming »", category: "accessory", imageUrl: "/images/gallery/mousepad-still-becoming.webp" },
  { title: "Tasse « Endless Grace »", category: "gift", imageUrl: "/images/collection/mug-endless-grace.webp" },
];

/**
 * Liste finale avec l'ordre d'affichage.
 * @returns {object[]}
 */
export function getSeedGalleryItems() {
  const items = [];
  for (let index = 0; index < GALLERY_ITEMS.length; index += 1) {
    items.push({ ...GALLERY_ITEMS[index], sortOrder: index + 1, isVisible: true });
  }
  return items;
}
