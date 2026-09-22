import { frameVerdict } from "@/lib/frame-policy";
import { frameUrl, getCardBySlug } from "@/lib/playlists";

export type EmbedCheck = { verdict: "allowed" | "blocked" | "unknown" };

const CHECK_TIMEOUT_MS = 6000;
// Sites vary headers by client; ask as the phone browser the frame will actually load in.
const MOBILE_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1";

/** Whether a catalogue site will render inside our frame, read from its live response headers. */
export async function GET(request: Request, ctx: RouteContext<"/api/embed/[slug]">) {
  const card = getCardBySlug((await ctx.params).slug);
  if (!card) return Response.json({ error: "unknown playlist" }, { status: 404 });

  let verdict: EmbedCheck["verdict"];
  try {
    const response = await fetch(frameUrl(card), {
      redirect: "follow",
      headers: { "user-agent": MOBILE_UA, accept: "text/html" },
      signal: AbortSignal.timeout(CHECK_TIMEOUT_MS),
      cache: "no-store",
    });
    void response.body?.cancel();
    verdict = frameVerdict(response.headers, new URL(request.url).origin);
  } catch {
    // Unreachable from the server doesn't mean unreachable from the phone; let the frame try.
    verdict = "unknown";
  }

  return Response.json({ verdict } satisfies EmbedCheck, {
    headers: {
      "Cache-Control":
        verdict === "unknown" ? "no-store" : "public, max-age=600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
