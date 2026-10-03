/** Classes for surfaces that own their pointer gestures (drag, scrub, long-press). */
export const TOUCH_GESTURE_CLASS = "touch-none select-none [-webkit-tap-highlight-color:transparent]";
/** For long-press content: no text selection or iOS callout while held. */
export const TOUCH_GESTURE_CONTENT_CLASS = "select-none [-webkit-touch-callout:none] [-webkit-tap-highlight-color:transparent]";

/** Capture a pointer, ignoring the InvalidStateError some browsers throw for released pointers. */
export function capturePointer(element: Element, pointerId: number) {
  try {
    element.setPointerCapture(pointerId);
  } catch {
    /* pointer already gone */
  }
}

export function releasePointer(element: Element, pointerId: number) {
  try {
    if (element.hasPointerCapture(pointerId)) element.releasePointerCapture(pointerId);
  } catch {
    /* pointer already gone */
  }
}

/**
 * Block text selection document-wide while a press is held (long-press menus
 * would otherwise select the word under the finger). Returns a release function.
 */
export function holdSelection(_element?: Element) {
  const root = document.documentElement;
  const prev = root.style.userSelect;
  const prevWebkit = root.style.getPropertyValue("-webkit-user-select");
  root.style.userSelect = "none";
  root.style.setProperty("-webkit-user-select", "none");
  window.getSelection()?.removeAllRanges();
  return () => {
    root.style.userSelect = prev;
    root.style.setProperty("-webkit-user-select", prevWebkit);
  };
}
