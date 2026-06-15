import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz"],
});

export const metadata: Metadata = {
  title: {
    default: "International Youth Gathering — Media Ministry for the Nations",
    template: "%s | IYG",
  },
  description:
    "IYG uses media as a kingdom tool to connect young people worldwide through devotionals, teaching, podcasts, and live events.",
  keywords: ["Christian youth", "media ministry", "devotional", "prayer", "God-Life Conference", "Qavah Podcast"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.internationalyouthgathering.com",
    siteName: "International Youth Gathering",
    title: "International Youth Gathering — Media Ministry for the Nations",
    description: "IYG uses media as a kingdom tool to connect young people worldwide.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=630&fit=crop",
        width: 1200,
        height: 630,
        alt: "International Youth Gathering",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@international_youthgathering",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="bg-[#FAF8F3] text-[#1B2A4A] antialiased" style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#F2B134] focus:text-[#1B2A4A] focus:font-bold focus:rounded-lg">
          Skip to main content
        </a>
        <Navbar />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <MobileNav />
        <div className="h-16 lg:hidden" aria-hidden="true" />
      </body>
    </html>
  );
}
