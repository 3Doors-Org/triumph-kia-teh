export const EXIT_INTENT_SESSION_KEY = "exit_intent_shown";
export const EXIT_INTENT_SESSION_VALUE = "true";

export function exitIntentAlreadyShown(): boolean {
  if (typeof sessionStorage === "undefined") return false;
  return sessionStorage.getItem(EXIT_INTENT_SESSION_KEY) === EXIT_INTENT_SESSION_VALUE;
}

export function markExitIntentSessionShown(): void {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.setItem(EXIT_INTENT_SESSION_KEY, EXIT_INTENT_SESSION_VALUE);
}
