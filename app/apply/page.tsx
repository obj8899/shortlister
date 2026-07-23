"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import StudentForm from "@/components/StudentForm";
import ThemeToggle from "@/components/ThemeToggle";

export default function ApplyPage() {
  return (
    <main className="min-h-screen bg-[var(--paper)] px-6 py-12 flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-wide text-[var(--ink-muted)] hover:text-[var(--ink)]"
          >
            <ArrowLeft size={14} /> Back
          </Link>
          <ThemeToggle />
        </div>
        <div className="text-center mb-8">
          <p className="font-mono text-xs uppercase tracking-widest text-[var(--ochre)] mb-2">
            Candidate review system
          </p>
          <h1 className="font-display text-4xl text-[var(--ink)] italic">Shortlister</h1>
        </div>
        <StudentForm />
      </div>
    </main>
  );
}