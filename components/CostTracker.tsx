"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

function CountUp({ value, duration = 0.8, prefix = "", suffix = "", decimals = 2 }: { value: number; duration?: number; prefix?: string; suffix?: string; decimals?: number }) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => `${prefix}${(latest ?? 0).toFixed(decimals)}${suffix}`);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration,
      ease: "easeOut",
    });
    return () => controls.stop();
  }, [value, motionValue, duration]);

  useEffect(() => {
    return rounded.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = latest;
      }
    });
  }, [rounded]);

  return <span ref={ref}>{prefix}{(Number(value) ?? 0).toFixed(decimals)}{suffix}</span>;
}

export default function CostTracker({ roleId }: { roleId: string }) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!roleId) return;
    fetch(`/api/cost?roleId=${roleId}`)
      .then((r) => r.json())
      .then(setData);
  }, [roleId]);

  if (!data) return null;

  return (
    <section className="bg-[var(--surface)] border border-[var(--mist)] rounded-sm p-6">
      <h2 className="font-display text-xl text-[var(--ink)] mb-4">Cost efficiency</h2>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="font-mono text-2xl text-[var(--ledger)]">
            <CountUp value={Number(data.actualCost)} prefix="$" decimals={2} />
          </p>
          <p className="text-xs text-[var(--ink-muted)] mt-1">Actual staged cost</p>
        </div>
        <div>
          <p className="font-mono text-2xl text-[var(--clay)]">
            <CountUp value={Number(data.naiveCost)} prefix="$" decimals={2} />
          </p>
          <p className="text-xs text-[var(--ink-muted)] mt-1">Naive full-LLM cost</p>
        </div>
        <div>
          <p className="font-mono text-2xl text-[var(--ochre)]">
            <CountUp value={Number(data.savingsPercent)} suffix="%" decimals={0} />
          </p>
          <p className="text-xs text-[var(--ink-muted)] mt-1">Savings</p>
        </div>
      </div>
      <p className="text-xs text-[var(--ink-faint)] mt-4 font-mono">
        {data.totalCandidates} candidates · {data.stage2Calls} embedding calls · {data.stage3Calls} LLM evaluation calls
      </p>
    </section>
  );
}