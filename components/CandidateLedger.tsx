"use client";

import { useEffect, useState } from "react";
import { FileText, X } from "lucide-react";
import Skeleton from "@/components/Skeleton";

interface Candidate {
  id: string;
  name: string;
  skills: string;
  resume_url: string;
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
  duplicate_flag: boolean;
  duplicate_reason: string | null;
}

function StatusPill({ status }: { status: string }) {
  const color =
    status === "passed"
      ? "text-[var(--ledger)] border-[var(--ledger)]"
      : status === "rejected"
        ? "text-[var(--clay)] border-[var(--clay)]"
        : "text-[var(--ink-faint)] border-[var(--mist)]";

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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fetchLedger = async () => {
    setLoading(true);
    const response = await fetch("/api/ledger");
    const data = await response.json();
    setCandidates(data.candidates || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchLedger();
  }, []);

  return (
    <section className="bg-[var(--surface)] border border-[var(--mist)] rounded-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl text-[var(--ink)]">Full ledger</h2>
        <button onClick={fetchLedger} className="text-xs font-mono uppercase tracking-wide text-[var(--ink-muted)] hover:text-[var(--ink)]">
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col gap-2">
          {[...Array(4)].map((_, index) => (
            <Skeleton key={index} className="h-14 w-full" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {candidates.map((candidate) => (
            <div key={candidate.id} className="border border-[var(--mist)] rounded-sm bg-[var(--surface-soft)]">
              <button
                onClick={() => setExpandedId(expandedId === candidate.id ? null : candidate.id)}
                className="w-full flex items-center justify-between px-4 py-3 text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm text-[var(--ink)]">{candidate.name}</span>
                  {candidate.flagged && <span className="text-[10px] font-mono uppercase text-[var(--ochre)]">flagged</span>}
                </div>
                <div className="flex items-center gap-2">
                  <StatusPill status={candidate.stage1_status} />
                  <StatusPill status={candidate.stage2_status} />
                  <StatusPill status={candidate.stage3_status} />
                  {candidate.shortlisted && (
                    <span className="text-[10px] font-mono uppercase text-[var(--paper)] bg-[var(--ledger)] rounded-sm px-1.5 py-0.5">
                      #{candidate.final_rank}
                    </span>
                  )}
                </div>
              </button>

              {expandedId === candidate.id && (
                <div className="px-4 pb-4 pt-1 border-t border-[var(--mist)] text-sm flex flex-col gap-2">
                  <p className="text-[var(--ink-muted)]">
                    <span className="font-mono text-xs uppercase">Skills:</span> {candidate.skills}
                  </p>
                  <button
                    type="button"
                    onClick={() => setPreviewUrl(candidate.resume_url)}
                    className="flex w-fit items-center gap-1.5 font-mono text-xs uppercase text-[var(--ledger)] hover:underline"
                  >
                    <FileText size={13} /> View resume
                  </button>
                  {candidate.flagged && (
                    <p className="text-[var(--ochre)]">
                      <span className="font-mono text-xs uppercase">Authenticity flag:</span> {candidate.flag_reason}
                    </p>
                  )}
                  {candidate.duplicate_flag && (
                    <p className="text-[var(--clay)]">
                      <span className="font-mono text-xs uppercase">Possible duplicate:</span> {candidate.duplicate_reason}
                    </p>
                  )}
                  <p className="text-[var(--ink-muted)]">
                    <span className="font-mono text-xs uppercase">Stage 1:</span>{" "}
                    {candidate.stage1_reason || "Passed eligibility rules"}
                  </p>
                  {candidate.similarity_score !== null && (
                    <p className="text-[var(--ink-muted)]">
                      <span className="font-mono text-xs uppercase">Stage 2 similarity:</span>{" "}
                      {(candidate.similarity_score * 100).toFixed(1)}%
                    </p>
                  )}
                  {candidate.stage3_reasoning && (
                    <p className="text-[var(--ink-muted)]">
                      <span className="font-mono text-xs uppercase">Stage 3:</span> {candidate.stage3_reasoning}{" "}
                      ({candidate.stage3_score}/100)
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6" onClick={() => setPreviewUrl(null)}>
          <div className="flex h-[85vh] w-full max-w-3xl flex-col rounded-sm bg-[var(--surface)]" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[var(--mist)] px-4 py-3">
              <span className="font-mono text-sm uppercase text-[var(--ink-muted)]">Resume preview</span>
              <button type="button" onClick={() => setPreviewUrl(null)} className="text-[var(--ink-muted)] hover:text-[var(--clay)]" aria-label="Close resume preview">
                <X size={18} />
              </button>
            </div>
            <iframe src={previewUrl} className="w-full flex-1" title="Resume preview" />
          </div>
        </div>
      )}
    </section>
  );
}
