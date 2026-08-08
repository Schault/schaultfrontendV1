import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { InvoiceData } from "./invoiceTypes";

// Standard monochrome styling for clean, premium print rendering
const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: "#18181b",
    backgroundColor: "#ffffff",
  },

  // Header Section
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: "#e4e4e7",
    paddingBottom: 20,
    marginBottom: 20,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: "bold",
    letterSpacing: 2,
    color: "#0350F0",
    marginBottom: 4,
  },
  companySubtext: {
    fontSize: 8,
    color: "#71717a",
    marginBottom: 2,
  },
  invoiceTitleBlock: {
    alignItems: "flex-end",
  },
  invoiceHeading: {
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 1.5,
    color: "#09090b",
    marginBottom: 4,
  },
  invoiceMetaText: {
    fontSize: 8,
    color: "#71717a",
  },

  // Info Cards Section (2 columns)
  metaGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    backgroundColor: "#fafafa",
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#f4f4f5",
  },
  metaColumn: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 7,
    color: "#71717a",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#09090b",
    marginBottom: 8,
  },

  // Addresses Section (2 columns)
  addressGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    gap: 16,
  },
  addressBox: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e4e4e7",
    borderRadius: 4,
  },
  addressBoxTitle: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#71717a",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    borderBottomWidth: 1,
    borderBottomColor: "#f4f4f5",
    paddingBottom: 4,
    marginBottom: 6,
  },
  addressTextBold: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#09090b",
    marginBottom: 2,
  },
  addressText: {
    fontSize: 8.5,
    color: "#3f3f46",
    lineHeight: 1.3,
  },

  // Product Table
  tableContainer: {
    marginBottom: 20,
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#18181b",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 2,
  },
  tableHeaderCell: {
    color: "#ffffff",
    fontSize: 7.5,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f4f4f5",
    paddingVertical: 8,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  colProduct: { flex: 3 },
  colSku: { flex: 2 },
  colVariant: { flex: 1.5 },
  colQty: { flex: 1, textAlign: "center" },
  colPrice: { flex: 1.5, textAlign: "right" },
  colTotal: { flex: 1.5, textAlign: "right" },

  productName: {
    fontSize: 8.5,
    fontWeight: "bold",
    color: "#09090b",
  },
  productSubtext: {
    fontSize: 7.5,
    color: "#71717a",
    marginTop: 1,
  },
  cellText: {
    fontSize: 8,
    color: "#27272a",
  },

  // Order Summary Box
  summaryWrapper: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 28,
  },
  summaryBox: {
    width: 220,
    backgroundColor: "#fafafa",
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#e4e4e7",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 8,
    color: "#71717a",
  },
  summaryValue: {
    fontSize: 8,
    color: "#09090b",
    fontWeight: "medium",
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#e4e4e7",
    paddingTop: 6,
    marginTop: 6,
  },
  grandTotalLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#09090b",
    textTransform: "uppercase",
  },
  grandTotalValue: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#0350F0",
  },

  // Footer Section
  footer: {
    position: "absolute",
    bottom: 30,
    left: 36,
    right: 36,
    borderTopWidth: 1,
    borderTopColor: "#e4e4e7",
    paddingTop: 12,
    alignItems: "center",
  },
  footerMessage: {
    fontSize: 8.5,
    fontWeight: "bold",
    color: "#09090b",
    marginBottom: 3,
  },
  footerSubtext: {
    fontSize: 7.5,
    color: "#71717a",
    textAlign: "center",
    marginBottom: 2,
  },
});

interface InvoiceTemplateProps {
  data: InvoiceData;
}

