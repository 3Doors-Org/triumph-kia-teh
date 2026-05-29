export const DESKTOP_EXIT_Y_PX = 20;
export const MOBILE_UPWARD_DELTA_PX = 60;
export const MOBILE_TIME_WINDOW_MS = 200;

export function isDesktopExitIntentSignal(event: MouseEvent): boolean {
  return event.clientY < DESKTOP_EXIT_Y_PX;
}

type TouchState = { lastY: number; lastTime: number };

export function createTouchIntentState(): TouchState {
  return { lastY: 0, lastTime: 0 };
}

export function isMobileExitIntentSignal(
  event: TouchEvent,
  state: TouchState,
): { triggered: boolean; next: TouchState } {
  const touch = event.touches[0];
  if (!touch) {
    return { triggered: false, next: state };
  }

  const now = Date.now();
  const currentY = touch.clientY;
  const timeDelta = now - state.lastTime;
  const distanceDelta = state.lastY - currentY;

  const triggered =
    state.lastTime > 0 &&
    timeDelta > 0 &&
    timeDelta <= MOBILE_TIME_WINDOW_MS &&
    distanceDelta > MOBILE_UPWARD_DELTA_PX;

  return {
    triggered,
    next: { lastY: currentY, lastTime: now },
  };
}
