"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface CollegeStats {
  total: number;
  stage1Passed: number;
  stage2Passed: number;
  stage3Passed: number;
  shortlisted: number;
}

export default function BiasDashboard() {
  const [breakdown, setBreakdown] = useState<Record<string, CollegeStats>>({});
  const [loading, setLoading] = useState(true);

  const fetchBias = async () => {
    setLoading(true);
    const res = await fetch("/api/bias");
    const data = await res.json();
    setBreakdown(data.breakdown || {});
    setLoading(false);
  };

  useEffect(() => {
    fetchBias();
  }, []);

  const colleges = Object.entries(breakdown);

  return (
    <section className="bg-[var(--surface)] border border-[var(--mist)] rounded-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl text-[var(--ink)]">Diversity funnel</h2>
        <button
          onClick={fetchBias}
          className="text-xs font-mono uppercase tracking-wide text-[var(--ink-muted)] hover:text-[var(--ink)] enabled:hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-[var(--ink-muted)] italic">Loading…</p>
      ) : colleges.length === 0 ? (
        <p className="text-sm text-[var(--ink-muted)] italic">No candidates yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {colleges.map(([college, stats]) => {
            const survivalRate = stats.total > 0 ? Math.round((stats.shortlisted / stats.total) * 100) : 0;
            return (
              <div key={college} className="border border-[var(--mist)] rounded-sm p-4 bg-[var(--surface-soft)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[var(--ink)] font-medium">{college}</span>
                  <span className="font-mono text-xs text-[var(--ink-muted)]">
                    {stats.total} submitted · {survivalRate}% shortlisted
                  </span>
                </div>
                <div className="flex gap-1 h-2 rounded-sm overflow-hidden bg-[var(--mist)]">
                  <motion.div
                    className="bg-[var(--ledger)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.total > 0 ? (stats.stage1Passed / stats.total) * 100 : 0}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    title={`Stage 1: ${stats.stage1Passed}/${stats.total}`}
                  />
                </div>
                <div className="flex justify-between mt-1.5 text-[10px] font-mono text-[var(--ink-faint)] uppercase">
                  <span>S1: {stats.stage1Passed}</span>
                  <span>S2: {stats.stage2Passed}</span>
                  <span>S3: {stats.stage3Passed}</span>
                  <span>Shortlisted: {stats.shortlisted}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}