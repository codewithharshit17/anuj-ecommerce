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
import { OrderConfirmationEmailProps } from "../types";

export const OrderConfirmationEmail = ({
  orderNumber = "ORD-000000",
  customerName = "Customer",
  orderDate = new Date().toLocaleDateString(),
  items = [],
  subtotal = 0,
  total = 0,
  shippingAddress = {
    name: "Customer",
    line1: "123 Main St",
    line2: null,
    city: "Metro",
    state: "State",
    pincode: "123456",
  },
}: OrderConfirmationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Thank you for your order, {customerName}!</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo Section */}
          <Section style={logoSection}>
            <Text style={logoText}>PMS</Text>
          </Section>

          {/* Heading */}
          <Heading style={h1}>Order Confirmed</Heading>
          <Text style={text}>
            Hi {customerName}, thank you for shopping with us! We have received your order and are currently processing it. Below are your order details.
          </Text>

          {/* Info Cards */}
          <Section style={detailsCard}>
            <Text style={cardTitle}>Order Summary</Text>
            <table style={{ width: "100%", fontSize: "14px" }}>
              <tbody>
                <tr>
                  <td style={{ color: "#64748b", padding: "4px 0" }}>Order Number:</td>
                  <td style={{ fontWeight: "bold", textAlign: "right" as const, color: "#1e293b" }}>{orderNumber}</td>
                </tr>
                <tr>
                  <td style={{ color: "#64748b", padding: "4px 0" }}>Order Date:</td>
                  <td style={{ textAlign: "right" as const, color: "#1e293b" }}>{orderDate}</td>
                </tr>
                <tr>
                  <td style={{ color: "#64748b", padding: "4px 0" }}>Payment Status:</td>
                  <td style={{ textAlign: "right" as const, color: "#0f766e", fontWeight: "bold" }}>PAID</td>
                </tr>
              </tbody>
            </table>
          </Section>

          {/* Items List */}
          <Section style={itemsSection}>
            <Text style={cardTitle}>Items Ordered</Text>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <th style={{ textAlign: "left" as const, paddingBottom: "8px", color: "#64748b", fontSize: "12px" }}>ITEM</th>
                  <th style={{ textAlign: "center" as const, paddingBottom: "8px", color: "#64748b", fontSize: "12px", width: "60px" }}>QTY</th>
                  <th style={{ textAlign: "right" as const, paddingBottom: "8px", color: "#64748b", fontSize: "12px", width: "80px" }}>PRICE</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "12px 0", fontSize: "14px" }}>
                      <span style={{ fontWeight: "bold", color: "#1e293b" }}>{item.name}</span>
                      {item.variantName && (
                        <span style={{ display: "block", color: "#64748b", fontSize: "12px", marginTop: "2px" }}>
                          Option: {item.variantName}
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: "center" as const, padding: "12px 0", fontSize: "14px", color: "#475569" }}>
                      {item.quantity}
                    </td>
                    <td style={{ textAlign: "right" as const, padding: "12px 0", fontSize: "14px", color: "#1e293b", fontWeight: "500" }}>
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          {/* Pricing Breakdown */}
          <Section style={{ padding: "16px 0", fontSize: "14px" }}>
            <table style={{ width: "100%" }}>
              <tbody>
                <tr>
                  <td style={{ color: "#64748b", padding: "4px 0" }}>Subtotal</td>
                  <td style={{ textAlign: "right" as const, color: "#1e293b" }}>₹{subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style={{ color: "#64748b", padding: "4px 0" }}>Shipping</td>
                  <td style={{ textAlign: "right" as const, color: "#0f766e", fontWeight: "bold" }}>FREE</td>
                </tr>
                <tr style={{ borderTop: "1px solid #e2e8f0" }}>
                  <td style={{ fontWeight: "bold", color: "#1e293b", paddingTop: "12px" }}>Total</td>
                  <td style={{ fontWeight: "bold", color: "#0f172a", fontSize: "18px", textAlign: "right" as const, paddingTop: "12px" }}>
                    ₹{total.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          {/* Shipping Address */}
          <Section style={detailsCard}>
            <Text style={cardTitle}>Shipping Address</Text>
            <Text style={addressText}>
              <strong>{shippingAddress.name}</strong>
              <br />
              {shippingAddress.line1}
              {shippingAddress.line2 && <><br />{shippingAddress.line2}</>}
              <br />
              {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              If you have any questions about this invoice or your order, please email us at{" "}
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

export default OrderConfirmationEmail;

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
  fontSize: "24px",
  fontWeight: "bold",
  paddingTop: "24px",
  margin: "0 0 8px",
};

const text = {
  color: "#475569",
  fontSize: "15px",
  lineHeight: "24px",
  margin: "0 0 24px",
};

const detailsCard = {
  backgroundColor: "#f8fafc",
  borderRadius: "6px",
  padding: "16px",
  margin: "16px 0",
  border: "1px solid #f1f5f9",
};

const cardTitle = {
  fontSize: "14px",
  fontWeight: "bold",
  color: "#0f172a",
  margin: "0 0 12px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
};

const addressText = {
  fontSize: "14px",
  lineHeight: "22px",
  color: "#334155",
  margin: "0",
};

const itemsSection = {
  margin: "24px 0",
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
