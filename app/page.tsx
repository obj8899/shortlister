"use client";

import { useState, useEffect } from "react";
import StudentForm from "@/components/StudentForm";
import CandidateLedger from "@/components/CandidateLedger";
import ReviewPanel from "@/components/ReviewPanel";

interface Stats {
  total: number;
  stage1Passed: number;
  stage2Passed: number;
  stage3Passed: number;
  shortlisted: number;
}

interface ShortlistedCandidate {
  name: string;
  final_score: number;
  final_rank: number;
  stage3_reasoning: string;
}

export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [results, setResults] = useState<ShortlistedCandidate[]>([]);
  const [runningStage, setRunningStage] = useState<number | null>(null);

  const fetchStats = async () => {
    const res = await fetch("/api/stats");
    const data = await res.json();
    setStats(data);
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

  const stages = [
    { num: 1, label: "Hard filter", endpoint: "/api/stage1", count: stats?.stage1Passed },
    { num: 2, label: "Embeddings", endpoint: "/api/stage2", count: stats?.stage2Passed },
    { num: 3, label: "AI evaluator", endpoint: "/api/stage3", count: stats?.stage3Passed },
    { num: 4, label: "Ranking", endpoint: "/api/stage4", count: stats?.shortlisted },
  ];

  return (
    <main className="min-h-screen bg-[var(--paper)] px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12">
          <p className="font-mono text-xs uppercase tracking-widest text-[var(--ochre)] mb-2">
            Candidate review system
          </p>
          <h1 className="font-display text-4xl md:text-5xl text-[var(--ink)] italic">
            Shortlister
          </h1>
          <p className="text-[var(--ink)]/60 mt-2 max-w-lg">
            Every candidate is reviewed in four stages — eligibility, relevance, depth, and rank —
            each entry stamped with the reasoning behind its outcome.
          </p>
        </header>

        <div className="grid md:grid-cols-[380px_1fr] gap-8">
          <StudentForm />

          <div className="flex flex-col gap-8">
            {/* Pipeline control panel */}
            <section className="bg-white/60 border border-[var(--mist)] rounded-sm p-6">
              <h2 className="font-display text-xl text-[var(--ink)] mb-1">Pipeline</h2>
              <p className="text-sm text-[var(--ink)]/60 mb-5">
                {stats?.total ?? 0} total entries in the ledger.
              </p>

              <div className="flex flex-col gap-3">
                {stages.map((s) => (
                  <div
                    key={s.num}
                    className="flex items-center justify-between border border-[var(--mist)] rounded-sm px-4 py-3 bg-white/40"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-[var(--ink)]/40">0{s.num}</span>
                      <span className="text-sm text-[var(--ink)]">{s.label}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-sm text-[var(--ledger)]">
                        {s.count ?? 0} passed
                      </span>
                      <button
                        onClick={() => runStage(s.num, s.endpoint)}
                        disabled={runningStage !== null}
                        className="text-xs font-mono uppercase tracking-wide border border-[var(--ink)] px-3 py-1.5 rounded-sm hover:bg-[var(--ink)] hover:text-[var(--paper)] transition-colors disabled:opacity-40"
                      >
                        {runningStage === s.num ? "Running…" : "Run"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Shortlist results */}
            <section className="bg-white/60 border border-[var(--mist)] rounded-sm p-6">
              <h2 className="font-display text-xl text-[var(--ink)] mb-4">Shortlist</h2>
              {results.length === 0 ? (
                <p className="text-sm text-[var(--ink)]/50 italic">
                  No candidates shortlisted yet — run the pipeline stages above.
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  {results.map((c) => (
                    <div
                      key={c.final_rank}
                      className="relative border border-[var(--mist)] rounded-sm p-4 bg-white/50"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-[var(--ink)]">{c.name}</p>
                          <p className="text-sm text-[var(--ink)]/60 mt-1">{c.stage3_reasoning}</p>
                        </div>
                        <div className="text-right shrink-0 ml-4">
                          <p className="font-mono text-lg text-[var(--ochre)]">
                            #{c.final_rank}
                          </p>
                          <p className="font-mono text-xs text-[var(--ink)]/50">
                            {c.final_score.toFixed(1)}
                          </p>
                        </div>
                      </div>
                      <span className="stamp absolute -top-2 -right-2 bg-[var(--ledger)] text-[var(--paper)] text-[10px] font-mono uppercase tracking-wide px-2 py-1 rounded-sm shadow-sm">
                        Shortlisted
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>
            <CandidateLedger />
            <ReviewPanel onRerank={async () => { await fetchStats(); await fetchResults(); }} />
          </div>
        </div>
      </div>
    </main>
  );
}