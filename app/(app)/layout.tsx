import { SessionGate, ShellSkeleton } from "@/components/session-gate";
import { ShellVisitMarker } from "@/components/shell-visit-marker";
import { TabBar } from "@/components/tab-bar";

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <main className="mx-auto min-h-dvh max-w-5xl pb-[calc(var(--tab-bar-height)+env(safe-area-inset-bottom)+24px)]">
        <SessionGate fallback={<ShellSkeleton />}>{children}</SessionGate>
      </main>
      <TabBar />
      <ShellVisitMarker />
    </>
  );
}
