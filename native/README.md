# Native shells (iOS / Android)

Capacitor apps in `ios/` and `android/` that load the deployed site (`server.url` in
`capacitor.config.ts`, default `https://baaza.vercel.app`, override with `CAP_SERVER_URL`).
They exist for one reason: **music keeps playing with the phone locked or the app in the background**,
which a browser or home-screen PWA cannot do, because the playlist sites' players (mostly YouTube
embeds) pause themselves when the page turns hidden.

How:

- `native/www/keep-playing.js` is injected into every frame, cross-origin ones included, before page
  scripts run. It makes `document.visibilityState` always `"visible"` and swallows `visibilitychange`.
- **iOS** (`ios/App/App/BaazaViewController.swift`): adds that script as a `WKUserScript`, sets the
  audio session to `.playback`; `UIBackgroundModes: audio` in `Info.plist`.
- **Android** (`android/app/src/main/java/app/baaza/`): adds the script via
  `WebViewCompat.addDocumentStartJavaScript`; `PlaybackService` is a `mediaPlayback` foreground
  service started by the `Playback` plugin while a player is open (`lib/background-audio.ts`), so
  Android doesn't freeze the app. Off-origin navigations inside frames stay in the frame.

`native/www/index.html` is only the offline fallback page.

## Workflow

```bash
npm run native:sync   # after changing capacitor.config.ts or anything in native/www
npm run ios           # opens Xcode (needs full Xcode, not just Command Line Tools)
npm run android       # opens Android Studio
```

Web changes need no rebuild of the apps: deploy the site and reopen the app.
To try a local dev server on a device: `CAP_SERVER_URL=http://<lan-ip>:3000 npm run native:sync`
(and set `server.cleartext: true` temporarily for http).

## Store review risk

Keeping YouTube playing in the background works around YouTube's Premium-only background play
and goes against YouTube's API Terms. App Store / Play review may reject the app for it, and an
app that only wraps a website can also be rejected under App Store guideline 4.2 (minimum functionality).
