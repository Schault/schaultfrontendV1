export type ShoeDetails = {
    id: string;
    name: string;
    tagline: string;
    description: string;
    specs: string[];
    price: string;
    priceValue: number;
    image: string;
    availableSizes: number[];
    allSizes: number[];
};

export const SIZES = [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12];

export const SHOES: ShoeDetails[] = [
    {
        id: "arctic-dawn",
        name: 'Schault "Arctic Dawn"',
        tagline: "Colorway: Arctic Blue & Navy",
        description: "Seize the Morning. The Arctic Dawn is a philosophy in motion. Designed for those who navigate the urban landscape with intention, this silhouette balances cool, icy tones with deep naval stability.",
        specs: [
            "Signature Sunburst: Intricate, textless debossed sun detail on the lateral panel.",
            "Premium Texture: Light blue pebble-grain leather, velvety grey suede, and breathable white mesh.",
            "Triple-Density Sole: Engineered with an EVA, TPR, and Rubber hybrid black outsole for high-performance traction."
        ],
        price: "₹1,990",
        priceValue: 1990,
        image: "/images/shoes/bluewhite.jpg",
        allSizes: SIZES,
        availableSizes: [9],
    },
    {
        id: "ochre-earth",
        name: 'Schault "Ochre & Earth"',
        tagline: "Colorway: Mustard Yellow, Forest Green & Chocolate Brown",
        description: "The Bold Navigator. This edition is for the visionaries. By balancing the warmth of mustard yellow with the stability of forest green and chocolate brown suede, the Ochre & Earth edition is a high-contrast statement piece that refuses to be ignored.",
        specs: [
            "Tri-Tone Mastery: Mustard PU leather, Forest Green heel counters, and Chocolate Brown suede toe caps.",
            "Tactile Depth: The mix of smooth leather and velvety suede provides a rich, premium hand-feel.",
            "Skinfit Interior: Lined with a Lycra-Nylon blend to prevent friction."
        ],
        price: "₹1,990",
        priceValue: 1990,
        image: "/images/shoes/yellow.jpg",
        allSizes: SIZES,
        availableSizes: [9],
    },
    {
        id: "rust-ash",
        name: 'Schault "Rust & Ash"',
        tagline: "Colorway: Grey Mesh, Rust Suede & Charcoal Black",
        description: "Industrial Heat. The Rust & Ash edition is designed for the city's concrete canyons. Cool, breathable grey mesh panels are ignited by deep rust-colored suede overlays.",
        specs: [
            "Breathable Core: High-density performance mesh side panels for superior airflow.",
            "Rustic Accents: Deep rust-tone suede on the toe and heel adds a rugged touch.",
            "Stealth Profile: An all-black matte midsole and outsole provides a grounded, aggressive look."
        ],
        price: "₹1,990",
        priceValue: 1990,
        image: "/images/shoes/brownblack.jpg",
        allSizes: SIZES,
        availableSizes: [9],
    },
    {
        id: "cd-heritage",
        name: 'Schault "CD" Heritage',
        tagline: "Colorway: Arctic White, Cream Suede & Mustard Stripe",
        description: "The Minimalist’s Mantra. A clean, iconic heritage piece. Featuring a crisp white upper punctuated by a striking mustard-yellow racing stripe and 'CD' branded navy accents, this pair represents the intersection of athletic legacy and aspirational design.",
        specs: [
            "Heritage Branding: Unique 'CD' (Carpe Diem) embroidery on the lateral heel.",
            "Mustard Energy: A sharp, horizontal leather stripe in mustard yellow provides a high-energy focal point.",
            "Hidden Detail: 'CARPE DIEM' subtly engraved directly into the rubber sidewall."
        ],
        price: "₹1,990",
        priceValue: 1990,
        image: "/images/shoes/whitefull.jpg",
        allSizes: SIZES,
        availableSizes: [9],
    },
    {
        id: "navy-frost",
        name: 'Schault "Navy Frost"',
        tagline: "Colorway: Ice White Mesh, Dove Grey Suede & Midnight Navy",
        description: "Lightness of Being. Designed for those who value speed and breathability. The Navy Frost swaps heavy leather for a lightweight, airy mesh frame, reinforced by midnight navy leather.",
        specs: [
            "Air-Flow Architecture: Large mesh windows across the midfoot and tongue ensure maximum ventilation.",
            "Midnight Contrast: Deep Navy Blue leather heel counter adds a touch of formal luxury.",
            "Tonal Versatility: The Dove Grey suede toe cap ensures this pair transitions perfectly from casual denim."
        ],
        price: "₹1,990",
        priceValue: 1990,
        image: "/images/shoes/darkblue.jpg",
        allSizes: SIZES,
        availableSizes: [9],
    },
];
