export interface ItemDef {
  id: string;
  name: string;
  emoji: string;
  category: "basic" | "furniture" | "house" | "food";
  price: number;
  premium: boolean;
  width: number;
  height: number;
  color: string;
}

export const ITEMS: ItemDef[] = [
  { id: "water-bottle", name: "Water Bottle", emoji: "\u{1F4A7}", category: "basic", price: 0, premium: false, width: 0.08, height: 0.15, color: "#60a5fa" },
  { id: "food-bowl", name: "Food Bowl", emoji: "\u{1F35A}", category: "basic", price: 0, premium: false, width: 0.1, height: 0.08, color: "#f97316" },
  { id: "wheel", name: "Hamster Wheel", emoji: "\u{1F3A1}", category: "basic", price: 0, premium: false, width: 0.2, height: 0.2, color: "#818cf8" },
  { id: "house", name: "Wooden House", emoji: "\u{1F3E0}", category: "house", price: 0, premium: false, width: 0.15, height: 0.15, color: "#a3e635" },
  { id: "tunnel", name: "Tunnel", emoji: "\u{1F573}\uFE0F", category: "furniture", price: 30, premium: false, width: 0.2, height: 0.06, color: "#fbbf24" },
  { id: "seesaw", name: "Seesaw", emoji: "\u{1F3A2}", category: "furniture", price: 50, premium: false, width: 0.15, height: 0.08, color: "#f472b6" },
  { id: "hammock", name: "Hammock", emoji: "\u{1F6CC}", category: "furniture", price: 80, premium: false, width: 0.12, height: 0.08, color: "#34d399" },
  { id: "slide", name: "Slide", emoji: "\u{1F6DD}", category: "furniture", price: 100, premium: false, width: 0.1, height: 0.15, color: "#f87171" },
  { id: "castle", name: "Castle", emoji: "\u{1F3F0}", category: "house", price: 200, premium: true, width: 0.18, height: 0.18, color: "#c084fc" },
  { id: "tent", name: "Tent", emoji: "\u26FA", category: "house", price: 150, premium: true, width: 0.14, height: 0.14, color: "#fb923c" },
];

export const FOODS = [
  { id: "sunflower", name: "Sunflower Seed", emoji: "\u{1F33B}", value: 20, price: 0 },
  { id: "carrot", name: "Carrot", emoji: "\u{1F955}", value: 35, price: 5 },
  { id: "cheese", name: "Cheese", emoji: "\u{1F9C0}", value: 50, price: 10 },
  { id: "strawberry", name: "Strawberry", emoji: "\u{1F353}", value: 70, price: 20 },
];

export function getItemDef(id: string): ItemDef | undefined {
  return ITEMS.find((i) => i.id === id);
}
