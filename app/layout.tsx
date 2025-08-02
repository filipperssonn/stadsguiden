import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'),
  title: {
    template: "%s | Stadsguiden",
    default: "Stadsguiden - Upptäck din stad",
  },
  description:
    "Hitta de bästa restaurangerna, butikerna och sevärdheterna i din stad. Upptäck nya platser och utforska med dagens väder. Powered by Google Places API.",
  keywords: [
    "stadsguide",
    "restauranger",
    "butiker",
    "sevärdheter",
    "Karlstad",
    "Stockholm",
    "väder",
    "Google Places",
    "sök platser",
    "lokala företag",
    "kaféer",
    "shopping",
    "turism",
  ],
  authors: [{ name: "Stadsguiden Team" }],
  creator: "Stadsguiden",
  category: "Turism & Resor",
  classification: "Stadsguide och platssökning",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    shortcut: "/favicon.svg",
    apple: [
      { url: "/favicon.svg", sizes: "180x180" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "sv_SE",
    title: "Stadsguiden - Upptäck din stad",
    description:
      "Hitta de bästa restaurangerna, butikerna och sevärdheterna i din stad. Upptäck nya platser och utforska med dagens väder.",
    siteName: "Stadsguiden",
    url: "https://stadsguiden.vercel.app",
    images: [
      {
        url: "/logo.svg",
        width: 1200,
        height: 630,
        alt: "Stadsguiden - Upptäck din stad",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stadsguiden - Upptäck din stad",
    description:
      "Hitta de bästa restaurangerna, butikerna och sevärdheterna i din stad.",
    images: ["/logo.svg"],
    creator: "@stadsguiden",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  alternates: {
    canonical: "https://stadsguiden.vercel.app",
    languages: {
      "sv-SE": "https://stadsguiden.vercel.app",
    },
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
