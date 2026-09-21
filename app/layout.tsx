import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PwaRuntime } from "@/components/pwa-runtime";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "Baaza", template: "%s · Baaza" },
  description: "Indian internet radio, one tap away",
  applicationName: "Baaza",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Baaza" },
  icons: { apple: "/apple-touch-icon.png" },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full bg-bg antialiased`}
    >
      <body className="min-h-full bg-bg font-sans text-text">
        {children}
        <PwaRuntime />
      </body>
    </html>
  );
}
