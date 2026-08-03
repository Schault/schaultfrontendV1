import { InvoiceData } from "./invoiceTypes";
import { DEFAULT_COMPANY_INFO } from "./constants";

export const MOCK_INVOICE_DATA: InvoiceData = {
  invoiceNumber: "INV-2026-0001",
  orderId: "ORD-94820148-A1",
  invoiceDate: "03 Aug 2026",
  paymentDate: "03 Aug 2026, 15:40 IST",
  paymentStatus: "PAID",
  paymentMethod: "Razorpay (UPI)",
  company: DEFAULT_COMPANY_INFO,
  customer: {
    name: "Mohit Sharma",
    email: "mohit@example.com",
    phone: "+91 98100 12345",
    shippingAddress: {
      line1: "Flat 402, Block C, Green Avenue",
      line2: "Sector 62",
      city: "Noida",
      state: "Uttar Pradesh",
      postalCode: "201301",
      country: "India",
    },
  },
  items: [
    {
      productName: "SCHAULT Modular Sneaker - Canvas Upper",
      sku: "SCH-MOD-CNV-BLK-8",
      size: "UK-8",
      color: "Midnight Black",
      quantity: 1,
      unitPrice: 3499,
      lineTotal: 3499,
    },
    {
      productName: "SCHAULT Interchangeable Outsole - Rubber Grip",
      sku: "SCH-SOLE-RUB-GRY-8",
      size: "UK-8",
      color: "Stealth Grey",
      quantity: 1,
      unitPrice: 1500,
      lineTotal: 1500,
    },
  ],
  subtotal: 4999,
  shippingFee: 0,
  discountAmount: 500,
  taxAmount: 0,
  grandTotal: 4499,
};
