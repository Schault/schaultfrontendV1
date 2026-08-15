import { Product } from "@/components/shop/ProductCard";

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "BlueBird",
    price: 2999,
    originalPrice: 3999,
    image: "/images/shoes/BlueBird/1.png",
    gallery: [
      "/images/shoes/BlueBird/1.png",
      "/images/shoes/BlueBird/2.png",
      "/images/shoes/BlueBird/3.png",
      "/images/shoes/BlueBird/4.png"
    ],
    category: "Shoe",
    colors: [
      { name: "Blue / White", hex: "#4A90E2" }
    ],
    sizes: ["4", "5", "6", "7", "8", "9", "10", "11"],
    availableSizes: [],
    isAvailable: false
  },
  {
    id: "2",
    name: "RedEye",
    price: 2999,
    originalPrice: 3999,
    image: "/images/shoes/RedEye/1.png",
    gallery: [
      "/images/shoes/RedEye/1.png",
      "/images/shoes/RedEye/2.png",
      "/images/shoes/RedEye/3.png",
      "/images/shoes/RedEye/4.png"
    ],
    category: "Shoe",
    colors: [
      { name: "Brown / Black", hex: "#8B4513" }
    ],
    sizes: ["4", "5", "6", "7", "8", "9", "10", "11"],
    availableSizes: ["8"],
    isAvailable: true
  },
  {
    id: "3",
    name: "DayDream",
    price: 2999,
    originalPrice: 3999,
    image: "/images/shoes/DayDream/1.png",
    gallery: [
      "/images/shoes/DayDream/1.png",
      "/images/shoes/DayDream/2.png",
      "/images/shoes/DayDream/3.png",
      "/images/shoes/DayDream/4.png"
    ],
    category: "Shoe",
    colors: [
      { name: "Dark Blue", hex: "#00008B" }
    ],
    sizes: ["4", "5", "6", "7", "8", "9", "10", "11"],
    availableSizes: ["8"],
    isAvailable: true
  },
  {
    id: "4",
    name: "DayBreak",
    price: 2999,
    originalPrice: 3999,
    image: "/images/shoes/DayBreak/1.png",
    gallery: [
      "/images/shoes/DayBreak/1.png",
      "/images/shoes/DayBreak/2.png",
      "/images/shoes/DayBreak/3.png",
      "/images/shoes/DayBreak/4.png"
    ],
    category: "Shoe",
    colors: [
      { name: "White", hex: "#FFFFFF" }
    ],
    sizes: ["4", "5", "6", "7", "8", "9", "10", "11"],
    availableSizes: ["8"],
    isAvailable: true
  },
  {
    id: "5",
    name: "WildRoot",
    price: 2999,
    originalPrice: 3999,
    image: "/images/shoes/WildRoot/1.png",
    gallery: [
      "/images/shoes/WildRoot/1.png",
      "/images/shoes/WildRoot/2.png",
      "/images/shoes/WildRoot/3.png",
      "/images/shoes/WildRoot/4.png"
    ],
    category: "Shoe",
    colors: [
      { name: "Yellow", hex: "#FFD700" }
    ],
    sizes: ["4", "5", "6", "7", "8", "9", "10", "11"],
    availableSizes: [],
    isAvailable: false
  },
  {
    id: "6",
    name: "SunDaze",
    price: 2999,
    originalPrice: 3999,
    image: "/images/shoes/SunDaze/1.png",
    gallery: [
      "/images/shoes/SunDaze/1.png",
      "/images/shoes/SunDaze/2.png",
      "/images/shoes/SunDaze/3.png",
      "/images/shoes/SunDaze/4.png"
    ],
    category: "Shoe",
    colors: [
      { name: "Sun Yellow", hex: "#E67E22" }
    ],
    sizes: ["4", "5", "6", "7", "8", "9", "10", "11"],
    availableSizes: ["8"],
    isAvailable: true
  }
];
