# Baaza v1 — Spotify-style PWA for Indian internet radio

Status: ready-for-agent

## Problem Statement

There are around a hundred small, community-made Indian playlist and internet-radio sites: chai-shop radios, train-journey playlists, festival mixes, regional stations, wedding sets. Each one lives at its own URL and was shared once on X by its creator, then scattered. A listener who likes the genre has no single place to find them, no way to browse them by mood or occasion, no way to remember the ones they liked, and every visit means leaving whatever they were doing to open yet another tab on yet another domain. On a phone this is worse: each site is a separate browser tab with Safari/Chrome chrome around it, and there is no app-like home to come back to.

The catalogue of these sites already exists as 101 card records with cover art, but nothing renders it. The repository is still the `create-next-app` starter page.

## Solution

Baaza: a dark, Spotify-styled, installable web app that lists all 101 playlist cards, grouped into category rails on a home feed. Users search them instantly, keep favourites in "My Playlists", and open any card inside the app. The site loads full-screen in an in-app browser that appears to grow out of its own cover art. A single floating back button returns the user to exactly where they were. Sites that refuse to be framed open in a new tab behind a short "Opening …" sheet, so the exit still feels intentional.

Sign-in is cosmetic in v1: a "Continue with Google" button creates a local guest session. The app installs to the home screen on Android and iOS, and its shell, feed, search and cover art work offline.

## User Stories

### Sign-in gate

1. As a first-time visitor, I want to see a full-bleed black screen with the Baaza wordmark and a single "Continue with Google" button, so that I know immediately what the app is and how to get in.
2. As a first-time visitor, I want the Google button to look like the standard Google sign-in mark, so that it feels familiar and trustworthy.
3. As a visitor, I want tapping "Continue with Google" to take me straight to the home feed with no pop-ups or account pickers, so that getting in costs one tap.
4. As a returning user with an existing session, I want opening the app at the root to send me straight to the home feed, so that I never see the sign-in screen again.
5. As a returning user, I want no flash of the sign-in screen while my session is being checked, so that the app feels native rather than a web page reloading.
6. As a user without a session, I want any attempt to open an in-app route to return me to the sign-in gate, so that the app's entry flow is consistent.
7. As a product owner, I want the fake sign-in isolated behind a single session interface and a public feature flag, so that real Google auth can replace it later without touching the UI.

### App shell and navigation

8. As a user, I want a bottom tab bar with Home, Search, My Playlists and Settings, so that I can move between the app's main areas with my thumb.
9. As a user, I want the active tab highlighted in the accent green, so that I always know where I am.
10. As an iPhone user with the app installed, I want the tab bar to sit above the home indicator, so that I never tap the system gesture area by accident.
11. As a user, I want the entire app to be true black with white and dim-grey text, so that it looks like Spotify and is easy on the eyes and on OLED batteries.
12. As a user, I want pressed cards and buttons to shrink slightly, so that I get tactile feedback on every tap.
13. As a user, I want the app never to flash white between screens, so that the dark illusion is never broken.

### Home feed

14. As a user, I want a greeting at the top of Home that matches my local time of day ("Good morning" / "Good afternoon" / "Good evening"), so that the app feels personal.
15. As a user, I want an avatar next to the greeting that takes me to Settings, so that my profile is one tap away.
16. As a user, I want playlists grouped into horizontal rails by category, so that I can browse by mood or occasion.
17. As a user, I want the biggest categories first (Journeys, Shops & Addas, Regional, Festivals, Everyday, Bhakti & Desh, Late Night, School Days, Weddings), so that the richest rails are at the top, as on Spotify's home.
18. As a user, I want each rail to scroll horizontally with snap, so that tiles settle cleanly and don't stop half-cut.
19. As a user, I want each card to show square cover art, a single-line title, and a dim "Playlist · @creator" subtitle, so that I can scan quickly and know who made it.
20. As a user, I want long titles to truncate with an ellipsis instead of wrapping, so that rails stay tidy.
21. As a user, I want offline playlists shown dimmed with an "Offline" pill and not tappable, so that I don't waste a tap on a dead site.
22. As a user, I want a playlist with no cover art to show a distinctive generated gradient tile instead of a broken image, so that the feed never looks broken.
23. As a user, I want to see all 101 playlists reachable from the home feed, so that nothing in the catalogue is hidden.
24. As a user, I want to favourite a card directly from the feed, so that I can save something without opening it.
25. As a user on a slow connection, I want the home feed to render on the server with almost no client JavaScript, so that it appears fast.

