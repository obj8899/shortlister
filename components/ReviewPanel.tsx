"use client";

import { useEffect, useState } from "react";

interface RankedCandidate {
  id: string;
  name: string;
  final_score: number | null;
  final_rank: number | null;
  shortlisted: boolean;
  manual_override: boolean;
}

export default function ReviewPanel({ onRerank }: { onRerank?: () => void }) {
  const [candidates, setCandidates] = useState<RankedCandidate[]>([]);
  const [similarityWeight, setSimilarityWeight] = useState(0.4);
  const [rerunning, setRerunning] = useState(false);

  const fetchRanked = async () => {
    const res = await fetch("/api/ledger");
    const data = await res.json();
    const ranked = (data.candidates || [])
      .filter((c: any) => c.stage3_status === "passed")
      .sort((a: any, b: any) => (a.final_rank ?? 999) - (b.final_rank ?? 999));
    setCandidates(ranked);
  };

  useEffect(() => {
    fetchRanked();
  }, []);

  const rerunRanking = async () => {
    setRerunning(true);
    await fetch("/api/stage4", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        similarityWeight,
        evalWeight: 1 - similarityWeight,
      }),
    });
    await fetchRanked();
    if (onRerank) await onRerank();
    setRerunning(false);
  };

  const toggleOverride = async (id: string, current: boolean) => {
    await fetch("/api/override", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, shortlisted: !current }),
    });
    await fetchRanked();
  };

  return (
    <section className="bg-[var(--surface)] border border-[var(--mist)] rounded-sm p-6">
      <h2 className="font-display text-xl text-[var(--ink)] mb-4">Human review</h2>

      <div className="mb-5 border border-[var(--mist)] rounded-sm p-4 bg-[var(--surface-soft)]">
        <label className="text-xs font-mono uppercase tracking-wide text-[var(--ink-muted)]">
          Similarity weight: {(similarityWeight * 100).toFixed(0)}% · Evaluation weight:{" "}
          {((1 - similarityWeight) * 100).toFixed(0)}%
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={similarityWeight}
          onChange={(e) => setSimilarityWeight(parseFloat(e.target.value))}
          className="w-full mt-2 accent-[var(--ledger)]"
        />
        <button
          onClick={rerunRanking}
          disabled={rerunning}
          className="mt-3 text-xs font-mono uppercase tracking-wide border border-[var(--ink)] px-3 py-1.5 rounded-sm hover:bg-[var(--ink)] hover:text-[var(--paper)] enabled:hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-40 cursor-pointer"
        >
          {rerunning ? "Re-ranking…" : "Re-run ranking"}
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {candidates.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between border border-[var(--mist)] rounded-sm px-4 py-3 bg-[var(--surface-soft)]"
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm text-[var(--ochre)]">#{c.final_rank}</span>
              <span className="text-sm text-[var(--ink)]">{c.name}</span>
              {c.manual_override && (
                <span className="text-[10px] font-mono uppercase text-[var(--ochre)]">
                  manually adjusted
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-[var(--ink-muted)]">{c.final_score}</span>
              <button
                onClick={() => toggleOverride(c.id, c.shortlisted)}
                className={`text-[10px] font-mono uppercase tracking-wide px-2 py-1 rounded-sm border ${
                  c.shortlisted
                    ? "bg-[var(--ledger)] text-[var(--paper)] border-[var(--ledger)]"
                    : "text-[var(--ink-muted)] border-[var(--mist)]"
                }`}
              >
                {c.shortlisted ? "Shortlisted" : "Not shortlisted"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}