import React from "react";
import path from "path";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { InvoiceData } from "./invoiceTypes";
import { amountInWords } from "./amountInWords";

// The PDF standard fonts (Helvetica et al.) have no Indian Rupee glyph, so every
// amount rendered as a broken mark. Noto Sans ships one; bundled locally so the
// render never depends on a network fetch.
const FONT_DIR = path.join(process.cwd(), "lib/invoice/fonts");
const LOGO_PATH = path.join(process.cwd(), "public/assets/schault-logo-email.png");

Font.register({
  family: "Noto Sans",
  fonts: [
    { src: path.join(FONT_DIR, "NotoSans-Regular.ttf"), fontWeight: "normal" },
    { src: path.join(FONT_DIR, "NotoSans-Bold.ttf"), fontWeight: "bold" },
  ],
});

const NAVY = "#1A3D7C";
const ACCENT = "#2456C3";
const MUTED = "#5B6270";
const TEXT = "#111111";
const LIGHT_BG = "#F3F5F9";
const BORDER = "#D5DBE5";

const styles = StyleSheet.create({
  page: {
    paddingTop: 32,
    paddingHorizontal: 42,
    paddingBottom: 108,
    fontSize: 9,
    fontFamily: "Noto Sans",
    color: TEXT,
    backgroundColor: "#ffffff",
  },

  // Accent bars
  topBar: { position: "absolute", top: 0, left: 0, right: 0, height: 7, flexDirection: "row" },
  topBarAccent: { width: "29%", backgroundColor: ACCENT },
  topBarNavy: { flex: 1, backgroundColor: NAVY },
  bottomBar: { position: "absolute", bottom: 34, left: 42, right: 42, height: 2.5, backgroundColor: NAVY },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingBottom: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  brandBlock: { width: 106, alignItems: "center", marginRight: 18 },
  logo: { width: 82, height: 51 },
  wordmark: { fontSize: 20, fontWeight: "bold", color: "#000000", letterSpacing: 0.5, marginTop: 2 },
  tagline: { fontSize: 6.5, fontWeight: "bold", color: NAVY, letterSpacing: 2 },
  companyBlock: { flex: 1, paddingTop: 4 },
  companyName: { fontSize: 13, fontWeight: "bold", color: NAVY, letterSpacing: 0.5, marginBottom: 6 },
  companyLine: { fontSize: 9, color: TEXT, marginBottom: 3, lineHeight: 1.4 },
  companyMuted: { fontSize: 8.5, color: MUTED },
  titleBlock: { alignItems: "flex-end" },
  invoiceHeading: { fontSize: 26, fontWeight: "bold", color: NAVY, letterSpacing: 1 },
  invoiceNumber: { fontSize: 10, fontWeight: "bold", color: TEXT, marginTop: 4 },
  invoiceDate: { fontSize: 8.5, color: MUTED, marginTop: 4, textTransform: "uppercase" },
  pill: {
    marginTop: 8,
    paddingVertical: 3,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#B9CBEF",
    backgroundColor: "#E7EEFB",
  },
  pillText: { fontSize: 7.5, fontWeight: "bold", color: NAVY },

  // Meta grid
  metaGrid: {
    flexDirection: "row",
    backgroundColor: LIGHT_BG,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 6,
    paddingVertical: 8,
    marginBottom: 12,
  },
  metaColumn: { flex: 1, paddingHorizontal: 12 },
  metaDivider: { borderLeftWidth: 1, borderLeftColor: BORDER },
  metaLabel: { fontSize: 7, fontWeight: "bold", color: MUTED, letterSpacing: 0.6, textTransform: "uppercase" },
  metaValueBold: { fontSize: 10, fontWeight: "bold", color: TEXT, marginTop: 1, marginBottom: 4 },
  metaValue: { fontSize: 8.5, color: TEXT, marginTop: 2 },

  // Address cards
  cardRow: { flexDirection: "row", gap: 14, marginBottom: 12 },
  card: { flex: 1, borderWidth: 1, borderColor: BORDER, borderRadius: 6, padding: 10 },
  cardTitle: {
    fontSize: 8.5,
    fontWeight: "bold",
    color: NAVY,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingBottom: 6,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  cardName: { fontSize: 10, fontWeight: "bold", color: TEXT, marginBottom: 3 },
  cardText: { fontSize: 8.5, color: MUTED, lineHeight: 1.35 },

  // Table
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 6 },
  sectionTitle: { fontSize: 9, fontWeight: "bold", color: NAVY, textTransform: "uppercase", letterSpacing: 0.5 },
  currency: { fontSize: 8, color: MUTED },
  table: { borderWidth: 1, borderColor: BORDER, borderTopLeftRadius: 6, borderTopRightRadius: 6, marginBottom: 8 },
  tableHeaderRow: { flexDirection: "row", backgroundColor: NAVY, borderTopLeftRadius: 5, borderTopRightRadius: 5 },
  th: {
    color: "#ffffff",
    fontSize: 7,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    paddingVertical: 9,
    paddingHorizontal: 8,
  },
  tableRow: { flexDirection: "row", borderTopWidth: 1, borderTopColor: BORDER },
  td: { fontSize: 8.5, color: TEXT, paddingVertical: 9, paddingHorizontal: 8 },
  cellBorder: { borderLeftWidth: 1, borderLeftColor: BORDER },
  colProduct: { width: "31%" },
  colSku: { width: "18%", fontSize: 7.5 },
  colVariant: { width: "19%" },
  colQty: { width: "6.5%", textAlign: "center" },
  colPrice: { width: "12.5%", textAlign: "right" },
  colTotal: { width: "13%", textAlign: "right" },
  productName: { fontSize: 9.5, fontWeight: "bold", color: TEXT },
  productSub: { fontSize: 8, color: MUTED, marginTop: 4 },

  // Bottom row: payment confirmation + totals
  bottomRow: { flexDirection: "row", gap: 14, alignItems: "flex-start", marginBottom: 10 },
  confirmCard: { flex: 1.2, borderWidth: 1, borderColor: BORDER, borderRadius: 6, padding: 12, marginTop: 8 },
  confirmText: { fontSize: 8.5, color: MUTED, lineHeight: 1.4 },
  totalsBox: { flex: 1, backgroundColor: LIGHT_BG, borderWidth: 1, borderColor: BORDER, borderRadius: 6, padding: 12 },
  totalsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 7 },
  totalsLabel: { fontSize: 9, color: MUTED },
  totalsValue: { fontSize: 9, color: TEXT },
  grandRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingTop: 9,
    marginTop: 2,
  },
  grandLabel: { fontSize: 10, fontWeight: "bold", color: TEXT },
  grandValue: { fontSize: 15, fontWeight: "bold", color: ACCENT },

  wordsRow: { flexDirection: "row" },
  wordsLabel: { fontSize: 8.5, fontWeight: "bold", color: MUTED, marginRight: 8 },
  wordsValue: { fontSize: 8.5, fontWeight: "bold", color: TEXT },

  // Footer
  footer: {
    position: "absolute",
    bottom: 50,
    left: 42,
    right: 42,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingTop: 12,
    alignItems: "center",
  },
  footerTitle: { fontSize: 11, fontWeight: "bold", color: NAVY, marginBottom: 5 },
  footerText: { fontSize: 8, color: MUTED, marginBottom: 12 },
  copyright: { fontSize: 7.5, color: MUTED },
});

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

