import { InvoiceItem, CustomerInformation } from "../invoice/invoiceTypes";

export interface OrderConfirmationEmailProps {
  customerName: string;
  orderId: string;
  invoiceNumber: string;
  orderDate: string;
  paymentDate: string;
  paymentStatus: string;
  paymentMethod: string;
  items: InvoiceItem[];
  customer: CustomerInformation;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  taxAmount: number;
  grandTotal: number;
  signedInvoiceUrl?: string | null;
}

export interface SendOrderConfirmationResult {
  success: boolean;
  orderId: string;
  messageId?: string | null;
  isDuplicate: boolean;
  error?: string;
}
