"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowLeft, BriefcaseBusiness, Code2, GraduationCap } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--paper)] px-6 py-14">
      <div className="mx-auto max-w-2xl">
        <div className="mb-10 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wide text-[var(--ink-muted)] hover:text-[var(--ink)]">
            <ArrowLeft size={14} /> Back
          </Link>
          <ThemeToggle />
        </div>

        <motion.div variants={container} initial="hidden" animate="show">
          <motion.p variants={item} className="mb-2 font-mono text-xs uppercase tracking-widest text-[var(--ochre)]">
            About the creator
          </motion.p>
          <motion.h1 variants={item} className="font-gill mb-6 text-4xl text-[var(--ink)] md:text-5xl">
            Ojass Bhatt
          </motion.h1>

          <motion.div variants={item} className="liquid-glass mb-6 rounded-sm p-6">
            <div className="mb-3 flex items-start gap-3">
              <GraduationCap size={20} className="mt-0.5 text-[var(--ledger)]" strokeWidth={1.75} />
              <p className="text-sm text-[var(--ink-muted)]">
                Third-year B.Tech CSE (Data Science) student at Pranveer Singh Institute of Technology, Kanpur. Secretary of the Vyomnauts Club, and actively building toward software engineering placements at top-tier product companies.
              </p>
            </div>
          </motion.div>

          <motion.p variants={item} className="mb-6 text-[var(--ink-muted)]">
            Shortlister is an end-to-end AI candidate shortlisting platform, built from the ground up — a staged pipeline of rule-based filtering, semantic embeddings, structured LLM evaluation, and human-reviewed ranking, with full explainability and bias tracking at every stage.
          </motion.p>

          <motion.div variants={item} className="flex gap-4">
            <a href="https://github.com/obj8899" target="_blank" rel="noopener noreferrer" className="liquid-glass flex items-center gap-2 rounded-sm px-4 py-2.5 text-sm text-[var(--ink)] transition-shadow hover:shadow-md">
              <Code2 size={16} /> GitHub
            </a>
            <a href="https://linkedin.com/in/ojass-bhatt-15a09a320" target="_blank" rel="noopener noreferrer" className="liquid-glass flex items-center gap-2 rounded-sm px-4 py-2.5 text-sm text-[var(--ink)] transition-shadow hover:shadow-md">
              <BriefcaseBusiness size={16} /> LinkedIn
            </a>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
