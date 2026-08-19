import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mada Putra Adhadriyanto — Full-Stack AI Engineer",
  description:
    "Portfolio of Mada Putra Adhadriyanto (@Mazees), an Informatics student and Full-Stack AI Engineer exploring modern web development, intelligent AI applications, agentic workflows, and practical real-world AI implementations.",
};

import AosProvider from "@/components/AosProvider";
import MarkFloatingTrigger from "@/components/agent/MarkFloatingTrigger";
import MarkAgentOverlay from "@/components/agent/MarkAgentOverlay";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${jakartaSans.variable} ${jetbrainsMono.variable} font-sans min-h-screen flex flex-col antialiased selection:bg-primary/30 selection:text-primary-light text-textPrimary text-base`}
      >
        <AosProvider>
          {children}
          <MarkFloatingTrigger />
          <MarkAgentOverlay />
        </AosProvider>
      </body>
    </html>
  );
}
