"use client";

import { useSyncExternalStore } from "react";
import { featuredCards, FEATURED_PICKS, pickFeatured, type PlaylistCard } from "@/lib/playlists";
import { FeaturedCard } from "./featured-card";

// Picked once per app load: stable while you browse, fresh on every visit to the app.
let picks: PlaylistCard[] | null = null;
const getPicks = () => (picks ??= pickFeatured());
const subscribe = () => () => {};

/** The maker's playlists first, then random picks from across the categories. */
export function FeaturedRow() {
  // Home is prerendered, so the random picks can only exist on the client; the server renders placeholders.
  const random = useSyncExternalStore(subscribe, getPicks, () => null);

  return (
    <>
      {featuredCards.map((card) => (
        <FeaturedCard key={card.slug} card={card} />
      ))}
      {random
        ? random.map((card) => (
            // The same card also sits in its category rail, which keeps the art morph.
            <FeaturedCard key={card.slug} card={card} morph={false} />
          ))
        : Array.from({ length: FEATURED_PICKS }, (_, i) => (
            <div key={i} aria-hidden="true" className="w-[44vw] max-w-56 shrink-0 snap-start">
              <div className="aspect-square animate-pulse rounded-card bg-surface" />
              <div className="mt-2 h-4 w-3/4 rounded-pill bg-surface" />
              <div className="mt-1.5 h-3 w-1/2 rounded-pill bg-surface" />
            </div>
          ))}
    </>
  );
}
