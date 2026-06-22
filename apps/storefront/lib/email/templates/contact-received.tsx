import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface ContactReceivedEmailProps {
  name: string;
  subject: string;
  message: string;
}

export const ContactReceivedEmail = ({
  name = "Customer",
  subject = "Support Request",
  message = "This is a test support message.",
}: ContactReceivedEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>We have received your support request: {subject}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoSection}>
            <Text style={logoText}>PMS</Text>
          </Section>

          <Heading style={h1}>Support Request Received</Heading>
          <Text style={text}>
            Hi {name},
          </Text>
          <Text style={text}>
            Thank you for reaching out to us. We have received your message regarding <strong>&quot;{subject}&quot;</strong>.
          </Text>
          <Text style={text}>
            Our customer support team is reviewing your request and will get back to you as soon as possible.
          </Text>

          <Section style={messageCard}>
            <Text style={cardTitle}>Copy of your message</Text>
            <Text style={messageText}>{message}</Text>
          </Section>

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>
              If you have additional details to add, please contact us at{" "}
              <Link href="mailto:support@pms.com" style={link}>
                support@pms.com
              </Link>
            </Text>
            <Text style={footerText}>
              © {new Date().getFullYear()} PMS. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default ContactReceivedEmail;

// --- Styles ---
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "40px 20px 48px",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  maxWidth: "580px",
};

const logoSection = {
  paddingBottom: "24px",
  borderBottom: "1px solid #e6ebf1",
  textAlign: "center" as const,
};

const logoText = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#0f172a",
  margin: "0",
  letterSpacing: "1px",
};

const h1 = {
  color: "#1e293b",
  fontSize: "22px",
  fontWeight: "bold",
  paddingTop: "24px",
  margin: "0 0 16px",
};

const text = {
  color: "#475569",
  fontSize: "15px",
  lineHeight: "24px",
  margin: "0 0 16px",
};

const messageCard = {
  backgroundColor: "#f8fafc",
  borderRadius: "6px",
  padding: "16px",
  margin: "24px 0",
  border: "1px solid #f1f5f9",
};

const cardTitle = {
  fontSize: "13px",
  fontWeight: "bold",
  color: "#64748b",
  margin: "0 0 8px",
  textTransform: "uppercase" as const,
};

const messageText = {
  fontSize: "14px",
  lineHeight: "22px",
  color: "#334155",
  margin: "0",
  whiteSpace: "pre-wrap" as const,
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "24px 0",
};

const footer = {
  textAlign: "center" as const,
};

const footerText = {
  color: "#94a3b8",
  fontSize: "12px",
  lineHeight: "18px",
  margin: "4px 0",
};

const link = {
  color: "#0f172a",
  textDecoration: "underline",
};
