import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Agentra AI — AI Voice & Agent Platform",
    template: "%s | Agentra AI",
  },
  description:
    "Build, deploy, and manage intelligent AI voice and chat agents for your business. Role-based AI agents for healthcare, restaurants, marketing, and more.",
  keywords: [
    "AI agent",
    "voice AI",
    "chatbot",
    "AI platform",
    "dental AI",
    "restaurant AI",
    "customer support AI",
  ],
  authors: [{ name: "Agentra AI" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://agentra.ai",
    siteName: "Agentra AI",
    title: "Agentra AI — AI Voice & Agent Platform",
    description:
      "Build, deploy, and manage intelligent AI voice and chat agents for your business.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Agentra AI",
    description: "Build, deploy, and manage intelligent AI agents",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>{children}</body>
    </html>
  );
}