### Search

26. As a user, I want the Search tab to show a resting search field, so that it's obvious I can type straight away.
27. As a user, I want tapping the field to raise a full-screen search overlay with the keyboard already up and the tab bar hidden, so that I can search without extra taps or distractions.
28. As a user, I want results to update instantly as I type, so that searching feels immediate.
29. As a user, I want search to work offline, so that I can still find a playlist on a train.
30. As a user, I want search to ignore case, extra spaces and diacritics, so that "chai", "Chai" and "chāi" all find the same thing.
31. As a user, I want to find a playlist by its original-language title, so that I can search the way the creator named it.
32. As a user, I want to find a non-English playlist by its English title too, so that I can search even when I can't type the original script.
33. As a user, I want to find playlists by category name, so that typing "wedding" surfaces the wedding rail's contents.
34. As a user, I want to find playlists by creator handle, so that I can see everything one person made.
35. As a user, I want to find playlists by words in their description, so that loosely remembered playlists still turn up.
36. As a user, I want title matches ranked above English-title, category, creator and description matches, in that order, so that the most likely result is at the top.
37. As a user with an empty query, I want a "Browse all" grid of the nine category chips, so that I have somewhere to go before typing.
38. As a user whose query matches nothing, I want my query echoed back with the category chips offered, so that I know the search ran and have a next step.
39. As a user, I want my last 8 searches remembered and shown when the overlay opens, so that I can repeat common searches in one tap.
40. As a user, I want to clear my recent searches, so that I control what the app remembers.
41. As a user, I want to open a result straight into the in-app browser, so that search leads directly to listening.

### In-app browser

42. As a user, I want tapping a card to open the playlist site full-screen inside Baaza, so that I never feel I've left the app.
43. As a user, I want the card's cover art to morph into the opening screen, so that the site appears to grow out of the card I tapped.
44. As a user, I want a blurred, full-screen version of the cover art with the title shown while the site loads, so that I never see a white flash or a half-painted third-party page.
45. As a user, I want the site to crossfade in once it has loaded, so that the reveal feels smooth.
46. As a user, I want music to start without tapping a second time, so that the tap on the card is the only gesture needed to listen.
47. As a user, I want no Baaza header bar over the site, so that the playlist gets the whole screen.
48. As a user, I want a single small floating back button in the top-left corner, clear of the notch, so that I can always get out.
49. As a user, I want the back button to fade after a few seconds of inactivity and return when I tap or scroll, so that it's there when I need it and out of the way when I don't.
50. As a user, I want the back button always to return me to Baaza, never to step back inside the playlist site, so that its behaviour is predictable.
51. As an Android user, I want the hardware/gesture back to close the in-app browser and restore my scroll position, so that the app behaves like a native app.
52. As an iOS user, I want the edge-swipe back gesture to do the same, so that the app behaves like a native app.
53. As a user who opened a shared playlist link directly, I want the back button to take me to Home rather than out of the app, so that I'm never stranded.
54. As a user, I want each playlist to have its own shareable URL, so that I can send a friend straight to it.
55. As a user, I want to favourite the playlist I'm listening to from inside the in-app browser, so that I can save it while it plays.
56. As a user, I want the playing site never to reload while I'm on it, so that my music is not interrupted by anything the app does.
57. As a user, I want the embedded site to be unable to ask for my location, microphone or camera, so that opening a playlist never triggers a scary permission prompt.
58. As a user, I want YouTube/Spotify embeds and the site's own saved state to keep working inside the frame, so that the playlist behaves as it does in a normal tab.

### Non-embeddable sites

59. As a user opening a site known to refuse framing, I want a short "Opening <title>…" sheet and then the site in a new tab, so that the exit feels deliberate rather than broken.
60. As a user opening a site that silently fails to load in the frame, I want Baaza to detect this within about four seconds and offer the same new-tab path, so that I'm never stuck staring at a poster.
61. As a returning user, I want Baaza to remember sites that failed to frame on my device and open them in a new tab straight away next time, so that I don't wait for the timeout again.
62. As a maintainer, I want a committed script that re-probes every live site's framing headers and records whether each card is embeddable, so that the catalogue's embeddability stays current when cards are added.

### My Playlists

