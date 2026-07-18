"use client";

import { useEffect, useState } from "react";

interface Candidate {
  id: string;
  name: string;
  skills: string;
  flagged: boolean;
  flag_reason: string | null;
  stage1_status: string;
  stage1_reason: string | null;
  stage2_status: string;
  similarity_score: number | null;
  stage3_status: string;
  stage3_score: number | null;
  stage3_reasoning: string | null;
  final_rank: number | null;
  shortlisted: boolean;
}

function StatusPill({ status }: { status: string }) {
  const color =
    status === "passed"
      ? "text-[var(--ledger)] border-[var(--ledger)]"
      : status === "rejected"
      ? "text-[var(--clay)] border-[var(--clay)]"
      : "text-[var(--ink)]/40 border-[var(--mist)]";
  return (
    <span className={`text-[10px] font-mono uppercase tracking-wide border rounded-sm px-1.5 py-0.5 ${color}`}>
      {status}
    </span>
  );
}

export default function CandidateLedger() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchLedger = async () => {
    setLoading(true);
    const res = await fetch("/api/ledger");
    const data = await res.json();
    setCandidates(data.candidates || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchLedger();
  }, []);

  return (
    <section className="bg-white/60 border border-[var(--mist)] rounded-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl text-[var(--ink)]">Full ledger</h2>
        <button
          onClick={fetchLedger}
          className="text-xs font-mono uppercase tracking-wide text-[var(--ink)]/50 hover:text-[var(--ink)]"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-[var(--ink)]/50 italic">Loading…</p>
      ) : (
        <div className="flex flex-col gap-2">
          {candidates.map((c) => (
            <div key={c.id} className="border border-[var(--mist)] rounded-sm bg-white/40">
              <button
                onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}
                className="w-full flex items-center justify-between px-4 py-3 text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm text-[var(--ink)]">{c.name}</span>
                  {c.flagged && (
                    <span className="text-[10px] font-mono uppercase text-[var(--ochre)]">flagged</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <StatusPill status={c.stage1_status} />
                  <StatusPill status={c.stage2_status} />
                  <StatusPill status={c.stage3_status} />
                  {c.shortlisted && (
                    <span className="text-[10px] font-mono uppercase text-[var(--paper)] bg-[var(--ledger)] rounded-sm px-1.5 py-0.5">
                      #{c.final_rank}
                    </span>
                  )}
                </div>
              </button>

              {expandedId === c.id && (
                <div className="px-4 pb-4 pt-1 border-t border-[var(--mist)] text-sm flex flex-col gap-2">
                  <p className="text-[var(--ink)]/60">
                    <span className="font-mono text-xs uppercase">Skills:</span> {c.skills}
                  </p>
                  {c.flagged && (
                    <p className="text-[var(--ochre)]">
                      <span className="font-mono text-xs uppercase">Authenticity flag:</span> {c.flag_reason}
                    </p>
                  )}
                  <p className="text-[var(--ink)]/70">
                    <span className="font-mono text-xs uppercase">Stage 1:</span>{" "}
                    {c.stage1_reason || "Passed eligibility rules"}
                  </p>
                  {c.similarity_score !== null && (
                    <p className="text-[var(--ink)]/70">
                      <span className="font-mono text-xs uppercase">Stage 2 similarity:</span>{" "}
                      {(c.similarity_score * 100).toFixed(1)}%
                    </p>
                  )}
                  {c.stage3_reasoning && (
                    <p className="text-[var(--ink)]/70">
                      <span className="font-mono text-xs uppercase">Stage 3:</span> {c.stage3_reasoning}{" "}
                      ({c.stage3_score}/100)
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}