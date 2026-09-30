"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CurrencyCode, RATES } from "@/lib/currency";

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (usdPrice: number) => string;
}

const SYMBOLS: Record<CurrencyCode, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  LKR: "Rs ",
  AUD: "A$",
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("USD");

  useEffect(() => {
    // Load from local storage if exists
    const saved = localStorage.getItem("yala-currency") as CurrencyCode;
    if (saved && RATES[saved]) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrencyState(saved);
    }
  }, []);

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
    localStorage.setItem("yala-currency", code);
  };

  const formatPrice = (usdPrice: number) => {
    const rate = RATES[currency];
    const symbol = SYMBOLS[currency];
    const converted = usdPrice * rate;
    
    // Format nicely without decimals if round number, or 2 decimals
    return `${symbol}${converted.toLocaleString(undefined, { 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 0 
    })}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
