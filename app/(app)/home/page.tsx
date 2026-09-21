import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/card";
import { FeaturedCard } from "@/components/featured-card";
import { Greeting } from "@/components/greeting";
import { HeaderSearch } from "@/components/header-search";
import { InstallBar } from "@/components/install-bar";
import { cardsByCategory, featuredCards, isFeatured } from "@/lib/playlists";

export const metadata: Metadata = { title: "Home" };

export default function HomePage() {
  return (
    <div className="pt-[calc(env(safe-area-inset-top)+16px)]">
      <header className="flex items-center justify-between px-4">
        <Greeting />
        <div className="flex items-center gap-2">
          <HeaderSearch />
          <Link
            href="/settings"
            aria-label="Settings"
            className="pressable grid h-9 w-9 place-items-center rounded-pill bg-accent text-sm font-bold text-black"
          >
            G
          </Link>
        </div>
      </header>

      <InstallBar />

      <section aria-labelledby="featured-heading" className="mt-6 px-4">
        <h2 id="featured-heading" className="text-xl font-semibold tracking-tight">
          Featured
        </h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:max-w-2xl">
          {featuredCards.map((card) => (
            <FeaturedCard key={card.slug} card={card} />
          ))}
        </div>
      </section>

      {[...cardsByCategory].map(([category, cards], index) => (
        <section key={category} aria-labelledby={`rail-${index}`} className="mt-7">
          <h2 id={`rail-${index}`} className="px-4 text-xl font-semibold tracking-tight">
            {category}
          </h2>
          <div className="no-scrollbar relative mt-3 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-1">
            {cards.map((card, i) => (
              <Card key={card.slug} card={card} eager={index === 0 && i < 3} morph={!isFeatured(card.slug)} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
