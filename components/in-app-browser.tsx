"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, ViewTransition } from "react";
import { rememberNotEmbeddable } from "@/lib/embed-memory";
import { hasInAppHistory } from "@/lib/nav-history";
import { imageSrc, type PlaylistCard } from "@/lib/playlists";
import { KEYS, parseStringArray, useStored } from "@/lib/storage";
import { artTransitionName, gradientFor } from "./cover";
import { FavoriteButton } from "./favorite-button";

/** How long a frame may take to fire `load` before we offer the new-tab fallback. */
const WATCHDOG_MS = 4000;
const CHROME_IDLE_MS = 3000;

export function InAppBrowser({ card }: { card: PlaylistCard }) {
  const refusedSlugs = useStored(KEYS.nonEmbeddable, parseStringArray);
  const [loaded, setLoaded] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const knownRefused = card.embeddable === false || (refusedSlugs?.includes(card.slug) ?? false);
  // Mount the frame only once storage is readable, so a remembered refusal never starts a load.
  const showFrame = !knownRefused && refusedSlugs !== undefined;

  // Remember the refusal only if the user leaves without the frame ever loading:
  // a slow site that loads late is never written off.
  const outcome = useRef({ timedOut: false, loaded: false });

  useEffect(() => {
    if (!showFrame || loaded) return;
    const timer = setTimeout(() => {
      outcome.current.timedOut = true;
      setTimedOut(true);
    }, WATCHDOG_MS);
    return () => clearTimeout(timer);
  }, [showFrame, loaded]);

  useEffect(() => {
    const slug = card.slug;
    const result = outcome.current; // mutated in place by the handlers above
    return () => {
      if (result.timedOut && !result.loaded) rememberNotEmbeddable(slug);
    };
  }, [card.slug]);

  return (
    <div className="fixed inset-0 bg-bg">
      {showFrame && (
        <iframe
          key={card.slug}
          src={card.url}
          title={card.title}
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture; clipboard-write"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={() => {
            outcome.current.loaded = true;
            setLoaded(true);
          }}
          className={`fixed inset-0 h-full w-full border-0 bg-bg transition-opacity duration-[260ms] ease-app motion-reduce:transition-none ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      <Poster card={card} hidden={loaded && showFrame} />
      {knownRefused && <OpeningSheet card={card} autoOpen />}
      {showFrame && timedOut && !loaded && <OpeningSheet card={card} autoOpen={false} />}
      <FloatingChrome card={card} />
    </div>
  );
}

/** Blurred full-screen cover shown until the frame paints; the card art morphs into it. */
function Poster({ card, hidden }: { card: PlaylistCard; hidden: boolean }) {
  const src = imageSrc(card);
  return (
    <div
      aria-hidden={hidden}
      className={`pointer-events-none fixed inset-0 transition-opacity duration-[260ms] ease-app motion-reduce:transition-none ${
        hidden ? "opacity-0" : "opacity-100"
      }`}
    >
      <ViewTransition name={artTransitionName(card.slug)} share="morph" default="none">
        <div className="absolute inset-0 overflow-hidden">
          {src ? (
            <Image src={src} alt="" fill priority sizes="100vw" className="scale-110 object-cover blur-2xl brightness-50" />
          ) : (
            <div className="h-full w-full brightness-75" style={{ background: gradientFor(card.slug) }} />
          )}
        </div>
      </ViewTransition>
      <div className="absolute inset-0 grid place-items-center px-8 text-center">
        <div>
          <p className="text-3xl font-semibold tracking-tight">{card.title}</p>
          {card.titleEn && <p className="mt-1 text-text-dim">{card.titleEn}</p>}
          <p className="mt-4 text-sm text-text-dim">Loading {card.domain}…</p>
        </div>
      </div>
    </div>
  );
}

type OpeningSheetProps = {
  card: PlaylistCard;
  /** Try opening the tab straight away; only works while the opening tap still counts as a gesture. */
  autoOpen: boolean;
};

/** New-tab fallback for sites that refuse (or fail) to load inside the app. */
function OpeningSheet({ card, autoOpen }: OpeningSheetProps) {
  const attempted = useRef(false);

  useEffect(() => {
    if (!autoOpen || attempted.current) return;
    attempted.current = true;
    // If the browser blocks this popup, the button below does the same thing with a real tap.
    window.open(card.url, "_blank", "noopener,noreferrer");
  }, [autoOpen, card.url]);

  return (
    <div role="region" aria-live="polite" aria-labelledby="opening-title" className="fixed inset-x-0 bottom-0 z-40 p-4 pb-[calc(env(safe-area-inset-bottom)+16px)]">
      <div className="mx-auto max-w-md rounded-card bg-surface p-5 shadow-2xl">
        <p id="opening-title" className="text-lg font-semibold tracking-tight">
          {autoOpen ? `Opening ${card.title}…` : `${card.title} is taking a while`}
        </p>
        <p className="mt-1 text-sm text-text-dim">
          {autoOpen
            ? `${card.domain} doesn’t allow playing inside other apps, so it opens in a new tab.`
            : `${card.domain} may not allow playing inside other apps. Keep waiting, or open it in a new tab.`}
        </p>
        <a
          href={card.url}
          target="_blank"
          rel="noopener noreferrer"
          className="pressable mt-4 block rounded-pill bg-accent py-3 text-center font-semibold text-black"
        >
          Open {card.domain}
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

  const fade = `transition-opacity duration-200 ease-app ${idle ? "opacity-35" : "opacity-100"}`;
  return (
    <>
      <button
        type="button"
        onClick={back}
        aria-label="Back to Baaza"
        className={`pressable fixed left-3 top-[calc(env(safe-area-inset-top)+12px)] z-50 grid h-10 w-10 place-items-center rounded-pill bg-black/45 backdrop-blur-md ${fade}`}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M15 5l-7 7 7 7" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <FavoriteButton
        slug={card.slug}
        title={card.title}
        size="md"
        className={`fixed right-3 top-[calc(env(safe-area-inset-top)+12px)] z-50 ${fade}`}
      />
    </>
  );
}
