import Link from "next/link";
import type { PlaylistCard } from "@/lib/playlists";
import { Cover } from "./cover";
import { FavoriteButton } from "./favorite-button";

export const cardSubtitle = (card: Pick<PlaylistCard, "creator">) =>
  card.creator ? `Playlist · ${card.creator}` : "Playlist";

/** Spotify-anatomy tile: square art, one-line title, dim "Playlist · @creator". */
export function Card({ card, eager = false }: { card: PlaylistCard; eager?: boolean }) {
  const text = (
    <>
      <p className="mt-2 truncate text-sm font-semibold tracking-tight">{card.title}</p>
      <p className="truncate text-xs text-text-dim">{cardSubtitle(card)}</p>
    </>
  );

  if (card.status === "offline") {
    return (
      <div className="w-[150px] shrink-0 snap-start opacity-45">
        <div className="relative">
          <Cover card={card} sizes="150px" eager={eager} />
          <span className="absolute left-1.5 top-1.5 rounded-pill bg-black/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
            Offline
          </span>
        </div>
        {text}
        <span className="sr-only">This playlist is offline.</span>
      </div>
    );
  }

  return (
    <div className="relative w-[150px] shrink-0 snap-start">
      <Link href={`/play/${card.slug}`} className="pressable block rounded-card">
        <Cover card={card} sizes="150px" morph eager={eager} />
        {text}
      </Link>
      <FavoriteButton slug={card.slug} title={card.title} className="absolute right-1.5 top-1.5" />
    </div>
  );
}
