import type { Metadata } from "next";
import { Fraunces, Space_Mono, Work_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const fraunces = Fraunces({
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
      <body className={`${fraunces.variable} ${workSans.variable} ${spaceMono.variable} antialiased`}>
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
