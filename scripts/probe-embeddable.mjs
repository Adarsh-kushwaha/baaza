#!/usr/bin/env node
// Probes every live card's site for framing restrictions and stamps `embeddable`
// (true | false | "unknown") onto each card in data/playlist_cards.json, in place.
//
// Run manually after adding cards:  node scripts/probe-embeddable.mjs
// Set BAAZA_ORIGIN (e.g. https://baaza.app) to count sites whose frame-ancestors allowlist includes us.

import { readFile, writeFile } from "node:fs/promises";

const DATA = new URL("../data/playlist_cards.json", import.meta.url);
const OUR_ORIGIN = process.env.BAAZA_ORIGIN ?? null;
const TIMEOUT_MS = 10_000;
const CONCURRENCY = 8;

/** CSP frame-ancestors wins over X-Frame-Options in every current browser. */
export function verdict(headers) {
  const csp = headers.get("content-security-policy");
  const ancestors = csp
    ?.split(";")
    .map((d) => d.trim())
    .find((d) => d.toLowerCase().startsWith("frame-ancestors"));
  if (ancestors) {
    const sources = ancestors.split(/\s+/).slice(1).map((s) => s.toLowerCase());
    if (sources.includes("*")) return true;
    if (OUR_ORIGIN && sources.some((s) => s.replace(/\/$/, "") === OUR_ORIGIN.toLowerCase())) return true;
    return false;
  }
  const xfo = headers.get("x-frame-options")?.trim().toLowerCase();
  if (xfo === "deny" || xfo === "sameorigin") return false;
  return true;
}

async function probe(card) {
  try {
    const response = await fetch(card.url, {
      redirect: "follow",
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { "user-agent": "Mozilla/5.0 (compatible; BaazaEmbedProbe/1.0)" },
    });
    await response.body?.cancel();
    return verdict(response.headers);
  } catch {
    return "unknown";
  }
}

const cards = JSON.parse(await readFile(DATA, "utf8"));
const live = cards.filter((card) => card.status === "live");

let next = 0;
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (next < live.length) {
      const card = live[next++];
      card.embeddable = await probe(card);
    }
  }),
);
for (const card of cards) if (card.status !== "live") card.embeddable = "unknown";

await writeFile(DATA, `${JSON.stringify(cards, null, 2)}\n`);

const blocked = live.filter((c) => c.embeddable === false).map((c) => c.domain);
const unknown = live.filter((c) => c.embeddable === "unknown").map((c) => c.domain);
console.log(`${live.length} live cards: ${live.length - blocked.length - unknown.length} embeddable`);
console.log(`not embeddable (${blocked.length}): ${blocked.join(", ") || "none"}`);
console.log(`unknown (${unknown.length}): ${unknown.join(", ") || "none"}`);
