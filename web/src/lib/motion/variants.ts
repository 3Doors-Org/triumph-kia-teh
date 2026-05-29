import type { Variants } from "framer-motion";

import { MOTION_TOKENS } from "@/lib/motion/tokens";

export function fadeInUpVariants(reducedMotion: boolean): Variants {
  return {
    hidden: reducedMotion
      ? { opacity: 0 }
      : { opacity: 0, y: MOTION_TOKENS.reveal.yOffsetPx },
    visible: reducedMotion
      ? { opacity: 1 }
      : {
          opacity: 1,
          y: 0,
          transition: {
            duration: MOTION_TOKENS.duration.sectionRevealMs / 1000,
            ease: MOTION_TOKENS.easing.easeOut,
          },
        },
  };
}

export function staggerChildrenVariants(reducedMotion: boolean): Variants {
  return {
    hidden: { opacity: reducedMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: reducedMotion
        ? { duration: 0 }
        : {
            staggerChildren: 0.15,
            delayChildren: 0.05,
          },
    },
  };
}

export function routeFadeVariants(reducedMotion: boolean): Variants {
  if (reducedMotion) {
    return {
      initial: { opacity: 1 },
      animate: { opacity: 1 },
      exit: { opacity: 1 },
    };
  }

  return {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: MOTION_TOKENS.duration.baseMs / 1000,
        ease: MOTION_TOKENS.easing.easeInOut,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: MOTION_TOKENS.duration.fastMs / 1000,
        ease: MOTION_TOKENS.easing.easeInOut,
      },
    },
  };
}
