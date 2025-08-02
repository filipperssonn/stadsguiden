import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { CityProvider } from "@/lib/contexts/CityContext";
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
    "Hitta de bästa restaurangerna, butikerna och sevärdheterna i svenska städer. Upptäck nya platser och utforska med dagens väder. Powered by Google Places API.",
  keywords: [
    "stadsguide",
    "restauranger",
    "butiker",
    "sevärdheter",
    "Sverige",
    "svenska städer",
    "Stockholm",
    "Göteborg", 
    "Malmö",
    "Uppsala",
    "Linköping",
    "Örebro",
    "Västerås",
    "Helsingborg",
    "Jönköping",
    "Norrköping",
    "Lund",
    "Umeå",
    "Gävle",
    "Borås",
    "Eskilstuna",
    "Karlstad",
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
      "Hitta de bästa restaurangerna, butikerna och sevärdheterna i svenska städer. Upptäck nya platser och utforska med dagens väder.",
    siteName: "Stadsguiden",
    url: "https://stadsguiden.vercel.app",
    images: [
      {
        url: "/stadsguiden-logo.svg",
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
      "Hitta de bästa restaurangerna, butikerna och sevärdheterna i svenska städer.",
    images: ["/stadsguiden-logo.svg"],
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
  other: {
    'application-name': 'Stadsguiden',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Stadsguiden',
    'format-detection': 'telephone=no',
    'mobile-web-app-capable': 'yes',
    'msapplication-config': '/browserconfig.xml',
    'msapplication-TileColor': '#FFC107',
    'msapplication-tap-highlight': 'no',
    'theme-color': '#FFC107',
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
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Hoppa till huvudinnehåll
        </a>
        <CityProvider>
          {children}
        </CityProvider>
      </body>
    </html>
  );
}
