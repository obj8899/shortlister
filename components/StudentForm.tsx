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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto flex flex-col gap-4 p-6">
      <div>
        <label className="block text-sm mb-1">Name</label>
        <input {...register("name")} className="w-full p-2 rounded bg-neutral-800 text-white" />
        {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm mb-1">Email</label>
        <input {...register("email")} className="w-full p-2 rounded bg-neutral-800 text-white" />
        {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm mb-1">Skills (comma separated)</label>
        <input {...register("skills")} className="w-full p-2 rounded bg-neutral-800 text-white" />
        {errors.skills && <p className="text-red-400 text-sm mt-1">{errors.skills.message}</p>}
      </div>

      <div>
        <label className="block text-sm mb-1">Resume URL</label>
        <input {...register("resumeUrl")} className="w-full p-2 rounded bg-neutral-800 text-white" />
        {errors.resumeUrl && <p className="text-red-400 text-sm mt-1">{errors.resumeUrl.message}</p>}
      </div>

      <div>
        <label className="block text-sm mb-1">LinkedIn URL (optional)</label>
        <input {...register("linkedinUrl")} className="w-full p-2 rounded bg-neutral-800 text-white" />
        {errors.linkedinUrl && <p className="text-red-400 text-sm mt-1">{errors.linkedinUrl.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-white text-black rounded p-2 mt-2 font-medium disabled:opacity-50"
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>

      {submitStatus === "success" && (
        <p className="text-green-400 text-sm">Submitted successfully!</p>
      )}
      {submitStatus === "error" && (
        <p className="text-red-400 text-sm">{errorMessage}</p>
      )}
    </form>
  );
}