import Script from "next/script";

import { getPublicAnalyticsConfig } from "@/lib/analytics/config";

export function PublicAnalyticsScripts() {
  const config = getPublicAnalyticsConfig();

  return (
    <>
      {config.plausible ? (
        <Script
          id="plausible-analytics"
          src={config.plausible.scriptSrc}
          data-domain={config.plausible.domain}
          strategy="afterInteractive"
          defer
        />
      ) : null}
      {config.clarityProjectId ? (
        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${config.clarityProjectId}");window.clarity&&window.clarity("consent");`,
          }}
        />
      ) : null}
    </>
  );
}
