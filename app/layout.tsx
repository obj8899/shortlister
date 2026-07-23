import type { Metadata } from "next";
import { Jost, Newsreader, Space_Mono, Work_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

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
  title: "Shortlister — AI Candidate Review",
  description: "A staged AI pipeline for shortlisting candidates — explainable, bias-aware, and human-reviewed.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${newsreader.variable} ${workSans.variable} ${spaceMono.variable} ${jost.variable} antialiased`}>
        <script
          dangerouslySetInnerHTML={{
            __html: "if (localStorage.getItem('theme') === 'dark') document.documentElement.classList.add('dark');",
          }}
        />
        <Toaster richColors position="top-right" />
        {children}
      </body>
    </html>
  );
}
