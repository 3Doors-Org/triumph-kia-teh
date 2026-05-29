"use client";

import { motion } from "framer-motion";

import { fadeInUpVariants, useReducedMotionPreference } from "@/lib/motion";

export function SaveStatus({
  state,
  message,
}: {
  state: "idle" | "saving" | "saved" | "error";
  message?: string | null;
}) {
  const reducedMotion = useReducedMotionPreference();
  if (state === "idle" && !message) {
    return null;
  }

  const text =
    message ??
    (state === "saving" ? "Saving..." : state === "saved" ? "Saved." : state === "error" ? "Save failed." : "");

  const colorClass =
    state === "error"
      ? "text-red-700"
      : state === "saved"
        ? "text-emerald-700"
        : "text-[var(--color-muted-fg)]";

  return (
    <motion.p
      role={state === "error" ? "alert" : "status"}
      aria-live="polite"
      initial="hidden"
      animate="visible"
      variants={fadeInUpVariants(reducedMotion)}
      className={`text-sm ${colorClass}`}
    >
      {text}
    </motion.p>
  );
}
