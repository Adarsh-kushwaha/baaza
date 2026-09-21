import { describe, expect, it } from "vitest";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { allCards, cardsByCategory, creators, frameUrl, getCardBySlug, imageSrc, searchCards } from "./playlists";

describe("cardsByCategory", () => {
  it("orders categories biggest first", () => {
    expect([...cardsByCategory.keys()]).toEqual([
      "Journeys",
      "Shops & Addas",
      "Regional",
      "Festivals",
      "Everyday",
      "Bhakti & Desh",
      "Late Night",
      "School Days",
      "Weddings",
    ]);
  });
});

describe("catalogue coverage", () => {
  it("puts every card in exactly one rail with the expected counts", () => {
    const counts = [...cardsByCategory.values()].map((cards) => cards.length);
    expect(counts).toEqual([27, 21, 16, 10, 8, 6, 6, 5, 4]);
    expect(counts.reduce((a, b) => a + b, 0)).toBe(allCards.length);
    expect(allCards).toHaveLength(103);
  });

  it("has unique slugs", () => {
    expect(new Set(allCards.map((c) => c.slug)).size).toBe(allCards.length);
  });
});

describe("getCardBySlug", () => {
  it("finds every card by its slug", () => {
    for (const card of allCards) expect(getCardBySlug(card.slug)).toBe(card);
  });

  it("returns undefined for an unknown slug", () => {
    expect(getCardBySlug("no-such-playlist")).toBeUndefined();
  });
});

describe("cover images", () => {
  const imageDir = join(process.cwd(), "public");
  const files = readdirSync(join(imageDir, "images"));

  it("resolves every non-null image to a served file", () => {
    for (const card of allCards) {
      const src = imageSrc(card);
      if (card.image === null) {
        expect(src).toBeNull();
      } else {
        expect(src).toBe(`/images/${card.image}`);
        expect(existsSync(join(imageDir, src!))).toBe(true);
      }
    }
  });

  it("has exactly one card per image file and only card 101 without art", () => {
    const referenced = allCards.map((c) => c.image).filter((i): i is string => i !== null);
    expect(referenced.sort()).toEqual([...files].sort());
    expect(allCards.filter((c) => c.image === null).map((c) => c.id)).toEqual([101]);
  });
});

describe("searchCards", () => {
  const slugs = (query: string) => searchCards(query).map((c) => c.slug);
  const titles = (query: string) => searchCards(query).map((c) => c.title);

  it("returns nothing for an empty or whitespace query", () => {
    expect(searchCards("")).toEqual([]);
    expect(searchCards("   \t ")).toEqual([]);
  });

  it("returns nothing for a query that matches no field", () => {
    expect(searchCards("zzqxj")).toEqual([]);
  });

  it("ignores case, extra whitespace and Latin diacritics", () => {
    const expected = slugs("cutting chai");
    expect(expected.length).toBeGreaterThan(0);
    expect(slugs("  CUTTING   Chai ")).toEqual(expected);
    expect(slugs("cutting chāi")).toEqual(expected);
  });

  it("finds a non-English card by its original title and by its English title", () => {
    expect(titles("हॉर्न ओके")).toContain("हॉर्न ओके प्लीज़");
    expect(titles("horn ok please")).toContain("हॉर्न ओके प्लीज़");
  });

  it("finds cards by creator with or without the @", () => {
    const withAt = slugs("@thehirenthakkar");
    expect(withAt).toHaveLength(2);
    expect(slugs("thehirenthakkar")).toEqual(withAt);
  });

  it("finds every card in a category by the category name", () => {
    const weddings = cardsByCategory.get("Weddings")!.map((c) => c.slug);
    expect(slugs("weddings")).toEqual(expect.arrayContaining(weddings));
  });

  it("finds cards by words in their description", () => {
    expect(titles("litti")).toEqual(["Chai Route Radio"]);
  });

  it("ranks title > English title > description matches", () => {
    const ids = searchCards("chai").map((c) => c.id);
    const titleHit = 61; // "Chai Route Radio"
    const titleEnHit = 87; // "चाय वाला" / "Chai Wala"
    const descriptionHit = 86; // "चाय टपरी", "Taazi chai…" only in description
    expect(ids.indexOf(titleHit)).toBeGreaterThanOrEqual(0);
    expect(ids.indexOf(titleHit)).toBeLessThan(ids.indexOf(titleEnHit));
    expect(ids.indexOf(titleEnHit)).toBeLessThan(ids.indexOf(descriptionHit));
  });

  it("never returns the same card twice", () => {
    for (const query of ["chai", "radio", "a", "@"]) {
      const found = slugs(query);
      expect(new Set(found).size).toBe(found.length);
    }
  });
});

describe("embeddable", () => {
  it("marks the known frame-refusing sites as not embeddable", () => {
    const blocked = allCards.filter((c) => c.embeddable === false).map((c) => c.domain);
    expect(blocked).toEqual(
      expect.arrayContaining([
        "chaitapri.vercel.app",
        "cutting-chai-xi.vercel.app",
        "chhath-geet.netlify.app",
        "hornokplease.xyz",
        "mandir-radio.vercel.app",
      ]),
    );
  });

  it("only uses true, false or unknown", () => {
    for (const card of allCards) expect([true, false, "unknown"]).toContain(card.embeddable);
  });
});

describe("creators", () => {
  it("lists each credited creator once, sorted, with their link", () => {
    const names = creators.map((c) => c.name);
    expect(new Set(names).size).toBe(names.length);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
    expect(names).toEqual(expect.arrayContaining(["@thehirenthakkar", "Vedansh Danot"]));
    expect(creators.find((c) => c.name === "@chakra5027")?.url).toBe("https://x.com/chakra5027");
    expect(names).not.toContain(null);
  });
});

describe("frameUrl", () => {
  it("upgrades http sites to https so the frame is not blocked as mixed content", () => {
    expect(frameUrl({ url: "http://cuttingshop.lol" })).toBe("https://cuttingshop.lol");
    expect(frameUrl({ url: "http://example.com/a?b=http://x" })).toBe("https://example.com/a?b=http://x");
  });

  it("leaves https urls alone", () => {
    expect(frameUrl({ url: "https://chaitapri.vercel.app/" })).toBe("https://chaitapri.vercel.app/");
  });
});

describe("maker's playlists", () => {
  it.each([
    ["raju-mistri", "raju mistri", "राजू"],
    ["deluxe-salon", "deluxe salon", "सैलून"],
  ])("%s is in the catalogue, embeddable, and findable by either title", (slug, english, original) => {
    const card = getCardBySlug(slug);
    expect(card?.category).toBe("Shops & Addas");
    expect(card?.embeddable).toBe(true);
    expect(searchCards(english).map((c) => c.slug)).toContain(slug);
    expect(searchCards(original).map((c) => c.slug)).toContain(slug);
  });
});
