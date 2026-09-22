// Builds public/collage.jpg, the sign-in backdrop, from every card's cover art.
// Re-run after adding cards: `npm run collage`.
import { readFileSync } from "node:fs";
import sharp from "sharp";

const cards = JSON.parse(readFileSync(new URL("../data/playlist_cards.json", import.meta.url), "utf8"));
const coverPath = (file) => new URL(`../public/images/${file}`, import.meta.url).pathname;

// Skip covers that would read as holes in the wall: flat (blank or near-black) or washed-out white.
const images = [];
for (const file of new Set(cards.map((c) => c.image).filter(Boolean))) {
  const [grey] = (await sharp(coverPath(file)).greyscale().stats()).channels;
  if (grey.stdev >= 30 && grey.mean <= 220) images.push(file);
}

const COLS = 6;
const TILE_W = 320;
const TILE_H = 180; // covers are mostly 16:9 screenshots
const GAP = 10;
const RADIUS = 14;
const rows = Math.ceil(images.length / COLS);
// Odd columns sit half a tile lower, masonry-style.
const STAGGER = Math.round((TILE_H + GAP) / 2);
const width = COLS * TILE_W + (COLS + 1) * GAP;
const height = rows * (TILE_H + GAP) + GAP + STAGGER;

// Seeded shuffle: neighbouring cards in the catalogue often share a palette.
let seed = 7;
const random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
for (let i = images.length - 1; i > 0; i--) {
  const j = Math.floor(random() * (i + 1));
  [images[i], images[j]] = [images[j], images[i]];
}

const mask = Buffer.from(
  `<svg width="${TILE_W}" height="${TILE_H}"><rect width="${TILE_W}" height="${TILE_H}" rx="${RADIUS}" ry="${RADIUS}"/></svg>`,
);

// Fill every cell; the last row wraps around to the start rather than leaving holes.
const cells = rows * COLS;
const tiles = await Promise.all(
  Array.from({ length: cells }, async (_, i) => {
    const file = images[i % images.length];
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const input = await sharp(coverPath(file))
      .resize(TILE_W, TILE_H, { fit: "cover", position: "attention" })
      .composite([{ input: mask, blend: "dest-in" }])
      .png()
      .toBuffer();
    return {
      input,
      left: GAP + col * (TILE_W + GAP),
      top: GAP + row * (TILE_H + GAP) + (col % 2 ? STAGGER : 0),
    };
  }),
);

await sharp({ create: { width, height, channels: 3, background: "#000000" } })
  .composite(tiles)
  .jpeg({ quality: 78, mozjpeg: true })
  .toFile(new URL("../public/collage.jpg", import.meta.url).pathname);

console.log(`collage.jpg: ${images.length} covers, ${width}×${height}`);
