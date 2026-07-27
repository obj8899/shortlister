"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const particleVariants: any = {
  animate: (i: number) => ({
    x: ["0%", "250px"],
    opacity: [0, 0.8, 0],
    transition: {
      duration: 2.2,
      repeat: Infinity,
      delay: i * 0.7,
      ease: "linear",
    },
  }),
};

interface CollegeStats {
  total: number;
  stage1Passed: number;
  stage2Passed: number;
  stage3Passed: number;
  shortlisted: number;
}

export default function BiasDashboard({ roleId }: { roleId: string }) {
  const [breakdown, setBreakdown] = useState<Record<string, CollegeStats>>({});
  const [loading, setLoading] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  const fetchBias = async () => {
    if (!roleId) return;
    setLoading(true);
    const res = await fetch(`/api/bias?roleId=${roleId}`);
    const data = await res.json();
    setBreakdown(data.breakdown || {});
    setLoading(false);
  };

  useEffect(() => {
    fetchBias();
  }, [roleId]);

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
                <div className="flex gap-1 h-2 rounded-sm overflow-hidden bg-[var(--mist)] relative">
                  <motion.div
                    className="bg-[var(--ledger)] h-full relative overflow-hidden"
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.total > 0 ? (stats.stage1Passed / stats.total) * 100 : 0}%` }}
                    transition={shouldReduceMotion ? { duration: 0.1 } : { duration: 0.8, ease: "easeOut" }}
                    title={`Stage 1: ${stats.stage1Passed}/${stats.total}`}
                  >
                    {!shouldReduceMotion && (
                      <div className="absolute inset-0 pointer-events-none flex items-center">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            custom={i}
                            variants={particleVariants}
                            animate="animate"
                            className="absolute w-1 h-1 rounded-full bg-white/60"
                          />
                        ))}
                      </div>
                    )}
                  </motion.div>
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