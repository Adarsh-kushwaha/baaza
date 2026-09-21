"use client";

import { getCardBySlug, type PlaylistCard } from "@/lib/playlists";
import { useFavorites } from "@/lib/use-favorites";
import { PlaylistRow } from "./playlist-row";

/** Always shown at the top of My Playlists: the maker's own playlists. */
const PINNED_SLUGS = ["raju-mistri", "deluxe-salon"];

const byExistingSlug = (slugs: string[]) =>
  slugs.map(getCardBySlug).filter((c): c is PlaylistCard => c !== undefined);

export function LibraryScreen() {
  const favorites = useFavorites();
  const pinned = byExistingSlug(PINNED_SLUGS);
  // Slugs no longer in the catalogue are skipped; pinned cards are not listed twice.
  const cards = byExistingSlug((favorites ?? []).filter((slug) => !PINNED_SLUGS.includes(slug)));

  return (
    <div className="pt-[calc(env(safe-area-inset-top)+16px)]">
      <h1 className="px-4 text-2xl font-semibold tracking-tight">My Playlists</h1>

      {pinned.length > 0 && (
        <section aria-labelledby="pinned-heading" className="mt-4">
          <h2 id="pinned-heading" className="px-4 text-xs font-semibold uppercase tracking-wide text-text-dim">
            From the maker
          </h2>
          <ul className="mt-1">
            {pinned.map((card) => (
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
