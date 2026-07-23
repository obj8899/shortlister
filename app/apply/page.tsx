"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import StudentForm from "@/components/StudentForm";
import ThemeToggle from "@/components/ThemeToggle";

export default function ApplyPage() {
  const [roleName, setRoleName] = useState("");

  useEffect(() => {
    document.title = "Apply — Shortlister";
  }, []);

  useEffect(() => {
    fetch("/api/role")
      .then((response) => response.json())
      .then((data) => setRoleName(data.roleName));
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--paper)] px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wide text-[var(--ink-muted)] hover:text-[var(--ink)]"
          >
            <ArrowLeft size={14} /> Back
          </Link>
          <ThemeToggle />
        </div>
        <div className="mb-8 text-center">
          <p className="mb-2 font-mono text-xs uppercase tracking-widest text-[var(--ochre)]">
            Candidate review system
          </p>
          <h1 className="font-display text-4xl italic text-[var(--ink)]">Shortlister</h1>
          {roleName && (
            <p className="mt-2 font-mono text-sm text-[var(--ochre)]">
              Currently hiring for: {roleName}
            </p>
          )}
        </div>
        <StudentForm />
      </div>
    </main>
  );
}
