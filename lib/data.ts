export type ShoeDetails = {
    id: string;
    name: string;
    tagline: string;
    description: string;
    specs: string[];
    price: string;
    priceValue: number;
    originalPrice?: string;
    originalPriceValue?: number;
    image: string;
    availableSizes: number[];
    allSizes: number[];
    isAvailable?: boolean;
};

export const SIZES = [4, 5, 6, 7, 8, 9, 10, 11];

export const SHOES: ShoeDetails[] = [
    {
        id: "blue-bird",
        name: 'Schault "BlueBird"',
        tagline: "Colorway: Arctic Blue & Navy",
        description: "Seize the Morning. The BlueBird is a philosophy in motion. Designed for those who navigate the urban landscape with intention, this silhouette balances cool, icy tones with deep naval stability.",
        specs: [
            "Signature Sunburst: Intricate, textless debossed sun detail on the lateral panel.",
            "Premium Texture: Light blue pebble-grain leather, velvety grey suede, and breathable white mesh.",
            "Triple-Density Sole: Engineered with an EVA, TPR, and Rubber hybrid black outsole for high-performance traction."
        ],
        price: "₹2,999",
        priceValue: 2999,
        originalPrice: "₹3,999",
        originalPriceValue: 3999,
        image: "/images/shoes/bluewhite.jpg",
        allSizes: SIZES,
        availableSizes: [],
        isAvailable: false,
    },
    {
        id: "wild-root",
        name: 'Schault "WildRoot"',
        tagline: "Colorway: Mustard Yellow, Forest Green & Chocolate Brown",
        description: "The Bold Navigator. This edition is for the visionaries. By balancing the warmth of mustard yellow with the stability of forest green and chocolate brown suede, the WildRoot edition is a high-contrast statement piece that refuses to be ignored.",
        specs: [
            "Tri-Tone Mastery: Mustard PU leather, Forest Green heel counters, and Chocolate Brown suede toe caps.",
            "Tactile Depth: The mix of smooth leather and velvety suede provides a rich, premium hand-feel.",
            "Skinfit Interior: Lined with a Lycra-Nylon blend to prevent friction."
        ],
        price: "₹2,999",
        priceValue: 2999,
        originalPrice: "₹3,999",
        originalPriceValue: 3999,
        image: "/images/shoes/yellow.jpg",
        allSizes: SIZES,
        availableSizes: [],
        isAvailable: false,
    },
    {
        id: "red-eye",
        name: 'Schault "RedEye"',
        tagline: "Colorway: Grey Mesh, Rust Suede & Charcoal Black",
        description: "Industrial Heat. The RedEye edition is designed for the city's concrete canyons. Cool, breathable grey mesh panels are ignited by deep rust-colored suede overlays.",
        specs: [
            "Breathable Core: High-density performance mesh side panels for superior airflow.",
            "Rustic Accents: Deep rust-tone suede on the toe and heel adds a rugged touch.",
            "Stealth Profile: An all-black matte midsole and outsole provides a grounded, aggressive look."
        ],
        price: "₹2,999",
        priceValue: 2999,
        originalPrice: "₹3,999",
        originalPriceValue: 3999,
        image: "/images/shoes/brownblack.jpg",
        allSizes: SIZES,
        availableSizes: [8],
    },
    {
        id: "cd-daybreak",
        name: 'Schault "CD" DayBreak',
        tagline: "Colorway: Arctic White, Cream Suede & Mustard Stripe",
        description: "The Minimalist’s Mantra. A clean, iconic DayBreak piece. Featuring a crisp white upper punctuated by a striking mustard-yellow racing stripe and 'CD' branded navy accents, this pair represents the intersection of athletic legacy and aspirational design.",
        specs: [
            "Heritage Branding: Unique 'CD' (Carpe Diem) embroidery on the lateral heel.",
            "Mustard Energy: A sharp, horizontal leather stripe in mustard yellow provides a high-energy focal point.",
            "Hidden Detail: 'CARPE DIEM' subtly engraved directly into the rubber sidewall."
        ],
        price: "₹2,999",
        priceValue: 2999,
        originalPrice: "₹3,999",
        originalPriceValue: 3999,
        image: "/images/shoes/whitefull.jpg",
        allSizes: SIZES,
        availableSizes: [8],
    },
    {
        id: "day-dream",
        name: 'Schault "DayDream"',
        tagline: "Colorway: Ice White Mesh, Dove Grey Suede & Midnight Navy",
        description: "Lightness of Being. Designed for those who value speed and breathability. The DayDream swaps heavy leather for a lightweight, airy mesh frame, reinforced by midnight navy leather.",
        specs: [
            "Air-Flow Architecture: Large mesh windows across the midfoot and tongue ensure maximum ventilation.",
            "Midnight Contrast: Deep Navy Blue leather heel counter adds a touch of formal luxury.",
            "Tonal Versatility: The Dove Grey suede toe cap ensures this pair transitions perfectly from casual denim."
        ],
        price: "₹2,999",
        priceValue: 2999,
        originalPrice: "₹3,999",
        originalPriceValue: 3999,
        image: "/images/shoes/darkblue.jpg",
        allSizes: SIZES,
        availableSizes: [8],
    },
    {
        id: "sun-daze",
        name: 'Schault "SunDaze"',
        tagline: "Colorway: Golden Sun, Warm Earth & Cream",
        description: "Radiant Horizon. The SunDaze edition brings warm, vibrant energy to every step. Crafted with premium paneling and breathable mesh, this silhouette captures the essence of sun-drenched days.",
        specs: [
            "Signature Sunburst: Intricate debossed sun detail on the lateral panel.",
            "Vibrant Palette: Premium suede and smooth leather overlays in rich golden tones.",
            "Triple-Density Sole: High-performance traction hybrid sole for all-day comfort."
        ],
        price: "₹2,999",
        priceValue: 2999,
        originalPrice: "₹3,999",
        originalPriceValue: 3999,
        image: "/images/shoes/SunDaze/1.png",
        allSizes: SIZES,
        availableSizes: [8],
        isAvailable: true,
    },
];
