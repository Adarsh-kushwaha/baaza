import { KEYS, parseJson, useStored, writeJson, writeRaw } from "./storage";

export type Session = {
  name: string;
  email: string;
  picture: string | null;
  at: number;
};

/**
 * v1 only implements "fake": a local guest session, no network call.
 * Real Google auth will branch on this flag inside signIn/signOut, leaving the UI untouched.
 */
export const AUTH_MODE = process.env.NEXT_PUBLIC_AUTH_MODE ?? "fake";

function parseSession(raw: string | null): Session | null {
  const value = parseJson(raw) as Partial<Session> | null;
  if (!value || typeof value.name !== "string" || typeof value.email !== "string") return null;
  return {
    name: value.name,
    email: value.email,
    picture: typeof value.picture === "string" ? value.picture : null,
    at: typeof value.at === "number" ? value.at : 0,
  };
}

/** `undefined` while resolving, `null` when signed out. */
export function useSession(): Session | null | undefined {
  return useStored(KEYS.session, parseSession);
}

export function signIn() {
  writeJson(KEYS.session, { name: "Guest", email: "guest@baaza.app", picture: null, at: Date.now() } satisfies Session);
}

/** Clears only the session; favourites and recent searches survive. */
export function signOut() {
  writeRaw(KEYS.session, null);
}
