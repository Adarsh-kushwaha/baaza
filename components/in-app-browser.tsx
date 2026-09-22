"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, ViewTransition } from "react";
import type { EmbedCheck } from "@/app/api/embed/[slug]/route";
import { holdBackgroundAudio, primeBackgroundAudio } from "@/lib/background-audio";
import { hasInAppHistory } from "@/lib/nav-history";
import { frameUrl, imageSrc, type PlaylistCard } from "@/lib/playlists";
import { artTransitionName, gradientFor } from "./cover";
import { FavoriteButton } from "./favorite-button";

/** Longest we hold the frame back waiting for the header check before trusting its `load`. */
const CHECK_TIMEOUT_MS = 5000;
/** After this long without a paint, offer the site in a new tab (the frame keeps loading). */
const SLOW_MS = 10000;
const CHROME_IDLE_MS = 3000;

type Check = EmbedCheck["verdict"] | "pending";

/** Asks the server whether the site's headers allow framing; a refused frame is invisible to us here. */
function useEmbedCheck(card: PlaylistCard): Check {
  const [check, setCheck] = useState<Check>(card.embeddable === false ? "blocked" : "pending");

  useEffect(() => {
    if (card.embeddable === false) return;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), CHECK_TIMEOUT_MS);
    fetch(`/api/embed/${card.slug}`, { signal: controller.signal })
      .then((res) => (res.ok ? (res.json() as Promise<EmbedCheck>) : { verdict: "unknown" as const }))
      .then(({ verdict }) => setCheck(verdict))
      .catch(() => setCheck("unknown"))
      .finally(() => clearTimeout(timer));
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [card.slug, card.embeddable]);

  return check;
}

