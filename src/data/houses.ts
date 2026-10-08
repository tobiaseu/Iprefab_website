export type HouseType = "detached" | "holiday" | "cabin";

export type House = {
  slug: string;
  name: string;
  builder: string;
  type: HouseType;
  size: number;
  bedrooms: number;
  floors: number;
  price: number;
  image: string;
  cover?: string;
};

export const houses: House[] = [
  { slug: "aava-140", name: "Aava 140", builder: "Finnlamelli", type: "holiday", size: 140, bedrooms: 4, floors: 1, price: 307000, image: "/images/aava-140.jpg" },
  { slug: "poutta-155", name: "Poutta 155", builder: "Finnlamelli", type: "detached", size: 155, bedrooms: 4, floors: 2, price: 387000, image: "/images/poutta-155.jpg" },
  { slug: "ideal-133", name: "Ideal 133", builder: "Designtalo", type: "detached", size: 133, bedrooms: 5, floors: 2, price: 217000, image: "/images/ideal-133.jpg" },
  { slug: "ideal-110", name: "Ideal 110", builder: "Designtalo", type: "detached", size: 110, bedrooms: 4, floors: 2, price: 210000, image: "/images/ideal-110.jpg" },
  { slug: "pout-101", name: "Pout 101", builder: "Finnlamelli", type: "holiday", size: 101, bedrooms: 3, floors: 1, price: 266000, image: "/images/pout-101.jpg" },
  { slug: "rehti-124", name: "Rehti 124", builder: "Finnlamelli", type: "detached", size: 124, bedrooms: 2, floors: 2, price: 273000, image: "/images/rehti-124.jpg" },
  { slug: "ideal-105", name: "Ideal 105+", builder: "Designtalo", type: "detached", size: 105, bedrooms: 4, floors: 1, price: 198000, image: "/images/ideal-105.jpg" },
  { slug: "shine-133", name: "Shine 133", builder: "Finnlamelli", type: "holiday", size: 132, bedrooms: 4, floors: 1, price: 369000, image: "/images/shine-133.jpg" },
  { slug: "rehti-89", name: "Rehti 89", builder: "Finnlamelli", type: "cabin", size: 89, bedrooms: 4, floors: 1, price: 205000, image: "/images/rehti-89.jpg" },
  { slug: "ideal-90", name: "Ideal 90", builder: "Designtalo", type: "detached", size: 90, bedrooms: 3, floors: 1, price: 163000, image: "/images/ideal-90.jpg" },
  { slug: "aava-134", name: "Aava 134", builder: "Finnlamelli", type: "holiday", size: 134, bedrooms: 4, floors: 1, price: 306000, image: "/images/aava-140-lake.jpg", cover: "/images/house-cover.jpg" },
];

export const houseTypes: { value: HouseType; label: string }[] = [
  { value: "detached", label: "Detached House" },
  { value: "holiday", label: "Holiday House" },
  { value: "cabin", label: "Cabin House" },
];

export const builders = ["OKAL", "HONKA", "DESIGNTALO", "SALVOS", "IPREFAB", "FINNLAMELLI"];

export const articles = [
  { slug: "main-two-methods", title: "Main Two Methods", excerpt: "Modular elements vs. building at the factory. Welcome to the...", date: "2024/09/10", image: "/images/magazine-1.png" },
  { slug: "why-material-matters", title: "Why Material Matters", excerpt: "Iprefab will introduce the latest available tech in the market...", date: "2024/09/10", image: "/images/magazine-2.png" },
  { slug: "what-is-a-modular-method", title: "What Is A Modular Method", excerpt: "Iprefab will introduce the latest available tech in the market...", date: "2024/09/10", image: "/images/magazine-3.png" },
];

export const formatPrice = (n: number) => "€" + n.toLocaleString("de-DE");
