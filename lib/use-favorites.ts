import { KEYS, parseStringArray, readRaw, useStored, writeJson, writeRaw } from "./storage";

/** Favourite slugs, newest first. `undefined` while resolving. */
export function useFavorites(): string[] | undefined {
  return useStored(KEYS.favorites, parseStringArray);
}

export function toggleFavorite(slug: string) {
  const current = parseStringArray(readRaw(KEYS.favorites));
  writeJson(KEYS.favorites, current.includes(slug) ? current.filter((s) => s !== slug) : [slug, ...current]);
}

export function clearFavorites() {
  writeRaw(KEYS.favorites, null);
}
