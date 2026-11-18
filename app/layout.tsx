import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Abhinav & Chandana | Wedding Invitation",
  description: "You are cordially invited to celebrate the wedding of Abhinav Viswateja and Chandana on 12 December 2026.",
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#f0ebe1" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
