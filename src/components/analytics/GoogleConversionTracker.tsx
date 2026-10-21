"use client";

import { useEffect, useRef } from "react";
import { trackPurchase } from "@/lib/gtag";

interface GoogleConversionTrackerProps {
  transactionId: string;
  value: number;
  currency?: string;
  items?: Array<{
    item_id?: string;
    item_name?: string;
    price?: number;
    quantity?: number;
  }>;
}

export default function GoogleConversionTracker({
  transactionId,
  value,
  currency = "USD",
  items,
}: GoogleConversionTrackerProps) {
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current || !transactionId) return;
    firedRef.current = true;

    trackPurchase({
      transactionId,
      value,
      currency,
      items,
    });
  }, [transactionId, value, currency, items]);

  return null;
}
