"use client";

import { toggleFavorite, useFavorites } from "@/lib/use-favorites";

type FavoriteButtonProps = {
  slug: string;
  title: string;
  className?: string;
  size?: "sm" | "md";
  /** `overlay` sits on cover art; `floating` over a playing site; `plain` on the page background. */
  variant?: "overlay" | "floating" | "plain";
};

export function FavoriteButton({ slug, title, className = "", size = "sm", variant = "overlay" }: FavoriteButtonProps) {
  const favorites = useFavorites();
  const active = favorites?.includes(slug) ?? false;
  const box = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const icon = size === "sm" ? 16 : 20;
  const surface = {
    overlay: "bg-black/45 backdrop-blur-md",
    floating: "bg-black/75 shadow-lg ring-1 ring-white/15 backdrop-blur-md",
    plain: "",
  }[variant];

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? `Remove ${title} from My Playlists` : `Save ${title} to My Playlists`}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleFavorite(slug);
      }}
      className={`pressable grid place-items-center rounded-pill ${surface} ${box} ${className}`}
    >
      <svg width={icon} height={icon} viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 8 3.4 4.5 6.9 4.5c2 0 3.4 1.1 4.1 2.3.7-1.2 2.1-2.3 4.1-2.3 3.5 0 5.5 3.5 4.2 6.8-1.8 4.6-9.3 9.2-9.3 9.2z"
          fill={active ? "var(--accent)" : "none"}
          stroke={active ? "var(--accent)" : "white"}
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
