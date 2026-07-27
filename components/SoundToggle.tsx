"use client";

import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";

export default function SoundToggle() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("sound-effects");
    setEnabled(stored === "true");
  }, []);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    localStorage.setItem("sound-effects", next ? "true" : "false");
  };

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={toggle}
      aria-label="Toggle sound effects"
      className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors duration-300 cursor-pointer ${
        enabled ? "bg-[var(--ledger)] border-[var(--ledger)] text-[var(--paper)]" : "bg-[var(--surface)] border-[var(--mist)] text-[var(--ink-muted)]"
      }`}
    >
      {enabled ? (
        <Volume2 size={18} />
      ) : (
        <VolumeX size={18} />
      )}
    </motion.button>
  );
}
