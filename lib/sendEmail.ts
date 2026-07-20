import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendShortlistEmail(to: string, name: string, shortlisted: boolean) {
  try {
    await resend.emails.send({
      from: "Shortlister <onboarding@resend.dev>",
      to,
      subject: shortlisted
        ? "You've been shortlisted!"
        : "Update on your application",
      html: shortlisted
        ? `<p>Hi ${name},</p><p>Congratulations — you've been shortlisted! We'll be in touch with next steps soon.</p>`
        : `<p>Hi ${name},</p><p>Thank you for applying. After review, we won't be moving forward with your application at this time. We appreciate the effort you put in.</p>`,
    });
  } catch (err) {
    console.error(`Failed to send email to ${to}:`, err);
  }
}