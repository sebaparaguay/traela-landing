import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PostHogAnalytics from "./PostHogAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  icons: {
    icon: [{ url: "/traela-logo-new.svg", type: "image/png" }],
    shortcut: "/traela-logo-new.svg",
    apple: "/traela-logo-new.svg",
  },
  title: "Traela — Compra como hablás",
  description: "Tu agente personal de compras en Paraguay.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-PY"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col"><PostHogAnalytics />{children}</body>
    </html>
  );
}
