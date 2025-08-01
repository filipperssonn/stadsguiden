import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Stadsguiden - Upptäck din stad",
  description:
    "Hitta de bästa restaurangerna, butikerna och sevärdheterna i din stad. Upptäck nya platser och utforska med dagens väder.",
  keywords: [
    "stadsguide",
    "restauranger",
    "butiker",
    "sevärdheter",
    "Stockholm",
    "väder",
  ],
  authors: [{ name: "Stadsguiden" }],
  creator: "Stadsguiden",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "sv_SE",
    title: "Stadsguiden - Upptäck din stad",
    description:
      "Hitta de bästa restaurangerna, butikerna och sevärdheterna i din stad.",
    siteName: "Stadsguiden",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stadsguiden - Upptäck din stad",
    description:
      "Hitta de bästa restaurangerna, butikerna och sevärdheterna i din stad.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv" className={inter.variable}>
      <body className={`${inter.className} antialiased font-sans`}>
        {children}
      </body>
    </html>
  );
}
