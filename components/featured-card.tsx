import Link from "next/link";
import type { PlaylistCard } from "@/lib/playlists";
import { cardSubtitle } from "./card";
import { Cover } from "./cover";
import { FavoriteButton } from "./favorite-button";

/** Large Spotify-style hero tile: full-width art with a green play button, title below. */
export function FeaturedCard({ card }: { card: PlaylistCard }) {
  return (
    <div className="relative w-[44vw] max-w-56 shrink-0 snap-start">
      <Link href={`/play/${card.slug}`} className="pressable group block rounded-card">
        <div className="relative">
          <Cover card={card} sizes="(min-width: 510px) 224px, 44vw" morph eager className="shadow-xl shadow-black/60" />
          <span
            aria-hidden="true"
            className="absolute bottom-2 right-2 grid h-11 w-11 place-items-center rounded-pill bg-accent shadow-lg shadow-black/50"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M8 5.5v13l11-6.5z" fill="black" />
            </svg>
          </span>
        </div>
        <p className="mt-2 truncate font-semibold tracking-tight">{card.title}</p>
        <p className="truncate text-xs text-text-dim">{cardSubtitle(card)}</p>
      </Link>
      <FavoriteButton slug={card.slug} title={card.title} className="absolute right-2 top-2" />
    </div>
  );
}
