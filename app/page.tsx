"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, GraduationCap, ShieldCheck } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function LandingPage() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-[var(--paper)]">
      <div className="aurora-bg pointer-events-none absolute inset-0">
        <div className="aurora-blob blob-1" />
        <div className="aurora-blob blob-2" />
        <div className="aurora-blob blob-3" />
        <div className="aurora-blob blob-4" />
      </div>

      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10"
      >
        <span className="font-gill text-lg text-[var(--ink)]">Shortlister</span>
        <div className="flex items-center gap-4">
          <Link href="/about" className="text-sm font-medium text-[var(--ink-muted)] transition-colors hover:text-[var(--ink)]">
            About
          </Link>
          <ThemeToggle />
        </div>
      </motion.nav>

      <div className="relative z-10 flex flex-1 items-center justify-center px-6">
        <motion.div variants={container} initial="hidden" animate="show" className="w-full max-w-2xl text-center">
          <motion.p variants={item} className="mb-3 font-mono text-xs uppercase tracking-widest text-[var(--ochre)]">
            Candidate review system
          </motion.p>
          <motion.h1 variants={item} className="mb-4 font-gill text-5xl text-[var(--ink)] md:text-6xl">
            Shortlister
          </motion.h1>
          <motion.p variants={item} className="mx-auto mb-6 max-w-md text-[var(--ink-muted)]">
            Every candidate reviewed in four stages — eligibility, relevance, depth, and rank — each entry stamped with the reasoning behind its outcome.
          </motion.p>

          <div className="grid gap-5 sm:grid-cols-2">
            <motion.div variants={item}>
              <Link href="/apply">
                <motion.div
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className="liquid-glass group flex h-full cursor-pointer flex-col items-center rounded-sm p-8 text-center transition-shadow hover:shadow-lg"
                >
                  <GraduationCap className="mb-4 text-[var(--ledger)]" size={32} strokeWidth={1.5} />
                  <h2 className="font-display mb-2 text-xl text-[var(--ink)]">I&apos;m applying</h2>
                  <p className="mb-4 text-sm text-[var(--ink-muted)]">Submit your details for review.</p>
                  <span className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wide text-[var(--ledger)]">
                    Continue
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </motion.div>
              </Link>
            </motion.div>

            <motion.div variants={item}>
              <Link href="/admin/login">
                <motion.div
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className="liquid-glass group flex h-full cursor-pointer flex-col items-center rounded-sm p-8 text-center transition-shadow hover:shadow-lg"
                >
                  <ShieldCheck className="mb-4 text-[var(--ochre)]" size={32} strokeWidth={1.5} />
                  <h2 className="font-display mb-2 text-xl text-[var(--ink)]">I&apos;m reviewing</h2>
                  <p className="mb-4 text-sm text-[var(--ink-muted)]">Access the admin dashboard.</p>
                  <span className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wide text-[var(--ochre)]">
                    Continue
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