63. As a user, I want a My Playlists tab that lists my favourites newest-first, so that my most recent saves are easiest to reach.
64. As a user, I want My Playlists shown as a vertical list with a small thumbnail and two lines of text, so that it scans like Spotify's library.
65. As a new user with no favourites, I want an empty state telling me to tap ♥ on any playlist, so that I know how to fill it.
66. As a user, I want unfavouriting to remove the item from My Playlists immediately, so that the list is always accurate.
67. As a user with Baaza open in two tabs, I want favouriting in one to appear in the other, so that my library never goes stale.
68. As a user, I want the ♥ state to be the same everywhere a card appears (feed, search, in-app browser, library), so that the app never contradicts itself.

### Settings

69. As a user, I want a profile row showing my guest identity, so that I can see who I'm "signed in" as.
70. As an Android/desktop Chrome user, I want an "Add to Home Screen" button that triggers the browser's install prompt, so that installing is one tap.
71. As an iOS user, I want Share-sheet install instructions instead of a button that can't work, so that I can still install.
72. As a user, I want a one-time, dismissible install bar on Home, so that I discover installation without being nagged.
73. As a user, I want to clear all favourites, so that I can start my library over.
74. As a user, I want to clear recent searches from Settings, so that I don't have to open search to do it.
75. As a user, I want to sign out, so that the device returns to the sign-in gate.
76. As a user, I want to see the app version and a credit line pointing to the playlist creators, so that the people who made these sites get recognition.

### Installable PWA

77. As an Android user, I want Chrome to offer to install Baaza, so that it lives on my home screen like an app.
78. As an iOS user, I want the installed app to open full-bleed with a translucent black status bar and no Safari chrome, so that it looks native.
79. As a user, I want a proper Baaza icon on my home screen on both Android (including adaptive/maskable shapes) and iOS, so that it looks like a real app.
80. As a user, I want the installed app to open in portrait, standalone mode, so that it behaves like a phone app.
81. As a user who is offline, I want the app shell, feed and search to still open, so that the app never shows the browser's offline dinosaur.
82. As a user, I want cover art to load instantly from cache on repeat visits while it refreshes in the background, so that browsing is fast.
83. As a user, I want Baaza to never cache the third-party playlist sites, so that I always get the creator's live version.

### Accessibility and polish

84. As a user who prefers reduced motion, I want the cover-art morph and crossfade replaced by an instant swap, so that the app doesn't make me queasy.
85. As a keyboard user, I want visible focus rings on every interactive element, so that I can navigate without a mouse.
86. As a screen-reader user, I want the embedded frame titled with the playlist's name, so that I know what's playing.
87. As a user on a small 320 px-wide phone, I want nothing to overflow or overlap, so that the app works on older devices.
88. As a user whose browser lacks View Transitions, I want a plain cut instead of a broken animation, so that the app still works.

### Catalogue maintenance

89. As a maintainer adding a card, I want every card's cover image to exist and every image to belong to a card, so that the feed never shows a broken image and no stale files pile up.
90. As a maintainer, I want the catalogue to be a single typed static data source with no API or database, so that adding a card means editing one file.

## Implementation Decisions

### Stack and platform

- Next.js 16 App Router, React 19.2, TypeScript strict, Tailwind v4. Per AGENTS.md this Next version differs from older ones. Read the bundled Next docs before using any API: the file-convention manifest, metadata/viewport exports, ViewTransition, route-typed props.
- No backend, no API routes, no database, no auth SDK. Everything is static data plus browser storage.
- Dark theme only. No light mode, no toggle.

### Catalogue (playlist data module), the core module

- The raw card JSON moves into a dedicated data location and is imported directly (JSON module import). It is ~43 KB and ships in the server bundle, so there is no fetch and no API layer.
- One typed module is the single source of truth for cards. Its public interface:
  - `allCards`: every card, in stable order.
  - `cardsByCategory`: an ordered map of category → cards. Categories are ordered by descending card count, giving Journeys (27), Shops & Addas (19), Regional (16), Festivals (10), Everyday (8), Bhakti & Desh (6), Late Night (6), School Days (5), Weddings (4). Break ties by a fixed, deterministic rule so Bhakti & Desh and Late Night never swap between builds.
  - `getCardBySlug(slug)`: a card, or a not-found result for unknown slugs.
  - `searchCards(query)`: ranked matches (see Search).
  - A way to resolve a card's image to its served URL, or to "no image" so a slug-seeded gradient is used.
