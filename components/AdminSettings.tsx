"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminSettings() {
  const [config, setConfig] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchConfig = async () => {
    const { data } = await supabase.from("pipeline_config").select("*").eq("id", 1).single();
    setConfig(data);
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    const { error } = await supabase.from("pipeline_config").update(config).eq("id", 1);
    setSaving(false);
    if (!error) setSaved(true);
  };

  if (!config) return null;

  const fieldClass =
    "w-full px-3 py-2 rounded-sm border border-[var(--mist)] bg-white text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--ochre)]";
  const labelClass = "block text-xs font-mono uppercase tracking-wide text-[var(--ink-muted)] mb-1";

  return (
    <section className="bg-[var(--surface)] border border-[var(--mist)] rounded-sm p-6">
      <h2 className="font-display text-xl text-[var(--ink)] mb-4">Shortlisting criteria</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Required skills (comma separated)</label>
          <input
            value={config.required_skills}
            onChange={(e) => setConfig({ ...config, required_skills: e.target.value })}
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass}>Minimum skill count</label>
          <input
            type="number"
            value={config.min_skill_count}
            onChange={(e) => setConfig({ ...config, min_skill_count: parseInt(e.target.value) })}
            className={fieldClass}
          />
        </div>
        <div className="md:col-span-2">
          <label className={labelClass}>Target profile description</label>
          <textarea
            value={config.target_profile}
            onChange={(e) => setConfig({ ...config, target_profile: e.target.value })}
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
            onChange={(e) => setConfig({ ...config, similarity_threshold: parseFloat(e.target.value) })}
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass}>AI evaluator threshold (0–100)</label>
          <input
            type="number"
            value={config.score_threshold}
            onChange={(e) => setConfig({ ...config, score_threshold: parseFloat(e.target.value) })}
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass}>Shortlist size</label>
          <input
            type="number"
            value={config.shortlist_size}
            onChange={(e) => setConfig({ ...config, shortlist_size: parseInt(e.target.value) })}
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
      {saved && (
        <p className="text-[var(--ledger)] text-sm mt-2 font-mono">
          ✓ Saved. Re-run pipeline stages to apply.
        </p>
      )}
    </section>
  );
}