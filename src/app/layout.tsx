import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const spaceMono = Space_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Vouch — The Truth Engine for Influencer Marketing",
  description:
    "Vouch is the definitive AI audit tool for influencer marketing. We provide raw, unfiltered data on engagement quality, fake followers, and brand safety.",
  keywords: [
    "influencer analytics",
    "AI marketing",
    "fake engagement detection",
    "brand safety",
    "influencer marketing",
    "ROI prediction",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${spaceMono.variable} antialiased grain-overlay`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
