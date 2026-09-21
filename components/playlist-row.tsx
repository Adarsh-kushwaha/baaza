import Link from "next/link";
import type { PlaylistCard } from "@/lib/playlists";
import { cardSubtitle } from "./card";
import { Cover } from "./cover";
import { FavoriteButton } from "./favorite-button";

type PlaylistRowProps = {
  card: PlaylistCard;
  onOpen?: () => void;
};

/** Library/search list row: 64px thumb + two lines, ♥ on the right. */
export function PlaylistRow({ card, onOpen }: PlaylistRowProps) {
  const body = (
    <>
      <Cover card={card} sizes="64px" className="w-16 shrink-0" morph={card.status === "live"} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold tracking-tight">{card.title}</p>
        <p className="truncate text-sm text-text-dim">
          {card.status === "offline" ? "Offline" : cardSubtitle(card)}
          {card.titleEn && ` · ${card.titleEn}`}
        </p>
      </div>
    </>
  );

  if (card.status === "offline") {
    return (
      <li className="flex items-center gap-3 px-4 py-2 opacity-45">
        {body}
      </li>
    );
  }

  return (
    <li className="flex items-center gap-2 pr-4">
      <Link href={`/play/${card.slug}`} onClick={onOpen} className="pressable flex min-w-0 flex-1 items-center gap-3 rounded-card py-2 pl-4">
        {body}
      </Link>
      <FavoriteButton slug={card.slug} title={card.title} variant="plain" className="shrink-0" />
    </li>
  );
}
