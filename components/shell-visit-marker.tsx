"use client";

import { useEffect } from "react";
import { markShellVisited } from "@/lib/nav-history";

/** Records that an app screen was shown, so the play screen's back button can use history. */
export function ShellVisitMarker() {
  useEffect(() => markShellVisited(), []);
  return null;
}
