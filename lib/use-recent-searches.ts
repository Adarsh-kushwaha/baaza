import { normalize } from "./playlists";
import { KEYS, parseStringArray, readRaw, useStored, writeJson, writeRaw } from "./storage";

const MAX_RECENT = 8;

/** Last distinct searches, most recent first. `undefined` while resolving. */
export function useRecentSearches(): string[] | undefined {
  return useStored(KEYS.recentSearches, parseStringArray);
}

export function addRecentSearch(query: string) {
  const q = normalize(query);
  if (q === "") return;
  const current = parseStringArray(readRaw(KEYS.recentSearches));
  writeJson(KEYS.recentSearches, [q, ...current.filter((s) => s !== q)].slice(0, MAX_RECENT));
}

export function clearRecentSearches() {
  writeRaw(KEYS.recentSearches, null);
}
