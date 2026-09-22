"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { GoogleButton } from "@/components/google-button";
import { useSession } from "@/lib/use-session";
import collage from "@/public/collage.jpg";

export function SignInGate() {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) router.replace("/home");
  }, [session, router]);

  // Stay blank while resolving or redirecting, so a signed-in user never sees the gate flash.
  if (session !== null) return null;

  return (
    <div className="relative min-h-dvh overflow-hidden bg-black">
      <CollageBackdrop />

      <div className="relative flex min-h-dvh flex-col items-center justify-end px-6 pb-[calc(env(safe-area-inset-bottom)+40px)]">
        <div className="animate-[rise_700ms_var(--ease)_200ms_both] text-center">
          <p className="text-6xl font-bold tracking-tighter drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">Baaza</p>
          <p className="mt-3 text-lg text-white/80">Indian internet radio, one tap away.</p>
        </div>
        <div className="mt-10 flex w-full animate-[rise_700ms_var(--ease)_350ms_both] justify-center">
          <GoogleButton />
        </div>
      </div>
    </div>
  );
}

/** Every playlist's cover art in one tilted, slowly drifting wall, fading into black behind the sign-in. */
function CollageBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute left-1/2 top-1/2 w-[max(150vw,95vh)] -translate-x-1/2 -translate-y-1/2 -rotate-[8deg]">
        <div className="animate-[drift_60s_ease-in-out_infinite_alternate] motion-reduce:animate-none">
          <Image
            src={collage}
            alt=""
            preload
            placeholder="blur"
            sizes="max(150vw, 95vh)"
            className="h-auto w-full animate-[collage-in_1400ms_var(--ease)_both]"
          />
        </div>
      </div>
      {/* Legibility: a soft top shade for the status bar, a deep fade where the text sits. */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/10 via-35% to-black" />
      <div className="absolute inset-x-0 bottom-0 h-[55dvh] bg-gradient-to-t from-black via-black/85 to-transparent" />
    </div>
  );
}
