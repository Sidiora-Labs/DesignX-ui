import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { isValidElement, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Animation constants                                                */
/* ------------------------------------------------------------------ */

const BACKDROP_DURATION = 0.2;
const STAGGER_BASE_DELAY = 0.12;
const STAGGER_CHILD_DELAY = 0.05;

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type DrawerSide = "top" | "right" | "bottom" | "left";

export interface DrawerProps {
  /** Drawer content */
  children?: React.ReactNode;
  /** Additional CSS class names */
  className?: string;
  /** Description displayed below the title */
  description?: string;
  /** Footer content */
  footer?: React.ReactNode;
  /** Callback when the open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Whether the drawer is open */
  open?: boolean;
  /** The side from which the drawer opens */
  side?: DrawerSide;
  /** Title displayed in the drawer header */
  title?: string;
  /** Trigger element that opens the drawer */
  trigger?: React.ReactNode;
}

/* ------------------------------------------------------------------ */
/*  Stagger child — animates content items in sequence after open      */
/* ------------------------------------------------------------------ */

const StaggerChild = ({
  children,
  index,
  shouldReduceMotion,
}: {
  children: React.ReactNode;
  index: number;
  shouldReduceMotion: boolean | null;
}) => (
  <motion.div
    animate={
      shouldReduceMotion
        ? { opacity: 1 }
        : { opacity: 1, transform: "translateY(0px)" }
    }
    exit={
      shouldReduceMotion
        ? { opacity: 0, transition: { duration: 0 } }
        : { opacity: 0, transition: { duration: 0.1 } }
    }
    initial={
      shouldReduceMotion
        ? { opacity: 1 }
        : { opacity: 0, transform: "translateY(6px)" }
    }
    transition={
      shouldReduceMotion
        ? { duration: 0 }
        : {
            bounce: 0,
            delay: STAGGER_BASE_DELAY + index * STAGGER_CHILD_DELAY,
            duration: 0.25,
            type: "spring" as const,
          }
    }
  >
    {children}
  </motion.div>
);

/* ------------------------------------------------------------------ */
/*  Animated handle bar with glow pulse                                */
/* ------------------------------------------------------------------ */

const AnimatedHandle = ({
  shouldReduceMotion,
}: {
  shouldReduceMotion: boolean | null;
}) => (
  <motion.div
    animate={
      shouldReduceMotion
        ? {}
        : {
            opacity: [0.5, 1, 0.5],
          }
    }
    className="mx-auto h-1 w-10 shrink-0 rounded-full bg-container-highest"
    transition={
      shouldReduceMotion
        ? { duration: 0 }
        : {
            duration: 2,
            ease: [0.645, 0.045, 0.355, 1],
            repeat: Number.POSITIVE_INFINITY,
          }
    }
  />
);

/* ------------------------------------------------------------------ */
/*  Drawer                                                             */
/* ------------------------------------------------------------------ */

const SIDE_CLASS: Record<DrawerSide, string> = {
  bottom: "inset-x-0 bottom-0 max-h-[85vh] rounded-t-[28px]",
  left: "inset-y-0 left-0 h-full w-[min(380px,85vw)] rounded-r-[28px]",
  right: "inset-y-0 right-0 h-full w-[min(380px,85vw)] rounded-l-[28px]",
  top: "inset-x-0 top-0 max-h-[85vh] rounded-b-[28px]",
};

const SIDE_OFFSET: Record<DrawerSide, { x?: string; y?: string }> = {
  bottom: { y: "100%" },
  left: { x: "-100%" },
  right: { x: "100%" },
  top: { y: "-100%" },
};

const PANEL_SPRING = { bounce: 0, duration: 0.45, type: "spring" as const };

export default function Drawer({
  open,
  onOpenChange,
  side = "bottom",
  title,
  description,
  className,
  children,
  trigger,
  footer,
}: DrawerProps) {
  const shouldReduceMotion = useReducedMotion();
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = open ?? internalOpen;
  const setOpen = (next: boolean) => {
    if (open === undefined) {
      setInternalOpen(next);
    }
    onOpenChange?.(next);
  };
  const offset = SIDE_OFFSET[side];
  const hidden = { opacity: shouldReduceMotion ? 0 : 1, x: shouldReduceMotion ? 0 : (offset.x ?? 0), y: shouldReduceMotion ? 0 : (offset.y ?? 0) };

  return (
    <DialogPrimitive.Root onOpenChange={(next) => setOpen(next)} open={isOpen}>
      {trigger ? (
        <DrawerTrigger
          render={isValidElement(trigger) ? trigger : <button type="button">{trigger}</button>}
        />
      ) : null}

      <AnimatePresence>
        {isOpen ? (
          <DialogPrimitive.Portal keepMounted>
            <DialogPrimitive.Backdrop
              render={
                <motion.div
                  animate={{ opacity: 1 }}
                  className="fixed inset-0 z-50 bg-overlay backdrop-blur-[2px]"
                  exit={{ opacity: 0 }}
                  initial={{ opacity: shouldReduceMotion ? 1 : 0 }}
                  transition={{ duration: shouldReduceMotion ? 0 : BACKDROP_DURATION }}
                />
              }
            />
            <DialogPrimitive.Popup
              render={
                <motion.div
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  className={cn(
                    "fixed z-50 flex flex-col overflow-y-auto overscroll-contain bg-popover p-6 text-popover-foreground shadow-float outline-none",
                    SIDE_CLASS[side],
                    className
                  )}
                  exit={hidden}
                  initial={hidden}
                  transition={shouldReduceMotion ? { duration: 0 } : PANEL_SPRING}
                >
                  {side === "bottom" && (
                    <AnimatedHandle shouldReduceMotion={shouldReduceMotion} />
                  )}
                  <div className="mx-auto mt-4 flex w-full max-w-lg flex-1 flex-col">
                    {title || description ? (
                      <StaggerChild index={0} shouldReduceMotion={shouldReduceMotion}>
                        <div className="flex flex-col gap-1.5 pb-4 text-center sm:text-left">
                          {title ? (
                            <DialogPrimitive.Title className="font-medium text-[18px] tracking-[-0.01em]">
                              {title}
                            </DialogPrimitive.Title>
                          ) : null}
                          {description ? (
                            <DialogPrimitive.Description className="text-muted-foreground text-sm">
                              {description}
                            </DialogPrimitive.Description>
                          ) : null}
                        </div>
                      </StaggerChild>
                    ) : null}

                    {children ? (
                      <StaggerChild
                        index={title || description ? 1 : 0}
                        shouldReduceMotion={shouldReduceMotion}
                      >
                        {children}
                      </StaggerChild>
                    ) : null}

                    {footer ? (
                      <StaggerChild
                        index={(title || description ? 1 : 0) + (children ? 1 : 0)}
                        shouldReduceMotion={shouldReduceMotion}
                      >
                        <DrawerFooter>{footer}</DrawerFooter>
                      </StaggerChild>
                    ) : null}
                  </div>
                </motion.div>
              }
            />
          </DialogPrimitive.Portal>
        ) : null}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}

/* ------------------------------------------------------------------ */
/*  Re-exports                                                         */
/* ------------------------------------------------------------------ */

export {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
};
