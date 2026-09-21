import { KEYS, parseStringArray, readRaw, writeJson } from "./storage";

/** Slugs whose frame failed to load on this device; they open in a new tab from now on. */
export function rememberNotEmbeddable(slug: string) {
  const current = parseStringArray(readRaw(KEYS.nonEmbeddable));
  if (!current.includes(slug)) writeJson(KEYS.nonEmbeddable, [...current, slug]);
}

