"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { Badge, Button } from "@/components/ui";
import { useMotionContext } from "@/components/motion/motion-provider";
import { routes } from "@/lib/routes";
import { MOTION_TOKENS } from "@/lib/motion/tokens";

export function HomeHeroContent() {
  const { reducedMotion } = useMotionContext();
  const fadeY = reducedMotion ? 0 : 30;
  const baseDuration = MOTION_TOKENS.duration.sectionRevealMs / 1000;

  if (reducedMotion) {
    return (
      <>
        <Badge variant="accent">Institutional Platform</Badge>
        <h1 className="mt-4 font-[var(--font-display)] text-4xl md:text-5xl">
          Practitioner and scholar. Cofounder of 3Doors, Palaver Institute, and DeWise Foundation.
        </h1>
        <p className="mt-4 max-w-3xl text-base/7 text-[var(--color-primary-fg)]/90">
          Building systems with a long horizon that advance access, excellence, and opportunity across
          communities and institutions.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={routes.public.communityImpact}>
            <Button>Explore the Work</Button>
          </Link>
          <Link href={routes.public.contact}>
            <Button
              variant="secondary"
              className="border-[var(--color-primary-fg)] text-[var(--color-primary-fg)]"
            >
              Get in Touch
            </Button>
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: fadeY }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: baseDuration }}
      >
        <Badge variant="accent">Institutional Platform</Badge>
      </motion.div>
      <motion.h1
        className="mt-4 font-[var(--font-display)] text-4xl md:text-5xl"
        initial={{ opacity: 0, y: fadeY }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: baseDuration, delay: 0.2 }}
      >
        Practitioner and scholar. Cofounder of 3Doors, Palaver Institute, and DeWise Foundation.
      </motion.h1>
      <motion.p
        className="mt-4 max-w-3xl text-base/7 text-[var(--color-primary-fg)]/90"
        initial={{ opacity: 0, y: fadeY }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: baseDuration, delay: 0.4 }}
      >
        Building systems with a long horizon that advance access, excellence, and opportunity across
        communities and institutions.
      </motion.p>
      <motion.div
        className="mt-8 flex flex-wrap gap-3"
        initial={{ opacity: 0, y: fadeY }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: baseDuration, delay: 0.6 }}
      >
        <Link href={routes.public.communityImpact}>
          <Button>Explore the Work</Button>
        </Link>
        <Link href={routes.public.contact}>
          <Button
            variant="secondary"
            className="border-[var(--color-primary-fg)] text-[var(--color-primary-fg)]"
          >
            Get in Touch
          </Button>
        </Link>
      </motion.div>
    </>
  );
}
