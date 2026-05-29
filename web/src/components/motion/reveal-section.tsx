"use client";

import { createElement, type ReactNode } from "react";

import { motion } from "framer-motion";

import { useMotionContext } from "@/components/motion/motion-provider";
import { MOTION_TOKENS } from "@/lib/motion/tokens";

const motionHosts = {
  section: motion.section,
  div: motion.div,
  header: motion.header,
  ul: motion.ul,
  article: motion.article,
  nav: motion.nav,
  form: motion.form,
} as const;

export type RevealSectionTag = keyof typeof motionHosts;

function staticHost(
  tag: RevealSectionTag,
): "section" | "div" | "header" | "ul" | "article" | "nav" | "form" {
  return tag;
}

const easingSectionReveal = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

export function RevealSection({
  children,
  className,
  as = "section",
  enabled = true,
  reveal = "scroll",
  direction = "up",
  delay = 0,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  as?: RevealSectionTag;
  enabled?: boolean;
  reveal?: "scroll" | "mount";
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
} & Record<string, unknown>) {
  const revealsEnabled = process.env.NEXT_PUBLIC_ENABLE_SECTION_REVEALS !== "false";
  const { reducedMotion } = useMotionContext();
  const duration = MOTION_TOKENS.duration.sectionRevealMs / 1000;
  const slide = MOTION_TOKENS.reveal.yOffsetPx;
  const staticTag = staticHost(as);

  if (!enabled || !revealsEnabled || reducedMotion) {
    const domProps = { className, ...rest };
    return createElement(staticTag, domProps as Record<string, unknown>, children);
  }

  const MotionHost = motionHosts[staticTag];
  const from = axisFromDirection(direction, slide);
  const to = { opacity: 1, x: 0, y: 0 };

  const transition = {
    duration,
    ease: easingSectionReveal,
    delay,
  };

  if (reveal === "mount") {
    return (
      <MotionHost
        className={className}
        initial={{ opacity: 0, ...from }}
        animate={to}
        transition={transition}
        {...(rest as object)}
      >
        {children}
      </MotionHost>
    );
  }

  return (
    <MotionHost
      className={className}
      initial={{ opacity: 0, ...from }}
      whileInView={to}
      viewport={{ once: true, margin: "-100px 0px", amount: MOTION_TOKENS.reveal.viewportAmount }}
      transition={transition}
      {...(rest as object)}
    >
      {children}
    </MotionHost>
  );
}

function axisFromDirection(
  direction: "up" | "down" | "left" | "right",
  amount: number,
): { x: number; y: number } {
  switch (direction) {
    case "down":
      return { x: 0, y: -amount };
    case "left":
      return { x: amount, y: 0 };
    case "right":
      return { x: -amount, y: 0 };
    default:
      return { x: 0, y: amount };
  }
}