- Card shape (from the plan). `embeddable` is new, added by the probe script:

  ```ts
  type PlaylistCard = {
    id: number; slug: string; title: string
    titleEn: string | null          // set on 27 non-English titles
    description: string; url: string; domain: string
    category: Category              // union of the nine category names
    creator: string | null          // usually "@handle", sometimes a plain name; null on 19 cards
    creatorUrl: string | null
    status: "live" | "offline"
    image: string | null            // bare filename; null only on id 101
    embeddable: boolean | "unknown" // stamped by the probe
  }
  ```

- `Category` is a closed union of the nine names, so a typo in data or UI fails the typecheck.
- Offline cards (currently `fibeats`, id 12, and `corporate-majdoor-flame`, id 101) stay in the catalogue and feed but are marked non-interactive by the UI.

### Assets

- The cover-image folder moves under the public static directory so Next serves it. The image path is built at render time from the bare filename.
- Invariant: images and card `image` values correspond 1:1. There are 100 files and 100 references today, no orphans and no missing files. Exactly one card (id 101) has `image: null` and renders a gradient tile seeded from its slug.
- Cover art uses the Next image component, square with object-cover.

### Design system

- Tokens live as CSS variables mapped into Tailwind v4's `@theme inline` block (no Tailwind config file): background `#000000`, surface `#121212`, surface-hi `#1f1f1f`, text `#ffffff`, text-dim `#b3b3b3`, accent `#1ed760`, card radius 8px, pill radius 9999px.
- Geist stays as the font: tight tracking on headings, semibold rather than bold.
- One motion token: 200 ms, `cubic-bezier(0.2, 0, 0, 1)`. The press state is `scale(0.97)` and nothing else.
- Root `<html>` background is `#000` with `color-scheme: dark` to kill inter-page white flashes.
- `viewport-fit=cover` and safe-area insets on the tab bar and on the in-app browser's back button.
- Fix the root metadata, which still says "Create Next App".

### Routes

- `/`: the sign-in gate. It redirects to the home feed when a session exists.
- An app-shell route group with a shared layout: main content plus the tab bar, wrapped for view transitions. It redirects to `/` when there is no session and shows a shell skeleton until the session check resolves.
  - `/home`: category rails (Server Component).
  - `/search`: resting field plus overlay.
  - `/library`: My Playlists.
  - `/settings`.
- `/play/[slug]`: the in-app browser. Only live cards get a play URL; offline cards' URLs return not-found. It is outside the app-shell group, so there is no tab bar or header. It is a real route, not a modal, which gives browser history, Android back, iOS edge-swipe and shareable URLs for free. Unknown slugs get the not-found page.

### Session (fake auth)

- The session is a local-storage record under a namespaced key. It holds guest name, email, a null picture and a timestamp.
- One session interface (read / set / clear, exposed as a hook) is the only thing the UI talks to. A public env flag reserves the switch to real auth later; v1 implements only the fake path.
- The session check is client-side. The shell renders a skeleton until it resolves.

### Home

- The greeting uses the local hour: morning, afternoon or evening.
- There is one rail per category in catalogue order, with 150 px tiles and horizontal scroll-snap.
- It is a Server Component. The only client code is the favourite button and the press state.

### Search

- Search runs client-side over the full catalogue, so it is instant and works offline.
- Normalisation, applied to the query and every field: lowercase, strip Latin diacritics (NFD + remove U+0300–U+036F only), collapse whitespace, trim. Indic vowel signs and nuktas are combining marks too but are kept: stripping them would conflate distinct Devanagari/Telugu/Kannada words. NFD on both sides still makes precomposed and decomposed nukta forms match.
- Searchable fields in priority order: `title` > `titleEn` > `category` > `creator` > `description`. A card's rank is its best (highest-priority) matching field. Within a rank, order stays stable (catalogue order). Each card appears at most once.
- The creator handle matches with or without the leading `@`.
- Empty or whitespace-only query → no results; the UI shows the "Browse all" category chips.
- No matches → the UI echoes the query and shows the category chips.
- Recent searches: last 8 distinct non-empty normalised queries, most recent first, re-searching moves a query to the front, stored in local storage, clearable.
- The overlay autofocuses the input, hides the tab bar and pads for the on-screen keyboard.

