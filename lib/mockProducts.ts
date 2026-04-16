import { Product } from "@/components/shop/ProductCard";

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "MOMENT 1",
    price: 2500,
    originalPrice: 4000,
    rating: 4.8,
    image: "/images/shoes/bluewhite.jpg",
    category: "Shoes & Bags",
    colors: [
      { name: "Blue / White", hex: "#4A90E2" }
    ],
    sizes: ["7", "8", "9", "10", "11"]
  },
  {
    id: "2",
    name: "MOMENT 2",
    price: 2500,
    originalPrice: 4000,
    rating: 4.5,
    image: "/images/shoes/brownblack.jpg",
    category: "Shoes & Bags",
    colors: [
      { name: "Brown / Black", hex: "#8B4513" }
    ],
    sizes: ["8", "9", "10", "11"]
  },
  {
    id: "3",
    name: "MOMENT 3",
    price: 2500,
    originalPrice: 4000,
    rating: 4.7,
    image: "/images/shoes/darkblue.jpg",
    category: "Shoes & Bags",
    colors: [
      { name: "Dark Blue", hex: "#00008B" }
    ],
    sizes: ["7", "8", "9", "10"]
  },
  {
    id: "4",
    name: "MOMENT 4",
    price: 2500,
    originalPrice: 4000,
    rating: 4.9,
    image: "/images/shoes/whitefull.jpg",
    category: "Shoes & Bags",
    colors: [
      { name: "White", hex: "#FFFFFF" }
    ],
    sizes: ["7", "8", "9", "10", "11"]
  },
  {
    id: "5",
    name: "MOMENT 5",
    price: 2500,
    originalPrice: 4000,
    rating: 4.6,
    image: "/images/shoes/yellow.jpg",
    category: "Shoes & Bags",
    colors: [
      { name: "Yellow", hex: "#FFD700" }
    ],
    sizes: ["8", "9", "10"]
  }
];
