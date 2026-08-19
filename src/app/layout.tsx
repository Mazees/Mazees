import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mada Putra Adhadriyanto — AI Full-Stack Developer",
  description: "Portfolio of Mada Putra Adhadriyanto (@Mazees), an Informatics student and AI Full-Stack Developer building AI applications, web applications, developer tools, and agentic systems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
