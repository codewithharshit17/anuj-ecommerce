import {
  sendWelcomeEmail,
  sendContactAdminEmail,
  sendContactReceivedEmail,
} from "../lib/email/send-email";

async function main() {
  process.env.EMAIL_ENABLED = "false"; // force bypass to test logic compile and run
  console.log("Testing email triggers (bypassed)...");
  
  const resWelcome = await sendWelcomeEmail({
    email: "customer@example.com",
    firstName: "Alice",
  });
  console.log("Welcome Email Result:", resWelcome);

  const resAdmin = await sendContactAdminEmail({
    name: "John Doe",
    email: "john@example.com",
    subject: "Inquiry about calligraphy pens",
    message: "Hello support, do you restock your classic calligraphy nibs?",
  });
  console.log("Admin Support Email Result:", resAdmin);

  const resCustomer = await sendContactReceivedEmail({
    to: "john@example.com",
    name: "John Doe",
    subject: "Inquiry about calligraphy pens",
    message: "Hello support, do you restock your classic calligraphy nibs?",
  });
  console.log("Customer Auto-Reply Email Result:", resCustomer);
}

main().catch(console.error);
