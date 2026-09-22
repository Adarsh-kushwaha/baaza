import type { CapacitorConfig } from "@capacitor/cli";

/**
 * The native shells load the deployed site rather than a static export: the app relies on
 * server routes (`/api/embed`) and Server Components, so there is nothing to bundle.
 * What the shells add is background audio; see `native/README.md`.
 */
const config: CapacitorConfig = {
  appId: "app.baaza",
  appName: "Baaza",
  // Shown only if the live site cannot be reached.
  webDir: "native/www",
  server: {
    url: process.env.CAP_SERVER_URL ?? "https://baaza.vercel.app",
    cleartext: false,
  },
  backgroundColor: "#000000",
  ios: {
    contentInset: "never",
  },
  android: {
    // Playlist sites are framed over https only (see `frameUrl`).
    allowMixedContent: false,
  },
};

export default config;
