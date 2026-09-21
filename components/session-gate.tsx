"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useSession } from "@/lib/use-session";

type SessionGateProps = {
  children: ReactNode;
  /** Shown while the session resolves or while redirecting to the sign-in gate. */
  fallback?: ReactNode;
};

/** Renders its children only for a signed-in session; otherwise sends the user to `/`. */
export function SessionGate({ children, fallback = null }: SessionGateProps) {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session === null) router.replace("/");
  }, [session, router]);

  if (!session) return fallback;
  return children;
}

export function ShellSkeleton() {
  return (
    <div role="status" aria-busy="true" aria-label="Loading" className="animate-pulse px-4 pt-[calc(env(safe-area-inset-top)+20px)]">
      <div className="h-7 w-44 rounded-pill bg-surface" />
      {[0, 1].map((row) => (
        <div key={row} className="mt-8">
          <div className="h-5 w-32 rounded-pill bg-surface" />
          <div className="mt-3 flex gap-3 overflow-hidden">
            {[0, 1, 2].map((tile) => (
              <div key={tile} className="aspect-square w-[150px] shrink-0 rounded-card bg-surface" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
