"use client";

import { useEffect, useState, useRef } from "react";
import { motion, type Variants } from "framer-motion";
import { CheckCircle2, XCircle, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

interface CandidateDashboardProps {
  data: {
    name: string;
    stage1_status: string; // "pending" | "passed" | "rejected"
    stage2_status: string;
    stage3_status: string;
    shortlisted: boolean;
    ats_score: number; // 0-100
    ats_feedback: string;
    created_at: string;
  };
}

function CountUp({
  value,
  duration = 800,
  decimals = 0,
  suffix = "",
  prefix = "",
}: {
  value: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start: number | null = null;
    const target = Number(value) || 0;

    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setDisplay(Math.round(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [value, duration]);

  return (
    <span>
      {prefix}
      {(display ?? 0).toFixed(decimals ?? 0)}
      {suffix}
    </span>
  );
}

export default function CandidateDashboard({ data }: CandidateDashboardProps) {
  const {
    name,
    stage1_status,
    stage2_status,
    stage3_status,
    shortlisted,
    ats_score,
    ats_feedback,
    created_at,
  } = data;

  const formattedDate = new Date(created_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return "var(--ledger)";
    if (score >= 50) return "var(--ochre)";
    return "var(--clay)";
  };

  const scoreColor = getScoreColor(ats_score ?? 0);

  // Stepper Stage configuration
  const getStageStatus = (stageNum: number) => {
    if (stageNum === 1) return stage1_status;
    if (stageNum === 2) return stage2_status;
    if (stageNum === 3) return stage3_status;
    // Stage 4: Ranking
    if (shortlisted) return "passed";
    if (
      stage1_status === "rejected" ||
      stage2_status === "rejected" ||
      stage3_status === "rejected"
    ) {
      return "rejected";
    }
    return "pending";
  };

  const stages = [
    { label: "Eligibility", status: getStageStatus(1) },
    { label: "Relevance", status: getStageStatus(2) },
    { label: "Depth", status: getStageStatus(3) },
    { label: "Ranking", status: getStageStatus(4) },
  ];

  // Framer Motion Stepper Variants
  const stepperContainerVariants: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const stageVariants: Variants = {
    hidden: { scale: 0.8, opacity: 0 },
    show: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const isAnyRejected =
    stage1_status === "rejected" ||
    stage2_status === "rejected" ||
    stage3_status === "rejected";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-md w-full bg-[var(--surface)] border border-[var(--mist)] rounded-sm p-8 flex flex-col gap-6 shadow-sm"
      style={{ fontFamily: "var(--font-body)" }}
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="font-display italic text-2xl text-[var(--ink)] mb-1">
            Hi {name}, here&apos;s your status
          </h2>
          <p className="text-xs text-[var(--ink-muted)]">
            Applied on {formattedDate}
          </p>
        </div>
        <button
          type="button"
          onClick={async () => {
            await supabase.auth.signOut();
            window.location.reload();
          }}
          className="text-xs font-mono text-[var(--ink-muted)] hover:text-[var(--clay)] transition-colors cursor-pointer mt-1 underline"
        >
          Sign out
        </button>
      </div>

      {/* Stepper Progress */}
      <motion.div
        variants={stepperContainerVariants}
        initial="hidden"
        animate="show"
        className="relative flex justify-between items-center w-full my-4 px-2"
      >
        {/* Horizontal Line Connector */}
        <div className="absolute top-4 left-4 right-4 h-0.5 bg-[var(--mist)]/40 -z-10" />

        {stages.map((stage, index) => {
          const isPassed = stage.status === "passed" || stage.status === "passed_manual";
          const isRejected = stage.status === "rejected";

          return (
            <motion.div
              key={index}
              variants={stageVariants}
              className="flex flex-col items-center flex-1 relative"
            >
              {isPassed ? (
                <div className="w-8 h-8 rounded-full bg-[var(--ledger)] text-[var(--paper)] flex items-center justify-center z-10 shadow-sm border border-[var(--ledger)]">
                  <CheckCircle2 size={16} />
                </div>
              ) : isRejected ? (
                <div className="w-8 h-8 rounded-full bg-[var(--clay)] text-[var(--paper)] flex items-center justify-center z-10 shadow-sm border border-[var(--clay)]">
                  <XCircle size={16} />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-[var(--surface)] border-2 border-[var(--mist)] flex items-center justify-center z-10 shadow-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--mist)] opacity-60" />
                </div>
              )}
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--ink-muted)] mt-2 text-center">
                {stage.label}
              </span>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Banner */}
      {shortlisted ? (
        <div className="bg-[var(--ledger)] text-[var(--paper)] p-4 rounded-sm flex items-center gap-3 text-sm font-medium shadow-sm">
          <Sparkles size={18} className="shrink-0" />
          <span>You&apos;ve been shortlisted!</span>
        </div>
      ) : isAnyRejected ? (
        <div className="bg-[var(--surface-soft)] border border-[var(--clay)] text-[var(--ink)] p-4 rounded-sm flex items-center gap-3 text-sm font-medium shadow-sm">
          <XCircle size={18} className="text-[var(--clay)] shrink-0" />
          <span>Your application wasn&apos;t selected to move forward this time.</span>
        </div>
      ) : (
        <div className="bg-[var(--surface-soft)] text-[var(--ink-muted)] p-4 rounded-sm flex items-center gap-3 text-sm font-medium shadow-sm">
          <div className="w-2 h-2 rounded-full bg-[var(--ochre)] animate-pulse shrink-0" />
          <span>Your application is still being reviewed.</span>
        </div>
      )}

      {/* Resume Match Analysis Card */}
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="bg-[var(--surface-soft)] border border-[var(--mist)] rounded-sm p-6 flex flex-col gap-4 transition-shadow hover:shadow-sm cursor-default"
      >
        <h3 className="font-display text-lg text-[var(--ink)]">
          Resume match analysis
        </h3>

        {/* Score indicator */}
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-full border-4 flex items-center justify-center font-mono text-base font-bold shrink-0 shadow-sm"
            style={{
              borderColor: scoreColor,
              color: scoreColor,
              backgroundColor: "var(--surface)",
            }}
          >
            <CountUp value={ats_score ?? 0} decimals={0} suffix="%" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--ink-muted)]">
                Match strength
              </span>
              <span className="text-xs font-mono font-bold" style={{ color: scoreColor }}>
                {ats_score ?? 0}/100
              </span>
            </div>
            <div className="w-full bg-[var(--mist)]/30 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: scoreColor }}
                initial={{ width: 0 }}
                animate={{ width: `${ats_score ?? 0}%` }}
                transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
        </div>

        {/* Feedback Section */}
        {ats_feedback && (
          <div className="mt-2 pt-4 border-t border-[var(--mist)]/40">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--ink)] mb-2">
              Suggestions to improve your match:
            </p>
            <p className="text-sm text-[var(--ink-muted)] leading-relaxed">
              {ats_feedback}
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
