import type { Metadata } from "next";
import { LibraryScreen } from "@/components/library-screen";

export const metadata: Metadata = { title: "My Playlists" };

export default function LibraryPage() {
  return <LibraryScreen />;
}
