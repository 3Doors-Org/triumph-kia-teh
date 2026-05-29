"use client";

import { createContext, useContext } from "react";

import { useReducedMotionPreference } from "@/lib/motion";

const MotionContext = createContext<{ reducedMotion: boolean }>({ reducedMotion: false });

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotionPreference();
  return <MotionContext.Provider value={{ reducedMotion }}>{children}</MotionContext.Provider>;
}

export function useMotionContext() {
  return useContext(MotionContext);
}
