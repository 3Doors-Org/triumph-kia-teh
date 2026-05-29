"use client";

import { useEffect } from "react";

import { EXIT_INTENT_SESSION_KEY, EXIT_INTENT_SESSION_VALUE } from "@/lib/exit-intent/session-gate";

export function ContactExitIntentGate() {
  useEffect(() => {
    sessionStorage.setItem(EXIT_INTENT_SESSION_KEY, EXIT_INTENT_SESSION_VALUE);
  }, []);

  return null;
}