export const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({ data }) => {
  const { company, customer, items } = data;

  return (
    <Document title={`Invoice-${data.invoiceNumber}`}>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.brandTitle}>SCHAULT</Text>
            <Text style={styles.companySubtext}>{company.name}</Text>
            <Text style={styles.companySubtext}>{company.address}</Text>
            <Text style={styles.companySubtext}>
              Email: {company.email} | Tel: {company.phone}
            </Text>
            <Text style={styles.companySubtext}>
              GSTIN: {company.gstin} | {company.website}
            </Text>
          </View>
          <View style={styles.invoiceTitleBlock}>
            <Text style={styles.invoiceHeading}>INVOICE</Text>
            <Text style={styles.invoiceMetaText}>#{data.invoiceNumber}</Text>
          </View>
        </View>

        {/* Invoice Metadata Grid */}
        <View style={styles.metaGrid}>
          <View style={styles.metaColumn}>
            <Text style={styles.metaLabel}>Invoice Number</Text>
            <Text style={styles.metaValue}>{data.invoiceNumber}</Text>
            <Text style={styles.metaLabel}>Invoice Date</Text>
            <Text style={styles.metaValue}>{data.invoiceDate}</Text>
          </View>

          <View style={styles.metaColumn}>
            <Text style={styles.metaLabel}>Order ID</Text>
            <Text style={styles.metaValue}>{data.orderId}</Text>
            <Text style={styles.metaLabel}>Payment Date</Text>
            <Text style={styles.metaValue}>{data.paymentDate}</Text>
          </View>

          <View style={styles.metaColumn}>
            <Text style={styles.metaLabel}>Payment Status</Text>
            <Text style={styles.metaValue}>{data.paymentStatus}</Text>
            <Text style={styles.metaLabel}>Payment Method</Text>
            <Text style={styles.metaValue}>{data.paymentMethod}</Text>
          </View>
        </View>

        {/* Addresses Grid */}
        <View style={styles.addressGrid}>
          <View style={styles.addressBox}>
            <Text style={styles.addressBoxTitle}>Billed & Shipped To</Text>
            <Text style={styles.addressTextBold}>{customer.name}</Text>
            <Text style={styles.addressText}>{customer.shippingAddress.line1}</Text>
            {customer.shippingAddress.line2 ? (
              <Text style={styles.addressText}>{customer.shippingAddress.line2}</Text>
            ) : null}
            <Text style={styles.addressText}>
              {customer.shippingAddress.city}
              {customer.shippingAddress.state ? `, ${customer.shippingAddress.state}` : ""} - {customer.shippingAddress.postalCode}
            </Text>
            {customer.shippingAddress.country ? (
              <Text style={styles.addressText}>{customer.shippingAddress.country}</Text>
            ) : null}
            <Text style={[styles.addressText, { marginTop: 4 }]}>
              Email: {customer.email} {customer.phone ? `| Phone: ${customer.phone}` : ""}
            </Text>
          </View>

          <View style={styles.addressBox}>
            <Text style={styles.addressBoxTitle}>Seller Details</Text>
            <Text style={styles.addressTextBold}>{company.name}</Text>
            <Text style={styles.addressText}>{company.address}</Text>
            <Text style={styles.addressText}>GSTIN: {company.gstin}</Text>
            <Text style={styles.addressText}>Email: {company.email}</Text>
          </View>
        </View>

        {/* Product Table */}
        <View style={styles.tableContainer}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.tableHeaderCell, styles.colProduct]}>Product Description</Text>
            <Text style={[styles.tableHeaderCell, styles.colSku]}>SKU</Text>
            <Text style={[styles.tableHeaderCell, styles.colVariant]}>Variant</Text>
            <Text style={[styles.tableHeaderCell, styles.colQty]}>Qty</Text>
            <Text style={[styles.tableHeaderCell, styles.colPrice]}>Unit Price</Text>
            <Text style={[styles.tableHeaderCell, styles.colTotal]}>Line Total</Text>
          </View>

          {items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={styles.colProduct}>
                <Text style={styles.productName}>{item.productName}</Text>
              </View>
              <Text style={[styles.cellText, styles.colSku]}>{item.sku}</Text>
              <Text style={[styles.cellText, styles.colVariant]}>
                {item.size} {item.color ? `/ ${item.color}` : ""}
              </Text>
              <Text style={[styles.cellText, styles.colQty]}>{item.quantity}</Text>
              <Text style={[styles.cellText, styles.colPrice]}>
                ₹{item.unitPrice.toLocaleString("en-IN")}
              </Text>
              <Text style={[styles.cellText, styles.colTotal]}>
                ₹{item.lineTotal.toLocaleString("en-IN")}
              </Text>
            </View>
          ))}
        </View>

        {/* Order Summary */}
        <View style={styles.summaryWrapper}>
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>₹{data.subtotal.toLocaleString("en-IN")}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping</Text>
              <Text style={styles.summaryValue}>
                {data.shippingFee === 0 ? "FREE" : `₹${data.shippingFee.toLocaleString("en-IN")}`}
              </Text>
            </View>
            {data.discountAmount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Discount</Text>
                <Text style={[styles.summaryValue, { color: "#16a34a" }]}>
                  -₹{data.discountAmount.toLocaleString("en-IN")}
                </Text>
              </View>
            )}
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax (GST)</Text>
              <Text style={styles.summaryValue}>
                {data.taxAmount === 0 ? "Included" : `₹${data.taxAmount.toLocaleString("en-IN")}`}
              </Text>
            </View>
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>Grand Total</Text>
              <Text style={styles.grandTotalValue}>₹{data.grandTotal.toLocaleString("en-IN")}</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerMessage}>Thank you for choosing SCHAULT Modular Footwear!</Text>
          <Text style={styles.footerSubtext}>
            For customer support or return inquiries, please contact {company.email}.
          </Text>
          <Text style={styles.footerSubtext}>
            Returns accepted within 14 days of delivery. Refer to schault.com/refund-policy for details.
          </Text>
          <Text style={[styles.footerSubtext, { marginTop: 4 }]}>
            © {new Date().getFullYear()} SCHAULT FOOTWEAR PVT LTD. All rights reserved.
          </Text>
        </View>
      </Page>
    </Document>
  );
};
