"use client";

import { useEffect } from "react";
import { captureInstallPrompt } from "@/lib/install-prompt";

/** Registers the service worker (production only) and captures the install prompt. */
export function PwaRuntime() {
  useEffect(() => captureInstallPrompt(), []);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register(`/sw.js?v=${process.env.NEXT_PUBLIC_BUILD_ID}`, { scope: "/", updateViaCache: "none" }).catch(() => {
      // No offline support this visit; the app still works online.
    });
  }, []);

  return null;
}
