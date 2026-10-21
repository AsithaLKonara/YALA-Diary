export const GOOGLE_TAG_ID = process.env.NEXT_PUBLIC_GOOGLE_TAG_ID || "AW-18528445589";

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Safe invocation of window.gtag across client environments.
 * If gtag has not fully mounted but dataLayer exists, queues into dataLayer.
 */
export const safeGtag = (...args: any[]): void => {
  if (typeof window === "undefined") return;

  if (typeof window.gtag === "function") {
    window.gtag(...args);
  } else if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push(args);
  }
};

/**
 * Track route / page views
 */
export const pageview = (url: string, title?: string): void => {
  if (!GOOGLE_TAG_ID) return;
  safeGtag("config", GOOGLE_TAG_ID, {
    page_path: url,
    page_title: title || (typeof document !== "undefined" ? document.title : undefined),
  });
};

/**
 * Track generic custom event
 */
export const event = (action: string, params: Record<string, any> = {}): void => {
  safeGtag("event", action, params);
};

export interface ConversionParams {
  value?: number;
  currency?: string;
  transaction_id?: string;
  [key: string]: any;
}

/**
 * Track Google Ads Conversion
 * @param sendTo Optional specific conversion destination (e.g. AW-18528445589/abcXYZ or default to GOOGLE_TAG_ID)
 */
export const trackConversion = (
  sendTo?: string,
  params: ConversionParams = {}
): void => {
  const destination = sendTo || GOOGLE_TAG_ID;
  safeGtag("event", "conversion", {
    send_to: destination,
    ...params,
  });
};

export interface PurchaseParams {
  transactionId: string;
  value: number;
  currency?: string;
  items?: Array<{
    item_id?: string;
    item_name?: string;
    price?: number;
    quantity?: number;
    [key: string]: any;
  }>;
}

/**
 * Track successful booking / e-commerce purchase
 */
export const trackPurchase = ({
  transactionId,
  value,
  currency = "USD",
  items,
}: PurchaseParams): void => {
  // Fire Google Tag purchase event
  safeGtag("event", "purchase", {
    transaction_id: transactionId,
    value,
    currency,
    items,
  });

  // Also trigger Google Ads conversion
  trackConversion(undefined, {
    transaction_id: transactionId,
    value,
    currency,
  });
};

export interface BeginCheckoutParams {
  value?: number;
  currency?: string;
  packageName?: string;
  items?: Array<Record<string, any>>;
}

/**
 * Track initiation of checkout funnel
 */
export const trackBeginCheckout = ({
  value,
  currency = "USD",
  packageName,
  items,
}: BeginCheckoutParams = {}): void => {
  safeGtag("event", "begin_checkout", {
    value,
    currency,
    package_name: packageName,
    items: items || (packageName ? [{ item_name: packageName, price: value }] : undefined),
  });
};

export interface LeadParams {
  method: string;
  value?: number;
  currency?: string;
  label?: string;
}

/**
 * Track lead generation (inquiries, WhatsApp chats, contact)
 */
export const trackLead = ({
  method,
  value,
  currency = "USD",
  label,
}: LeadParams): void => {
  safeGtag("event", "generate_lead", {
    method,
    value,
    currency,
    event_label: label,
  });

  trackConversion(undefined, {
    event_category: "Lead",
    event_label: `${method}:${label || "inquiry"}`,
  });
};

/**
 * Helper to track WhatsApp chat clicks
 */
export const trackWhatsAppClick = (source: string = "floating_widget"): void => {
  trackLead({
    method: "whatsapp",
    label: `WhatsApp Chat from ${source}`,
  });
};
