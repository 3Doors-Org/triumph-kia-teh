"use client";

import { AnimatePresence, motion } from "framer-motion";

import { routeFadeVariants, useReducedMotionPreference } from "@/lib/motion";

export function ConfirmDeleteDialog({
  open,
  title,
  description,
  confirmLabel,
  onCancel,
  onConfirm,
  isBusy = false,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
  isBusy?: boolean;
}) {
  const reducedMotion = useReducedMotionPreference();
  const variants = routeFadeVariants(reducedMotion);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={variants}
          onClick={onCancel}
          role="presentation"
        >
          <motion.div
            className="w-full max-w-md rounded-lg border border-[var(--color-muted)] bg-[var(--color-card)] p-5 shadow-lg"
            onClick={(event) => event.stopPropagation()}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-delete-title"
            aria-describedby="confirm-delete-description"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
          >
            <h2 id="confirm-delete-title" className="text-lg font-semibold">
              {title}
            </h2>
            <p id="confirm-delete-description" className="mt-2 text-sm text-[var(--color-muted-fg)]">
              {description}
            </p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onCancel}
                className="rounded-md border border-[var(--color-muted)] px-3 py-2 text-sm hover:bg-[var(--color-muted)]"
                disabled={isBusy}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="rounded-md border border-red-500 px-3 py-2 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
                disabled={isBusy}
              >
                {isBusy ? "Deleting..." : confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
