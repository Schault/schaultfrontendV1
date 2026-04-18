import { Product } from "@/components/shop/ProductCard";

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Arctic Dawn",
    price: 2499,
    originalPrice: 4000,
    rating: 4.8,
    image: "/images/shoes/Arctic Dawn/1.png",
    gallery: [
      "/images/shoes/Arctic Dawn/1.png",
      "/images/shoes/Arctic Dawn/2.png",
      "/images/shoes/Arctic Dawn/3.png",
      "/images/shoes/Arctic Dawn/4.png"
    ],
    category: "Shoe",
    colors: [
      { name: "Blue / White", hex: "#4A90E2" }
    ],
    sizes: ["7", "8", "9", "10", "11"]
  },
  {
    id: "2",
    name: "Rust & Ash",
    price: 2499,
    originalPrice: 4000,
    rating: 4.5,
    image: "/images/shoes/Rust & Ash/1.png",
    gallery: [
      "/images/shoes/Rust & Ash/1.png",
      "/images/shoes/Rust & Ash/2.png",
      "/images/shoes/Rust & Ash/3.png",
      "/images/shoes/Rust & Ash/4.png"
    ],
    category: "Shoe",
    colors: [
      { name: "Brown / Black", hex: "#8B4513" }
    ],
    sizes: ["8", "9", "10", "11"]
  },
  {
    id: "3",
    name: "Navy Frost",
    price: 2499,
    originalPrice: 4000,
    rating: 4.7,
    image: "/images/shoes/Navy Frost/1.png",
    gallery: [
      "/images/shoes/Navy Frost/1.png",
      "/images/shoes/Navy Frost/2.png",
      "/images/shoes/Navy Frost/3.png",
      "/images/shoes/Navy Frost/4.png"
    ],
    category: "Shoe",
    colors: [
      { name: "Dark Blue", hex: "#00008B" }
    ],
    sizes: ["7", "8", "9", "10"]
  },
  {
    id: "4",
    name: "Heritage",
    price: 2499,
    originalPrice: 4000,
    rating: 4.9,
    image: "/images/shoes/Heritage/1.png",
    gallery: [
      "/images/shoes/Heritage/1.png",
      "/images/shoes/Heritage/2.png",
      "/images/shoes/Heritage/3.png",
      "/images/shoes/Heritage/4.png"
    ],
    category: "Shoe",
    colors: [
      { name: "White", hex: "#FFFFFF" }
    ],
    sizes: ["7", "8", "9", "10", "11"]
  },
  {
    id: "5",
    name: "Ochre & Earth",
    price: 2499,
    originalPrice: 4000,
    rating: 4.6,
    image: "/images/shoes/Ochre & Earth/1.png",
    gallery: [
      "/images/shoes/Ochre & Earth/1.png",
      "/images/shoes/Ochre & Earth/2.png",
      "/images/shoes/Ochre & Earth/3.png",
      "/images/shoes/Ochre & Earth/4.png"
    ],
    category: "Shoe",
    colors: [
      { name: "Yellow", hex: "#FFD700" }
    ],
    sizes: ["8", "9", "10"]
  }
];
