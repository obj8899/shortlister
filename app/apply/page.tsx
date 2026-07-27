"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Briefcase, ChevronRight } from "lucide-react";
import { motion, type Variants, useReducedMotion } from "framer-motion";
import StudentForm from "@/components/StudentForm";
import CandidateDashboard from "@/components/CandidateDashboard";
import ThemeToggle from "@/components/ThemeToggle";
import GoogleSignIn from "@/components/GoogleSignIn";
import { supabase } from "@/lib/supabaseClient";

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

export default function ApplyPage() {
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [openRoles, setOpenRoles] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [candidateStatus, setCandidateStatus] = useState<any>(null);
  const [statusChecked, setStatusChecked] = useState(false);

  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    document.title = "Apply — Shortlister";

    const params = new URLSearchParams(window.location.search);
    const rId = params.get("roleId");
    if (rId) {
      setSelectedRoleId(rId);
    }

    fetch("/api/open-roles")
      .then((res) => res.json())
      .then((data) => setOpenRoles(data.roles || []))
      .catch((err) => console.error("Error loading open roles:", err));
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session) {
      setStatusChecked(false);
      setCandidateStatus(null);
      setApplications([]);
      return;
    }

    const token = session.access_token;

    if (selectedRoleId) {
      setLoading(true);
      fetch(`/api/my-status?roleId=${selectedRoleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((result) => {
          setCandidateStatus(result.candidate || null);
          setStatusChecked(true);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setLoading(true);
      fetch("/api/my-applications", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((result) => {
          setApplications(result.applications || []);
          setStatusChecked(true);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [session, selectedRoleId]);

  const handleSelectRole = (roleId: string) => {
    setSelectedRoleId(roleId);
    setStatusChecked(false);
    setCandidateStatus(null);
    const newUrl = `${window.location.pathname}?roleId=${roleId}`;
    window.history.pushState({ path: newUrl }, "", newUrl);
  };

  const handleBackToRoles = () => {
    setSelectedRoleId(null);
    setCandidateStatus(null);
    setStatusChecked(false);
    const newUrl = window.location.pathname;
    window.history.pushState({ path: newUrl }, "", newUrl);
  };

  const getApplicationStatusLabel = (app: any) => {
    if (app.shortlisted) return { text: "Shortlisted", color: "text-[var(--ledger)] border-[var(--ledger)] bg-[var(--ledger)]/5" };
    if (
      app.stage1_status === "rejected" ||
      app.stage2_status === "rejected" ||
      app.stage3_status === "rejected"
    ) {
      return { text: "Rejected", color: "text-[var(--clay)] border-[var(--clay)] bg-[var(--clay)]/5" };
    }
    return { text: "In Review", color: "text-[var(--ochre)] border-[var(--ochre)] bg-[var(--ochre)]/5" };
  };

  const truncateText = (text: string, maxLen = 140) => {
    if (!text) return "";
    if (text.length <= maxLen) return text;
    return text.substring(0, maxLen) + "…";
  };

  const itemVariants = {
    hidden: shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: shouldReduceMotion ? 0.05 : 0.6, ease: [0.22, 1, 0.36, 1] as any } },
  };

  const hoverCard = shouldReduceMotion ? undefined : { y: -4 };
  const hoverBtn = shouldReduceMotion ? undefined : { y: -2 };
  const hoverRow = shouldReduceMotion ? undefined : { y: -2 };
  const tapCard = shouldReduceMotion ? undefined : { scale: 0.98 };
  const tapBtn = shouldReduceMotion ? undefined : { scale: 0.97 };

  if (loading || (session && selectedRoleId && !statusChecked)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--paper)]">
        <span className="text-sm font-mono text-[var(--ink-muted)] animate-pulse">Loading...</span>
      </div>
    );
  }

  if (selectedRoleId) {
    const activeRole = openRoles.find((r) => r.id === selectedRoleId);
    const activeRoleName = activeRole?.role_name || "Selected Position";

    return (
      <motion.main
        variants={containerVariants}
        initial={shouldReduceMotion ? "show" : "hidden"}
        animate="show"
        className="flex min-h-screen items-center justify-center bg-[var(--paper)] px-6 py-12"
      >
        <div className="w-full max-w-md">
          <motion.div variants={itemVariants} className="mb-6 flex items-center justify-between">
            <motion.button
              whileHover={hoverBtn}
              whileTap={tapBtn}
              onClick={handleBackToRoles}
              className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wide text-[var(--ink-muted)] hover:text-[var(--ink)] cursor-pointer"
            >
              <ArrowLeft size={14} /> Back to roles
            </motion.button>
            <ThemeToggle />
          </motion.div>

          <motion.div variants={itemVariants} className="mb-8 text-center">
            <p className="mb-2 font-mono text-xs uppercase tracking-widest text-[var(--ochre)]">
              Candidate Portal
            </p>
            <h1 className="font-display text-4xl italic text-[var(--ink)]">Shortlister</h1>
            <p className="mt-2 font-mono text-sm text-[var(--ochre)]">
              Applying for: {activeRoleName}
            </p>
          </motion.div>

          {!session ? (
            <motion.div variants={itemVariants} className="max-w-md w-full bg-[var(--surface)] border border-[var(--mist)] rounded-sm p-8 flex flex-col gap-6 shadow-sm">
              <div>
                <h2 className="font-display text-2xl text-[var(--ink)] mb-1">Verify Email</h2>
                <p className="text-sm text-[var(--ink-muted)]">
                  Sign in with Google to verify your email before applying to this role.
                </p>
              </div>
              <GoogleSignIn />
            </motion.div>
          ) : candidateStatus ? (
            <motion.div variants={itemVariants} className="flex flex-col gap-4">
              <CandidateDashboard data={candidateStatus} />
              <motion.button
                whileHover={hoverBtn}
                whileTap={tapBtn}
                onClick={handleBackToRoles}
                className="text-xs font-mono uppercase tracking-wide text-[var(--ink-muted)] hover:text-[var(--ink)] text-center underline cursor-pointer mt-2"
              >
                Back to all roles
              </motion.button>
            </motion.div>
          ) : (
            <motion.div variants={itemVariants} className="flex flex-col gap-4">
              <StudentForm verifiedEmail={session.user.email} roleId={selectedRoleId} />
              <motion.button
                whileHover={hoverBtn}
                whileTap={tapBtn}
                onClick={handleBackToRoles}
                className="text-xs font-mono uppercase tracking-wide text-[var(--ink-muted)] hover:text-[var(--ink)] text-center underline cursor-pointer mt-2"
              >
                Cancel and choose another role
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.main>
    );
  }

  return (
    <motion.main
      variants={containerVariants}
      initial={shouldReduceMotion ? "show" : "hidden"}
      animate="show"
      className="min-h-screen bg-[var(--paper)] px-6 py-12"
    >
      <div className="max-w-4xl mx-auto">
        <motion.header variants={itemVariants} className="mb-10 flex items-start justify-between">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wide text-[var(--ink-muted)] hover:text-[var(--ink)] mb-3"
            >
              <ArrowLeft size={14} /> Back Home
            </Link>
            <h1 className="font-display italic text-4xl md:text-5xl text-[var(--ink)]">Shortlister</h1>
            <p className="text-sm text-[var(--ink-muted)] mt-2">Explore available roles or track your application status.</p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {session && (
              <motion.button
                whileHover={hoverBtn}
                whileTap={tapBtn}
                onClick={async () => {
                  await supabase.auth.signOut();
                  window.location.reload();
                }}
                className="text-xs font-mono uppercase tracking-wide text-[var(--ink-muted)] hover:text-[var(--clay)] border border-[var(--mist)] px-3 py-1.5 rounded-sm transition-all duration-200 cursor-pointer"
              >
                Sign out
              </motion.button>
            )}
          </div>
        </motion.header>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main position listing column */}
          <motion.div variants={itemVariants} className="md:col-span-2 flex flex-col gap-6">
            <h2 className="font-mono text-xs uppercase tracking-wider text-[var(--ink-muted)] border-b border-[var(--mist)] pb-2">
              Available Openings
            </h2>

            {openRoles.length === 0 ? (
              <p className="text-sm text-[var(--ink-muted)] italic">
                No roles are currently open. Check back soon.
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {openRoles.map((role) => (
                  <motion.div
                    key={role.id}
                    whileHover={hoverCard}
                    whileTap={tapCard}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    onClick={() => handleSelectRole(role.id)}
                    className="border border-[var(--mist)] bg-[var(--surface)] hover:border-[var(--ink)] rounded-sm p-5 cursor-pointer flex flex-col justify-between shadow-sm transition-all animate-none"
                  >
                    <div>
                      <h3 className="font-display text-lg text-[var(--ink)] mb-2 flex items-center gap-2">
                        <Briefcase size={16} className="text-[var(--ochre)]" />
                        {role.role_name}
                      </h3>
                      <p className="text-xs text-[var(--ink-muted)] leading-relaxed mb-4">
                        {truncateText(role.target_profile)}
                      </p>
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-wide text-[var(--ledger)] flex items-center gap-1">
                      Apply Now <ChevronRight size={10} />
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Sidebar / User applications list */}
          <motion.div variants={itemVariants} className="flex flex-col gap-6">
            <h2 className="font-mono text-xs uppercase tracking-wider text-[var(--ink-muted)] border-b border-[var(--mist)] pb-2">
              Your Applications
            </h2>

            {!session ? (
              <div className="border border-[var(--mist)] border-dashed bg-[var(--surface-soft)] rounded-sm p-6 text-center">
                <p className="text-xs text-[var(--ink-muted)] mb-4">
                  Sign in with Google to view and track your submitted applications.
                </p>
                <GoogleSignIn />
              </div>
            ) : applications.length === 0 ? (
              <div className="border border-[var(--mist)] bg-[var(--surface-soft)] rounded-sm p-6 text-center">
                <p className="text-xs text-[var(--ink-muted)] italic">
                  You haven&apos;t applied to any roles yet. Pick a role from the left to start.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {applications.map((app) => {
                  const status = getApplicationStatusLabel(app);
                  return (
                    <motion.div
                      key={app.id}
                      whileHover={hoverRow}
                      whileTap={tapCard}
                      onClick={() => handleSelectRole(app.role_id)}
                      className="border border-[var(--mist)] bg-[var(--surface)] hover:border-[var(--ink)] rounded-sm p-4 cursor-pointer flex flex-col gap-3 shadow-xs transition-all duration-200"
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-sm text-[var(--ink)] leading-tight">
                          {app.role?.role_name || "Position"}
                        </h4>
                        <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 border rounded-sm tracking-wide shrink-0 ${status.color}`}>
                          {status.text}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1 text-[10px] font-mono text-[var(--ink-muted)]">
                        <span>Applied: {new Date(app.created_at).toLocaleDateString()}</span>
                        <span className="text-[var(--ledger)] hover:underline flex items-center gap-0.5">
                          View details <ChevronRight size={10} />
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.main>
  );
}