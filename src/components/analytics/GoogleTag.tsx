import React, { Suspense } from "react";
import Script from "next/script";
import { GOOGLE_TAG_ID } from "@/lib/gtag";
import GoogleTagTracker from "./GoogleTagTracker";

export default function GoogleTag() {
  if (!GOOGLE_TAG_ID) return null;

  return (
    <>
      {/* Google tag (gtag.js) */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG_ID}`}
      />
      <Script
        id="google-tag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GOOGLE_TAG_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      <Suspense fallback={null}>
        <GoogleTagTracker />
      </Suspense>
    </>
  );
}
