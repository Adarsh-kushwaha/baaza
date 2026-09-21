"use client";

import { useRef, useState } from "react";
import { CategoryChips, SearchIcon, SearchOverlay } from "./search-overlay";

/** Resting search field on the tab; tapping it raises the full-screen overlay. */
export function SearchScreen() {
  // null = closed; otherwise the query the overlay opens with.
  const [openWith, setOpenWith] = useState<string | null>(null);
  const restingField = useRef<HTMLButtonElement>(null);

  return (
    <div className="px-4 pt-[calc(env(safe-area-inset-top)+16px)]">
      <h1 className="text-2xl font-semibold tracking-tight">Search</h1>
      <button
        ref={restingField}
        type="button"
        onClick={() => setOpenWith("")}
        className="pressable mt-4 flex w-full items-center gap-3 rounded-card bg-white px-4 py-3 text-left text-[15px] font-medium text-black/60"
      >
        <SearchIcon className="text-black" />
        What do you want to listen to?
      </button>

      <h2 className="mt-8 text-lg font-semibold tracking-tight">Browse all</h2>
      <CategoryChips onPick={setOpenWith} />

      {openWith !== null && (
        <SearchOverlay
          initialQuery={openWith}
          onClose={() => {
            setOpenWith(null);
            restingField.current?.focus();
          }}
        />
      )}
    </div>
  );
}
