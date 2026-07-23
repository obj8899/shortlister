import { BrevoClient } from "@getbrevo/brevo";

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY!,
});

export async function sendShortlistEmail(to: string, name: string, shortlisted: boolean, roleName: string) {
  try {
    await brevo.transactionalEmails.sendTransacEmail({
      subject: shortlisted ? "You've been shortlisted!" : "Update on your application",
      htmlContent: shortlisted
        ? `<p>Hi ${name},</p><p>Congratulations — you've been shortlisted for <strong>${roleName}</strong>! We'll be in touch with next steps soon.</p>`
        : `<p>Hi ${name},</p><p>Thank you for applying for <strong>${roleName}</strong>. After review, we won't be moving forward with your application at this time.</p>`,
      sender: { name: "Shortlister", email: process.env.BREVO_SENDER_EMAIL! },
      to: [{ email: to, name }],
    });
  } catch (err) {
    console.error(`Failed to send email to ${to}:`, err);
  }
}
