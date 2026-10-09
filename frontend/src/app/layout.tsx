import type { Metadata } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-barlow",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Meridian Moto Group",
  description: "Fictional company created for recruitment assessment purposes only.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${barlowCondensed.variable}`}>
      <body className="bg-moto-bg text-moto-text min-h-screen flex flex-col antialiased selection:bg-moto-copper selection:text-white">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
