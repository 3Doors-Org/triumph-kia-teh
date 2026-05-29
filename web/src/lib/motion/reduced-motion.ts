"use client";

import { useSyncExternalStore } from "react";

function subscribeReducedMotion(listener: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
}

function snapshotReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useReducedMotionPreference(): boolean {
  return useSyncExternalStore(subscribeReducedMotion, snapshotReducedMotion, () => false);
}
