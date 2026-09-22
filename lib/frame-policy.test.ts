import { describe, expect, it } from "vitest";
import { frameVerdict } from "./frame-policy";

const us = "https://baaza.app";
const verdict = (headers: Record<string, string>, embedder = us) => frameVerdict(new Headers(headers), embedder);

describe("frameVerdict", () => {
  it("allows sites without framing headers", () => {
    expect(verdict({})).toBe("allowed");
    expect(verdict({ "content-security-policy": "upgrade-insecure-requests" })).toBe("allowed");
  });

  it("blocks X-Frame-Options DENY and SAMEORIGIN", () => {
    expect(verdict({ "x-frame-options": "DENY" })).toBe("blocked");
    expect(verdict({ "x-frame-options": "sameorigin" })).toBe("blocked");
  });

  it("ignores X-Frame-Options when frame-ancestors is present", () => {
    expect(verdict({ "x-frame-options": "DENY", "content-security-policy": "frame-ancestors *" })).toBe("allowed");
  });

  it("matches frame-ancestors sources", () => {
    const csp = (value: string) => ({ "content-security-policy": `default-src 'self'; frame-ancestors ${value}` });
    expect(verdict(csp("'none'"))).toBe("blocked");
    expect(verdict(csp("'self'"))).toBe("blocked");
    expect(verdict(csp("https:"))).toBe("allowed");
    expect(verdict(csp("'self' https://baaza.app"))).toBe("allowed");
    expect(verdict(csp("https://*.baaza.app"))).toBe("blocked");
    expect(verdict(csp("https://*.baaza.app"), "https://www.baaza.app")).toBe("allowed");
    expect(verdict(csp("http://localhost:4180"), "http://localhost:3000")).toBe("blocked");
    expect(verdict(csp("http://localhost:3000"), "http://localhost:3000")).toBe("allowed");
  });

  it("requires every policy to allow when several are sent", () => {
    expect(verdict({ "content-security-policy": "frame-ancestors *, frame-ancestors 'none'" })).toBe("blocked");
  });
});
