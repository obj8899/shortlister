"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, type Variants, useReducedMotion, useSpring, useMotionValue } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import AdminGuard from "@/components/AdminGuard";
import AdminNav from "@/components/AdminNav";
import CandidateLedger from "@/components/CandidateLedger";
import ReviewPanel from "@/components/ReviewPanel";
import ThemeToggle from "@/components/ThemeToggle";
import SoundToggle from "@/components/SoundToggle";
import BiasDashboard from "@/components/BiasDashboard";
import CostTracker from "@/components/CostTracker";
import AdminSettings from "@/components/AdminSettings";
import { Loader2, Info } from "lucide-react";
import { toast } from "sonner";
import Skeleton from "@/components/Skeleton";
import { Command } from "cmdk";

interface Stats {
  total: number;
  stage1Passed: number;
  stage2Passed: number;
  stage3Passed: number;
  shortlisted: number;
}
interface ShortlistedCandidate {
  id: string;
  name: string;
  final_score: number;
  final_rank: number;
  stage3_reasoning: string;
}

const fadeSlide: Variants = {
  hidden: { opacity: 0, y: 10, x: 8 },
  show: { opacity: 1, y: 0, x: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -6, x: -8, transition: { duration: 0.2 } },
};

function StageInfoTooltip({ text }: { text: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div 
      className="relative flex items-center" 
      ref={tooltipRef}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onClick={() => setIsOpen(!isOpen)}
    >
      <Info 
        size={14} 
        className="text-[var(--ink-faint)] hover:text-[var(--ink-muted)] cursor-help transition-colors" 
      />
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 w-[260px] bg-[var(--surface)] border border-[var(--mist)] rounded-sm p-3 shadow-lg pointer-events-none"
          >
            <p className="text-xs text-[var(--ink-muted)] leading-relaxed whitespace-normal">{text}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CountBadge({ count }: { count: number }) {
  const [prevCount, setPrevCount] = useState(count);
  const [animateTrigger, setAnimateTrigger] = useState(false);

  useEffect(() => {
    if (count !== prevCount) {
      setPrevCount(count);
      setAnimateTrigger(true);
      const timer = setTimeout(() => setAnimateTrigger(false), 800);
      return () => clearTimeout(timer);
    }
  }, [count, prevCount]);

  return (
    <motion.span
      animate={animateTrigger ? {
        scale: [1, 1.25, 1],
        backgroundColor: ["rgba(217, 154, 61, 0)", "rgba(217, 154, 61, 0.25)", "rgba(217, 154, 61, 0)"],
      } : {}}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="font-mono text-sm text-[var(--ledger)] px-1 rounded-sm inline-block"
    >
      {count}
    </motion.span>
  );
}

function AdminDashboard() {
  const [tab, setTab] = useState("overview");
  const [roles, setRoles] = useState<any[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [stats, setStats] = useState<Stats | null>(null);
  const [results, setResults] = useState<ShortlistedCandidate[]>([]);
  const [resultsLoading, setResultsLoading] = useState(true);
  const [runningStage, setRunningStage] = useState<number | null>(null);
  const router = useRouter();

  const [paletteOpen, setPaletteOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const [isFinePointer, setIsFinePointer] = useState(false);
  const mouseX = useMotionValue(-500);
  const mouseY = useMotionValue(-500);

  const springConfig = { damping: 20, stiffness: 50 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: fine)");
    setIsFinePointer(mediaQuery.matches);

    if (!mediaQuery.matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Centering offset: half of 500px width/height
      mouseX.set(e.clientX - 250);
      mouseY.set(e.clientY - 250);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const fetchRoles = async (selectFirst = false) => {
    try {
      const res = await fetch("/api/roles");
      const data = await res.json();
      const fetchedRoles = data.roles || [];
      setRoles(fetchedRoles);
      if (fetchedRoles.length > 0) {
        if (!selectedRoleId || !fetchedRoles.find((r: any) => r.id === selectedRoleId) || selectFirst) {
          setSelectedRoleId(fetchedRoles[0].id);
        }
      } else {
        setSelectedRoleId("");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load roles");
    }
  };

  const fetchStats = async () => {
    if (!selectedRoleId) return;
    const res = await fetch(`/api/stats?roleId=${selectedRoleId}`);
    setStats(await res.json());
  };

  const fetchResults = async () => {
    if (!selectedRoleId) return;
    setResultsLoading(true);
    const res = await fetch(`/api/results?roleId=${selectedRoleId}`);
    const data = await res.json();
    setResults(data.candidates || []);
    setResultsLoading(false);
  };

  useEffect(() => {
    fetchRoles(true);
  }, []);

  useEffect(() => {
    if (selectedRoleId) {
      fetchStats();
      fetchResults();
    } else {
      setStats(null);
      setResults([]);
      setResultsLoading(false);
    }
  }, [selectedRoleId]);

  const runStage = async (stageNum: number, endpoint: string) => {
    if (!selectedRoleId) {
      toast.error("Please select a role first.");
      return;
    }
    setRunningStage(stageNum);
    await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roleId: selectedRoleId }),
    });
    await fetchStats();
    await fetchResults();
    setRunningStage(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const handleResetAll = async () => {
    if (!selectedRoleId) {
      toast.error("Please select a role first.");
      return;
    }
    toast("Reset all candidates for this role?", {
      description: "This will reset candidates back to pending. This cannot be undone.",
      action: {
        label: "Reset",
        onClick: async () => {
          await fetch("/api/reset", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ roleId: selectedRoleId }),
          });
          await fetchStats();
          await fetchResults();
          toast.success("Candidates reset.");
        },
      },
    });
  };

  const stages = [
    { 
      num: 1, 
      label: "Hard filter", 
      endpoint: "/api/stage1", 
      count: stats?.stage1Passed,
      tooltip: "Eliminates candidates who don't meet basic requirements — missing required skills or below the minimum skill count. This is the fastest, cheapest check, run first to reduce the pool before any AI processing." 
    },
    { 
      num: 2, 
      label: "Embeddings", 
      endpoint: "/api/stage2", 
      count: stats?.stage2Passed,
      tooltip: "Compares each remaining candidate's skills and resume against the role's target profile using AI-generated semantic vectors, scoring how closely their experience matches — beyond exact keyword matching." 
    },
    { 
      num: 3, 
      label: "AI evaluator", 
      endpoint: "/api/stage3", 
      count: stats?.stage3Passed,
      tooltip: "A language model reads each candidate's profile in depth, scoring problem-solving ability and technical depth, and writes a short explanation for its score — this is the most thorough, most expensive stage, run only on candidates who passed the earlier filters." 
    },
    { 
      num: 4, 
      label: "Ranking", 
      endpoint: "/api/stage4", 
      count: stats?.shortlisted,
      tooltip: "Combines the embedding similarity score and the AI evaluator score into one final weighted score, ranks all candidates, and marks the top performers as shortlisted based on the configured shortlist size." 
    },
  ];

  return (
    <motion.main
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={shouldReduceMotion ? { duration: 0.1 } : { duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`min-h-screen bg-[var(--paper)] px-6 py-10 relative overflow-hidden ledger-ruled-bg ${
        shouldReduceMotion ? "" : "ledger-drift-anim"
      }`}
    >
      {/* Subtle cursor spotlight */}
      {isFinePointer && !shouldReduceMotion && (
        <motion.div
          className="fixed top-0 left-0 w-[500px] h-[500px] rounded-full bg-[var(--ochre)] opacity-[0.05] pointer-events-none z-0"
          style={{
            x: cursorX,
            y: cursorY,
            filter: "blur(110px)",
          }}
        />
      )}

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="mb-6 flex items-start justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-[var(--ochre)] mb-2">Admin dashboard</p>
            <h1 className="font-display italic text-4xl md:text-5xl text-[var(--ink)]">Shortlister</h1>
          </div>
          <div className="flex items-center gap-3">
            <SoundToggle />
            <ThemeToggle />
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleResetAll}
              disabled={!selectedRoleId}
              className="text-xs font-mono uppercase tracking-wide text-[var(--clay)] hover:text-[var(--paper)] hover:bg-[var(--clay)] border border-[var(--clay)] px-3 py-1.5 rounded-sm transition-all duration-200 cursor-pointer disabled:opacity-40"
            >
              Reset role
            </motion.button>
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleLogout}
              className="text-xs font-mono uppercase tracking-wide text-[var(--ink-muted)] hover:text-[var(--clay)] border border-[var(--mist)] px-3 py-1.5 rounded-sm transition-all duration-200 cursor-pointer"
            >
              Log out
            </motion.button>
          </div>
        </header>

        {roles.length > 0 && (
          <div className="mb-6 flex items-center gap-3 bg-[var(--surface-soft)] border border-[var(--mist)] rounded-sm px-4 py-3">
            <span className="font-mono text-xs uppercase tracking-wide text-[var(--ink-muted)]">Active Role:</span>
            <select
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
              className="bg-[var(--surface)] text-[var(--ink)] border border-[var(--mist)] rounded-sm px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ochre)] cursor-pointer"
            >
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.role_name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6">
          <AdminNav active={tab} onChange={setTab} />

          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {tab === "overview" && (
                <motion.div key="overview" variants={fadeSlide} initial="hidden" animate="show" exit="exit" className="flex flex-col gap-6">
                  <section className="bg-[var(--surface)] border border-[var(--mist)] rounded-sm p-6">
                    <h2 className="font-display text-xl text-[var(--ink)] mb-1">Pipeline</h2>
                    <p className="text-sm text-[var(--ink-muted)] mb-5">{stats?.total ?? 0} total entries in the ledger.</p>
                    <div className="flex flex-col gap-3">
                      {stages.map((s) => (
                        <div key={s.num} className="flex items-center justify-between border border-[var(--mist)] rounded-sm px-4 py-3 bg-[var(--surface-soft)]">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs text-[var(--ink-faint)]">0{s.num}</span>
                            <span className="text-sm text-[var(--ink)]">{s.label}</span>
                            <StageInfoTooltip text={s.tooltip} />
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-mono text-sm text-[var(--ledger)]"><CountBadge count={s.count ?? 0} /> passed</span>
                            <motion.button
                              whileHover={{ y: -2 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => runStage(s.num, s.endpoint)}
                              disabled={runningStage !== null || !selectedRoleId}
                              className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wide border border-[var(--ink)] px-3 py-1.5 rounded-sm hover:bg-[var(--ink)] hover:text-[var(--paper)] transition-all duration-200 disabled:opacity-40 cursor-pointer"
                            >
                              {runningStage === s.num && <Loader2 size={12} className="animate-spin" />}
                              {runningStage === s.num ? "Running" : "Run"}
                            </motion.button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="bg-[var(--surface)] border border-[var(--mist)] rounded-sm p-6">
                    <h2 className="font-display text-xl text-[var(--ink)] mb-4">Shortlist</h2>
                    {resultsLoading ? (
                      <div className="flex flex-col gap-3">
                        {[...Array(2)].map((_, index) => (
                          <Skeleton key={index} className="h-20 w-full" />
                        ))}
                      </div>
                    ) : results.length === 0 ? (
                      <p className="text-sm text-[var(--ink-muted)] italic">No candidates shortlisted yet — run the pipeline stages above.</p>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {results.map((c) => (
                          <div key={c.id} className="relative border border-[var(--mist)] rounded-sm p-4 bg-[var(--surface)]">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium text-[var(--ink)]">{c.name}</p>
                                <p className="text-sm text-[var(--ink-muted)] mt-1">{c.stage3_reasoning}</p>
                              </div>
                              <div className="text-right shrink-0 ml-4">
                                <p className="font-mono text-lg text-[var(--ochre)]">#{c.final_rank}</p>
                                <p className="font-mono text-xs text-[var(--ink-muted)]">{(c.final_score ?? 0).toFixed(1)}</p>
                              </div>
                            </div>
                            <AnimatePresence mode="popLayout">
                              <motion.span
                                key={c.id + "-dashboard-shortlist-stamp"}
                                initial={shouldReduceMotion ? { scale: 1, rotate: -4 } : { scale: 1.4, rotate: -8, opacity: 0 }}
                                animate={{ scale: 1, rotate: -4, opacity: 1 }}
                                transition={shouldReduceMotion ? { duration: 0.1 } : { type: "spring" as any, stiffness: 300, damping: 15 }}
                                className="absolute -top-2 -right-2 bg-[var(--ledger)] text-[var(--paper)] text-[10px] font-mono uppercase tracking-wide px-2 py-1 rounded-sm shadow-sm inline-block"
                              >
                                Shortlisted
                              </motion.span>
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                </motion.div>
              )}

              {tab === "criteria" && (
                <motion.div key="criteria" variants={fadeSlide} initial="hidden" animate="show" exit="exit">
                  <AdminSettings onRolesChanged={() => fetchRoles(false)} />
                </motion.div>
              )}

              {tab === "ledger" && (
                <motion.div key="ledger" variants={fadeSlide} initial="hidden" animate="show" exit="exit">
                  <CandidateLedger roleId={selectedRoleId} />
                </motion.div>
              )}

              {tab === "insights" && (
                <motion.div key="insights" variants={fadeSlide} initial="hidden" animate="show" exit="exit" className="flex flex-col gap-6">
                  <BiasDashboard roleId={selectedRoleId} />
                  <CostTracker roleId={selectedRoleId} />
                </motion.div>
              )}

              {tab === "review" && (
                <motion.div key="review" variants={fadeSlide} initial="hidden" animate="show" exit="exit">
                  <ReviewPanel roleId={selectedRoleId} onRerank={async () => { await fetchStats(); await fetchResults(); }} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      {/* Command Palette Overlay */}
      <AnimatePresence>
        {paletteOpen && (
          <Command.Dialog
            open={paletteOpen}
            onOpenChange={setPaletteOpen}
            label="Admin Actions Palette"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs focus:outline-none"
          >
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-lg bg-[var(--surface)] border border-[var(--mist)] rounded-sm shadow-xl overflow-hidden flex flex-col focus:outline-none"
            >
              <Command.Input
                placeholder="Search commands (e.g. switch tab, run)..."
                className="w-full px-4 py-3 bg-transparent text-[var(--ink)] placeholder:text-[var(--ink-faint)] border-b border-[var(--mist)] focus:outline-none text-sm font-mono"
              />
              <Command.List className="max-h-[300px] overflow-y-auto p-2 flex flex-col gap-1 focus:outline-none">
                <Command.Empty className="p-3 text-xs font-mono text-[var(--ink-faint)]">No results found.</Command.Empty>
                
                <Command.Group heading="Navigation" className="text-[10px] font-mono uppercase tracking-wider text-[var(--ink-muted)] p-2">
                  <Command.Item
                    onSelect={() => { setTab("overview"); setPaletteOpen(false); }}
                    className="flex items-center gap-2 px-3 py-2 rounded-sm text-sm text-[var(--ink)] hover:bg-[var(--surface-soft)] cursor-pointer aria-selected:bg-[var(--surface-soft)] focus:outline-none"
                  >
                    Go to Overview Tab
                  </Command.Item>
                  <Command.Item
                    onSelect={() => { setTab("criteria"); setPaletteOpen(false); }}
                    className="flex items-center gap-2 px-3 py-2 rounded-sm text-sm text-[var(--ink)] hover:bg-[var(--surface-soft)] cursor-pointer aria-selected:bg-[var(--surface-soft)] focus:outline-none"
                  >
                    Go to Criteria Tab
                  </Command.Item>
                  <Command.Item
                    onSelect={() => { setTab("ledger"); setPaletteOpen(false); }}
                    className="flex items-center gap-2 px-3 py-2 rounded-sm text-sm text-[var(--ink)] hover:bg-[var(--surface-soft)] cursor-pointer aria-selected:bg-[var(--surface-soft)] focus:outline-none"
                  >
                    Go to Ledger Tab
                  </Command.Item>
                  <Command.Item
                    onSelect={() => { setTab("insights"); setPaletteOpen(false); }}
                    className="flex items-center gap-2 px-3 py-2 rounded-sm text-sm text-[var(--ink)] hover:bg-[var(--surface-soft)] cursor-pointer aria-selected:bg-[var(--surface-soft)] focus:outline-none"
                  >
                    Go to Insights Tab
                  </Command.Item>
                  <Command.Item
                    onSelect={() => { setTab("review"); setPaletteOpen(false); }}
                    className="flex items-center gap-2 px-3 py-2 rounded-sm text-sm text-[var(--ink)] hover:bg-[var(--surface-soft)] cursor-pointer aria-selected:bg-[var(--surface-soft)] focus:outline-none"
                  >
                    Go to Human Review Tab
                  </Command.Item>
                </Command.Group>

                <Command.Separator className="h-[1px] bg-[var(--mist)] my-1" />

                <Command.Group heading="Pipeline Stages" className="text-[10px] font-mono uppercase tracking-wider text-[var(--ink-muted)] p-2">
                  <Command.Item
                    onSelect={() => { runStage(1, "/api/stage1"); setPaletteOpen(false); }}
                    className="flex items-center gap-2 px-3 py-2 rounded-sm text-sm text-[var(--ink)] hover:bg-[var(--surface-soft)] cursor-pointer aria-selected:bg-[var(--surface-soft)] focus:outline-none"
                  >
                    Run Stage 1: Eligibility Check (Hard Filter)
                  </Command.Item>
                  <Command.Item
                    onSelect={() => { runStage(2, "/api/stage2"); setPaletteOpen(false); }}
                    className="flex items-center gap-2 px-3 py-2 rounded-sm text-sm text-[var(--ink)] hover:bg-[var(--surface-soft)] cursor-pointer aria-selected:bg-[var(--surface-soft)] focus:outline-none"
                  >
                    Run Stage 2: Relevance Match (Embeddings)
                  </Command.Item>
                  <Command.Item
                    onSelect={() => { runStage(3, "/api/stage3"); setPaletteOpen(false); }}
                    className="flex items-center gap-2 px-3 py-2 rounded-sm text-sm text-[var(--ink)] hover:bg-[var(--surface-soft)] cursor-pointer aria-selected:bg-[var(--surface-soft)] focus:outline-none"
                  >
                    Run Stage 3: Depth Evaluation (AI Evaluator)
                  </Command.Item>
                  <Command.Item
                    onSelect={() => { runStage(4, "/api/stage4"); setPaletteOpen(false); }}
                    className="flex items-center gap-2 px-3 py-2 rounded-sm text-sm text-[var(--ink)] hover:bg-[var(--surface-soft)] cursor-pointer aria-selected:bg-[var(--surface-soft)] focus:outline-none"
                  >
                    Run Stage 4: Ranking Shortlist
                  </Command.Item>
                </Command.Group>

                <Command.Separator className="h-[1px] bg-[var(--mist)] my-1" />

                <Command.Group heading="Actions" className="text-[10px] font-mono uppercase tracking-wider text-[var(--ink-muted)] p-2">
                  <Command.Item
                    onSelect={() => { handleResetAll(); setPaletteOpen(false); }}
                    className="flex items-center gap-2 px-3 py-2 rounded-sm text-sm text-[var(--clay)] hover:bg-[var(--surface-soft)] cursor-pointer aria-selected:bg-[var(--surface-soft)] focus:outline-none"
                  >
                    Reset All Candidates
                  </Command.Item>
                  <Command.Item
                    onSelect={() => { handleLogout(); setPaletteOpen(false); }}
                    className="flex items-center gap-2 px-3 py-2 rounded-sm text-sm text-[var(--ink-muted)] hover:bg-[var(--surface-soft)] cursor-pointer aria-selected:bg-[var(--surface-soft)] focus:outline-none"
                  >
                    Log Out Admin Session
                  </Command.Item>
                </Command.Group>
              </Command.List>
            </motion.div>
          </Command.Dialog>
        )}
      </AnimatePresence>
    </motion.main>
  );
}

export default function AdminPage() {
  useEffect(() => {
    document.title = "Admin — Shortlister";
  }, []);

  return (
    <AdminGuard>
      <AdminDashboard />
    </AdminGuard>
  );
}
