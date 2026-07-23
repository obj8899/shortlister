"use client";

import { useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";

export default function SkillTagInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [input, setInput] = useState("");
  const skills = value ? value.split(",").map((skill) => skill.trim()).filter(Boolean) : [];

  const addSkill = () => {
    const trimmed = input.trim();
    if (trimmed && !skills.includes(trimmed)) onChange([...skills, trimmed].join(", "));
    setInput("");
  };

  const removeSkill = (skill: string) => onChange(skills.filter((entry) => entry !== skill).join(", "));

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addSkill();
    } else if (event.key === "Backspace" && input === "" && skills.length > 0) {
      removeSkill(skills[skills.length - 1]);
    }
  };

  return (
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
        onChange={(event) => setInput(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addSkill}
        placeholder={skills.length === 0 ? "Type a skill, press Enter" : ""}
        className="min-w-[120px] flex-1 bg-transparent text-sm text-[var(--ink)] outline-none placeholder:text-[var(--ink-faint)]"
      />
    </div>
  );
}
