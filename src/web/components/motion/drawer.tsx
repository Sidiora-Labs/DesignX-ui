import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";
import { EASE_OUT, SPRING_PANEL } from "@/lib/ease";
import { PresenceGate } from "@/lib/presence-gate";
import { cn } from "@/lib/utils";

export interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side?: "left" | "right";
  children: ReactNode;
  /** Class for the panel surface. */
  className?: string;
  /** Class for the backdrop. */
  backdropClassName?: string;
  ariaLabel?: string;
  /** ID of a visible heading inside the drawer. */
  ariaLabelledBy?: string;
  /** ID of supporting text inside the drawer. */
  ariaDescribedBy?: string;
  /** Close when the backdrop is clicked. Default true. */
  dismissable?: boolean;
}

export function Drawer({
  open,
  onOpenChange,
  side = "right",
  children,
  className,
  backdropClassName,
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
  dismissable = true,
}: DrawerProps) {
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const onOpenChangeRef = useRef(onOpenChange);

  useEffect(() => {
    onOpenChangeRef.current = onOpenChange;
  }, [onOpenChange]);

  useEffect(() => {
    if (!open) return;
    restoreFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const panel = panelRef.current;
    const focusableSelector = [
      "a[href]",
      "button:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      "[tabindex]:not([tabindex='-1'])",
    ].join(",");
    const focusable = () =>
      panel
        ? Array.from(panel.querySelectorAll<HTMLElement>(focusableSelector)).filter(
            (element) => element.getAttribute("aria-hidden") !== "true",
          )
        : [];
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && dismissable) {
        e.preventDefault();
        onOpenChangeRef.current(false);
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      const items = focusable();
      if (items.length === 0) {
        e.preventDefault();
        panel.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (!panel.contains(document.activeElement)) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
        return;
      }
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    const first = focusable()[0];
    (first ?? panel)?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      if (restoreFocusRef.current?.isConnected) restoreFocusRef.current.focus();
    };
  }, [dismissable, open]);

  const offscreen = side === "right" ? "100%" : "-100%";

  // Two fixed siblings, no wrapper: the backdrop spans the viewport edges but
  // paints the scrim, and the panel is inset off one side and paints its own
  // surface, so neither is a transparent edge-spanning layer. Both hang off
  // `PresenceGate`, so interaction releases in the same commit that starts the
  // exit rather than when it ends.
  return (
    <AnimatePresence>
      {open ? (
        <PresenceGate key="backdrop">
          {({ gate }) => (
            <motion.button
              type="button"
              aria-label="Close"
              tabIndex={dismissable ? 0 : -1}
              onClick={() => dismissable && onOpenChange(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE_OUT }}
              {...gate}
              className={cn(
                "fixed inset-0 z-50 h-full w-full cursor-default bg-black/40 backdrop-blur-sm",
                backdropClassName,
              )}
            />
          )}
        </PresenceGate>
      ) : null}
      {open ? (
        <PresenceGate key="panel">
          {({ gate }) => (
            <motion.aside
              ref={panelRef}
              // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
              role="dialog"
              aria-modal="true"
              aria-label={ariaLabelledBy ? undefined : ariaLabel ?? "Drawer"}
              aria-labelledby={ariaLabelledBy}
              aria-describedby={ariaDescribedBy}
              tabIndex={-1}
              initial={reduce ? { opacity: 0 } : { x: offscreen }}
              animate={reduce ? { opacity: 1 } : { x: 0 }}
              exit={reduce ? { opacity: 0 } : { x: offscreen }}
              transition={
                reduce ? { duration: 0.2, ease: EASE_OUT } : SPRING_PANEL
              }
              {...gate}
              className={cn(
                "fixed inset-y-0 z-50 flex w-80 max-w-[85vw] flex-col bg-background shadow-2xl",
                side === "right"
                  ? "right-0 border-l border-border"
                  : "left-0 border-r border-border",
                className,
              )}
            >
              {children}
            </motion.aside>
          )}
        </PresenceGate>
      ) : null}
    </AnimatePresence>
  );
}
