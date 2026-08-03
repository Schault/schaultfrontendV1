export interface CompanyInformation {
  name: string;
  address: string;
  email: string;
  phone: string;
  website: string;
  gstin: string;
}

export interface ShippingAddressInfo {
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country?: string;
}

export interface CustomerInformation {
  name: string;
  email: string;
  phone?: string;
  shippingAddress: ShippingAddressInfo;
}

export interface InvoiceItem {
  productName: string;
  sku: string;
  size: string;
  color?: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  orderId: string;
  invoiceDate: string;
  paymentDate: string;
  paymentStatus: string;
  paymentMethod: string;
  company: CompanyInformation;
  customer: CustomerInformation;
  items: InvoiceItem[];
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  taxAmount: number;
  grandTotal: number;
}
