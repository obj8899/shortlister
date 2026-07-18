"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { studentFormSchema, StudentFormData } from "@/lib/schemas";

export default function StudentForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentFormSchema),
  });

  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const onSubmit = async (data: StudentFormData) => {
    const res = await fetch("/api/candidates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const result = await res.json();
      setErrorMessage(result.error || "Something went wrong. Please try again.");
      setSubmitStatus("error");
      return;
    }

    setSubmitStatus("success");
    setErrorMessage("");
    reset();
  };

  const fieldClass =
    "w-full px-3 py-2.5 rounded-sm border border-[var(--mist)] bg-white text-[var(--ink)] placeholder:text-[var(--mist)] focus:outline-none focus:ring-2 focus:ring-[var(--ochre)] transition-shadow";
  const labelClass =
    "block text-xs font-mono uppercase tracking-wider text-[var(--ink-muted)] mb-1.5";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md w-full bg-[var(--surface)] border border-[var(--mist)] rounded-sm p-8 flex flex-col gap-5 shadow-sm"
    >
      <div>
        <h2 className="font-display text-2xl text-[var(--ink)] mb-1">Candidate entry</h2>
        <p className="text-sm text-[var(--ink-muted)]">Submit your details for review.</p>
      </div>

      <div>
        <label className={labelClass}>Name</label>
        <input {...register("name")} className={fieldClass} />
        {errors.name && <p className="text-[var(--clay)] text-xs mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Email</label>
        <input {...register("email")} className={fieldClass} />
        {errors.email && <p className="text-[var(--clay)] text-xs mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Skills (comma separated)</label>
        <input {...register("skills")} className={fieldClass} placeholder="Python, SQL, React" />
        {errors.skills && <p className="text-[var(--clay)] text-xs mt-1">{errors.skills.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Resume URL</label>
        <input {...register("resumeUrl")} className={fieldClass} placeholder="https://..." />
        {errors.resumeUrl && <p className="text-[var(--clay)] text-xs mt-1">{errors.resumeUrl.message}</p>}
      </div>

      <div>
        <label className={labelClass}>LinkedIn URL (optional)</label>
        <input {...register("linkedinUrl")} className={fieldClass} placeholder="https://linkedin.com/in/..." />
        {errors.linkedinUrl && <p className="text-[var(--clay)] text-xs mt-1">{errors.linkedinUrl.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 bg-[var(--ink)] text-[var(--paper)] rounded-sm py-2.5 font-medium tracking-wide hover:bg-[var(--ledger)] transition-colors disabled:opacity-50"
      >
        {isSubmitting ? "Submitting…" : "Submit entry"}
      </button>

      {submitStatus === "success" && (
        <p className="text-[var(--ledger)] text-sm font-mono">✓ Entry recorded successfully.</p>
      )}
      {submitStatus === "error" && (
        <p className="text-[var(--clay)] text-sm font-mono">{errorMessage}</p>
      )}
    </form>
  );
}