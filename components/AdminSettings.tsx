"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";

interface RoleConfig {
  id: string;
  role_name: string;
  required_skills: string;
  min_skill_count: number;
  target_profile: string;
  similarity_threshold: number;
  score_threshold: number;
  shortlist_size: number;
  similarity_weight: number;
  eval_weight: number;
  status: string;
}

interface AdminSettingsProps {
  onRolesChanged?: () => void;
}

export default function AdminSettings({ onRolesChanged }: AdminSettingsProps) {
  const [roles, setRoles] = useState<RoleConfig[]>([]);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<RoleConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/roles");
      const data = await res.json();
      setRoles(data.roles || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load roles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleCreateRole = async () => {
    try {
      const res = await fetch("/api/roles", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.role) {
        setRoles((prev) => [data.role, ...prev]);
        setEditingRoleId(data.role.id);
        setEditForm(data.role);
        toast.success("Role created successfully.");
        if (onRolesChanged) onRolesChanged();
      } else {
        toast.error(data.error || "Failed to create role");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to create role");
    }
  };

  const handleManage = (role: RoleConfig) => {
    if (editingRoleId === role.id) {
      setEditingRoleId(null);
      setEditForm(null);
    } else {
      setEditingRoleId(role.id);
      setEditForm({ ...role });
    }
  };

  const handleSave = async () => {
    if (!editForm || !editingRoleId) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/roles/${editingRoleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role_name: editForm.role_name,
          required_skills: editForm.required_skills,
          min_skill_count: editForm.min_skill_count,
          target_profile: editForm.target_profile,
          similarity_threshold: editForm.similarity_threshold,
          score_threshold: editForm.score_threshold,
          shortlist_size: editForm.shortlist_size,
          status: editForm.status,
        }),
      });
      const data = await res.json();
      if (res.ok && data.role) {
        setRoles((prev) =>
          prev.map((r) => (r.id === editingRoleId ? data.role : r))
        );
        toast.success("Criteria saved. Re-run pipeline stages to apply.");
        setEditingRoleId(null);
        setEditForm(null);
        if (onRolesChanged) onRolesChanged();
      } else {
        toast.error(data.error || "Failed to save role criteria");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save role criteria");
    } finally {
      setSaving(false);
    }
  };

  const fieldClass =
    "w-full px-3 py-2 rounded-sm border border-[var(--mist)] bg-[var(--surface)] text-[var(--ink)] placeholder:text-[var(--ink-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--ochre)] text-sm";
  const labelClass = "block text-[10px] font-mono uppercase tracking-wide text-[var(--ink-muted)] mb-1";

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl text-[var(--ink)]">Role criteria management</h2>
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleCreateRole}
          className="flex items-center gap-1 bg-[var(--ink)] text-[var(--paper)] px-3 py-1.5 rounded-sm text-xs font-mono uppercase tracking-wide hover:bg-[var(--ledger)] transition-colors cursor-pointer"
        >
          <Plus size={14} /> Create new role
        </motion.button>
      </div>

      {loading && roles.length === 0 ? (
        <p className="text-sm text-[var(--ink-muted)] italic">Loading roles…</p>
      ) : roles.length === 0 ? (
        <div className="border border-[var(--mist)] border-dashed rounded-sm p-8 text-center bg-[var(--surface-soft)]">
          <p className="text-sm text-[var(--ink-muted)] mb-4">No roles exist yet.</p>
          <button
            onClick={handleCreateRole}
            className="bg-[var(--ink)] text-[var(--paper)] px-4 py-2 rounded-sm text-xs font-mono uppercase tracking-wide hover:bg-[var(--ledger)] transition-colors cursor-pointer"
          >
            Create your first role
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {roles.map((role) => {
            const isEditing = editingRoleId === role.id;
            return (
              <div
                key={role.id}
                className="border border-[var(--mist)] rounded-sm bg-[var(--surface-soft)] overflow-hidden"
              >
                <div className="flex items-center justify-between px-4 py-4 bg-[var(--surface)]">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-[var(--ink)]">{role.role_name}</span>
                    <span
                      className={`text-[10px] font-mono uppercase tracking-wide border rounded-sm px-1.5 py-0.5 ${
                        role.status === "open"
                          ? "text-[var(--ledger)] border-[var(--ledger)]"
                          : "text-[var(--ink-faint)] border-[var(--mist)]"
                      }`}
                    >
                      {role.status}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleManage(role)}
                    className="flex items-center gap-1 text-xs font-mono uppercase tracking-wide border border-[var(--mist)] px-3 py-1.5 rounded-sm hover:border-[var(--ink)] transition-colors cursor-pointer"
                  >
                    {isEditing ? (
                      <>
                        Collapse <ChevronUp size={12} />
                      </>
                    ) : (
                      <>
                        Manage <ChevronDown size={12} />
                      </>
                    )}
                  </motion.button>
                </div>

                <AnimatePresence initial={false}>
                  {isEditing && editForm && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden border-t border-[var(--mist)] bg-[var(--surface-soft)]"
                    >
                      <div className="p-5 grid md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className={labelClass}>Role name (shown to candidates)</label>
                          <input
                            value={editForm.role_name}
                            onChange={(e) =>
                              setEditForm({ ...editForm, role_name: e.target.value })
                            }
                            className={fieldClass}
                            placeholder="e.g. Backend Developer Intern"
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Status</label>
                          <select
                            value={editForm.status}
                            onChange={(e) =>
                              setEditForm({ ...editForm, status: e.target.value })
                            }
                            className={fieldClass}
                          >
                            <option value="open">Open</option>
                            <option value="closed">Closed</option>
                          </select>
                        </div>
                        <div>
                          <label className={labelClass}>Required skills (comma separated)</label>
                          <input
                            value={editForm.required_skills}
                            onChange={(e) =>
                              setEditForm({ ...editForm, required_skills: e.target.value })
                            }
                            className={fieldClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Minimum skill count</label>
                          <input
                            type="number"
                            value={editForm.min_skill_count}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                min_skill_count: parseInt(e.target.value) || 0,
                              })
                            }
                            className={fieldClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Similarity threshold (0–1)</label>
                          <input
                            type="number"
                            step="0.05"
                            value={editForm.similarity_threshold}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                similarity_threshold: parseFloat(e.target.value) || 0,
                              })
                            }
                            className={fieldClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>AI evaluator threshold (0–100)</label>
                          <input
                            type="number"
                            value={editForm.score_threshold}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                score_threshold: parseFloat(e.target.value) || 0,
                              })
                            }
                            className={fieldClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Shortlist size</label>
                          <input
                            type="number"
                            value={editForm.shortlist_size}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                shortlist_size: parseInt(e.target.value) || 0,
                              })
                            }
                            className={fieldClass}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className={labelClass}>Target profile description</label>
                          <textarea
                            value={editForm.target_profile}
                            onChange={(e) =>
                              setEditForm({ ...editForm, target_profile: e.target.value })
                            }
                            className={fieldClass}
                            rows={3}
                          />
                        </div>
                        <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                          <motion.button
                            whileHover={{ y: -1 }}
                            whileTap={{ scale: 0.97 }}
                            type="button"
                            onClick={() => {
                              setEditingRoleId(null);
                              setEditForm(null);
                            }}
                            className="text-xs font-mono uppercase tracking-wide border border-[var(--mist)] px-3 py-2 rounded-sm hover:border-[var(--ink)] transition-colors cursor-pointer"
                          >
                            Cancel
                          </motion.button>
                          <motion.button
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            type="button"
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-[var(--ink)] text-[var(--paper)] px-4 py-2 rounded-sm text-xs font-mono uppercase tracking-wide hover:bg-[var(--ledger)] transition-colors disabled:opacity-50 cursor-pointer"
                          >
                            {saving ? "Saving…" : "Save role criteria"}
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
