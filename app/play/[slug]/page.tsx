import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InAppBrowser } from "@/components/in-app-browser";
import { SessionGate } from "@/components/session-gate";
import { allCards, getCardBySlug } from "@/lib/playlists";

export const dynamicParams = false;

export function generateStaticParams() {
  return allCards.filter((card) => card.status === "live").map((card) => ({ slug: card.slug }));
}

export async function generateMetadata({ params }: PageProps<"/play/[slug]">): Promise<Metadata> {
  const card = getCardBySlug((await params).slug);
  return card ? { title: card.titleEn ?? card.title, description: card.description } : {};
}

export default async function PlayPage({ params }: PageProps<"/play/[slug]">) {
  const card = getCardBySlug((await params).slug);
  if (!card || card.status === "offline") notFound();

  return (
    <SessionGate>
      <InAppBrowser card={card} />
    </SessionGate>
  );
}
