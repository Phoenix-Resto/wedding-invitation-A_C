import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Abhinav & Chandana | Wedding Invitation",
  description: "You are cordially invited to celebrate the wedding of Abhinav Viswateja and Chandana on 12 December 2026.",
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#f0ebe1" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=DM+Sans:wght@400;600&family=Noto+Serif+Telugu:wght@400;600;700&display=swap"
        />
        <link rel="preload" href="/images/ganesh-medallion.webp" as="image" type="image/webp" />
      </head>
      <body>{children}</body>
    </html>
  );
}
