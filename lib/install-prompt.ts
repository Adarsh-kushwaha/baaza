import { useSyncExternalStore } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

/**
 * - `available`: the browser handed us an install prompt to fire.
 * - `ios`: iOS Safari, which only installs via the Share sheet.
 * - `manual`: a phone browser that gave us no prompt (e.g. not yet eligible, or plain HTTP);
 *   the user can still install from the browser menu.
 * - `installed`: already running as an installed app.
 * - `unavailable`: desktop with nothing to offer.
 */
export type InstallState = "available" | "ios" | "manual" | "installed" | "unavailable";

let deferred: BeforeInstallPromptEvent | null = null;
let justInstalled = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

/** Called once from the root layout so the event is caught on whichever page fires it. */
export function captureInstallPrompt() {
  const onPrompt = (event: Event) => {
    event.preventDefault();
    deferred = event as BeforeInstallPromptEvent;
    emit();
  };
  const onInstalled = () => {
    deferred = null;
    justInstalled = true;
    emit();
  };
  window.addEventListener("beforeinstallprompt", onPrompt);
  window.addEventListener("appinstalled", onInstalled);
  return () => {
    window.removeEventListener("beforeinstallprompt", onPrompt);
    window.removeEventListener("appinstalled", onInstalled);
  };
}

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isIos() {
  const ua = navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

function getState(): InstallState {
  if (justInstalled || isStandalone()) return "installed";
  if (deferred) return "available";
  if (isIos()) return "ios";
  if (window.matchMedia("(pointer: coarse)").matches) return "manual";
  return "unavailable";
}

export function useInstallState(): InstallState {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getState,
    () => "unavailable",
  );
}

export async function promptInstall() {
  const event = deferred;
  if (!event) return;
  // A prompt can only be used once.
  deferred = null;
  emit();
  await event.prompt();
}
