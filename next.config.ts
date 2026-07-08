import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

// script-src kräver 'unsafe-inline': App Router strömmar sin RSC-payload och
// hydreringsdata via inline <script>-taggar (self.__next_f.push(...)) utan
// nonce. Ett nonce-baserat CSP (Next.js middleware-mönster) skulle göra hela
// appen server-renderad per request istället för statisk, vilket är en
// större arkitekturändring än vad denna metadata-uppdatering ska göra.
// Appen laddar inga externa skript, typsnitt eller domäner (next/font
// själv-hostar typsnitten), så resten av policyn kan vara strikt utan
// undantag.
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self'",
      "img-src 'self' data:",
      "font-src 'self'",
      "connect-src 'self'",
      "worker-src 'self'",
      "manifest-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    // screen-wake-lock lämnas oreglerad (default "self") eftersom passet
    // håller skärmen vaken via Wake Lock API (src/lib/wakeLock.ts).
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=(), midi=()",
  },
];

const nextConfig: NextConfig = {
  turbopack: {},
  // Headers gäller bara i produktion - Next dev-servern (Turbopack, HMR över
  // websocket) och @ducanh2912/next-pwa är redan medvetet avstängda/olika i
  // dev (se disable ovan), så säkerhetshuvudena följer samma mönster.
  async headers() {
    if (process.env.NODE_ENV !== "production") return [];

    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default withPWA(nextConfig);
