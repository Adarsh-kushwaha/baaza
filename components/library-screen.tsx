"use client";

import { getCardBySlug, type PlaylistCard } from "@/lib/playlists";
import { useFavorites } from "@/lib/use-favorites";
import { PlaylistRow } from "./playlist-row";

export function LibraryScreen() {
  const favorites = useFavorites();
  // Slugs that are no longer in the catalogue are skipped.
  const cards = (favorites ?? []).map(getCardBySlug).filter((c): c is PlaylistCard => c !== undefined);

  return (
    <div className="pt-[calc(env(safe-area-inset-top)+16px)]">
      <h1 className="px-4 text-2xl font-semibold tracking-tight">My Playlists</h1>
      {favorites === undefined ? null : cards.length === 0 ? (
        <p className="px-4 pt-16 text-center text-text-dim">Tap ♥ on any playlist to keep it here.</p>
      ) : (
        <ul className="mt-3">
          {cards.map((card) => (
            <PlaylistRow key={card.slug} card={card} />
          ))}
        </ul>
      )}
    </div>
  );
}
