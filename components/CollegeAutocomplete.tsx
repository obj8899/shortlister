"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import rawInstitutionsData from "aishe-institutions-list/data/institutions.json";
import { motion, AnimatePresence } from "framer-motion";

const institutionsData = rawInstitutionsData as { aishe_code?: string; name: string; state: string; district?: string }[];

function searchInstitutions(query: string, limit = 8) {
  if (!query) return [];
  const normalizedQuery = query.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  const queryWords = normalizedQuery.split(' ').filter(w => w.length > 0);
  if (queryWords.length === 0) return [];

  const results = [];
  const seen = new Set();
  
  for (const inst of institutionsData) {
    if (results.length >= limit) break;
    
    const normalizedName = (inst.name || "").toLowerCase();
    const normalizedState = (inst.state || "").toLowerCase();
    
    const matches = queryWords.every(word => 
      normalizedName.includes(word) ||
      normalizedState.includes(word)
    );
    
    if (matches) {
      const key = `${inst.name}_${inst.state}`;
      if (!seen.has(key)) {
        seen.add(key);
        results.push(inst);
      }
    }
  }
  return results;
}

interface CollegeAutocompleteProps {
  value: string;
  onChange: (val: string) => void;
}

export default function CollegeAutocomplete({ value, onChange }: CollegeAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

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
  }, [isOpen, results]);

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

  useEffect(() => {
    const handler = setTimeout(() => {
      const trimmedValue = value.trim();
      if (trimmedValue.length >= 2) {
        const res = searchInstitutions(trimmedValue, 8);
        setResults(res);
      } else {
        setResults([]);
      }
    }, 200);

    return () => clearTimeout(handler);
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < results.length) {
        onChange(results[activeIndex].name);
        setIsOpen(false);
        setActiveIndex(-1);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  const handleSelect = (name: string) => {
    onChange(name);
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const fieldClass =
    "w-full px-3 py-2.5 rounded-sm border border-[var(--mist)] bg-[var(--surface)] text-[var(--ink)] placeholder:text-[var(--ink-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--ochre)] transition-all duration-200";

  return (
    <div className="relative w-full z-50" ref={wrapperRef}>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
          setActiveIndex(-1);
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (value.trim()) setIsOpen(true);
        }}
        placeholder="Your college name"
        className={fieldClass}
        autoComplete="off"
      />

      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && value.trim() && (
            <motion.div
              ref={dropdownRef}
              key="college-dropdown"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              style={dropdownStyle}
              className="z-[9999] bg-[var(--surface)] border border-[var(--mist)] rounded-sm shadow-lg max-h-64 overflow-y-auto"
            >
            {results.length > 0 ? (
              <ul className="py-1">
                {results.map((inst, idx) => (
                  <li
                    key={`${inst.name}-${inst.state}-${idx}`}
                    className={`px-3 py-2 cursor-pointer text-sm ${
                      idx === activeIndex
                        ? "bg-[var(--surface-soft)] text-[var(--ochre)]"
                        : "text-[var(--ink)] hover:bg-[var(--surface-soft)]"
                    }`}
                    onClick={() => handleSelect(inst.name)}
                    onMouseEnter={() => setActiveIndex(idx)}
                  >
                    <div>{inst.name}</div>
                    <div className="text-[var(--ink-faint)] text-xs mt-0.5">{inst.state}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-3 py-3 text-sm text-[var(--ink-muted)]">
                No matching college found — you can still type your college name manually
              </div>
            )}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
