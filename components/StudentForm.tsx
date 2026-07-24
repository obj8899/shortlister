"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import SkillTagInput from "@/components/SkillTagInput";
import { studentFormSchema, StudentFormData } from "@/lib/schemas";
import { supabase } from "@/lib/supabaseClient";

export default function StudentForm() {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentFormSchema),
  });

  const skillsValue = useWatch({ control, name: "skills" }) || "";
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFileError("");
    if (!file) return;

    if (file.type !== "application/pdf") {
      setFileError("Please upload a PDF file.");
      setResumeFile(null);
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setFileError("File too large — please compress to under 3MB (try smallpdf.com).");
      setResumeFile(null);
      return;
    }
    setResumeFile(file);
  };

  const onSubmit = async (data: StudentFormData) => {
    if (!resumeFile) {
      setFileError("Please attach your resume PDF.");
      return;
    }

    const fileName = `${crypto.randomUUID()}-${resumeFile.name}`;
    const { error: uploadError } = await supabase.storage
      .from("resumes")
      .upload(fileName, resumeFile, { contentType: "application/pdf" });

    if (uploadError) {
      console.error("Upload error details:", uploadError);
      toast.error("Failed to upload resume. Please try again.");
      return;
    }

    const { data: publicUrlData } = supabase.storage.from("resumes").getPublicUrl(fileName);
    const response = await fetch("/api/candidates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, resumeUrl: publicUrlData.publicUrl }),
    });

    if (!response.ok) {
      const result = await response.json();
      toast.error(result.error || "Something went wrong. Please try again.");
      return;
    }

    toast.success("Entry recorded successfully!");
    setResumeFile(null);
    reset();
  };

  const fieldClass =
    "w-full px-3 py-2.5 rounded-sm border border-[var(--mist)] bg-[var(--surface)] text-[var(--ink)] placeholder:text-[var(--ink-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--ochre)] transition-all duration-200";
  const labelClass =
    "block text-xs font-mono uppercase tracking-wider text-[var(--ink)]/60 mb-1.5";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md w-full bg-[var(--surface)] border border-[var(--mist)] rounded-sm p-8 flex flex-col gap-5 shadow-sm">
      <div>
        <h2 className="font-display text-2xl text-[var(--ink)] mb-1">Candidate entry</h2>
        <p className="text-sm text-[var(--ink-muted)]">Submit your details for review.</p>
      </div>

      <div>
        <label className={labelClass}>Name</label>
        <motion.div
          animate={errors.name ? { x: [-4, 4, -4, 4, 0] } : { x: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <input {...register("name")} className={fieldClass} />
        </motion.div>
        {errors.name && <p className="text-[var(--clay)] text-xs mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Email</label>
        <motion.div
          animate={errors.email ? { x: [-4, 4, -4, 4, 0] } : { x: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <input {...register("email")} className={fieldClass} />
        </motion.div>
        {errors.email && <p className="text-[var(--clay)] text-xs mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Skills</label>
        <motion.div
          animate={errors.skills ? { x: [-4, 4, -4, 4, 0] } : { x: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <SkillTagInput value={skillsValue} onChange={(value) => setValue("skills", value, { shouldValidate: true })} />
        </motion.div>
        {errors.skills && <p className="text-[var(--clay)] text-xs mt-1">{errors.skills.message}</p>}
      </div>

      <div>
        <label className={labelClass}>College / Institution</label>
        <motion.div
          animate={errors.college ? { x: [-4, 4, -4, 4, 0] } : { x: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <input {...register("college")} className={fieldClass} placeholder="Your college name" />
        </motion.div>
        {errors.college && <p className="text-[var(--clay)] text-xs mt-1">{errors.college.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Resume (PDF, under 3MB)</label>
        <motion.div
          animate={fileError ? { x: [-4, 4, -4, 4, 0] } : { x: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className={`${fieldClass} file:mr-3 file:py-1.5 file:px-3 file:rounded-sm file:border-0 file:bg-[var(--ink)] file:text-[var(--paper)] file:text-xs file:cursor-pointer cursor-pointer`}
          />
        </motion.div>
        <p className="text-xs text-[var(--ink-faint)] mt-1">Too large? Compress it free at smallpdf.com first.</p>
        {fileError && <p className="text-[var(--clay)] text-xs mt-1">{fileError}</p>}
      </div>

      <div>
        <label className={labelClass}>LinkedIn URL (optional)</label>
        <motion.div
          animate={errors.linkedinUrl ? { x: [-4, 4, -4, 4, 0] } : { x: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <input {...register("linkedinUrl")} className={fieldClass} placeholder="https://linkedin.com/in/..." />
        </motion.div>
        {errors.linkedinUrl && <p className="text-[var(--clay)] text-xs mt-1">{errors.linkedinUrl.message}</p>}
      </div>

      <button type="submit" disabled={isSubmitting} className="mt-2 bg-[var(--ink)] text-[var(--paper)] rounded-sm py-2.5 font-medium tracking-wide hover:bg-[var(--ledger)] enabled:hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50">
        {isSubmitting ? "Submitting…" : "Submit entry"}
      </button>
    </form>
  );
}
