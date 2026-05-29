"use client";

import { useEffect, useRef } from "react";

import {
  createTouchIntentState,
  isDesktopExitIntentSignal,
  isMobileExitIntentSignal,
} from "@/lib/exit-intent/detection";
import { exitIntentAlreadyShown, markExitIntentSessionShown } from "@/lib/exit-intent/session-gate";

type UseExitIntentOptions = {
  enabled: boolean;
  activationDelayMs: number;
  onTriggered: () => void;
};

export function useExitIntent({ enabled, activationDelayMs, onTriggered }: UseExitIntentOptions): void {
  const onTriggeredRef = useRef(onTriggered);

  useEffect(() => {
    onTriggeredRef.current = onTriggered;
  }, [onTriggered]);

  const triggeredRef = useRef(false);

  useEffect(() => {
    if (!enabled || typeof document === "undefined") {
      return;
    }

    if (exitIntentAlreadyShown()) {
      return;
    }

    let touchState = createTouchIntentState();

    let listening = false;
    function teardownListeners() {
      if (!listening) return;
      listening = false;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("touchmove", onTouchMove);
    }

    function fireIntent() {
      if (triggeredRef.current) return;
      if (exitIntentAlreadyShown()) return;
      triggeredRef.current = true;
      markExitIntentSessionShown();
      teardownListeners();
      onTriggeredRef.current();
    }

    function onMouseMove(event: MouseEvent) {
      if (!isDesktopExitIntentSignal(event)) return;
      fireIntent();
    }

    function onTouchMove(event: TouchEvent) {
      const result = isMobileExitIntentSignal(event, touchState);
      touchState = result.next;
      if (result.triggered) fireIntent();
    }

    const activationTimerId = globalThis.setTimeout(() => {
      if (exitIntentAlreadyShown()) return;
      listening = true;
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("touchmove", onTouchMove, { passive: true });
    }, activationDelayMs);

    return () => {
      globalThis.clearTimeout(activationTimerId);
      teardownListeners();
    };
  }, [enabled, activationDelayMs]);
}
