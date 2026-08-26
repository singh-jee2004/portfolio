import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tushar Singh | Full Stack Developer & AI Enthusiast",
  description:
    "Portfolio of Tushar Singh — Full Stack Developer specializing in React, Next.js, Node.js, and AI-powered applications. Building modern, scalable web experiences.",
  keywords: [
    "Tushar Singh",
    "Full Stack Developer",
    "React",
    "Next.js",
    "TypeScript",
    "AI Developer",
    "Portfolio",
  ],
  authors: [{ name: "Tushar Singh" }],
  creator: "Tushar Singh",
  openGraph: {
    type: "website",
    title: "Tushar Singh | Full Stack Developer",
    description:
      "Portfolio of Tushar Singh — Full Stack Developer & AI Enthusiast",
    siteName: "Tushar Singh Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tushar Singh | Full Stack Developer",
    description: "Full Stack Developer & AI Enthusiast",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <div className="noise-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