interface InvoiceTemplateProps {
  data: InvoiceData;
}

export const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({ data }) => {
  const { company, customer, items } = data;
  const addr = customer.shippingAddress;

  return (
    <Document title={`Invoice-${data.invoiceNumber}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.topBar} fixed>
          <View style={styles.topBarAccent} />
          <View style={styles.topBarNavy} />
        </View>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.brandBlock}>
            {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image has no alt */}
            <Image src={LOGO_PATH} style={styles.logo} />
            <Text style={styles.wordmark}>SCHAULT</Text>
            <Text style={styles.tagline}>SWITCH YOUR STYLE</Text>
          </View>
          <View style={styles.companyBlock}>
            <Text style={styles.companyName}>{company.name.toUpperCase()}</Text>
            <Text style={styles.companyLine}>{company.address}</Text>
            <Text style={styles.companyLine}>Phone: {company.phone}</Text>
            <Text style={styles.companyMuted}>
              {company.email}  |  {company.website}
            </Text>
          </View>
          <View style={styles.titleBlock}>
            <Text style={styles.invoiceHeading}>INVOICE</Text>
            <Text style={styles.invoiceNumber}>#{data.invoiceNumber}</Text>
            <Text style={styles.invoiceDate}>{data.invoiceDate}</Text>
            <View style={styles.pill}>
              <Text style={styles.pillText}>{data.paymentStatus}</Text>
            </View>
          </View>
        </View>

        {/* Meta grid */}
        <View style={styles.metaGrid}>
          <View style={styles.metaColumn}>
            <Text style={styles.metaLabel}>Invoice Number</Text>
            <Text style={styles.metaValueBold}>{data.invoiceNumber}</Text>
            <Text style={styles.metaLabel}>Invoice Date</Text>
            <Text style={styles.metaValue}>{data.invoiceDate}</Text>
          </View>
          <View style={[styles.metaColumn, styles.metaDivider]}>
            <Text style={styles.metaLabel}>Order ID</Text>
            <Text style={styles.metaValueBold}>{data.orderId}</Text>
            <Text style={styles.metaLabel}>Payment Date</Text>
            <Text style={styles.metaValue}>{data.paymentDate}</Text>
          </View>
          <View style={[styles.metaColumn, styles.metaDivider]}>
            <Text style={styles.metaLabel}>Payment Status</Text>
            <Text style={[styles.metaValueBold, { color: NAVY }]}>{data.paymentStatus}</Text>
            <Text style={styles.metaLabel}>Payment Method</Text>
            <Text style={styles.metaValue}>{data.paymentMethod}</Text>
          </View>
        </View>

        {/* Address cards */}
        <View style={styles.cardRow}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Billed & Shipped To</Text>
            <Text style={styles.cardName}>{customer.name}</Text>
            <Text style={styles.cardText}>{addr.line1}</Text>
            {addr.line2 ? <Text style={styles.cardText}>{addr.line2}</Text> : null}
            <Text style={styles.cardText}>
              {addr.city}
              {addr.state ? `, ${addr.state}` : ""} - {addr.postalCode}
            </Text>
            {addr.country ? <Text style={styles.cardText}>{addr.country}</Text> : null}
            <Text style={[styles.cardText, { fontSize: 8 }]}>
              {customer.email}
              {customer.phone ? `  |  ${customer.phone}` : ""}
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Seller Details</Text>
            <Text style={styles.cardName}>{company.name}</Text>
            <Text style={styles.cardText}>{company.address}</Text>
            <Text style={styles.cardText}>Phone: {company.phone}</Text>
            <Text style={styles.cardText}>Email: {company.email}</Text>
          </View>
        </View>

        {/* Order summary table */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <Text style={styles.currency}>Currency: INR</Text>
        </View>
        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.th, styles.colProduct]}>Product Description</Text>
            <Text style={[styles.th, styles.colSku]}>SKU</Text>
            <Text style={[styles.th, styles.colVariant]}>Variant</Text>
            <Text style={[styles.th, styles.colQty]}>Qty</Text>
            <Text style={[styles.th, styles.colPrice]}>Unit Price</Text>
            <Text style={[styles.th, styles.colTotal]}>Line Total</Text>
          </View>
          {items.map((item, index) => (
            <View key={index} style={styles.tableRow} wrap={false}>
              <View style={[styles.td, styles.colProduct]}>
                <Text style={styles.productName}>
                  {/^schault/i.test(item.productName) ? item.productName : `SCHAULT "${item.productName}"`}
                </Text>
                <Text style={styles.productSub}>Modular footwear</Text>
              </View>
              <Text style={[styles.td, styles.cellBorder, styles.colSku]}>{item.sku}</Text>
              <Text style={[styles.td, styles.cellBorder, styles.colVariant]}>
                {[item.size, item.color].filter(Boolean).join(" / ")}
              </Text>
              <Text style={[styles.td, styles.cellBorder, styles.colQty]}>{item.quantity}</Text>
              <Text style={[styles.td, styles.cellBorder, styles.colPrice]}>{inr(item.unitPrice)}</Text>
              <Text style={[styles.td, styles.cellBorder, styles.colTotal, { fontWeight: "bold" }]}>
                {inr(item.lineTotal)}
              </Text>
            </View>
          ))}
        </View>

        {/* Payment confirmation + totals */}
        <View style={styles.bottomRow} wrap={false}>
          <View style={styles.confirmCard}>
            <Text style={[styles.cardTitle, { borderBottomWidth: 0, paddingBottom: 0 }]}>Payment Confirmation</Text>
            <Text style={styles.confirmText}>Payment received via {data.paymentMethod}.</Text>
            <Text style={styles.confirmText}>Thank you for choosing SCHAULT Modular Footwear.</Text>
          </View>
          <View style={styles.totalsBox}>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Subtotal</Text>
              <Text style={styles.totalsValue}>{inr(data.subtotal)}</Text>
            </View>
            {data.discountAmount > 0 && (
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>Discount</Text>
                <Text style={[styles.totalsValue, { color: "#16a34a" }]}>-{inr(data.discountAmount)}</Text>
              </View>
            )}
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Shipping</Text>
              <Text style={styles.totalsValue}>{data.shippingFee === 0 ? "FREE" : inr(data.shippingFee)}</Text>
            </View>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Tax (GST)</Text>
              <Text style={styles.totalsValue}>{data.taxAmount === 0 ? "Included" : inr(data.taxAmount)}</Text>
            </View>
            <View style={styles.grandRow}>
              <Text style={styles.grandLabel}>GRAND TOTAL</Text>
              <Text style={styles.grandValue}>{inr(data.grandTotal)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.wordsRow}>
          <Text style={styles.wordsLabel}>Amount in words:</Text>
          <Text style={styles.wordsValue}>{amountInWords(data.grandTotal)}</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerTitle}>Thank you for choosing SCHAULT Modular Footwear!</Text>
          <Text style={styles.footerText}>For customer support or return inquiries, contact {company.email}.</Text>
          <Text style={styles.copyright}>
            © {new Date().getFullYear()} {company.name.toUpperCase()}. All rights reserved.
          </Text>
        </View>
        <View style={styles.bottomBar} fixed />
      </Page>
    </Document>
  );
};
