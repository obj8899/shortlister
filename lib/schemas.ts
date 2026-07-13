import { z } from "zod";

export const studentFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  skills: z.string().min(2, "List at least one skill"),
  resumeUrl: z.string().url("Enter a valid URL for your resume"),
  linkedinUrl: z.string().url("Enter a valid LinkedIn URL").optional().or(z.literal("")),
});

export type StudentFormData = z.infer<typeof studentFormSchema>;