### Browser storage layer

- A single storage module owns every local-storage key, all under a `baaza.` namespace: session, favourites, recent searches, learned non-embeddable slugs, and install-bar dismissal.
- All access is wrapped in try/catch and parses defensively. Corrupt or unavailable storage behaves as empty; it never throws into the UI.
- Favourites are an ordered array of slugs, newest first. Toggling adds to the front or removes the slug, and a slug is never duplicated. Slugs no longer in the catalogue are ignored when rendering.
- Favourites sync across tabs through the `storage` event.
- Sign-out clears only the session. Favourites and recents survive unless the user clears them explicitly in Settings.

### In-app browser

- Tapping a card pushes `/play/<slug>`. The floating back button calls router back. When there is no prior history (a cold start on a shared link), it replaces with `/home`.
- Chrome: a single 40 px circular translucent blurred button with a left chevron, top-left inside the safe area. It fades to 35% opacity after 3 s without interaction and returns to full on tap or scroll. An optional ♥ button mirrors it top-right.
- Transition:
  - Shared-element morph: React `ViewTransition` with a per-slug name wraps both the card's cover art and the play screen's poster.
  - Poster → frame crossfade: a blurred, scaled full-screen cover with a centred title paints first. The iframe mounts beneath it at zero opacity. On the frame's load event, the poster fades out over 260 ms and the frame fades in.
  - With reduced motion, both are replaced by an instant swap. Without View Transitions support, the change degrades to a plain cut.
- Frame attributes: `allow` exactly `autoplay; encrypted-media; fullscreen; picture-in-picture; clipboard-write`; referrer policy `no-referrer-when-downgrade`; title = card title. No `sandbox` attribute: it breaks YouTube/Spotify embeds and in-site storage. No geolocation, microphone or camera permissions, so the frame cannot prompt for them.
- The frame is keyed on slug only and never remounts while the user is on that play route, so audio is never interrupted by app state changes. Leaving the route stops audio; that is accepted for v1.
- Embeddability decision per open:
  - Card `embeddable: false`, or the slug is in the learned non-embeddable list → skip the frame. Show the "Opening <title>…" sheet, then open the URL in a new tab with `noopener`.
  - `true` or `"unknown"` → mount the frame and start a ~4 s watchdog. If the load event hasn't fired when it expires, show the new-tab sheet (with a button, since the popup would be blocked without a fresh gesture) but keep the frame loading; a late `load` hides the sheet. The slug is added to the learned non-embeddable list only if the user leaves the play screen without the frame ever loading, so slow sites are not written off.
  - Caveat: Chromium fires `load` on frames refused by X-Frame-Options/CSP (it loads an error page), so the watchdog mostly catches hung or very slow sites. Known refusals come from the probe data, not the watchdog.
- Known non-embeddable today: `chaitapri.vercel.app`, `cutting-chai-xi.vercel.app`, `chhath-geet.netlify.app`, `hornokplease.xyz`, `mandir-radio.vercel.app`.

### Embeddability probe (tooling)

- A committed, manually run Node script. For every live card it fetches headers and reads `X-Frame-Options` and CSP `frame-ancestors`, then rewrites the card data in place with `embeddable: true | false | "unknown"`. `"unknown"` means a network error or an ambiguous policy.
- It is not part of the build, because 101 network calls in CI is a bad trade.

### Settings

- Rows: guest profile; Add to Home Screen (fires the captured `beforeinstallprompt`; on iOS shows Share-sheet instructions instead); Clear favourites; Clear recent searches; Sign out; version and creator credit.

### PWA

- Uses the Next file-convention manifest (no `next-pwa` dependency). It sets name and short name "Baaza", description "Indian internet radio, one tap away", start URL and scope `/`, `standalone`, `portrait`, and background and theme colour `#000000`.
- Icons: 192, 512, 512 maskable (with the safe-zone padding), plus a 180 px apple-touch icon. It also uses the Apple web-app metadata: capable, `black-translucent` status bar, title "Baaza".
- Service worker: hand-written, registered by a small client component in the root layout. It precaches the app shell and icons on install, serves cover images stale-while-revalidate, and handles navigations network-first with the shell as offline fallback. It never caches third-party playlist origins.
- Install prompt: the `beforeinstallprompt` event is captured once. It surfaces as the Settings button and as a one-time dismissible bar on Home; dismissal is persisted.

### Build order

