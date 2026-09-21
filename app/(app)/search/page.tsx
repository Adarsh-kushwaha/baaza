import type { Metadata } from "next";
import { SearchScreen } from "@/components/search-screen";

export const metadata: Metadata = { title: "Search" };

export default function SearchPage() {
  return <SearchScreen />;
}
