const imageCache: Record<string, HTMLImageElement> = {};
const loadingSet = new Set<string>();

export function loadSprite(src: string): HTMLImageElement | null {
  if (imageCache[src]) return imageCache[src];
  if (loadingSet.has(src)) return null;

  loadingSet.add(src);
  const img = new Image();
  img.src = src;
  img.onload = () => {
    imageCache[src] = img;
    loadingSet.delete(src);
  };
  img.onerror = () => {
    loadingSet.delete(src);
  };
  return null;
}

export function getSprite(src: string): HTMLImageElement | null {
  return imageCache[src] ?? null;
}

// Preload all sprites
export function preloadSprites() {
  const sprites = [
    "/sprites/hamster.svg",
    "/sprites/hamster-sleep.svg",
    "/sprites/hamster-happy.svg",
    "/sprites/hamster-eat.svg",
    "/sprites/water-bottle.svg",
    "/sprites/food-bowl.svg",
    "/sprites/wheel.svg",
    "/sprites/house.svg",
  ];
  sprites.forEach(loadSprite);
}
