import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Movie Insight Builder",
  description: "Search a movie by IMDb ID and get AI sentiment insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
