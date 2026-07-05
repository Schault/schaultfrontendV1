// Returns & Settings remain local-only (no matching backend tables yet)
export const INITIAL_RETURNS: any[] = [];

export const INITIAL_SETTINGS = {
  couriers: {
    default: "Delhivery",
    delhivery_key: "••••••••••••••••",
    bluedart_key: "••••••••••••••••",
    shiprocket_key: "••••••••••••••••",
  },
  email_templates: {
    waitlist:
      "HI {{name}},\n\nYOU ARE IN. WE ARE THRILLED TO INVITE YOU TO EXCLUSIVELY ACCESS THE FIRST DROP OF SCHAULT MODULAR FOOTWEAR. CHOOSE YOUR OUTSOLE, SWAP YOUR UPPER, AND DEFINE YOUR STRIDE.\n\nCLAIM YOUR PAIR NOW: https://www.schault.com/shop?code={{code}}\n\nSTAY PROGRESSIVE,\nSCHAULT TEAM",
    dispatch:
      "ORDER {{order_id}} HAS BEEN DISPATCHED VIA {{courier}}.\nTRACKING AWB: {{awb}}.\n\nESTIMATED DELIVERY: {{eta}}.",
  },
  sms_config: {
    MSG91_key: "••••••••••••••••",
    twilio_sid: "••••••••••••••••",
  },
  webhook_url: "https://api.schault.com/v1/shipments/webhook",
  store: {
    name: "SCHAULT FOOTWEAR PVT LTD",
    address:
      "Gate No. 3, Industrial Area Phase 2, Okhla, New Delhi, 110020",
    gst: "07AAHCS3829M1ZP",
  },
};
