"use client";

import { Settings, Workflow, ListChecks, BarChart3, Users } from "lucide-react";
import { motion } from "framer-motion";

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
            className={`relative flex items-center gap-2 px-3 py-2.5 rounded-sm text-sm whitespace-nowrap transition-colors outline-none cursor-pointer ${
              isActive
                ? "text-[var(--paper)]"
                : "text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-soft)]/50"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-[var(--ink)] rounded-sm"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <Icon size={16} strokeWidth={1.75} />
              {t.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}