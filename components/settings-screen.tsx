"use client";

import type { ReactNode } from "react";
import { promptInstall, useInstallState } from "@/lib/install-prompt";
import { creators } from "@/lib/playlists";
import { clearFavorites, useFavorites } from "@/lib/use-favorites";
import { clearRecentSearches, useRecentSearches } from "@/lib/use-recent-searches";
import { signOut, useSession } from "@/lib/use-session";

export function SettingsScreen() {
  const session = useSession();
  const favorites = useFavorites() ?? [];
  const recents = useRecentSearches() ?? [];

  return (
    <div className="px-4 pt-[calc(env(safe-area-inset-top)+16px)]">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>

      <div className="mt-6 flex items-center gap-4">
        <div className="grid h-14 w-14 place-items-center rounded-pill bg-accent text-xl font-bold text-black" aria-hidden="true">
          {session?.name.charAt(0) ?? "G"}
        </div>
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold tracking-tight">{session?.name}</p>
          <p className="truncate text-sm text-text-dim">{session?.email}</p>
        </div>
      </div>

      <ul className="mt-8 divide-y divide-white/5 overflow-hidden rounded-card bg-surface">
        <InstallRow />
        <Row
          label="Clear My Playlists"
          detail={favorites.length === 0 ? "Nothing saved" : `${favorites.length} saved`}
          action={<RowButton onClick={clearFavorites} disabled={favorites.length === 0}>Clear</RowButton>}
        />
        <Row
          label="Clear recent searches"
          detail={recents.length === 0 ? "No recent searches" : `${recents.length} remembered`}
          action={<RowButton onClick={clearRecentSearches} disabled={recents.length === 0}>Clear</RowButton>}
        />
        <Row label="Sign out" detail="Your saved playlists stay on this device" action={<RowButton onClick={signOut}>Sign out</RowButton>} />
      </ul>

      <section className="mt-10 text-sm text-text-dim">
        <p>Baaza v{process.env.NEXT_PUBLIC_APP_VERSION}</p>
        <p className="mt-2">
          Every playlist here is made and hosted by its creator. Baaza only opens their sites — thank you to all {creators.length}{" "}
          of them.
        </p>
        <details className="mt-3">
          <summary className="pressable cursor-pointer font-semibold text-text">Creators</summary>
          <ul className="mt-2 columns-2 gap-4">
            {creators.map(({ name, url }) => (
              <li key={name} className="truncate py-0.5">
                {url ? (
                  <a href={url} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline">
                    {name}
                  </a>
                ) : (
                  name
                )}
              </li>
            ))}
          </ul>
        </details>
      </section>
    </div>
  );
}

function InstallRow() {
  const state = useInstallState();
  if (state === "installed") return <Row label="Add to Home Screen" detail="Baaza is installed" />;
  if (state === "ios") {
    return <Row label="Add to Home Screen" detail="In Safari, tap Share, then “Add to Home Screen”." />;
  }
  if (state === "available") {
    return (
      <Row
        label="Add to Home Screen"
        detail="Open Baaza full-screen from your home screen"
        action={<RowButton onClick={() => void promptInstall()}>Install</RowButton>}
      />
    );
  }
  if (state === "manual") {
    return <Row label="Add to Home Screen" detail="Open your browser menu (⋮), then “Install app” or “Add to Home screen”." />;
  }
  return <Row label="Add to Home Screen" detail="Use your browser’s menu to install Baaza" />;
}

function Row({ label, detail, action }: { label: string; detail: string; action?: ReactNode }) {
  return (
    <li className="flex items-center gap-4 p-4">
      <div className="min-w-0 flex-1">
        <p className="font-medium">{label}</p>
        <p className="text-sm text-text-dim">{detail}</p>
      </div>
      {action}
    </li>
  );
}

function RowButton({ children, onClick, disabled = false }: { children: ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="pressable shrink-0 rounded-pill border border-white/30 px-4 py-1.5 text-sm font-semibold disabled:opacity-40"
    >
      {children}
    </button>
  );
}
