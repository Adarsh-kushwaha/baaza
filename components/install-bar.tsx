"use client";

import { promptInstall, useInstallState, type InstallState } from "@/lib/install-prompt";
import { KEYS, useStored, writeRaw } from "@/lib/storage";

const parseDismissed = (raw: string | null) => raw === "1";

const HOW_TO: Partial<Record<InstallState, string>> = {
  ios: "Tap Share, then “Add to Home Screen”.",
  manual: "Open your browser menu (⋮), then “Install app” or “Add to Home screen”.",
};

/** One-time, dismissible nudge to install on phones. */
export function InstallBar() {
  const state = useInstallState();
  const dismissed = useStored(KEYS.installBarDismissed, parseDismissed);
  if (dismissed !== false || (state !== "available" && !HOW_TO[state])) return null;

  const dismiss = () => writeRaw(KEYS.installBarDismissed, "1");

  return (
    <div role="region" aria-label="Install Baaza" className="mx-4 mt-5 flex items-center gap-3 rounded-card bg-surface p-3">
      <p className="flex-1 text-sm">
        <span className="font-semibold">Install Baaza</span>
        <span className="block text-text-dim">{HOW_TO[state] ?? "Open it from your home screen, full-screen."}</span>
      </p>
      {state === "available" && (
        <button
          type="button"
          onClick={() => {
            dismiss();
            void promptInstall();
          }}
          className="pressable rounded-pill bg-accent px-4 py-2 text-sm font-semibold text-black"
        >
          Install
        </button>
      )}
      <button type="button" onClick={dismiss} aria-label="Dismiss" className="pressable grid h-8 w-8 place-items-center text-text-dim">
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
