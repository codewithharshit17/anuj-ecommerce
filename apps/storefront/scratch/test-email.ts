import { sendWelcomeEmail } from "../lib/email/send-email";

async function main() {
  process.env.EMAIL_ENABLED = "false"; // force bypass to test logic compile and run
  console.log("Testing welcome email trigger (bypassed)...");
  
  const result = await sendWelcomeEmail({
    email: "test@example.com",
    firstName: "Alice",
  });
  
  console.log("Result:", result);
}

main().catch(console.error);
