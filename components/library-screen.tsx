"use client";

import { featuredCards, getCardBySlug, isFeatured, type PlaylistCard } from "@/lib/playlists";
import { useFavorites } from "@/lib/use-favorites";
import { PlaylistRow } from "./playlist-row";


export function LibraryScreen() {
  const favorites = useFavorites();
  // Featured playlists are pinned above, so not listed twice; unknown slugs are skipped.
  const cards = (favorites ?? [])
    .filter((slug) => !isFeatured(slug))
    .map(getCardBySlug)
    .filter((c): c is PlaylistCard => c !== undefined);

  return (
    <div className="pt-[calc(env(safe-area-inset-top)+16px)]">
      <h1 className="px-4 text-2xl font-semibold tracking-tight">My Playlists</h1>

      {featuredCards.length > 0 && (
        <section aria-labelledby="pinned-heading" className="mt-4">
          <h2 id="pinned-heading" className="px-4 text-xs font-semibold uppercase tracking-wide text-text-dim">
            Featured
          </h2>
          <ul className="mt-1">
            {featuredCards.map((card) => (
              <PlaylistRow key={card.slug} card={card} />
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="saved-heading" className="mt-6">
        <h2 id="saved-heading" className="px-4 text-xs font-semibold uppercase tracking-wide text-text-dim">
          Saved
        </h2>
        {favorites === undefined ? null : cards.length === 0 ? (
          <p className="px-4 pt-10 text-center text-text-dim">Tap ♥ on any playlist to keep it here.</p>
        ) : (
          <ul className="mt-1">
            {cards.map((card) => (
              <PlaylistRow key={card.slug} card={card} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
