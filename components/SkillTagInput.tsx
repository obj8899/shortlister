"use client";

import { useState, type KeyboardEvent, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import skillsList from "@/lib/skills.json";

export default function SkillTagInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  const skills = value ? value.split(",").map((skill) => skill.trim()).filter(Boolean) : [];

  const suggestions = isOpen && input.trim()
    ? (skillsList as string[])
        .filter((s) => s.toLowerCase().includes(input.toLowerCase()))
        .filter((s) => !skills.some((existing) => existing.toLowerCase() === s.toLowerCase()))
        .slice(0, 6)
    : [];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const updatePosition = () => {
      if (wrapperRef.current && isOpen) {
        const rect = wrapperRef.current.getBoundingClientRect();
        setDropdownStyle({
          position: "fixed",
          top: rect.bottom + 4,
          left: rect.left,
          width: rect.width,
        });
      }
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen, input, suggestions.length]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current && !wrapperRef.current.contains(event.target as Node) &&
        (!dropdownRef.current || !dropdownRef.current.contains(event.target as Node))
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addSkill = (skillToAdd?: string) => {
    const trimmed = (typeof skillToAdd === 'string' ? skillToAdd : input).trim();
    if (trimmed && !skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      onChange([...skills, trimmed].join(", "));
    }
    setInput("");
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const removeSkill = (skill: string) => onChange(skills.filter((entry) => entry !== skill).join(", "));

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (isOpen && suggestions.length > 0) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
        return;
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
        return;
      } else if (event.key === "Enter") {
        event.preventDefault();
        if (activeIndex >= 0 && activeIndex < suggestions.length) {
          addSkill(suggestions[activeIndex]);
        } else {
          addSkill();
        }
        return;
      } else if (event.key === "Escape") {
        setIsOpen(false);
        setActiveIndex(-1);
        return;
      }
    }

    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addSkill();
    } else if (event.key === "Backspace" && input === "" && skills.length > 0) {
      removeSkill(skills[skills.length - 1]);
    }
  };

  return (
    <div className="relative w-full z-50" ref={wrapperRef}>
      <div className="flex min-h-[46px] w-full flex-wrap items-center gap-2 rounded-sm border border-[var(--mist)] bg-[var(--surface)] px-3 py-2 focus-within:ring-2 focus-within:ring-[var(--ochre)]">
        {skills.map((skill) => (
          <span key={skill} className="flex items-center gap-1 rounded-sm border border-[var(--mist)] bg-[var(--surface-soft)] px-2 py-1 text-sm text-[var(--ink)]">
            {skill}
            <button type="button" onClick={() => removeSkill(skill)} className="hover:text-[var(--clay)]" aria-label={`Remove ${skill}`}>
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
            setIsOpen(true);
            setActiveIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (input.trim()) setIsOpen(true);
          }}
          onBlur={() => {
            setTimeout(() => {
              addSkill();
            }, 150);
          }}
          placeholder={skills.length === 0 ? "Type a skill, press Enter" : ""}
          className="min-w-[120px] flex-1 bg-transparent text-sm text-[var(--ink)] outline-none placeholder:text-[var(--ink-faint)]"
        />
      </div>

      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && input.trim() && suggestions.length > 0 && (
            <motion.div
              ref={dropdownRef}
              key="skills-dropdown"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              style={dropdownStyle}
              className="z-[9999] bg-[var(--surface)] border border-[var(--mist)] rounded-sm shadow-lg max-h-64 overflow-y-auto"
            >
            <ul className="py-1">
              {suggestions.map((suggestion, idx) => (
                <li
                  key={suggestion}
                  className={`px-3 py-2 cursor-pointer text-sm ${
                    idx === activeIndex
                      ? "bg-[var(--surface-soft)] text-[var(--ochre)]"
                      : "text-[var(--ink)] hover:bg-[var(--surface-soft)]"
                  }`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    addSkill(suggestion);
                  }}
                  onMouseEnter={() => setActiveIndex(idx)}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
