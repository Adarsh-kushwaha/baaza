"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { GoogleButton } from "@/components/google-button";
import { useSession } from "@/lib/use-session";

export function SignInGate() {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) router.replace("/home");
  }, [session, router]);

  // Stay blank while resolving or redirecting, so a signed-in user never sees the gate flash.
  if (session !== null) return null;

  return (
    <div className="flex min-h-dvh flex-col items-center justify-between px-6 pb-[calc(env(safe-area-inset-bottom)+48px)] pt-[30dvh]">
      <div className="text-center">
        <p className="text-5xl font-semibold tracking-tighter">Baaza</p>
        <p className="mt-3 text-text-dim">Indian internet radio, one tap away.</p>
      </div>
      <GoogleButton />
    </div>
  );
}