export function InAppBrowser({ card }: { card: PlaylistCard }) {
  const check = useEmbedCheck(card);
  const [loaded, setLoaded] = useState(false);
  const [slow, setSlow] = useState(false);

  const blocked = check === "blocked";
  // The frame starts loading at once, in parallel with the check; it is only revealed once
  // both agree, so a refused site's browser error page never flashes on screen.
  const showFrame = !blocked;
  const revealed = showFrame && loaded && check !== "pending";

  useEffect(() => {
    if (revealed || blocked) return;
    const timer = setTimeout(() => setSlow(true), SLOW_MS);
    return () => clearTimeout(timer);
  }, [revealed, blocked]);

  useEffect(() => {
    if (!showFrame) return;
    const release = holdBackgroundAudio(card);
    // Deep links arrive without a gesture; any tap on our chrome unlocks the audio session.
    window.addEventListener("pointerdown", primeBackgroundAudio, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", primeBackgroundAudio);
      release();
    };
  }, [showFrame, card]);

  return (
    <div className="fixed inset-0 bg-bg">
      {showFrame && (
        <iframe
          key={card.slug}
          src={frameUrl(card)}
          title={card.title}
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture; clipboard-write"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={() => setLoaded(true)}
          className={`fixed inset-0 h-full w-full border-0 bg-bg transition-opacity duration-500 ease-app motion-reduce:transition-none ${
            revealed ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        />
      )}

      <Poster card={card} hidden={revealed} blocked={blocked} />
      {slow && !revealed && !blocked && <SlowPill card={card} />}
      <FloatingChrome card={card} />
    </div>
  );
}

type PosterProps = { card: PlaylistCard; hidden: boolean; blocked: boolean };

/**
 * Full-screen blurred cover art (the card art morphs into it). While loading it shows the
 * title over a soft pulse; if the site refuses to be framed it becomes the open-in-browser screen.
 */
function Poster({ card, hidden, blocked }: PosterProps) {
  const src = imageSrc(card);
  return (
    <div
      aria-hidden={hidden}
      className={`fixed inset-0 transition-opacity duration-500 ease-app motion-reduce:transition-none ${
        hidden ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <ViewTransition name={artTransitionName(card.slug)} share="morph" default="none">
        <div className="absolute inset-0 overflow-hidden">
          {src ? (
            <Image
              src={src}
              alt=""
              fill
              preload
              sizes="100vw"
              className={`scale-125 object-cover blur-2xl transition-[filter] duration-700 ease-app ${
                blocked ? "brightness-[0.35] saturate-150" : "brightness-50"
              }`}
            />
          ) : (
            <div className="h-full w-full brightness-75" style={{ background: gradientFor(card.slug) }} />
          )}
        </div>
      </ViewTransition>
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />

      {blocked ? (
        <BlockedPanel card={card} />
      ) : (
        <div className="absolute inset-0 grid place-items-center px-8 text-center">
          <div className="animate-[rise_500ms_var(--ease)_both]">
            <p className="text-3xl font-semibold tracking-tight">{card.title}</p>
            {card.titleEn && <p className="mt-1 text-text-dim">{card.titleEn}</p>}
            <div role="status" className="mt-6 flex items-center justify-center gap-2 text-sm text-text-dim">
              <Equalizer />
              <span>Tuning in to {card.domain}…</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** Three bars bouncing out of phase: the loading indicator. */
function Equalizer() {
  return (
    <span aria-hidden="true" className="flex h-4 items-end gap-[3px]">
      {[0, 180, 360].map((delay) => (
        <span
          key={delay}
          className="w-[3px] origin-bottom animate-[eq_900ms_ease-in-out_infinite] rounded-full bg-accent motion-reduce:animate-none"
          style={{ height: "100%", animationDelay: `${delay}ms` }}
        />
      ))}
    </span>
  );
}

/** Shown over the art when the site's headers forbid framing: a clear way out to the real site. */
function BlockedPanel({ card }: { card: PlaylistCard }) {
  const src = imageSrc(card);
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-8 pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)] text-center">
      <a
        href={card.url}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={-1}
        aria-hidden="true"
        className="pressable relative aspect-square w-[min(62vw,280px)] animate-[rise_600ms_var(--ease)_both] overflow-hidden rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.6)] ring-1 ring-white/10"
      >
        {src ? (
          <Image src={src} alt="" fill sizes="280px" className="object-cover" />
        ) : (
          <div className="h-full w-full" style={{ background: gradientFor(card.slug) }} />
        )}
      </a>

      <div className="mt-8 animate-[rise_600ms_var(--ease)_120ms_both]">
        <p className="text-3xl font-semibold tracking-tight">{card.title}</p>
        {card.titleEn && <p className="mt-1 text-text-dim">{card.titleEn}</p>}
        <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-text-dim">
          {card.domain} plays only on its own site. Open it there — the music keeps going when you come back.
        </p>
      </div>

      <a
        href={card.url}
        target="_blank"
        rel="noopener noreferrer"
        className="pressable mt-8 inline-flex w-full max-w-xs px-5 animate-[rise_600ms_var(--ease)_240ms_both] items-center justify-center gap-2 rounded-pill bg-accent py-4 text-base font-bold text-black shadow-[0_8px_32px_rgba(30,215,96,0.35)]"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
        </svg>
        <span className="min-w-0 truncate">Play on {card.domain}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 17L17 7M9 7h8v8" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </div>
  );
}

/** Non-blocking nudge for a slow site; the frame keeps loading underneath. */
function SlowPill({ card }: { card: PlaylistCard }) {
  return (
    <div
      role="status"
      className="fixed inset-x-0 bottom-0 z-40 flex justify-center p-4 pb-[calc(env(safe-area-inset-bottom)+20px)]"
    >
      <div className="flex animate-[rise_400ms_var(--ease)_both] items-center gap-3 rounded-pill bg-black/70 py-2 pl-5 pr-2 shadow-2xl ring-1 ring-white/15 backdrop-blur-md">
        <span className="text-sm text-text-dim">Taking a while…</span>
        <a
          href={card.url}
          target="_blank"
          rel="noopener noreferrer"
          className="pressable rounded-pill bg-white px-4 py-2 text-sm font-semibold text-black"
        >
          Open {card.domain} ↗
        </a>
      </div>
    </div>
  );
}

/** The only chrome: a back button (and ♥) that fade after a few idle seconds. */
function FloatingChrome({ card }: { card: PlaylistCard }) {
  const router = useRouter();
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    const sleep = () => setIdle(true);
    let timer = setTimeout(sleep, CHROME_IDLE_MS);
    const wake = () => {
      setIdle(false);
      clearTimeout(timer);
      timer = setTimeout(sleep, CHROME_IDLE_MS);
    };
    // Taps inside the cross-origin frame never reach us; focus moving into it (window blur) does.
    const events = ["pointerdown", "keydown", "scroll", "blur"] as const;
    events.forEach((e) => window.addEventListener(e, wake, { passive: true }));
    return () => {
      clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, wake));
    };
  }, []);

  const back = () => {
    if (hasInAppHistory()) router.back();
    else router.replace("/home");
  };

  const fade = `transition-opacity duration-200 ease-app ${idle ? "opacity-60" : "opacity-100"}`;
  return (
    <>
      <button
        type="button"
        onClick={back}
        aria-label="Back to Baaza"
        className={`pressable fixed left-3 top-[calc(env(safe-area-inset-top)+12px)] z-50 grid h-10 w-10 place-items-center rounded-pill bg-black/75 shadow-lg ring-1 ring-white/15 backdrop-blur-md ${fade}`}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M15 5l-7 7 7 7" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <FavoriteButton
        slug={card.slug}
        title={card.title}
        size="md"
        variant="floating"
        className={`fixed right-3 top-[calc(env(safe-area-inset-top)+12px)] z-50 ${fade}`}
      />
    </>
  );
}
