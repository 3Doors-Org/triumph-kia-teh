export const MOTION_TOKENS = {
  duration: {
    instantMs: 100,
    fastMs: 150,
    baseMs: 250,
    slowMs: 400,
    sectionRevealMs: 600,
    expressiveMs: 1800,
  },
  easing: {
    easeOut: [0.25, 0.1, 0.25, 1] as const,
    easeInOut: [0.42, 0, 0.58, 1] as const,
  },
  reveal: {
    yOffsetPx: 20,
    viewportAmount: 0.15,
  },
} as const;

export type MotionDurationKey = keyof typeof MOTION_TOKENS.duration;
