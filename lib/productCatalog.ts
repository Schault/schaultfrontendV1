// Display-only assets (images, colors, category) keyed by DB product slug.
// Price and stock are NOT here — those come from the DB (products.base_price,
// product_variants.stock_quantity) so an order actually decrements real inventory.
export interface CatalogEntry {
  slug: string;
  originalPrice?: number;
  image: string;
  gallery: string[];
  category: string;
  colors: { name: string; hex: string }[];
}

export const PRODUCT_CATALOG: Record<string, CatalogEntry> = {
  bluebird: {
    slug: "bluebird",
    originalPrice: 3999,
    image: "/images/shoes/BlueBird/1.png",
    gallery: [
      "/images/shoes/BlueBird/1.png",
      "/images/shoes/BlueBird/2.png",
      "/images/shoes/BlueBird/3.png",
      "/images/shoes/BlueBird/4.png",
    ],
    category: "Shoe",
    colors: [{ name: "Blue / White", hex: "#4A90E2" }],
  },
  "blue-bird": {
    slug: "blue-bird",
    originalPrice: 3999,
    image: "/images/shoes/BlueBird/1.png",
    gallery: [
      "/images/shoes/BlueBird/1.png",
      "/images/shoes/BlueBird/2.png",
      "/images/shoes/BlueBird/3.png",
      "/images/shoes/BlueBird/4.png",
    ],
    category: "Shoe",
    colors: [{ name: "Blue / White", hex: "#4A90E2" }],
  },
  redeye: {
    slug: "redeye",
    originalPrice: 3999,
    image: "/images/shoes/RedEye/1.png",
    gallery: [
      "/images/shoes/RedEye/1.png",
      "/images/shoes/RedEye/2.png",
      "/images/shoes/RedEye/3.png",
      "/images/shoes/RedEye/4.png",
    ],
    category: "Shoe",
    colors: [{ name: "Brown / Black", hex: "#8B4513" }],
  },
  "red-eye": {
    slug: "red-eye",
    originalPrice: 3999,
    image: "/images/shoes/RedEye/1.png",
    gallery: [
      "/images/shoes/RedEye/1.png",
      "/images/shoes/RedEye/2.png",
      "/images/shoes/RedEye/3.png",
      "/images/shoes/RedEye/4.png",
    ],
    category: "Shoe",
    colors: [{ name: "Brown / Black", hex: "#8B4513" }],
  },
  daydream: {
    slug: "daydream",
    originalPrice: 3999,
    image: "/images/shoes/DayDream/1.png",
    gallery: [
      "/images/shoes/DayDream/1.png",
      "/images/shoes/DayDream/2.png",
      "/images/shoes/DayDream/3.png",
      "/images/shoes/DayDream/4.png",
    ],
    category: "Shoe",
    colors: [{ name: "Dark Blue", hex: "#00008B" }],
  },
  "day-dream": {
    slug: "day-dream",
    originalPrice: 3999,
    image: "/images/shoes/DayDream/1.png",
    gallery: [
      "/images/shoes/DayDream/1.png",
      "/images/shoes/DayDream/2.png",
      "/images/shoes/DayDream/3.png",
      "/images/shoes/DayDream/4.png",
    ],
    category: "Shoe",
    colors: [{ name: "Dark Blue", hex: "#00008B" }],
  },
  daybreak: {
    slug: "daybreak",
    originalPrice: 3999,
    image: "/images/shoes/DayBreak/1.png",
    gallery: [
      "/images/shoes/DayBreak/1.png",
      "/images/shoes/DayBreak/2.png",
      "/images/shoes/DayBreak/3.png",
      "/images/shoes/DayBreak/4.png",
    ],
    category: "Shoe",
    colors: [{ name: "White", hex: "#FFFFFF" }],
  },
  "day-break": {
    slug: "day-break",
    originalPrice: 3999,
    image: "/images/shoes/DayBreak/1.png",
    gallery: [
      "/images/shoes/DayBreak/1.png",
      "/images/shoes/DayBreak/2.png",
      "/images/shoes/DayBreak/3.png",
      "/images/shoes/DayBreak/4.png",
    ],
    category: "Shoe",
    colors: [{ name: "White", hex: "#FFFFFF" }],
  },
  "cd-daybreak": {
    slug: "cd-daybreak",
    originalPrice: 3999,
    image: "/images/shoes/DayBreak/1.png",
    gallery: [
      "/images/shoes/DayBreak/1.png",
      "/images/shoes/DayBreak/2.png",
      "/images/shoes/DayBreak/3.png",
      "/images/shoes/DayBreak/4.png",
    ],
    category: "Shoe",
    colors: [{ name: "White", hex: "#FFFFFF" }],
  },
  wildroot: {
    slug: "wildroot",
    originalPrice: 3999,
    image: "/images/shoes/WildRoot/1.png",
    gallery: [
      "/images/shoes/WildRoot/1.png",
      "/images/shoes/WildRoot/2.png",
      "/images/shoes/WildRoot/3.png",
      "/images/shoes/WildRoot/4.png",
    ],
    category: "Shoe",
    colors: [{ name: "Yellow", hex: "#FFD700" }],
  },
  "wild-root": {
    slug: "wild-root",
    originalPrice: 3999,
    image: "/images/shoes/WildRoot/1.png",
    gallery: [
      "/images/shoes/WildRoot/1.png",
      "/images/shoes/WildRoot/2.png",
      "/images/shoes/WildRoot/3.png",
      "/images/shoes/WildRoot/4.png",
    ],
    category: "Shoe",
    colors: [{ name: "Yellow", hex: "#FFD700" }],
  },
  sundaze: {
    slug: "sundaze",
    originalPrice: 3999,
    image: "/images/shoes/SunDaze/1.png",
    gallery: [
      "/images/shoes/SunDaze/1.png",
      "/images/shoes/SunDaze/2.png",
      "/images/shoes/SunDaze/3.png",
      "/images/shoes/SunDaze/4.png",
    ],
    category: "Shoe",
    colors: [{ name: "Sun Yellow", hex: "#E67E22" }],
  },
  "sun-daze": {
    slug: "sun-daze",
    originalPrice: 3999,
    image: "/images/shoes/SunDaze/1.png",
    gallery: [
      "/images/shoes/SunDaze/1.png",
      "/images/shoes/SunDaze/2.png",
      "/images/shoes/SunDaze/3.png",
      "/images/shoes/SunDaze/4.png",
    ],
    category: "Shoe",
    colors: [{ name: "Sun Yellow", hex: "#E67E22" }],
  },
};
