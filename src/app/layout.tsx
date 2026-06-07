import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TFiverse - The Ultimate Cinematic Experience",
  description: "A premium database for heroes, movies, and cinematic tier lists.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Telugu:wght@400;700&family=Noto+Sans+Devanagari:wght@400;700&family=Noto+Sans+Kannada:wght@400;700&family=Noto+Sans+Tamil:wght@400;700&family=Noto+Sans+Malayalam:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-[100dvh] flex flex-col bg-black text-white relative">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

