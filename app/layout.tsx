import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Redbubble Automation Agent",
  description: "Automated design generation and upload system for Redbubble",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
