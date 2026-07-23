"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import AdminGuard from "@/components/AdminGuard";
import AdminNav from "@/components/AdminNav";
import CandidateLedger from "@/components/CandidateLedger";
import ReviewPanel from "@/components/ReviewPanel";
import ThemeToggle from "@/components/ThemeToggle";
import BiasDashboard from "@/components/BiasDashboard";
import CostTracker from "@/components/CostTracker";
import AdminSettings from "@/components/AdminSettings";
import { Loader2 } from "lucide-react";

interface Stats {
  total: number;
  stage1Passed: number;
  stage2Passed: number;
  stage3Passed: number;
  shortlisted: number;
}
interface ShortlistedCandidate {
  id: string;
  name: string;
  final_score: number;
  final_rank: number;
  stage3_reasoning: string;
}

const fadeSlide = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.2 } },
};

function AdminDashboard() {
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [results, setResults] = useState<ShortlistedCandidate[]>([]);
  const [runningStage, setRunningStage] = useState<number | null>(null);
  const router = useRouter();

  const fetchStats = async () => {
    const res = await fetch("/api/stats");
    setStats(await res.json());
  };
  const fetchResults = async () => {
    const res = await fetch("/api/results");
    const data = await res.json();
    setResults(data.candidates || []);
  };

  useEffect(() => {
    fetchStats();
    fetchResults();
  }, []);

  const runStage = async (stageNum: number, endpoint: string) => {
    setRunningStage(stageNum);
    await fetch(endpoint, { method: "POST" });
    await fetchStats();
    await fetchResults();
    setRunningStage(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const handleResetAll = async () => {
    if (!window.confirm("This will reset ALL candidates back to pending across every stage. This cannot be undone. Continue?")) return;
    await fetch("/api/reset", { method: "POST" });
    await fetchStats();
    await fetchResults();
  };

  const stages = [
    { num: 1, label: "Hard filter", endpoint: "/api/stage1", count: stats?.stage1Passed },
    { num: 2, label: "Embeddings", endpoint: "/api/stage2", count: stats?.stage2Passed },
    { num: 3, label: "AI evaluator", endpoint: "/api/stage3", count: stats?.stage3Passed },
    { num: 4, label: "Ranking", endpoint: "/api/stage4", count: stats?.shortlisted },
  ];

  return (
    <main className="min-h-screen bg-[var(--paper)] px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex items-start justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-[var(--ochre)] mb-2">Admin dashboard</p>
            <h1 className="font-gill text-4xl md:text-5xl text-[var(--ink)]">Shortlister</h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button onClick={handleResetAll} className="text-xs font-mono uppercase tracking-wide text-[var(--clay)] hover:text-[var(--paper)] hover:bg-[var(--clay)] border border-[var(--clay)] px-3 py-1.5 rounded-sm transition-colors">Reset all</button>
            <button onClick={handleLogout} className="text-xs font-mono uppercase tracking-wide text-[var(--ink-muted)] hover:text-[var(--clay)] border border-[var(--mist)] px-3 py-1.5 rounded-sm">Log out</button>
          </div>
        </header>

        <div className="flex flex-col md:flex-row gap-6">
          <AdminNav active={tab} onChange={setTab} />

          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {tab === "overview" && (
                <motion.div key="overview" variants={fadeSlide} initial="hidden" animate="show" exit="exit" className="flex flex-col gap-6">
                  <section className="bg-[var(--surface)] border border-[var(--mist)] rounded-sm p-6">
                    <h2 className="font-display text-xl text-[var(--ink)] mb-1">Pipeline</h2>
                    <p className="text-sm text-[var(--ink-muted)] mb-5">{stats?.total ?? 0} total entries in the ledger.</p>
                    <div className="flex flex-col gap-3">
                      {stages.map((s) => (
                        <div key={s.num} className="flex items-center justify-between border border-[var(--mist)] rounded-sm px-4 py-3 bg-[var(--surface-soft)]">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs text-[var(--ink-faint)]">0{s.num}</span>
                            <span className="text-sm text-[var(--ink)]">{s.label}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-mono text-sm text-[var(--ledger)]">{s.count ?? 0} passed</span>
                            <button
                              onClick={() => runStage(s.num, s.endpoint)}
                              disabled={runningStage !== null}
                              className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wide border border-[var(--ink)] px-3 py-1.5 rounded-sm hover:bg-[var(--ink)] hover:text-[var(--paper)] transition-colors disabled:opacity-40"
                            >
                              {runningStage === s.num && <Loader2 size={12} className="animate-spin" />}
                              {runningStage === s.num ? "Running" : "Run"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="bg-[var(--surface)] border border-[var(--mist)] rounded-sm p-6">
                    <h2 className="font-display text-xl text-[var(--ink)] mb-4">Shortlist</h2>
                    {results.length === 0 ? (
                      <p className="text-sm text-[var(--ink-muted)] italic">No candidates shortlisted yet — run the pipeline stages above.</p>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {results.map((c) => (
                          <div key={c.id} className="relative border border-[var(--mist)] rounded-sm p-4 bg-[var(--surface)]">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium text-[var(--ink)]">{c.name}</p>
                                <p className="text-sm text-[var(--ink-muted)] mt-1">{c.stage3_reasoning}</p>
                              </div>
                              <div className="text-right shrink-0 ml-4">
                                <p className="font-mono text-lg text-[var(--ochre)]">#{c.final_rank}</p>
                                <p className="font-mono text-xs text-[var(--ink-muted)]">{c.final_score.toFixed(1)}</p>
                              </div>
                            </div>
                            <span className="stamp absolute -top-2 -right-2 bg-[var(--ledger)] text-[var(--paper)] text-[10px] font-mono uppercase tracking-wide px-2 py-1 rounded-sm shadow-sm">Shortlisted</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                </motion.div>
              )}

              {tab === "criteria" && (
                <motion.div key="criteria" variants={fadeSlide} initial="hidden" animate="show" exit="exit">
                  <AdminSettings />
                </motion.div>
              )}

              {tab === "ledger" && (
                <motion.div key="ledger" variants={fadeSlide} initial="hidden" animate="show" exit="exit">
                  <CandidateLedger />
                </motion.div>
              )}

              {tab === "insights" && (
                <motion.div key="insights" variants={fadeSlide} initial="hidden" animate="show" exit="exit" className="flex flex-col gap-6">
                  <BiasDashboard />
                  <CostTracker />
                </motion.div>
              )}

              {tab === "review" && (
                <motion.div key="review" variants={fadeSlide} initial="hidden" animate="show" exit="exit">
                  <ReviewPanel onRerank={async () => { await fetchStats(); await fetchResults(); }} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminDashboard />
    </AdminGuard>
  );
}