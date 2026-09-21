/**
 * Whether this document has shown an app screen before the current one.
 * Module state survives client-side navigations but resets on a cold start, which is
 * exactly when "back" must go to Home instead of leaving the app.
 */
let visitedShell = false;

export function markShellVisited() {
  visitedShell = true;
}

export function hasInAppHistory() {
  return visitedShell;
}
