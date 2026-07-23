"use client";

import { Settings, Workflow, ListChecks, BarChart3, Users } from "lucide-react";

const tabs = [
  { id: "overview", label: "Overview", icon: Workflow },
  { id: "criteria", label: "Criteria", icon: Settings },
  { id: "ledger", label: "Ledger", icon: ListChecks },
  { id: "insights", label: "Insights", icon: BarChart3 },
  { id: "review", label: "Review", icon: Users },
];

export default function AdminNav({ active, onChange }: { active: string; onChange: (id: string) => void }) {
  return (
    <nav className="flex md:flex-col gap-1 md:w-48 shrink-0 overflow-x-auto md:overflow-visible">
      {tabs.map((t) => {
        const Icon = t.icon;
        const isActive = active === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-sm text-sm whitespace-nowrap transition-colors ${
              isActive
                ? "bg-[var(--ink)] text-[var(--paper)]"
                : "text-[var(--ink-muted)] hover:bg-[var(--surface-soft)]"
            }`}
          >
            <Icon size={16} strokeWidth={1.75} />
            {t.label}
          </button>
        );
      })}
    </nav>
  );
}