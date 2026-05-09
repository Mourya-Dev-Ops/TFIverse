import "./globals.css";
import type { Metadata } from "next";
import { SessionProvider } from 'next-auth/react';

export const metadata: Metadata = {
  title: "TFIverse - Telugu Film Industry Community",
  description: "Explore Telugu cinema, heroes, movies, tier lists, and reviews on TFIverse - the ultimate Telugu Film Industry platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="cinema-silver">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
      </head>
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
