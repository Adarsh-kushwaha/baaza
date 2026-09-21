"use client";

import { useSyncExternalStore } from "react";

function greetingFor(hour: number) {
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  return "Good evening";
}

/** The hour is read once per render; nothing to subscribe to. */
const subscribeNever = () => () => {};

/** Uses the viewer's local hour, so it renders only on the client. */
export function Greeting() {
  const greeting = useSyncExternalStore(subscribeNever, () => greetingFor(new Date().getHours()), () => null);
  return (
    <h1 className="min-h-8 text-2xl font-semibold tracking-tight">
      {greeting ?? <span className="sr-only">Home</span>}
    </h1>
  );
}
