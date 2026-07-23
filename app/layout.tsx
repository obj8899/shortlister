import type { Metadata } from "next";
import "./globals.css";
import { Newsreader, Work_Sans, Space_Mono, Jost } from "next/font/google";

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-gill",
  weight: ["400", "500", "600"],
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Shortlister — Candidate Review Ledger",
  description: "AI-assisted shortlisting pipeline for student candidates.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>   
      <body className={`${newsreader.variable} ${workSans.variable} ${spaceMono.variable} ${jost.variable} antialiased`}>
        <script
  dangerouslySetInnerHTML={{
    __html: `if (localStorage.getItem('theme') === 'dark') document.documentElement.classList.add('dark');`,
  }}
/>
        {children}
      </body>
    </html>
  );
}