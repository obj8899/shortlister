"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";

interface PipelineConfig {
  id: number;
  role_name: string;
  required_skills: string;
  min_skill_count: number;
  target_profile: string;
  similarity_threshold: number;
  score_threshold: number;
  shortlist_size: number;
}

export default function AdminSettings() {
  const [config, setConfig] = useState<PipelineConfig | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchConfig = async () => {
    const { data } = await supabase.from("pipeline_config").select("*").eq("id", 1).maybeSingle();
    setConfig(data);
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    const { error } = await supabase.from("pipeline_config").update(config).eq("id", 1);
    setSaving(false);
    if (!error) toast.success("Criteria saved. Re-run pipeline stages to apply.");
  };

  if (!config) return null;

  const fieldClass =
    "w-full px-3 py-2 rounded-sm border border-[var(--mist)] bg-[var(--surface)] text-[var(--ink)] placeholder:text-[var(--ink-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--ochre)]";
  const labelClass = "block text-xs font-mono uppercase tracking-wide text-[var(--ink-muted)] mb-1";

  return (
    <section className="bg-[var(--surface)] border border-[var(--mist)] rounded-sm p-6">
      <h2 className="font-display text-xl text-[var(--ink)] mb-4">Shortlisting criteria</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className={labelClass}>Role name (shown to candidates)</label>
          <input
            value={config.role_name}
            onChange={(event) => setConfig({ ...config, role_name: event.target.value })}
            className={fieldClass}
            placeholder="e.g. Backend Developer Intern"
          />
        </div>
        <div>
          <label className={labelClass}>Required skills (comma separated)</label>
          <input
            value={config.required_skills}
            onChange={(event) => setConfig({ ...config, required_skills: event.target.value })}
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass}>Minimum skill count</label>
          <input
            type="number"
            value={config.min_skill_count}
            onChange={(event) => setConfig({ ...config, min_skill_count: parseInt(event.target.value) })}
            className={fieldClass}
          />
        </div>
        <div className="md:col-span-2">
          <label className={labelClass}>Target profile description</label>
          <textarea
            value={config.target_profile}
            onChange={(event) => setConfig({ ...config, target_profile: event.target.value })}
            className={fieldClass}
            rows={2}
          />
        </div>
        <div>
          <label className={labelClass}>Similarity threshold (0–1)</label>
          <input
            type="number"
            step="0.05"
            value={config.similarity_threshold}
            onChange={(event) => setConfig({ ...config, similarity_threshold: parseFloat(event.target.value) })}
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass}>AI evaluator threshold (0–100)</label>
          <input
            type="number"
            value={config.score_threshold}
            onChange={(event) => setConfig({ ...config, score_threshold: parseFloat(event.target.value) })}
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass}>Shortlist size</label>
          <input
            type="number"
            value={config.shortlist_size}
            onChange={(event) => setConfig({ ...config, shortlist_size: parseInt(event.target.value) })}
            className={fieldClass}
          />
        </div>
      </div>
      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-4 bg-[var(--ink)] text-[var(--paper)] px-4 py-2 rounded-sm text-sm font-mono uppercase tracking-wide hover:bg-[var(--ledger)] transition-colors disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save criteria"}
      </button>
    </section>
  );
}
