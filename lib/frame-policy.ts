/**
 * Decides from a site's response headers whether a browser will let `embedder` frame it.
 * Browsers hide a refused frame from the parent page (it still fires `load`), so the only
 * reliable signal is the headers themselves, read server-side.
 */
export type FrameVerdict = "allowed" | "blocked";

export function frameVerdict(headers: Headers, embedder: string): FrameVerdict {
  const csp = headers.get("content-security-policy");
  const ancestors = csp ? frameAncestorLists(csp) : [];
  // Per spec, frame-ancestors (when present) overrides X-Frame-Options entirely.
  if (ancestors.length > 0) {
    return ancestors.every((sources) => sources.some((source) => sourceMatches(source, new URL(embedder))))
      ? "allowed"
      : "blocked";
  }

  const xfo = headers.get("x-frame-options");
  if (xfo && xfo.split(",").some((v) => ["deny", "sameorigin"].includes(v.trim().toLowerCase()))) return "blocked";
  return "allowed";
}

/** The source list of every frame-ancestors directive; several CSP headers arrive comma-joined. */
function frameAncestorLists(csp: string): string[][] {
  return csp
    .split(",")
    .flatMap((policy) => policy.split(";"))
    .map((directive) => directive.trim().split(/\s+/))
    .filter(([name]) => name?.toLowerCase() === "frame-ancestors")
    .map(([, ...sources]) => sources.map((s) => s.toLowerCase()));
}

function sourceMatches(source: string, embedder: URL): boolean {
  if (source === "*") return true;
  if (source === "'none'" || source === "'self'") return false; // 'self' is the framed site, never us
  if (/^[a-z][a-z0-9+.-]*:$/.test(source)) return embedder.protocol === source;

  const match = source.match(/^(?:([a-z][a-z0-9+.-]*):\/\/)?(\*\.)?([^/:]+)(?::(\d+|\*))?/);
  if (!match) return false;
  const [, scheme, wildcard, host, port] = match;
  if (scheme && `${scheme}:` !== embedder.protocol && !(scheme === "http" && embedder.protocol === "https:")) return false;
  const hostOk = wildcard ? embedder.hostname.endsWith(`.${host}`) : embedder.hostname === host;
  const portOk = !port || port === "*" || port === (embedder.port || (embedder.protocol === "https:" ? "443" : "80"));
  return hostOk && portOk;
}
