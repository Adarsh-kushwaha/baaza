import rawCards from "@/data/playlist_cards.json";

export const CATEGORIES = [
  "Journeys",
  "Shops & Addas",
  "Regional",
  "Festivals",
  "Everyday",
  "Bhakti & Desh",
  "Late Night",
  "School Days",
  "Weddings",
] as const;

export type Category = (typeof CATEGORIES)[number];

export type Embeddable = boolean | "unknown";

export type PlaylistCard = {
  id: number;
  slug: string;
  title: string;
  titleEn: string | null;
  description: string;
  url: string;
  domain: string;
  category: Category;
  creator: string | null;
  creatorUrl: string | null;
  status: "live" | "offline";
  image: string | null;
  embeddable: Embeddable;
};

type RawCard = Omit<PlaylistCard, "category" | "status" | "embeddable"> & {
  category: string;
  status: string;
  embeddable?: unknown;
};

function parseCard(raw: RawCard): PlaylistCard {
  if (!(CATEGORIES as readonly string[]).includes(raw.category)) {
    throw new Error(`Card ${raw.slug} has unknown category "${raw.category}"`);
  }
  if (raw.status !== "live" && raw.status !== "offline") {
    throw new Error(`Card ${raw.slug} has unknown status "${raw.status}"`);
  }
  return {
    ...raw,
    category: raw.category as Category,
    status: raw.status,
    embeddable: typeof raw.embeddable === "boolean" ? raw.embeddable : "unknown",
  };
}

export const allCards: readonly PlaylistCard[] = (rawCards as RawCard[]).map(parseCard);

/** Categories ordered by card count, biggest first; ties keep CATEGORIES order. */
export const cardsByCategory: ReadonlyMap<Category, readonly PlaylistCard[]> = new Map(
  CATEGORIES.map((category) => [category, allCards.filter((c) => c.category === category)] as const)
    .filter(([, cards]) => cards.length > 0)
    .sort(([a, aCards], [b, bCards]) => bCards.length - aCards.length || CATEGORIES.indexOf(a) - CATEGORIES.indexOf(b)),
);

const bySlug = new Map(allCards.map((card) => [card.slug, card]));

export function getCardBySlug(slug: string): PlaylistCard | undefined {
  return bySlug.get(slug);
}

/** Served URL of a card's cover art, or null when the card should render a gradient tile. */
export function imageSrc(card: Pick<PlaylistCard, "image">): string | null {
  return card.image === null ? null : `/images/${card.image}`;
}

/** Lowercase, strip Latin diacritics, collapse whitespace. Indic vowel signs are kept. */
export function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

type SearchField = (card: PlaylistCard) => string | null;

/** Fields in rank order: a card ranks by the first field that matches. */
const SEARCH_FIELDS: SearchField[] = [
  (c) => c.title,
  (c) => c.titleEn,
  (c) => c.category,
  (c) => c.creator && c.creator.replace(/^@/, ""),
  (c) => c.description,
];

const searchIndex = allCards.map((card) => ({
  card,
  fields: SEARCH_FIELDS.map((field) => normalize(field(card) ?? "")),
}));

/** Cards matching the query, best field match first; catalogue order within a rank. */
export function searchCards(query: string): PlaylistCard[] {
  const q = normalize(query).replace(/^@/, "");
  if (q === "") return [];
  return searchIndex
    .map(({ card, fields }) => ({ card, rank: fields.findIndex((f) => f.includes(q)) }))
    .filter(({ rank }) => rank !== -1)
    .sort((a, b) => a.rank - b.rank)
    .map(({ card }) => card);
}

export type Creator = { name: string; url: string | null };

/** Everyone credited on at least one card, once each, alphabetical. */
export const creators: readonly Creator[] = [
  ...new Map(allCards.flatMap((c) => (c.creator ? [[c.creator, c.creatorUrl] as const] : []))),
]
  .map(([name, url]) => ({ name, url }))
  .sort((a, b) => a.name.localeCompare(b.name));

/**
 * URL to load inside the in-app frame. Always https: an http frame on an https page is
 * blocked as mixed content. The probe marks sites without working https as not embeddable.
 */
export function frameUrl(card: Pick<PlaylistCard, "url">): string {
  return card.url.replace(/^http:\/\//, "https://");
}
