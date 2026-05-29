"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

import { routeFadeVariants, useReducedMotionPreference } from "@/lib/motion";

export function PublicRouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reducedMotion = useReducedMotionPreference();
  const variants = routeFadeVariants(reducedMotion);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={pathname} initial="initial" animate="animate" exit="exit" variants={variants}>
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
