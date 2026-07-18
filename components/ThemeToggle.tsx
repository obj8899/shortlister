"use client";

import { useEffect, useState } from "react";
import { Lightbulb } from "lucide-react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const isDark = stored === "dark";
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${
        dark ? "bg-[var(--ochre)] border-[var(--ochre)]" : "bg-white border-[var(--mist)]"
      }`}
    >
      <Lightbulb
        size={18}
        className={dark ? "text-[var(--paper)]" : "text-[var(--ochre)]"}
        fill={dark ? "currentColor" : "none"}
      />
    </button>
  );
}