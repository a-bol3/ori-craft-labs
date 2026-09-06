import { Resend } from "resend";
import { getEmailEnv } from "@/lib/env";

export async function sendEmail(input: {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}) {
  const config = getEmailEnv();
  if (!config) {
    console.warn("EMAIL_NOT_CONFIGURED", { subject: input.subject });
    return { sent: false };
  }

  const resend = new Resend(config.RESEND_API_KEY);
  const result = await resend.emails.send({
    from: config.RESEND_FROM,
    to: input.to,
    subject: input.subject,
    text: input.text,
    replyTo: input.replyTo || config.RESEND_REPLY_TO,
  });

  if (result.error) {
    throw new Error(`Email provider rejected message: ${result.error.message}`);
  }
  return { sent: true, id: result.data?.id };
}
