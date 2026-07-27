"use client";

import Link from "next/link";
import { useEffect } from "react";
import { motion, type Variants, useReducedMotion } from "framer-motion";
import { ArrowLeft, BriefcaseBusiness, Code2, GraduationCap } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.15 } } };
const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

export default function AboutPage() {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    document.title = "About — Shortlister";
  }, []);

  const mainInitial = shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 };
  const mainTransition = shouldReduceMotion ? { duration: 0.1 } : { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any };

  const hoverCard = shouldReduceMotion ? undefined : { y: -4 };
  const hoverBtn = shouldReduceMotion ? undefined : { y: -2 };
  const tapBtn = shouldReduceMotion ? undefined : { scale: 0.97 };

  return (
    <motion.main
      initial={mainInitial}
      animate={{ opacity: 1, y: 0 }}
      transition={mainTransition}
      className="min-h-screen bg-[var(--paper)] px-6 py-14"
    >
      <div className="mx-auto max-w-2xl lg:max-w-5xl">
        <div className="mb-10 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wide text-[var(--ink-muted)] hover:text-[var(--ink)]">
            <ArrowLeft size={14} /> Back
          </Link>
          <ThemeToggle />
        </div>

        <div>
          {/* Header section animates on mount */}
          <motion.div variants={container} initial={shouldReduceMotion ? "show" : "hidden"} animate="show" className="mb-8">
            <motion.p variants={item} className="mb-2 font-mono text-xs uppercase tracking-widest text-[var(--ochre)]">
              Meet the creators
            </motion.p>
            <motion.h1 variants={item} className="font-display italic mb-6 text-4xl text-[var(--ink)] md:text-5xl">
              Meet the Creators
            </motion.h1>

            <motion.p variants={item} className="mb-8 text-[var(--ink-muted)] leading-relaxed">
              Shortlister is an end-to-end AI candidate shortlisting platform, built from the ground up — a staged pipeline of rule-based filtering, semantic embeddings, structured LLM evaluation, and human-reviewed ranking, with full explainability and bias tracking at every stage.
            </motion.p>
          </motion.div>

          {/* Grid section animates when scrolled into view */}
          <motion.div
            variants={container}
            initial={shouldReduceMotion ? "show" : "hidden"}
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Creator 1: Ojass Bhatt */}
            <motion.div
              variants={item}
              whileHover={hoverCard}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="liquid-glass rounded-sm p-6 flex flex-col justify-between transition-shadow hover:shadow-md cursor-default"
            >
              <div>
                <h2 className="font-display italic text-2xl text-[var(--ink)] mb-1">Ojass Bhatt</h2>
                <p className="font-mono text-xs uppercase tracking-wider text-[var(--ochre)] mb-4">
                  Backend & AI/ML Developer
                </p>

                <div className="mb-5 flex items-start gap-3">
                  <GraduationCap size={20} className="mt-0.5 text-[var(--ledger)] shrink-0" strokeWidth={1.75} />
                  <p className="text-sm text-[var(--ink-muted)] leading-relaxed">
                    Third-year B.Tech CSE (Data Science) student at Pranveer Singh Institute of Technology, Kanpur. Passionate about Artificial Intelligence, Machine Learning, and scalable software systems, actively building AI-powered solutions for software engineering placements.
                  </p>
                </div>

                <div className="mb-6">
                  <p className="font-mono text-xs uppercase tracking-wider text-[var(--ink)] mb-3 flex items-center gap-1.5">
                    Responsibilities
                  </p>
                  <ul className="space-y-2 text-sm text-[var(--ink-muted)] font-body">
                    <li className="flex items-start gap-2">
                      <span className="text-[var(--ochre)] shrink-0">•</span>
                      <span>Backend Architecture</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[var(--ochre)] shrink-0">•</span>
                      <span>REST API Development</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[var(--ochre)] shrink-0">•</span>
                      <span>Authentication & Authorization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[var(--ochre)] shrink-0">•</span>
                      <span>Business Logic Implementation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[var(--ochre)] shrink-0">•</span>
                      <span>AI/ML Model Development</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[var(--ochre)] shrink-0">•</span>
                      <span>Resume Parsing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[var(--ochre)] shrink-0">•</span>
                      <span>Feature Engineering</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[var(--ochre)] shrink-0">•</span>
                      <span>Candidate Shortlisting Engine</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[var(--ochre)] shrink-0">•</span>
                      <span>Model Deployment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[var(--ochre)] shrink-0">•</span>
                      <span>Backend Testing & Optimization</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-[var(--mist)] mt-6">
                <motion.a
                  whileHover={hoverBtn}
                  whileTap={tapBtn}
                  href="https://github.com/obj8899"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="liquid-glass flex items-center gap-2 rounded-sm px-4 py-2.5 text-sm text-[var(--ink)] transition-shadow hover:shadow-md cursor-pointer"
                >
                  <Code2 size={16} /> GitHub
                </motion.a>
                <motion.a
                  whileHover={hoverBtn}
                  whileTap={tapBtn}
                  href="https://linkedin.com/in/ojass-bhatt-15a09a320"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="liquid-glass flex items-center gap-2 rounded-sm px-4 py-2.5 text-sm text-[var(--ink)] transition-shadow hover:shadow-md cursor-pointer"
                >
                  <BriefcaseBusiness size={16} /> LinkedIn
                </motion.a>
              </div>
            </motion.div>

            {/* Creator 2: Palak Tripathi */}
            <motion.div
              variants={item}
              whileHover={hoverCard}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="liquid-glass rounded-sm p-6 flex flex-col justify-between transition-shadow hover:shadow-md cursor-default"
            >
              <div>
                <h2 className="font-display italic text-2xl text-[var(--ink)] mb-1">Palak Tripathi</h2>
                <p className="font-mono text-xs uppercase tracking-wider text-[var(--ochre)] mb-4">
                  Frontend & Database Developer
                </p>

                <div className="mb-5 flex items-start gap-3">
                  <GraduationCap size={20} className="mt-0.5 text-[var(--ledger)] shrink-0" strokeWidth={1.75} />
                  <p className="text-sm text-[var(--ink-muted)] leading-relaxed">
                    Third-year B.Tech CSE (Data Science) student at Pranveer Singh Institute of Technology, Kanpur. Passionate about building responsive user interfaces and designing efficient database systems for modern web applications.
                  </p>
                </div>

                <div className="mb-6">
                  <p className="font-mono text-xs uppercase tracking-wider text-[var(--ink)] mb-3 flex items-center gap-1.5">
                    Responsibilities
                  </p>
                  <ul className="space-y-2 text-sm text-[var(--ink-muted)] font-body">
                    <li className="flex items-start gap-2">
                      <span className="text-[var(--ochre)] shrink-0">•</span>
                      <span>UI/UX Development</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[var(--ochre)] shrink-0">•</span>
                      <span>Responsive Frontend Design</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[var(--ochre)] shrink-0">•</span>
                      <span>Student Dashboard</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[var(--ochre)] shrink-0">•</span>
                      <span>Forms & User Interface</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[var(--ochre)] shrink-0">•</span>
                      <span>API Integration</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[var(--ochre)] shrink-0">•</span>
                      <span>Database Schema Design</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[var(--ochre)] shrink-0">•</span>
                      <span>Database Management</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[var(--ochre)] shrink-0">•</span>
                      <span>Query Optimization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[var(--ochre)] shrink-0">•</span>
                      <span>Frontend Testing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[var(--ochre)] shrink-0">•</span>
                      <span>Deployment Support</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-[var(--mist)] mt-6">
                <motion.a
                  whileHover={hoverBtn}
                  whileTap={tapBtn}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="liquid-glass flex items-center gap-2 rounded-sm px-4 py-2.5 text-sm text-[var(--ink)] transition-shadow hover:shadow-md cursor-default"
                >
                  <Code2 size={16} /> GitHub
                </motion.a>
                <motion.a
                  whileHover={hoverBtn}
                  whileTap={tapBtn}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="liquid-glass flex items-center gap-2 rounded-sm px-4 py-2.5 text-sm text-[var(--ink)] transition-shadow hover:shadow-md cursor-default"
                >
                  <BriefcaseBusiness size={16} /> LinkedIn
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.main>
  );
}
