import { Resend } from "resend";

// Sandbox sender — works without a verified domain, but Resend will label
// delivery as coming from "onboarding@resend.dev". Swap for a real address
// on the Pauella domain (e.g. notifications@pauella.com) once the domain is
// live and verified in Resend.
const FROM_ADDRESS = "Pauella <onboarding@resend.dev>";

// Submitted form values land straight in an HTML email body — escape them
// so a stray "<" or "&" from a guest's message can't break the markup.
export function escapeHtml(value: unknown): string {
  if (value === undefined || value === null || value === "") return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function emailRows(fields: [string, unknown][]): string {
  return fields
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([label, value]) => `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`)
    .join("");
}

export async function sendNotificationEmail({
  subject,
  html,
  replyTo,
}: {
  subject: string;
  html: string;
  replyTo?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFICATION_EMAIL;

  if (!apiKey || !to) {
    console.log("RESEND_API_KEY or NOTIFICATION_EMAIL not set, skipping email send.", {
      subject,
    });
    return;
  }

  const resend = new Resend(apiKey);
  // The SDK reports failures (bad key, unverified recipient…) in the return
  // value instead of throwing, so surface them here — otherwise the form
  // would show "sent" for an email that never left.
  const { error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject,
    html,
    ...(replyTo ? { replyTo } : {}),
  });

  if (error) {
    throw new Error(`Resend failed to send "${subject}": ${error.message}`);
  }
}
