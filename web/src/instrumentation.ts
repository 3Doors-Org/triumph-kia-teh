import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (!process.env.SENTRY_DSN) {
    return;
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    sendDefaultPii: false,
    tracesSampleRate: 0,
    beforeSend(event) {
      if (event.user) {
        delete event.user.email;
        delete event.user.ip_address;
      }
      if (event.request?.headers) {
        delete event.request.headers.authorization;
        delete event.request.headers.cookie;
      }
      if (event.request?.data && typeof event.request.data === "object") {
        const requestData = event.request.data as Record<string, unknown>;
        for (const key of ["email", "message", "turnstileToken", "name", "ip", "userAgent"]) {
          if (key in requestData) {
            delete requestData[key];
          }
        }
      }
      return event;
    },
  });
}
