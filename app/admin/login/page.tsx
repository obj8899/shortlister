"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("Invalid credentials.");
      return;
    }
    router.push("/admin");
  };

  return (
    <main className="min-h-screen bg-[var(--paper)] flex items-center justify-center px-6">
      <form
        onSubmit={handleLogin}
        className="max-w-sm w-full bg-[var(--surface)] border border-[var(--mist)] rounded-sm p-8 flex flex-col gap-4"
      >
        <h1 className="font-display text-2xl text-[var(--ink)] italic">Admin login</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-3 py-2.5 rounded-sm border border-[var(--mist)] bg-white text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--ochre)]"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-3 py-2.5 rounded-sm border border-[var(--mist)] bg-white text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--ochre)]"
        />
        {error && <p className="text-[var(--clay)] text-sm">{error}</p>}
        <button
          type="submit"
          className="bg-[var(--ink)] text-[var(--paper)] rounded-sm py-2.5 font-medium hover:bg-[var(--ledger)] transition-colors"
        >
          Log in
        </button>
      </form>
    </main>
  );
}