1. Foundation: data move, catalogue module, tokens, metadata.
2. Shell and tab bar.
3. Cards and home.
4. Sign-in gate.
5. In-app browser and fallback.
6. View transitions.
7. Search.
8. Favourites and library.
9. Settings.
10. PWA.
11. Polish: safe areas, focus, reduced motion, 320 px check, device pass.

Every step ends in something runnable.

## Testing Decisions

- **Only one seam: the catalogue module's public interface** (`allCards`, `cardsByCategory`, `getCardBySlug`, `searchCards`, image resolution). All the app's rules that can be tested outside a browser meet here: category order, search normalisation and ranking, slug lookup, and the image invariant. Everything above it is UI wiring. Everything below it is static JSON.
- A good test here checks only external behaviour. It feeds real queries and slugs to the public functions and asserts on the cards returned and their order. It never inspects normaliser internals, intermediate indexes or private helpers. Tests run against the real catalogue data, not fixtures, so they also guard the data itself.
- Behaviours the seam should cover:
  - `cardsByCategory` yields the nine categories in the stated order with the stated counts. Together they account for all 101 cards.
  - `getCardBySlug` returns the right card for every slug and a not-found result for unknown ones; slugs are unique.
  - `searchCards`:
    - Case, diacritic and whitespace insensitivity.
    - A title hit ranks above a description hit.
    - `titleEn` finds non-English cards.
    - A creator matches with and without `@`.
    - A category name returns that category's cards.
    - An empty or whitespace query returns nothing.
    - A nonsense query returns nothing.
    - No duplicate cards appear in any result.
  - Image invariant: every non-null `image` resolves to a file that exists in the served image directory. Every file there is referenced by exactly one card. Only id 101 has no image.
  - Every card's `category` is one of the nine and every `status` is `live` or `offline`.
- **Test runner.** Vitest, node environment, scoped to the catalogue module's tests only (`npm test`). The plan originally shipped no runner; one was added so the agreed seam could be built test-first. The catalogue module must stay pure and framework-free (no React, no Next imports, no browser globals). Verification otherwise is `npm run lint`, `npx tsc --noEmit`, and a manual device pass.
- **Manual verification, needed for browser-bound behaviour that tests can't cover well:**
  - Open each of the five known non-embeddable domains and confirm the new-tab sheet appears.
  - Confirm the watchdog fires on a refused frame.
  - Confirm audio starts from the card tap alone.
  - Test Android back, iOS edge-swipe, and a cold start on a shared play link.
  - Toggle reduced motion, and disable the View Transitions API.
  - Check favourites sync across tabs.
  - Run a Lighthouse installability pass against a production build (never the dev server), then do a real home-screen install on iOS Safari and Android Chrome.
  - Load the offline shell with the network disabled.
  - Check layout at 320 px.
- Prior art: the catalogue tests themselves are the first; follow their style (real data, public interface only).

## Out of Scope

- Real Google OAuth, tokens, any backend or database, and cross-device sync of favourites.
- Hosting or playing audio ourselves. Baaza only frames or links creators' sites.
- Keeping audio playing after leaving the play screen (persistent background frame plus mini-player). Deferred to v2.
- Bypassing any site's framing policy (proxies, header stripping). The five blocked sites open in a new tab; only their owners can change that.
- Auto-dismissing cookie or consent dialogs inside framed sites.
- Stepping back within a framed site's own history.
- Server-side search, analytics and telemetry.
- Push notifications.
- Light theme or a theme toggle.
- Native app wrappers.
- Running the embeddability probe as part of the build or CI.

## Further Notes

- No domain glossary (`CONTEXT.md`) or ADRs exist yet. This spec uses the plan's vocabulary: **card** (one playlist record), **category** / **rail** (a home-feed row), **catalogue** (all cards), **in-app browser** / **play screen**, **embeddable**, **favourites** / **My Playlists**, **session**.
- The "Continue with Google" button is explicitly fake. It must not load any Google script or send any network request.
- The watchdog's "no load event" signal is heuristic: a cross-origin refused frame can't be inspected. Some slow-but-valid sites may be wrongly learned as non-embeddable on a bad connection. That is accepted for v1. Clearing site data resets it.
- Clearing site data also signs the user out and drops favourites. That is a known v1 limitation that real auth will fix.
- The source of truth for detail beyond this spec is the build plan document at the repo root.
