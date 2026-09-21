"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  {
    href: "/home",
    label: "Home",
    icon: <path d="M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z" />,
  },
  {
    href: "/search",
    label: "Search",
    icon: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" fill="none" strokeWidth="2.2" />
        <path d="m15.5 15.5 5 5" fill="none" strokeWidth="2.2" strokeLinecap="round" />
      </>
    ),
  },
  {
    href: "/library",
    label: "My Playlists",
    icon: <path d="M4 3h3v18H4zM9.5 3h3v18h-3zM14.6 3.8l2.9-.8 4.6 17.4-2.9.8z" />,
  },
  {
    href: "/settings",
    label: "Settings",
    icon: (
      <path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm8.4 5.1 1.8 1.4-2 3.4-2.1-.8a7.8 7.8 0 0 1-1.9 1.1l-.3 2.3h-4l-.3-2.3a7.8 7.8 0 0 1-1.9-1.1l-2.1.8-2-3.4 1.8-1.4a7.6 7.6 0 0 1 0-2.2L1.6 10l2-3.4 2.1.8a7.8 7.8 0 0 1 1.9-1.1L8 3.9h4l.3 2.4a7.8 7.8 0 0 1 1.9 1.1l2.1-.8 2 3.4-1.8 1.4a7.6 7.6 0 0 1 0 2.2z" />
    ),
  },
];

export function TabBar() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/5 bg-gradient-to-t from-black via-black/95 to-black/80 pb-[env(safe-area-inset-bottom)] backdrop-blur-md"
    >
      <ul className="mx-auto flex h-[var(--tab-bar-height)] max-w-xl items-stretch">
        {TABS.map((tab) => {
          const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={`pressable flex h-full flex-col items-center justify-center gap-1 text-[11px] font-medium ${
                  active ? "text-accent" : "text-text-dim"
                }`}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0" aria-hidden="true">
                  {tab.icon}
                </svg>
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
