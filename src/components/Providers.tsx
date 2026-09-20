"use client";

import React from "react";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { SessionProvider } from "next-auth/react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CurrencyProvider>
        {children}
      </CurrencyProvider>
    </SessionProvider>
  );
}
