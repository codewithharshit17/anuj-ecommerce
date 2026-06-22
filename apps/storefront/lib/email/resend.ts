import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const emailEnabled = process.env.EMAIL_ENABLED !== "false";

if (emailEnabled && !apiKey) {
  throw new Error(
    "Missing RESEND_API_KEY environment variable. Please configure it in your .env file, or set EMAIL_ENABLED=false to disable email functionality."
  );
}

export const resend = apiKey ? new Resend(apiKey) : null;
