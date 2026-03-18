import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Food Gene",
  description: "AI tools for food image analysis, ingredient extraction, and chat.",
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
