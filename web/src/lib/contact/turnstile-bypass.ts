export function isServerTurnstileVerificationBypassed(): boolean {
  return process.env.NODE_ENV === "test" || process.env.TEST_BYPASS_TURNSTILE === "true";
}
