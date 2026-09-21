"use client";

import { getCardBySlug, type PlaylistCard } from "@/lib/playlists";
import { useFavorites } from "@/lib/use-favorites";
import { PlaylistRow } from "./playlist-row";

/** Always shown at the top of My Playlists: the maker's own playlist. */
const PINNED_SLUG = "raju-mistri";

export function LibraryScreen() {
  const favorites = useFavorites();
  const pinned = getCardBySlug(PINNED_SLUG);
  // Slugs no longer in the catalogue are skipped; the pinned card is not listed twice.
  const cards = (favorites ?? [])
    .filter((slug) => slug !== PINNED_SLUG)
    .map(getCardBySlug)
    .filter((c): c is PlaylistCard => c !== undefined);

  return (
    <div className="pt-[calc(env(safe-area-inset-top)+16px)]">
      <h1 className="px-4 text-2xl font-semibold tracking-tight">My Playlists</h1>

      {pinned && (
        <section aria-labelledby="pinned-heading" className="mt-4">
          <h2 id="pinned-heading" className="px-4 text-xs font-semibold uppercase tracking-wide text-text-dim">
            From the maker
          </h2>
          <ul className="mt-1">
            <PlaylistRow card={pinned} />
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
