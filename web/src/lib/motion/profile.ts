"use client";

export type MotionProfile = {
  reduceIntensity: boolean;
  revealYOffsetPx: number;
  revealDurationScale: number;
};

export function getMotionProfile(): MotionProfile {
  if (typeof window === "undefined") {
    return {
      reduceIntensity: false,
      revealYOffsetPx: 18,
      revealDurationScale: 1,
    };
  }

  const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const isNarrowViewport = window.matchMedia("(max-width: 768px)").matches;
  const cores = typeof navigator.hardwareConcurrency === "number" ? navigator.hardwareConcurrency : 8;
  const lowCpu = cores <= 4;
  const reduceIntensity = isCoarsePointer || isNarrowViewport || lowCpu;

  return {
    reduceIntensity,
    revealYOffsetPx: reduceIntensity ? 10 : 18,
    revealDurationScale: reduceIntensity ? 0.78 : 1,
  };
}
