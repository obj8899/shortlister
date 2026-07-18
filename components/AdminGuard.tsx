"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/admin/login");
      } else {
        setAuthorized(true);
      }
      setChecking(false);
    };
    checkSession();
  }, [router]);

  if (checking) {
    return (
      <main className="min-h-screen bg-[var(--paper)] flex items-center justify-center">
        <p className="text-[var(--ink-muted)] font-mono text-sm">Checking session…</p>
      </main>
    );
  }

  if (!authorized) return null;

  return <>{children}</>;
}