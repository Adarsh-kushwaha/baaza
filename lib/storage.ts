import { useMemo, useSyncExternalStore } from "react";

/** Every localStorage key the app owns. */
export const KEYS = {
  session: "baaza.session",
  favorites: "baaza.favorites",
  recentSearches: "baaza.recentSearches",
  installBarDismissed: "baaza.installBarDismissed",
} as const;

type Key = (typeof KEYS)[keyof typeof KEYS];

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Fires for writes made in other tabs.
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

export function readRaw(key: Key): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeRaw(key: Key, value: string | null) {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {
    // Storage full or blocked: the UI keeps working, the write is lost.
  }
  listeners.forEach((listener) => listener());
}

export function writeJson(key: Key, value: unknown) {
  writeRaw(key, JSON.stringify(value));
}

export function parseJson(raw: string | null): unknown {
  if (raw === null) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function parseStringArray(raw: string | null): string[] {
  const value = parseJson(raw);
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
}

const PENDING = Symbol("pending");

/**
 * Parsed value of a key, kept in sync across components and tabs.
 * Returns `undefined` during SSR and hydration, before storage has been read.
 */
export function useStored<T>(key: Key, parse: (raw: string | null) => T): T | undefined {
  const raw = useSyncExternalStore<string | null | typeof PENDING>(
    subscribe,
    () => readRaw(key),
    () => PENDING,
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps -- parse is a stable module-level function
  return useMemo(() => (raw === PENDING ? undefined : parse(raw)), [raw]);
}
