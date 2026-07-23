"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) router.push("/admin/login");
    });

    return () => listener.subscription.unsubscribe();
  }, [router]);

  useEffect(() => {
    if (!authorized) return;

    const interval = setInterval(async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session?.expires_at) return;

      const secondsLeft = data.session.expires_at - Math.floor(Date.now() / 1000);
      if (secondsLeft > 0 && secondsLeft < 300) {
        toast.warning("Your session is expiring soon — save any changes.", { duration: 8000 });
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [authorized]);

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--paper)]">
        <p className="font-mono text-sm text-[var(--ink-muted)]">Checking session…</p>
      </main>
    );
  }

  if (!authorized) return null;
  return <>{children}</>;
}
