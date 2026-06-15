// apps/storefront/lib/medusa/client.ts

export interface MedusaProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  thumbnail: string;
  images: string[];
  collection_id: string;
  brand: string;
  rating: number;
  reviewCount: number;
  variants: {
    id: string;
    title: string;
    inventory_quantity: number;
    prices: {
      amount: number;
      original_amount?: number;
      currency_code: string;
    }[];
    options?: {
      option_id: string;
      value: string;
    }[];
  }[];
  options: {
    id: string;
    title: string;
    values: string[];
  }[];
  specifications?: Record<string, string>;
  features?: string[];
}

export interface MedusaCollection {
  id: string;
  title: string;
  handle: string;
  thumbnail: string;
}

const mockCollections: MedusaCollection[] = [
  { id: "col-stationery", title: "Stationery", handle: "stationery", thumbnail: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&auto=format&fit=crop&q=80" },
  { id: "col-office", title: "Office Supplies", handle: "office-supplies", thumbnail: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&auto=format&fit=crop&q=80" },
  { id: "col-art", title: "Art Supplies", handle: "art-supplies", thumbnail: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&auto=format&fit=crop&q=80" },
  { id: "col-craft", title: "Craft Material", handle: "craft-material", thumbnail: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80" },
  { id: "col-bestsellers", title: "Best Sellers", handle: "best-sellers", thumbnail: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&auto=format&fit=crop&q=80" },
  { id: "col-luxe", title: "Birthday/Party Items", handle: "birthday-party-items", thumbnail: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&auto=format&fit=crop&q=80" },
];

const mockProducts: MedusaProduct[] = [
  {
    id: "prod-pilot-v5",
    title: "Pilot Hi-Tecpoint V5 Rollerball",
    handle: "pilot-v5-rollerball",
    brand: "Pilot",
    collection_id: "col-stationery",
    description: "The Pilot V5 Hi-Tecpoint is an iconic liquid ink rollerball pen with a precision 0.5mm needle point. It offers an incredibly smooth writing experience with a unique ink regulator for consistent flow.",
    thumbnail: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.6,
    reviewCount: 182,
    variants: [
      { id: "var-pilot-v5-blue", title: "Blue", inventory_quantity: 45, prices: [{ amount: 80, original_amount: 120, currency_code: "INR" }], options: [{ option_id: "opt-color", value: "Blue" }] },
      { id: "var-pilot-v5-black", title: "Black", inventory_quantity: 23, prices: [{ amount: 80, original_amount: 120, currency_code: "INR" }], options: [{ option_id: "opt-color", value: "Black" }] },
      { id: "var-pilot-v5-red", title: "Red", inventory_quantity: 12, prices: [{ amount: 80, original_amount: 120, currency_code: "INR" }], options: [{ option_id: "opt-color", value: "Red" }] },
    ],
    options: [
      { id: "opt-color", title: "Color", values: ["Blue", "Black", "Red"] }
    ],
    features: [
      "0.5mm stainless steel needle-point tip",
      "Pure liquid ink for smooth & bright coloring",
      "Ink controller mechanism for skipped-free writing",
      "Visible ink level window",
    ],
    specifications: {
      "Tip Size": "0.5 mm",
      "Ink Type": "Liquid Ink",
      "Refillable": "Yes",
      "Country of Origin": "Japan"
    }
  },
  {
    id: "prod-pilot-v7",
    title: "Pilot Hi-Tecpoint V7 Liquid Ink Pen",
    handle: "pilot-v7-liquid-ink",
    brand: "Pilot",
    collection_id: "col-stationery",
    description: "The Pilot V7 Hi-Tecpoint is a slightly bolder 0.7mm liquid ink pen, delivering rich and vibrant strokes. Trusted by professionals and students alike for everyday long writing sessions.",
    thumbnail: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.8,
    reviewCount: 242,
    variants: [
      { id: "var-pilot-v7-blue", title: "Blue", inventory_quantity: 50, prices: [{ amount: 90, original_amount: 130, currency_code: "INR" }], options: [{ option_id: "opt-color", value: "Blue" }] },
      { id: "var-pilot-v7-black", title: "Black", inventory_quantity: 40, prices: [{ amount: 90, original_amount: 130, currency_code: "INR" }], options: [{ option_id: "opt-color", value: "Black" }] },
    ],
    options: [
      { id: "opt-color", title: "Color", values: ["Blue", "Black"] }
    ],
    features: [
      "0.7mm medium needle point",
      "Hi-Tecpoint mechanism for skip-free output",
      "Advanced liquid ink regulator",
      "Comfortable grip zone"
    ],
    specifications: {
      "Tip Size": "0.7 mm",
      "Ink Type": "Liquid Ink",
      "Refillable": "Yes"
    }
  },
  {
    id: "prod-lamy-safari",
    title: "Lamy Safari Fountain Pen - Special Edition",
    handle: "lamy-safari-fountain-pen",
    brand: "Lamy",
    collection_id: "col-luxe",
    description: "The Lamy Safari is a timeless design icon. Crafted from sturdy ABS plastic with a flexible chrome clip and ergonomic grip, it is the perfect luxury writing instrument.",
    thumbnail: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 94,
    variants: [
      { id: "var-lamy-fine", title: "Fine Nib / Matte Black", inventory_quantity: 8, prices: [{ amount: 2499, original_amount: 3200, currency_code: "INR" }], options: [{ option_id: "opt-nib", value: "Fine" }, { option_id: "opt-color", value: "Matte Black" }] },
      { id: "var-lamy-medium", title: "Medium Nib / Matte Black", inventory_quantity: 5, prices: [{ amount: 2499, original_amount: 3200, currency_code: "INR" }], options: [{ option_id: "opt-nib", value: "Medium" }, { option_id: "opt-color", value: "Matte Black" }] },
      { id: "var-lamy-fine-yellow", title: "Fine Nib / Shiny Yellow", inventory_quantity: 4, prices: [{ amount: 2399, original_amount: 3000, currency_code: "INR" }], options: [{ option_id: "opt-nib", value: "Fine" }, { option_id: "opt-color", value: "Shiny Yellow" }] },
    ],
    options: [
      { id: "opt-nib", title: "Nib Size", values: ["Fine", "Medium"] },
      { id: "opt-color", title: "Color", values: ["Matte Black", "Shiny Yellow"] }
    ],
    features: [
      "Made of sturdy ABS plastic in unique matte finishes",
      "Ergonomic triangular grip section for tireless writing",
      "Polished steel nib for premium glide",
      "Large metal clip for pocket attachment"
    ],
    specifications: {
      "Body Material": "ABS Plastic",
      "Nib Material": "Steel",
      "Weight": "15g",
      "Country of Origin": "Germany"
    }
  },
  {
    id: "prod-classmate-notebook",
    title: "Classmate Premium Hard Cover Notebook",
    handle: "classmate-premium-notebook",
    brand: "Classmate",
    collection_id: "col-office",
    description: "Classmate premium notebooks feature ultra-white pages with accurate margin lines, packed in an extremely durable hard cover for durability throughout the year.",
    thumbnail: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.4,
    reviewCount: 312,
    variants: [
      { id: "var-classmate-200", title: "200 Pages", inventory_quantity: 120, prices: [{ amount: 120, original_amount: 150, currency_code: "INR" }], options: [{ option_id: "opt-pages", value: "200 Pages" }] },
      { id: "var-classmate-300", title: "300 Pages", inventory_quantity: 80, prices: [{ amount: 160, original_amount: 200, currency_code: "INR" }], options: [{ option_id: "opt-pages", value: "300 Pages" }] },
    ],
    options: [
      { id: "opt-pages", title: "Page Count", values: ["200 Pages", "300 Pages"] }
    ],
    features: [
      "70 GSM premium chlorine-free paper",
      "Acid-free paper pages that do not yellowish over time",
      "Includes general info & puzzles inside cover",
      "Eco-friendly paper sourced from sustainable wood plantations"
    ],
    specifications: {
      "Paper Weight": "70 GSM",
      "Binding": "Thread Bound / Hardback",
      "Rulings": "Single Ruled"
    }
  },
  {
    id: "prod-tombow-dual",
    title: "Tombow Dual Brush Pen Set - Pastel Palette",
    handle: "tombow-dual-brush-pastel",
    brand: "Tombow",
    collection_id: "col-art",
    description: "The world-famous Tombow Dual Brush Pens feature a flexible brush tip on one end and a fine bullet tip on the other. Ideal for hand lettering, coloring, fine art, and bullet journaling.",
    thumbnail: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 142,
    variants: [
      { id: "var-tombow-10", title: "10 Color Set", inventory_quantity: 15, prices: [{ amount: 1999, original_amount: 2500, currency_code: "INR" }], options: [{ option_id: "opt-size", value: "10-Pack" }] },
    ],
    options: [
      { id: "opt-size", title: "Set Size", values: ["10-Pack"] }
    ],
    features: [
      "Flexible nylon fiber brush tip for sweeping strokes",
      "Fine 0.8mm bullet tip for precise borders & lines",
      "Water-based blendable ink is odorless & non-toxic",
      "Includes colorless blender pen to soften & blend colors"
    ],
    specifications: {
      "Palette": "Pastel Edition",
      "Ink Base": "Water-based",
      "Tips": "Dual (Brush + Bullet)"
    }
  },
  {
    id: "prod-apsara-pencils",
    title: "Apsara Platinum Extra Dark Pencils (Pack of 10)",
    handle: "apsara-platinum-pencils",
    brand: "Apsara",
    collection_id: "col-stationery",
    description: "Apsara Platinum Pencils are crafted from high-quality wood, housing a dark graphite core. Ideal for school children and technical sketchers seeking dark lines.",
    thumbnail: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.5,
    reviewCount: 410,
    variants: [
      { id: "var-apsara-10", title: "Pack of 10", inventory_quantity: 350, prices: [{ amount: 60, original_amount: 80, currency_code: "INR" }], options: [{ option_id: "opt-pack", value: "10-Pack" }] }
    ],
    options: [
      { id: "opt-pack", title: "Pack Size", values: ["10-Pack"] }
    ],
    features: [
      "Premium quality wood for easy sharpening",
      "Extra dark lead for bold writing and sketching",
      "Resilient core lead prevents breakage while sharpening",
      "Comes with eraser and sharpener included"
    ],
    specifications: {
      "Lead Grade": "2B",
      "Wood Type": "Cedar wood",
      "Core Color": "Black"
    }
  },
  {
    id: "prod-muji-gel",
    title: "Muji Gel Ink Cap Pen 0.5mm",
    handle: "muji-gel-cap-05",
    brand: "Muji",
    collection_id: "col-stationery",
    description: "Minimalist Muji Gel Pens are acclaimed worldwide for their ultra-clean look and reliable smooth ink output. Features a secure click cap and frosted transparent body.",
    thumbnail: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.7,
    reviewCount: 220,
    variants: [
      { id: "var-muji-blue", title: "Blue", inventory_quantity: 80, prices: [{ amount: 150, original_amount: 180, currency_code: "INR" }], options: [{ option_id: "opt-color", value: "Blue" }] },
      { id: "var-muji-black", title: "Black", inventory_quantity: 95, prices: [{ amount: 150, original_amount: 180, currency_code: "INR" }], options: [{ option_id: "opt-color", value: "Black" }] },
      { id: "var-muji-red", title: "Red", inventory_quantity: 30, prices: [{ amount: 150, original_amount: 180, currency_code: "INR" }], options: [{ option_id: "opt-color", value: "Red" }] },
    ],
    options: [
      { id: "opt-color", title: "Color", values: ["Blue", "Black", "Red"] }
    ],
    features: [
      "Clean minimalist Japanese aesthetics",
      "Smooth gel ink formula prevents blotting & smearing",
      "Refillable bodies with frosted textures",
      "Secure cap design"
    ],
    specifications: {
      "Tip Size": "0.5 mm",
      "Ink Type": "Gel Ink",
      "Refillable": "Yes"
    }
  },
  {
    id: "prod-washi-tape",
    title: "MT Washi Tape Set - Floral Delights",
    handle: "mt-washi-tape-floral",
    brand: "MT",
    collection_id: "col-craft",
    description: "Authentic Japanese MT washi tape rolls made of rice paper. Ideal for journaling, scrapbooking, wrapping, and craft tasks.",
    thumbnail: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.8,
    reviewCount: 88,
    variants: [
      { id: "var-washi-floral-5", title: "5-Roll Set", inventory_quantity: 40, prices: [{ amount: 499, original_amount: 700, currency_code: "INR" }], options: [{ option_id: "opt-rolls", value: "5-Pack" }] }
    ],
    options: [
      { id: "opt-rolls", title: "Roll Count", values: ["5-Pack"] }
    ],
    features: [
      "Authentic Japanese washi rice paper",
      "Repositionable adhesive - leaves no residue",
      "Easy to tear by hand",
      "Acid-free and archival safe"
    ],
    specifications: {
      "Material": "Rice Paper",
      "Roll Length": "10 meters",
      "Width": "15 mm"
    }
  },
  {
    id: "prod-sakura-micron",
    title: "Sakura Pigma Micron Fineliner Set",
    handle: "sakura-pigma-micron",
    brand: "Sakura",
    collection_id: "col-art",
    description: "Sakura Pigma Micron pens are the industry standard for archival-quality fine lines. Waterproof, chemical-resistant, and bleed-free ink.",
    thumbnail: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewCount: 198,
    variants: [
      { id: "var-micron-6", title: "6-Pen Set", inventory_quantity: 25, prices: [{ amount: 799, original_amount: 1100, currency_code: "INR" }], options: [{ option_id: "opt-pens", value: "6-Pack" }] }
    ],
    options: [
      { id: "opt-pens", title: "Set Size", values: ["6-Pack"] }
    ],
    features: [
      "Waterproof and chemical-resistant archival ink",
      "Won't bleed through thin journal pages",
      "Assorted sizes (005, 01, 02, 03, 05, 08)",
      "Fade-resistant on paper textures"
    ],
    specifications: {
      "Ink Base": "Pigment Ink",
      "Sizes Included": "0.2mm to 0.5mm",
      "Country of Origin": "Japan"
    }
  },
  {
    id: "prod-staedtler-noris",
    title: "Staedtler Noris School Pencil 120",
    handle: "staedtler-noris-120",
    brand: "Staedtler",
    collection_id: "col-stationery",
    description: "The classic yellow and black striped pencil. Made from Upcycled Wood, featuring high break-resistance lead.",
    thumbnail: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.3,
    reviewCount: 154,
    variants: [
      { id: "var-noris-hb", title: "Grade HB", inventory_quantity: 200, prices: [{ amount: 15, original_amount: 25, currency_code: "INR" }], options: [{ option_id: "opt-grade", value: "HB" }] },
      { id: "var-noris-2b", title: "Grade 2B", inventory_quantity: 150, prices: [{ amount: 15, original_amount: 25, currency_code: "INR" }], options: [{ option_id: "opt-grade", value: "2B" }] }
    ],
    options: [
      { id: "opt-grade", title: "Lead Grade", values: ["HB", "2B"] }
    ],
    features: [
      "Crafted from upcycled wood fibers",
      "Unbelievably break-resistant lead formulation",
      "Hexagonal grip feels natural in hand",
      "Easy to sharpen cleanly"
    ],
    specifications: {
      "Shape": "Hexagonal",
      "Core Material": "Graphite",
      "Country of Origin": "Germany"
    }
  },
  {
    id: "prod-birthday-decor",
    title: "Premium Birthday Decoration Kit",
    handle: "birthday-decor-kit",
    brand: "Kapi Party",
    collection_id: "col-luxe",
    description: "All-in-one premium party decoration pack featuring metallic balloons, confetti party poppers, a 'Happy Birthday' banner, and warm LED fairy lights. Make every celebration magical.",
    thumbnail: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.8,
    reviewCount: 96,
    variants: [
      { id: "var-decor-standard", title: "Standard Kit", inventory_quantity: 45, prices: [{ amount: 599, original_amount: 899, currency_code: "INR" }] }
    ],
    options: [],
    features: [
      "50x High-quality metallic balloons (Gold & Black)",
      "1x Cardstock Happy Birthday banner",
      "2x Confetti party poppers",
      "1x 10m LED fairy lights string"
    ],
    specifications: {
      "Kit Type": "Birthday Decor",
      "Balloon Material": "Natural Latex",
      "Fairy Lights Length": "10 meters"
    }
  },
  {
    id: "prod-party-poppers",
    title: "Confetti Party Poppers (Pack of 5)",
    handle: "confetti-party-poppers",
    brand: "Kapi Party",
    collection_id: "col-luxe",
    description: "Safe spring-loaded confetti launchers loaded with shiny metallic foil and colorful paper slips. Perfect for birthday cake-cutting moments and grand reveals.",
    thumbnail: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.6,
    reviewCount: 112,
    variants: [
      { id: "var-poppers-5", title: "5-Pack", inventory_quantity: 120, prices: [{ amount: 199, original_amount: 299, currency_code: "INR" }] }
    ],
    options: [],
    features: [
      "Spring-powered - no gunpowder or explosives",
      "Biodegradable paper + shiny foil confetti",
      "Shoots up to 10-15 feet high",
      "Pack of 5 individual poppers"
    ],
    specifications: {
      "Pack Size": "5 poppers",
      "Launcher Mechanism": "Spring release",
      "Confetti Type": "Metallic Foil & Paper"
    }
  }
];

export function getMedusaClient() {
  return {
    store: {
      collection: {
        list: async (query?: any) => {
          return { collections: mockCollections };
        },
        retrieve: async (id: string) => {
          const collection = mockCollections.find(c => c.id === id || c.handle === id);
          if (!collection) throw new Error("Collection not found");
          return { collection };
        }
      },
      product: {
        list: async (query?: {
          collection_id?: string[];
          status?: string;
          fields?: string;
          q?: string;
          price_range?: { min?: number; max?: number };
          brand?: string[];
          order?: string;
          offset?: number;
          limit?: number;
        }) => {
          let list = [...mockProducts];

          // Filter by collection ID
          if (query?.collection_id && query.collection_id.length > 0) {
            const ids = query.collection_id;
            // Best Sellers resolves special
            if (ids.includes("col-bestsellers")) {
              list = list.filter(p => p.rating >= 4.6);
            } else {
              list = list.filter(p => ids.includes(p.collection_id));
            }
          }

          // Search term
          if (query?.q) {
            const q = query.q.toLowerCase();
            list = list.filter(p => p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
          }

          // Filter by brand
          if (query?.brand && query.brand.length > 0) {
            const brands = query.brand.map(b => b.toLowerCase());
            list = list.filter(p => brands.includes(p.brand.toLowerCase()));
          }

          // Sort order
          if (query?.order) {
            if (query.order === "Price: Low to High") {
              list.sort((a, b) => a.variants[0].prices[0].amount - b.variants[0].prices[0].amount);
            } else if (query.order === "Price: High to Low") {
              list.sort((a, b) => b.variants[0].prices[0].amount - a.variants[0].prices[0].amount);
            } else if (query.order === "Newest First" || query.order === "Newest") {
              list.sort((a, b) => b.id.localeCompare(a.id));
            } else if (query.order === "Most Popular" || query.order === "Best Sellers") {
              list.sort((a, b) => b.rating - a.rating);
            }
          }

          const offset = query?.offset || 0;
          const limit = query?.limit || 20;
          const paginated = list.slice(offset, offset + limit);

          return { products: paginated, count: list.length };
        },
        retrieve: async (idOrHandle: string) => {
          const product = mockProducts.find(p => p.id === idOrHandle || p.handle === idOrHandle);
          if (!product) throw new Error("Product not found");
          return { product };
        }
      }
    }
  };
}
