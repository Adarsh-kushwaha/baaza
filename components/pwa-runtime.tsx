"use client";

import { useEffect } from "react";
import { primeBackgroundAudio } from "@/lib/background-audio";
import { captureInstallPrompt } from "@/lib/install-prompt";

/** Registers the service worker (production only), captures the install prompt and unlocks background audio. */
export function PwaRuntime() {
  useEffect(() => captureInstallPrompt(), []);

  useEffect(() => {
    // The tap that opens a player is the only gesture we get before the music starts in its frame.
    const onClick = (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest('a[href^="/play/"]')) primeBackgroundAudio();
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register(`/sw.js?v=${process.env.NEXT_PUBLIC_BUILD_ID}`, { scope: "/", updateViaCache: "none" }).catch(() => {
      // No offline support this visit; the app still works online.
    });
  }, []);

  return null;
}
