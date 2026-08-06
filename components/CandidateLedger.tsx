"use client";

import { useEffect, useState } from "react";
import { FileText, X, ExternalLink } from "lucide-react";
import { AnimatePresence, motion, useMotionValue, useTransform, useReducedMotion } from "framer-motion";
import Skeleton from "@/components/Skeleton";
import { playSound } from "@/lib/sound";
import { toast } from "sonner";

interface Candidate {
  id: string;
  name: string;
  skills: string;
  resume_url: string;
  linkedin_url: string | null;
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

function CandidateRow({
  candidate,
  isExpanded,
  onToggleExpand,
  onOverride,
  previewResume,
  shouldReduceMotion,
}: {
  candidate: Candidate;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onOverride: (id: string, shortlisted: boolean) => void;
  previewResume: (url: string) => void;
  shouldReduceMotion: boolean;
}) {
  const x = useMotionValue(0);

  // Background reveal color interpolation
  const dragBackground = useTransform(
    x,
    [-100, 0, 100],
    ["rgba(184, 92, 62, 0.2)", "rgba(0, 0, 0, 0)", "rgba(92, 122, 82, 0.2)"]
  );

  const handleDragEnd = (_event: any, info: any) => {
    if (shouldReduceMotion) return;
    const threshold = 120;
    if (info.offset.x > threshold) {
      // Swiped Right -> Shortlist
      onOverride(candidate.id, true);
    } else if (info.offset.x < -threshold) {
      // Swiped Left -> Remove
      onOverride(candidate.id, false);
    }
  };

  const handleToggle = () => {
    playSound("rustle");
    onToggleExpand();
  };

  const stampInitial = shouldReduceMotion ? { scale: 1, rotate: -4 } : { scale: 1.4, rotate: -8 };
  const stampTransition = shouldReduceMotion ? { duration: 0.1 } : { type: "spring" as any, stiffness: 300, damping: 15 };

  return (
    <div className="relative overflow-hidden border border-[var(--mist)] rounded-sm bg-[var(--surface-soft)] select-none">
      {/* Underlay reveal guides */}
      {!shouldReduceMotion && (
        <motion.div
          style={{ backgroundColor: dragBackground }}
          className="absolute inset-0 flex items-center justify-between px-6 pointer-events-none"
        >
          <span className="text-[var(--ledger)] font-mono text-[10px] uppercase tracking-wide">
            Shortlist →
          </span>
          <span className="text-[var(--clay)] font-mono text-[10px] uppercase tracking-wide">
            ← Remove
          </span>
        </motion.div>
      )}

      {/* Swipeable card */}
      <motion.div
        drag={shouldReduceMotion ? false : "x"}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.4}
        style={{ x }}
        onDragEnd={handleDragEnd}
        className="relative bg-[var(--surface)] z-10 w-full flex flex-col"
      >
        <button
          onClick={handleToggle}
          className="w-full flex items-center justify-between px-4 py-3 text-left cursor-pointer focus:outline-none"
        >
          <div className="flex items-center gap-3">
            <span className="text-sm text-[var(--ink)]">{candidate.name}</span>
            {candidate.flagged && (
              <span className="text-[10px] font-mono uppercase text-[var(--ochre)]">flagged</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <StatusPill status={candidate.stage1_status} />
            <StatusPill status={candidate.stage2_status} />
            <StatusPill status={candidate.stage3_status} />
            <AnimatePresence mode="popLayout">
              {candidate.shortlisted && (
                <motion.span
                  key={candidate.id + "-shortlisted-stamp"}
                  initial={stampInitial}
                  animate={{ scale: 1, rotate: -4 }}
                  transition={stampTransition}
                  className="text-[10px] font-mono uppercase text-[var(--paper)] bg-[var(--ledger)] rounded-sm px-1.5 py-0.5 inline-block"
                >
                  #{candidate.final_rank || "S"}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </button>

        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1, height: "auto" } : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
              transition={shouldReduceMotion ? { duration: 0.1 } : { duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 pt-1 border-t border-[var(--mist)] text-sm flex flex-col gap-2 bg-[var(--surface-soft)]/20">
                <p className="text-[var(--ink-muted)]">
                  <span className="font-mono text-xs uppercase">Skills:</span> {candidate.skills}
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => previewResume(candidate.resume_url)}
                    className="flex w-fit items-center gap-1.5 font-mono text-xs uppercase text-[var(--ledger)] hover:underline cursor-pointer focus:outline-none"
                  >
                    <FileText size={13} /> View resume
                  </button>
                  {candidate.linkedin_url && (
                    <a
                      href={candidate.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-fit items-center gap-1.5 font-mono text-xs uppercase text-[var(--ledger)] hover:underline cursor-pointer focus:outline-none"
                    >
                      <ExternalLink size={13} /> View LinkedIn profile
                    </a>
                  )}
                </div>
                {candidate.flagged && (
                  <p className="text-[var(--ochre)]">
                    <span className="font-mono text-xs uppercase">Authenticity flag:</span>{" "}
                    {candidate.flag_reason}
                  </p>
                )}
                {candidate.duplicate_flag && (
                  <p className="text-[var(--clay)]">
                    <span className="font-mono text-xs uppercase">Possible duplicate:</span>{" "}
                    {candidate.duplicate_reason}
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
                    <span className="font-mono text-xs uppercase">Stage 3:</span>{" "}
                    {candidate.stage3_reasoning} ({candidate.stage3_score}/100)
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default function CandidateLedger({ roleId }: { roleId: string }) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const fetchLedger = async () => {
    if (!roleId) return;
    setLoading(true);
    const response = await fetch(`/api/ledger?roleId=${roleId}`);
    const data = await response.json();
    setCandidates(data.candidates || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchLedger();
  }, [roleId]);

  const handleOverride = async (id: string, shortlisted: boolean) => {
    const candidate = candidates.find((c) => c.id === id);
    if (!candidate) return;
    if (candidate.shortlisted === shortlisted) return;

    // Immediately trigger sound
    playSound("thud");

    const res = await fetch("/api/override", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, shortlisted }),
    });

    if (res.ok) {
      toast.success(shortlisted ? "Candidate shortlisted" : "Removed from shortlist");
      setCandidates((prev) =>
        prev.map((c) => (c.id === id ? { ...c, shortlisted } : c))
      );
    } else {
      toast.error("Failed to update candidate status");
    }
  };

  return (
    <section className="bg-[var(--surface)] border border-[var(--mist)] rounded-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl text-[var(--ink)]">Full ledger</h2>
        <button
          onClick={fetchLedger}
          className="text-xs font-mono uppercase tracking-wide text-[var(--ink-muted)] hover:text-[var(--ink)] focus:outline-none"
        >
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
            <CandidateRow
              key={candidate.id}
              candidate={candidate}
              isExpanded={expandedId === candidate.id}
              onToggleExpand={() => setExpandedId(expandedId === candidate.id ? null : candidate.id)}
              onOverride={handleOverride}
              previewResume={setPreviewUrl}
              shouldReduceMotion={!!shouldReduceMotion}
            />
          ))}
        </div>
      )}

      {previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6" onClick={() => setPreviewUrl(null)}>
          <div className="flex h-[85vh] w-full max-w-3xl flex-col rounded-sm bg-[var(--surface)]" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[var(--mist)] px-4 py-3">
              <span className="font-mono text-sm uppercase text-[var(--ink-muted)]">Resume preview</span>
              <button type="button" onClick={() => setPreviewUrl(null)} className="text-[var(--ink-muted)] hover:text-[var(--clay)] focus:outline-none" aria-label="Close resume preview">
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
