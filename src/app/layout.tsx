import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Japanese Vocabulary Trainer",
  description: "Learn Japanese vocabulary with spaced repetition",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" translate="no">
      <head>
        {/* Prevent automatic browser translation — vocabulary must stay in Japanese */}
        <meta name="google" content="notranslate" />
      </head>
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
