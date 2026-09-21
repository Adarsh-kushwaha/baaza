"use client";

import { useRef, useState } from "react";
import { SearchIcon, SearchOverlay } from "./search-overlay";

/** Search icon for page headers: opens the search overlay in place. */
export function HeaderSearch() {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);

  return (
    <>
      <button
        ref={button}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search playlists and categories"
        className="pressable grid h-9 w-9 place-items-center rounded-pill text-text"
      >
        <SearchIcon className="h-6 w-6" />
      </button>
      {open && (
        <SearchOverlay
          onClose={() => {
            setOpen(false);
            button.current?.focus();
          }}
        />
      )}
    </>
  );
}
