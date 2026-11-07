export interface DelhiveryAddress {
  full_name: string; line1: string; line2?: string;
  city: string; state: string; postal_code: string; phone: string;
}

export async function createDelhiveryShipment(orderId: string, total: number, address: DelhiveryAddress) {
  const payload = JSON.stringify({
    shipments: [{
      name: address.full_name,
      add: [address.line1, address.line2].filter(Boolean).join(", "),
      pin: address.postal_code,
      city: address.city,
      state: address.state,
      country: "India",
      phone: address.phone,
      order: orderId,
      payment_mode: "Prepaid",
      return_pin: "", return_city: "", return_phone: "",
      return_name: "", return_add: "", return_state: "", return_country: "",
      products_desc: "Shoes",
      hsn_code: "",
      cod_amount: "0",
      total_amount: String(total),
      seller_name: "Schault",
      seller_add: "", seller_inv: "",
      quantity: "1",
      waybill: "",
      shipment_length: 30, shipment_width: 20, shipment_height: 15,
      weight: 0.5,
      seller_gst_tin: "",
      shipping_mode: "Surface",
      address_type: "home",
    }],
    pickup_location: { name: process.env.DELHIVERY_WAREHOUSE_NAME },
  });

  const res = await fetch("https://track.delhivery.com/api/cmu/create.json", {
    method: "POST",
    headers: {
      "Authorization": `Token ${process.env.DELHIVERY_API_TOKEN}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `format=json&data=${encodeURIComponent(payload)}`,
  });

  const data = await res.json();
  console.log("Delhivery response:", JSON.stringify(data));
  if (!res.ok) return null;
  return data?.packages?.[0]?.waybill ?? null;
}
