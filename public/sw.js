// Baaza service worker: offline app shell, cached cover art.
// Third-party playlist sites are never touched: only same-origin requests are handled.

// Registered as /sw.js?v=<build id>, so every deploy installs a fresh worker and cache set.
const VERSION = new URL(self.location.href).searchParams.get("v") ?? "dev";
const SHELL_CACHE = `baaza-shell-${VERSION}`;
const RUNTIME_CACHE = `baaza-runtime-${VERSION}`;
const IMAGE_CACHE = `baaza-images-${VERSION}`;

const SHELL_PAGES = ["/", "/home", "/search", "/library", "/settings"];
const SHELL_ASSETS = [
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-maskable-512.png",
  "/apple-touch-icon.png",
];

// Precache the shell pages plus every hashed static asset they reference,
// so the shell hydrates offline even on the very first visit.
async function precacheShell() {
  const cache = await caches.open(SHELL_CACHE);
  await cache.addAll(SHELL_ASSETS);
  const assets = new Set();
  await Promise.all(
    SHELL_PAGES.map(async (path) => {
      const response = await fetch(path, { credentials: "same-origin" });
      if (!response.ok) return;
      const html = await response.clone().text();
      await cache.put(path, response);
      for (const match of html.matchAll(/\/_next\/static\/[^"'\s)\\]+/g)) assets.add(match[0]);
    }),
  );
  await cache.addAll([...assets]);
}

self.addEventListener("install", (event) => {
  event.waitUntil(precacheShell().then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  const keep = new Set([SHELL_CACHE, RUNTIME_CACHE, IMAGE_CACHE]);
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith("baaza-") && !keep.has(key)).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(request, RUNTIME_CACHE));
  } else if (url.pathname.startsWith("/images/") || url.pathname === "/_next/image") {
    event.respondWith(staleWhileRevalidate(request, IMAGE_CACHE));
  } else if (request.mode === "navigate") {
    event.respondWith(networkFirst(request, () => matchShell(url.pathname)));
  } else if (request.headers.get("RSC") === "1" || url.searchParams.has("_rsc")) {
    // Client-side navigation payloads.
    event.respondWith(networkFirst(request, () => undefined));
  }
});

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) (await caches.open(cacheName)).put(request, response.clone());
  return response;
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => cached ?? Response.error());
  return cached ?? network;
}

async function networkFirst(request, fallback) {
  try {
    const response = await fetch(request);
    if (response.ok) (await caches.open(RUNTIME_CACHE)).put(request, response.clone());
    return response;
  } catch (error) {
    const cached = (await caches.match(request)) ?? (await fallback());
    if (cached) return cached;
    throw error;
  }
}

// Offline navigation: the exact page if cached, else a tiny offline page. Never another
// route's HTML: the router would hydrate that route under the wrong URL.
async function matchShell(pathname) {
  return (await caches.match(pathname)) ?? offlinePage();
}

function offlinePage() {
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#000000"><title>Offline · Baaza</title>
<style>html,body{margin:0;height:100%;background:#000;color:#fff;font-family:system-ui,sans-serif}
main{height:100%;display:grid;place-content:center;text-align:center;padding:24px;gap:8px}
p{margin:0;color:#b3b3b3}a{color:#000;background:#1ed760;border-radius:9999px;padding:12px 24px;font-weight:600;text-decoration:none;margin-top:16px}</style>
</head><body><main><h1 style="margin:0">You're offline</h1>
<p>Playlists need a connection. Your library and search still work.</p>
<a href="/home">Back to Home</a></main></body></html>`;
  return new Response(html, { status: 503, headers: { "Content-Type": "text/html; charset=utf-8" } });
}
