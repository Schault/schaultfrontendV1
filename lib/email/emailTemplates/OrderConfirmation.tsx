import React from "react";
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Row,
  Column,
  Text,
  Link,
  Button,
  Hr,
} from "@react-email/components";
import { OrderConfirmationEmailProps } from "../emailTypes";

export const OrderConfirmationEmail: React.FC<OrderConfirmationEmailProps> = ({
  customerName,
  orderId,
  invoiceNumber,
  orderDate,
  paymentStatus,
  paymentMethod,
  items,
  customer,
  subtotal,
  shippingFee,
  discountAmount,
  grandTotal,
  signedInvoiceUrl,
}) => {
  return (
    <Html lang="en">
      <Head />
      <Preview>Order Confirmed: #{orderId} - SCHAULT Modular Footwear</Preview>
      <Body style={mainStyles.body}>
        <Container style={mainStyles.container}>
          {/* Header */}
          <Section style={mainStyles.headerSection}>
            <Text style={mainStyles.brandTitle}>SCHAULT</Text>
            <Text style={mainStyles.brandSubtext}>MODULAR FOOTWEAR SYSTEM</Text>
          </Section>

          {/* Banner */}
          <Section style={mainStyles.bannerSection}>
            <Text style={mainStyles.bannerHeading}>ORDER CONFIRMED</Text>
            <Text style={mainStyles.bannerSubtext}>
              Thank you for your purchase! We are preparing your order for dispatch.
            </Text>
          </Section>

          {/* Greeting */}
          <Section style={mainStyles.contentSection}>
            <Text style={mainStyles.greetingText}>
              Hello <strong style={{ color: "#09090b" }}>{customerName}</strong>,
            </Text>
            <Text style={mainStyles.paragraph}>
              Thank you for shopping with <strong>SCHAULT</strong>. Your payment of{" "}
              <strong style={{ color: "#0350F0" }}>₹{grandTotal.toLocaleString("en-IN")}</strong> was verified
              successfully. Below are your order details and invoice information.
            </Text>
          </Section>

          {/* Order Meta Box */}
          <Section style={mainStyles.metaBox}>
            <Row style={{ marginBottom: "8px" }}>
              <Column style={{ width: "50%" }}>
                <Text style={mainStyles.metaLabel}>Order ID</Text>
                <Text style={mainStyles.metaValue}>{orderId}</Text>
              </Column>
              <Column style={{ width: "50%" }}>
                <Text style={mainStyles.metaLabel}>Invoice Number</Text>
                <Text style={mainStyles.metaValue}>{invoiceNumber}</Text>
              </Column>
            </Row>
            <Row>
              <Column style={{ width: "50%" }}>
                <Text style={mainStyles.metaLabel}>Payment Status</Text>
                <Text style={mainStyles.metaValueBadge}>{paymentStatus}</Text>
              </Column>
              <Column style={{ width: "50%" }}>
                <Text style={mainStyles.metaLabel}>Payment Method</Text>
                <Text style={mainStyles.metaValue}>{paymentMethod}</Text>
              </Column>
            </Row>
          </Section>

          {/* Purchased Items Table */}
          <Section style={mainStyles.sectionTitleContainer}>
            <Text style={mainStyles.sectionTitle}>PURCHASED ITEMS</Text>
          </Section>

          <Section style={mainStyles.tableSection}>
            {items.map((item, index) => (
              <Row key={index} style={mainStyles.itemRow}>
                <Column style={{ width: "65%" }}>
                  <Text style={mainStyles.itemName}>{item.productName}</Text>
                  <Text style={mainStyles.itemDetails}>
                    Size: {item.size} {item.color ? `| Color: ${item.color}` : ""} | SKU: {item.sku}
                  </Text>
                  <Text style={mainStyles.itemQty}>Qty: {item.quantity}</Text>
                </Column>
                <Column style={{ width: "35%", textAlign: "right" }}>
                  <Text style={mainStyles.itemPrice}>₹{item.lineTotal.toLocaleString("en-IN")}</Text>
                  <Text style={mainStyles.itemUnitPrice}>
                    (₹{item.unitPrice.toLocaleString("en-IN")} each)
                  </Text>
                </Column>
              </Row>
            ))}
          </Section>

          <Hr style={mainStyles.divider} />

          {/* Shipping Address */}
          <Section style={mainStyles.sectionTitleContainer}>
            <Text style={mainStyles.sectionTitle}>SHIPPING ADDRESS</Text>
          </Section>
          <Section style={mainStyles.addressBox}>
            <Text style={mainStyles.addressName}>{customer.name}</Text>
            <Text style={mainStyles.addressLine}>{customer.shippingAddress.line1}</Text>
            {customer.shippingAddress.line2 && (
              <Text style={mainStyles.addressLine}>{customer.shippingAddress.line2}</Text>
            )}
            <Text style={mainStyles.addressLine}>
              {customer.shippingAddress.city}
              {customer.shippingAddress.state ? `, ${customer.shippingAddress.state}` : ""} -{" "}
              {customer.shippingAddress.postalCode}
            </Text>
            <Text style={mainStyles.addressLine}>
              Email: {customer.email} {customer.phone ? `| Phone: ${customer.phone}` : ""}
            </Text>
          </Section>

          {/* Totals Box */}
          <Section style={mainStyles.summaryBox}>
            <Row style={{ marginBottom: "6px" }}>
              <Column style={{ width: "60%" }}>
                <Text style={mainStyles.summaryLabel}>Subtotal</Text>
              </Column>
              <Column style={{ width: "40%", textAlign: "right" }}>
                <Text style={mainStyles.summaryValue}>₹{subtotal.toLocaleString("en-IN")}</Text>
              </Column>
            </Row>
            <Row style={{ marginBottom: "6px" }}>
              <Column style={{ width: "60%" }}>
                <Text style={mainStyles.summaryLabel}>Shipping</Text>
              </Column>
              <Column style={{ width: "40%", textAlign: "right" }}>
                <Text style={mainStyles.summaryValue}>
                  {shippingFee === 0 ? "FREE" : `₹${shippingFee.toLocaleString("en-IN")}`}
                </Text>
              </Column>
            </Row>
            {discountAmount > 0 && (
              <Row style={{ marginBottom: "6px" }}>
                <Column style={{ width: "60%" }}>
                  <Text style={mainStyles.summaryLabel}>Discount</Text>
                </Column>
                <Column style={{ width: "40%", textAlign: "right" }}>
                  <Text style={mainStyles.discountValue}>-₹{discountAmount.toLocaleString("en-IN")}</Text>
                </Column>
              </Row>
            )}
            <Hr style={mainStyles.dividerThin} />
            <Row style={{ marginTop: "6px" }}>
              <Column style={{ width: "60%" }}>
                <Text style={mainStyles.grandTotalLabel}>Grand Total</Text>
              </Column>
              <Column style={{ width: "40%", textAlign: "right" }}>
                <Text style={mainStyles.grandTotalValue}>₹{grandTotal.toLocaleString("en-IN")}</Text>
              </Column>
            </Row>
          </Section>

          {/* Invoice Download Action */}
          {signedInvoiceUrl ? (
            <Section style={mainStyles.actionSection}>
              <Text style={mainStyles.actionText}>
                Your official tax invoice is available for download.
              </Text>
              <Button href={signedInvoiceUrl} style={mainStyles.downloadButton}>
                DOWNLOAD PDF INVOICE
              </Button>
              <Text style={mainStyles.expiryNotice}>
                * This secure link is valid for 24 hours.
              </Text>
            </Section>
          ) : (
            <Section style={mainStyles.actionSection}>
              <Text style={mainStyles.actionText}>
                Your PDF Tax Invoice has been attached to this email.
              </Text>
            </Section>
          )}

          {/* Footer */}
          <Hr style={mainStyles.divider} />
          <Section style={mainStyles.footerSection}>
            <Text style={mainStyles.footerHeading}>NEED HELP WITH YOUR ORDER?</Text>
            <Text style={mainStyles.footerText}>
              Email us at{" "}
              <Link href="mailto:support@schault.com" style={mainStyles.link}>
                support@schault.com
              </Link>{" "}
              or call +91 98765 43210.
            </Text>
            <Text style={mainStyles.footerText}>
              Website:{" "}
              <Link href="https://www.schault.com" style={mainStyles.link}>
                www.schault.com
              </Link>
            </Text>
            <Text style={mainStyles.copyrightText}>
              © {new Date().getFullYear()} SCHAULT FOOTWEAR PVT LTD. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const mainStyles = {
  body: {
    backgroundColor: "#f4f4f5",
    fontFamily: 'Helvetica, Arial, sans-serif',
    padding: "20px 0",
    margin: 0,
  },
  container: {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "32px 24px",
    maxWidth: "600px",
    borderRadius: "8px",
    border: "1px solid #e4e4e7",
  },
  headerSection: {
    textAlign: "center" as const,
    borderBottom: "2px solid #0350F0",
    paddingBottom: "16px",
    marginBottom: "24px",
  },
  brandTitle: {
    fontSize: "28px",
    fontWeight: "bold",
    letterSpacing: "3px",
    color: "#0350F0",
    margin: "0 0 4px 0",
  },
  brandSubtext: {
    fontSize: "9px",
    letterSpacing: "2px",
    color: "#71717a",
    margin: 0,
  },
  bannerSection: {
    backgroundColor: "#09090b",
    color: "#ffffff",
    padding: "16px 20px",
    borderRadius: "6px",
    marginBottom: "24px",
  },
  bannerHeading: {
    fontSize: "16px",
    fontWeight: "bold",
    letterSpacing: "2px",
    color: "#ffffff",
    margin: "0 0 4px 0",
  },
  bannerSubtext: {
    fontSize: "12px",
    color: "#a1a1aa",
    margin: 0,
  },
  contentSection: {
    marginBottom: "20px",
  },
  greetingText: {
    fontSize: "15px",
    color: "#27272a",
    margin: "0 0 8px 0",
  },
  paragraph: {
    fontSize: "13px",
    color: "#3f3f46",
    lineHeight: "1.5",
    margin: 0,
  },
  metaBox: {
    backgroundColor: "#fafafa",
    border: "1px solid #e4e4e7",
    padding: "16px",
    borderRadius: "6px",
    marginBottom: "24px",
  },
  metaLabel: {
    fontSize: "10px",
    color: "#71717a",
    textTransform: "uppercase" as const,
    letterSpacing: "1px",
    margin: "0 0 2px 0",
  },
  metaValue: {
    fontSize: "13px",
    fontWeight: "bold",
    color: "#09090b",
    margin: 0,
  },
  metaValueBadge: {
    fontSize: "12px",
    fontWeight: "bold",
    color: "#16a34a",
    margin: 0,
  },
  sectionTitleContainer: {
    marginBottom: "8px",
  },
  sectionTitle: {
    fontSize: "11px",
    fontWeight: "bold",
    letterSpacing: "1.5px",
    color: "#71717a",
    margin: 0,
  },
  tableSection: {
    marginBottom: "20px",
  },
  itemRow: {
    borderBottom: "1px solid #f4f4f5",
    padding: "10px 0",
  },
  itemName: {
    fontSize: "13px",
    fontWeight: "bold",
    color: "#09090b",
    margin: "0 0 2px 0",
  },
  itemDetails: {
    fontSize: "11px",
    color: "#71717a",
    margin: "0 0 2px 0",
  },
  itemQty: {
    fontSize: "11px",
    color: "#3f3f46",
    margin: 0,
  },
  itemPrice: {
    fontSize: "13px",
    fontWeight: "bold",
    color: "#09090b",
    margin: "0 0 2px 0",
  },
  itemUnitPrice: {
    fontSize: "10px",
    color: "#71717a",
    margin: 0,
  },
  addressBox: {
    backgroundColor: "#ffffff",
    border: "1px solid #e4e4e7",
    padding: "14px",
    borderRadius: "6px",
    marginBottom: "24px",
  },
  addressName: {
    fontSize: "13px",
    fontWeight: "bold",
    color: "#09090b",
    margin: "0 0 4px 0",
  },
  addressLine: {
    fontSize: "12px",
    color: "#3f3f46",
    margin: "0 0 2px 0",
  },
  summaryBox: {
    backgroundColor: "#fafafa",
    border: "1px solid #e4e4e7",
    padding: "16px",
    borderRadius: "6px",
    marginBottom: "24px",
  },
  summaryLabel: {
    fontSize: "12px",
    color: "#71717a",
    margin: 0,
  },
  summaryValue: {
    fontSize: "12px",
    color: "#09090b",
    fontWeight: "500",
    margin: 0,
  },
  discountValue: {
    fontSize: "12px",
    color: "#16a34a",
    fontWeight: "bold",
    margin: 0,
  },
  grandTotalLabel: {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#09090b",
    margin: 0,
  },
  grandTotalValue: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#0350F0",
    margin: 0,
  },
  actionSection: {
    textAlign: "center" as const,
    padding: "16px 0",
    marginBottom: "24px",
  },
  actionText: {
    fontSize: "12px",
    color: "#3f3f46",
    marginBottom: "12px",
  },
  downloadButton: {
    backgroundColor: "#0350F0",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "bold",
    letterSpacing: "1.5px",
    padding: "12px 24px",
    borderRadius: "6px",
    textDecoration: "none",
    display: "inline-block",
  },
  expiryNotice: {
    fontSize: "10px",
    color: "#a1a1aa",
    marginTop: "8px",
  },
  divider: {
    borderColor: "#e4e4e7",
    margin: "24px 0",
  },
  dividerThin: {
    borderColor: "#e4e4e7",
    margin: "8px 0",
  },
  footerSection: {
    textAlign: "center" as const,
  },
  footerHeading: {
    fontSize: "11px",
    fontWeight: "bold",
    letterSpacing: "1.5px",
    color: "#09090b",
    marginBottom: "6px",
  },
  footerText: {
    fontSize: "11px",
    color: "#71717a",
    margin: "0 0 4px 0",
  },
  link: {
    color: "#0350F0",
    textDecoration: "none",
  },
  copyrightText: {
    fontSize: "10px",
    color: "#a1a1aa",
    marginTop: "16px",
  },
};
