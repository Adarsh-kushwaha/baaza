"use client";

import { useDeferredValue, useRef, useState, useSyncExternalStore } from "react";
import { cardsByCategory, searchCards } from "@/lib/playlists";
import { addRecentSearch, clearRecentSearches, useRecentSearches } from "@/lib/use-recent-searches";
import { PlaylistRow } from "./playlist-row";

const CATEGORY_NAMES = [...cardsByCategory.keys()];

function subscribeViewport(onChange: () => void) {
  const viewport = window.visualViewport;
  viewport?.addEventListener("resize", onChange);
  return () => viewport?.removeEventListener("resize", onChange);
}

/** Height left above the on-screen keyboard (iOS ignores `interactive-widget`). */
function useVisibleHeight() {
  return useSyncExternalStore(subscribeViewport, () => window.visualViewport?.height ?? null, () => null);
}

type SearchOverlayProps = {
  initialQuery?: string;
  onClose: () => void;
};

/** Full-screen search over the catalogue, drawn above the tab bar. */
export function SearchOverlay({ initialQuery = "", onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);
  const deferredQuery = useDeferredValue(query);
  const results = searchCards(deferredQuery);
  const recents = useRecentSearches() ?? [];
  const hasQuery = query.trim() !== "";
  const visibleHeight = useVisibleHeight();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      className="fixed inset-x-0 top-0 z-50 flex h-dvh flex-col bg-bg pt-[env(safe-area-inset-top)]"
      style={visibleHeight ? { height: visibleHeight } : undefined}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <form
        role="search"
        className="flex items-center gap-2 px-3 py-2"
        onSubmit={(e) => {
          e.preventDefault();
          addRecentSearch(query);
          inputRef.current?.blur();
        }}
      >
        <label className="flex h-9 flex-1 items-center gap-2 rounded-pill bg-surface-hi px-3">
          <SearchIcon className="h-4 w-4 shrink-0 text-text-dim" />
          <span className="sr-only">Search playlists</span>
          <input
            ref={inputRef}
            autoFocus
            type="search"
            enterKeyHint="search"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search playlists"
            // 16px keeps iOS from zooming in on focus.
            className="search-input h-full min-w-0 flex-1 bg-transparent text-[16px] outline-none placeholder:text-text-dim"
          />
        </label>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close search"
          className="pressable grid h-9 w-9 shrink-0 place-items-center rounded-pill text-text-dim"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </button>
      </form>

      <div className="flex-1 overflow-y-auto overscroll-contain pb-[calc(env(safe-area-inset-bottom)+24px)]">
        {!hasQuery ? (
          <div className="px-4">
            {recents.length > 0 && (
              <section aria-labelledby="recent-heading" className="mb-6">
                <div className="flex items-center justify-between">
                  <h2 id="recent-heading" className="text-lg font-semibold tracking-tight">
                    Recent searches
                  </h2>
                  <button type="button" onClick={clearRecentSearches} className="pressable text-sm text-text-dim">
                    Clear
                  </button>
                </div>
                <ul className="mt-2">
                  {recents.map((recent) => (
                    <li key={recent}>
                      <button type="button" onClick={() => setQuery(recent)} className="pressable w-full py-2.5 text-left">
                        {recent}
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            <h2 className="text-lg font-semibold tracking-tight">Browse all</h2>
            <CategoryChips onPick={setQuery} />
          </div>
        ) : results.length > 0 ? (
          <ul aria-label={`Results for ${query}`}>
            {results.map((card) => (
              <PlaylistRow key={card.slug} card={card} morph={false} onOpen={() => addRecentSearch(query)} />
            ))}
          </ul>
        ) : (
          <div className="px-4 pt-10">
            <p className="text-center text-lg font-semibold tracking-tight">
              No results found for “{query.trim()}”
            </p>
            <p className="mt-1 text-center text-sm text-text-dim">Try another word, or browse a category.</p>
            <CategoryChips onPick={setQuery} />
          </div>
        )}
      </div>
    </div>
  );
}

export function CategoryChips({ onPick }: { onPick: (category: string) => void }) {
  return (
    <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
      {CATEGORY_NAMES.map((category, i) => (
        <li key={category}>
          <button
            type="button"
            onClick={() => onPick(category)}
            className="pressable flex h-16 w-full items-end rounded-card p-3 text-left font-semibold tracking-tight"
            style={{ background: `hsl(${(i * 47 + 140) % 360} 55% 32%)` }}
          >
            {category}
          </button>
        </li>
      ))}
    </ul>
  );
}

export function SearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <path d="m15.5 15.5 5 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}
