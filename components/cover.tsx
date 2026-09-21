import Image from "next/image";
import { ViewTransition } from "react";
import { imageSrc, type PlaylistCard } from "@/lib/playlists";

/** Deterministic two-tone gradient for cards without cover art. */
function gradientFor(slug: string) {
  let hash = 0;
  for (const ch of slug) hash = (hash * 31 + ch.charCodeAt(0)) | 0;
  const hue = Math.abs(hash) % 360;
  return `linear-gradient(135deg, hsl(${hue} 70% 45%), hsl(${(hue + 60) % 360} 70% 20%))`;
}

/** Transition name shared by a card's art and its play-screen poster. */
export const artTransitionName = (slug: string) => `art-${slug}`;

type CoverProps = {
  card: Pick<PlaylistCard, "slug" | "title" | "image">;
  /** `sizes` hint for the optimizer, e.g. "150px". */
  sizes: string;
  className?: string;
  /** Pair this cover with the play-screen poster; only one per slug may be on screen. */
  morph?: boolean;
};

export function Cover({ card, sizes, className = "", morph = false }: CoverProps) {
  const src = imageSrc(card);
  const art = (
    <div className={`relative aspect-square overflow-hidden rounded-card bg-surface-hi ${className}`}>
      {src ? (
        <Image src={src} alt="" fill sizes={sizes} className="object-cover" />
      ) : (
        <div className="flex h-full w-full items-end p-2" style={{ background: gradientFor(card.slug) }}>
          <span className="line-clamp-2 text-sm font-semibold leading-tight tracking-tight text-white/90">
            {card.title}
          </span>
        </div>
      )}
    </div>
  );
  if (!morph) return art;
  return (
    <ViewTransition name={artTransitionName(card.slug)} share="morph" default="none">
      {art}
    </ViewTransition>
  );
}

export { gradientFor };
