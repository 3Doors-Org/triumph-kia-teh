import type { NextConfig } from "next";

function buildCsp() {
  const plausibleHost =
    process.env.NEXT_PUBLIC_PLAUSIBLE_API_HOST ?? process.env.PLAUSIBLE_API_HOST ?? "";
  const clarityHost = "https://www.clarity.ms";
  const clarityInsightsHost = "https://c.bing.com";

  const scriptSrc = ["'self'", "'unsafe-inline'"];
  const connectSrc = ["'self'"];

  if (plausibleHost) {
    scriptSrc.push(plausibleHost);
    connectSrc.push(plausibleHost);
  }
  scriptSrc.push(clarityHost);
  connectSrc.push(clarityHost, clarityInsightsHost);

  return [
    "default-src 'self'",
    `script-src ${scriptSrc.join(" ")}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    `connect-src ${connectSrc.join(" ")}`,
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  serverExternalPackages: ["isomorphic-dompurify", "jsdom"],
  webpack(config) {
    config.ignoreWarnings = [
      ...(config.ignoreWarnings ?? []),
      {
        module: /@opentelemetry\/instrumentation\/build\/esm\/platform\/node\/instrumentation\.js/,
        message: /Critical dependency: the request of a dependency is an expression/,
      },
    ];
    return config;
  },
  async headers() {
    if (process.env.NODE_ENV !== "production") {
      return [];
    }
    const csp = buildCsp();
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
        ],
      },
    ];
  },
};

export default nextConfig;
