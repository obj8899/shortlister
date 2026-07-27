"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { motion, type Variants, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const [isFinePointer, setIsFinePointer] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const mouseX = useMotionValue(-500);
  const mouseY = useMotionValue(-500);

  // Smooth springs for tracking mouse spotlight
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

  const fieldClass =
    "w-full px-3 py-2.5 rounded-sm border border-[var(--mist)] bg-[var(--surface)] text-[var(--ink)] placeholder:text-[var(--ink-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--ochre)] transition-all duration-200";

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`min-h-screen bg-[var(--paper)] flex items-center justify-center px-6 relative overflow-hidden ledger-ruled-bg ${
        shouldReduceMotion ? "" : "ledger-drift-anim"
      }`}
    >
      {/* Subtle cursor-following spotlight */}
      {isFinePointer && !shouldReduceMotion && (
        <motion.div
          className="fixed top-0 left-0 w-[500px] h-[500px] rounded-full bg-[var(--ochre)] opacity-[0.05] pointer-events-none z-0"
          style={{
            x: cursorX,
            y: cursorY,
            filter: "blur(100px)",
          }}
        />
      )}

      <motion.form
        variants={containerVariants}
        initial="hidden"
        animate="show"
        onSubmit={handleLogin}
        className="max-w-sm w-full bg-[var(--surface)] border border-[var(--mist)] rounded-sm p-8 flex flex-col gap-4 shadow-sm relative z-10"
      >
        <motion.h1 variants={itemVariants} className="font-display text-2xl text-[var(--ink)] italic mb-2">
          Admin login
        </motion.h1>
        
        <motion.div variants={itemVariants}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClass}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={fieldClass}
          />
        </motion.div>

        {error && (
          <motion.p variants={itemVariants} className="text-[var(--clay)] text-sm">
            {error}
          </motion.p>
        )}

        <motion.button
          variants={itemVariants}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          className="bg-[var(--ink)] text-[var(--paper)] rounded-sm py-2.5 font-medium hover:bg-[var(--ledger)] transition-colors cursor-pointer text-sm font-mono uppercase tracking-wide mt-2"
        >
          Log in
        </motion.button>
      </motion.form>
    </motion.main>
  );
}