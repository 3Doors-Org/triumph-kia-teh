"use client";

import { useEffect, useRef, useState } from "react";

import { useInView } from "framer-motion";

import { useMotionContext } from "@/components/motion/motion-provider";

export function CountUpSpan({
  end,
  durationSec = 1.75,
}: {
  end: number;
  durationSec?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const { reducedMotion } = useMotionContext();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (reducedMotion || !isInView) {
      return;
    }

    let startTime: number | null = null;
    let rafId = 0;

    const animate = (currentTime: number) => {
      if (!startTime) {
        startTime = currentTime;
      }
      const progress = Math.min((currentTime - startTime) / (durationSec * 1000), 1);
      const easeOut = 1 - (1 - progress) ** 3;
      setCount(Math.floor(easeOut * end));
      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [end, durationSec, isInView, reducedMotion]);

  const shown = reducedMotion ? end : count;

  return <span ref={ref}>{shown}</span>;
}
