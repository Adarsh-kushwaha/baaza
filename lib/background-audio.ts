import { imageSrc, type PlaylistCard } from "./playlists";

/**
 * Keeps the player page counted as "playing audio" while it is hidden or the phone is locked.
 *
 * The music itself plays inside a cross-origin frame we cannot control. Browsers suspend or
 * pause media in hidden pages unless the top-level page holds an audio session, so we loop a
 * near-silent track in the top frame for as long as a player is open. It must first start
 * inside a user gesture (`primeBackgroundAudio`), after which `hold` can resume it freely.
 */

let audio: HTMLAudioElement | null = null;
let held = false;

/** Two seconds of noise at about -70 dBFS: inaudible, but loud enough to count as audible to the browser. */
function nearSilentWav(): string {
  const rate = 8000;
  const samples = rate * 2;
  const buffer = new ArrayBuffer(44 + samples * 2);
  const view = new DataView(buffer);
  const text = (offset: number, value: string) => [...value].forEach((c, i) => view.setUint8(offset + i, c.charCodeAt(0)));
  text(0, "RIFF");
  view.setUint32(4, 36 + samples * 2, true);
  text(8, "WAVE");
  text(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, rate, true);
  view.setUint32(28, rate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  text(36, "data");
  view.setUint32(40, samples * 2, true);
  for (let i = 0; i < samples; i++) view.setInt16(44 + i * 2, Math.round((Math.random() * 2 - 1) * 10), true);
  return URL.createObjectURL(new Blob([buffer], { type: "audio/wav" }));
}

function element(): HTMLAudioElement {
  if (!audio) {
    audio = new Audio(nearSilentWav());
    audio.loop = true;
    audio.preload = "auto";
    audio.setAttribute("playsinline", "");
    // Some browsers pause page media on interruptions (calls, other apps); pick it back up.
    audio.addEventListener("pause", () => {
      if (held && document.visibilityState === "visible") void audio?.play().catch(() => {});
    });
  }
  return audio;
}

/** Call from a tap/click handler: unlocks playback on iOS, which only allows starting media inside a gesture. */
export function primeBackgroundAudio() {
  const el = element();
  el.play()
    .then(() => {
      if (!held) el.pause();
    })
    .catch(() => {});
}

/** Keeps the audio session alive while a player is open. Returns the release function. */
export function holdBackgroundAudio(card: PlaylistCard): () => void {
  held = true;
  const el = element();
  void el.play().catch(() => {
    // Not unlocked yet (e.g. a deep link); the next tap on the page retries via primeBackgroundAudio.
  });

  const session = "mediaSession" in navigator ? navigator.mediaSession : null;
  if (session) {
    const art = imageSrc(card);
    session.metadata = new MediaMetadata({
      title: card.titleEn ?? card.title,
      artist: card.creator ?? card.domain,
      album: "Baaza",
      artwork: art ? [{ src: new URL(art, location.origin).href, sizes: "512x512" }] : [],
    });
    session.playbackState = "playing";
  }

  // If the system paused us while hidden (a call, another app's audio), resume on return.
  const onVisible = () => {
    if (document.visibilityState === "visible" && el.paused) void el.play().catch(() => {});
  };
  document.addEventListener("visibilitychange", onVisible);

  return () => {
    document.removeEventListener("visibilitychange", onVisible);
    held = false;
    el.pause();
    if (session) {
      session.metadata = null;
      session.playbackState = "none";
    }
  };
}
