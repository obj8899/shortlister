"use client";

import { useEffect, useState } from "react";

export default function CostTracker() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/cost").then((r) => r.json()).then(setData);
  }, []);

  if (!data) return null;

  return (
    <section className="bg-[var(--surface)] border border-[var(--mist)] rounded-sm p-6">
      <h2 className="font-display text-xl text-[var(--ink)] mb-4">Cost efficiency</h2>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="font-mono text-2xl text-[var(--ledger)]">${data.actualCost}</p>
          <p className="text-xs text-[var(--ink-muted)] mt-1">Actual staged cost</p>
        </div>
        <div>
          <p className="font-mono text-2xl text-[var(--clay)]">${data.naiveCost}</p>
          <p className="text-xs text-[var(--ink-muted)] mt-1">Naive full-LLM cost</p>
        </div>
        <div>
          <p className="font-mono text-2xl text-[var(--ochre)]">{data.savingsPercent}%</p>
          <p className="text-xs text-[var(--ink-muted)] mt-1">Savings</p>
        </div>
      </div>
      <p className="text-xs text-[var(--ink-faint)] mt-4 font-mono">
        {data.totalCandidates} candidates · {data.stage2Calls} embedding calls · {data.stage3Calls} LLM evaluation calls
      </p>
    </section>
  );
}