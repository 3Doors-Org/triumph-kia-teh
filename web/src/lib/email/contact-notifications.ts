import { Resend } from "resend";

type ContactLead = {
  id: string;
  name: string;
  email: string;
  inquiryType: string;
  message: string;
  sourcePage: string;
};

let resendClient: Resend | null = null;
const DEFAULT_OWNER_INBOX = "kiattriumph@gmail.com";

function getResendClient() {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return null;
  }

  if (!resendClient) {
    resendClient = new Resend(key);
  }

  return resendClient;
}

export async function sendContactNotifications(lead: ContactLead) {
  const client = getResendClient();
  if (!client) {
    return;
  }

  const from = process.env.RESEND_FROM_EMAIL ?? "noreply@triumphkiateh.com";
  const owner =
    process.env.EMAIL_OWNER ??
    process.env.SEED_ADMIN_EMAIL ??
    DEFAULT_OWNER_INBOX;
  if (!owner) {
    return;
  }

  const ownerPromise = client.emails.send({
    from,
    to: owner,
    subject: `New ${lead.inquiryType} lead from ${lead.name}`,
    text: [
      `Lead ID: ${lead.id}`,
      `Name: ${lead.name}`,
      `Email: ${lead.email}`,
      `Inquiry Type: ${lead.inquiryType}`,
      `Source Page: ${lead.sourcePage}`,
      "",
      "Message:",
      lead.message,
    ].join("\n"),
  });

  const submitterPromise = client.emails.send({
    from,
    to: lead.email,
    subject: "Your message was received",
    text: "Thank you for reaching out. Your message has been received and will be reviewed shortly.",
  });

  await Promise.allSettled([ownerPromise, submitterPromise]);
}
