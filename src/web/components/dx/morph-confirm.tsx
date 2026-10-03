import * as React from "react";
import { AnimatePresence, LayoutGroup, motion, MotionConfig } from "motion/react";
import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * MorphConfirma button that morphs into an inline confirmation card via a
 * shared layoutId. Inspired by family.co.
 */

const SPRING = { type: "spring", stiffness: 350, damping: 35 } as const;

type MorphConfirmProps = {
  /** Label of the trigger and the confirm button. */
  label: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  cancelLabel?: React.ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Dim + blur the page behind the card. */
  backdrop?: boolean;
  className?: string;
  /** Tailwind classes for the primary button. */
  buttonClassName?: string;
};

function MorphConfirm({
  label,
  title = "Are you sure?",
  description,
  icon,
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  open: openProp,
  onOpenChange,
  backdrop = true,
  className,
  buttonClassName,
}: MorphConfirmProps) {
  const [inner, setInner] = React.useState(false);
  const open = openProp ?? inner;
  const setOpen = (v: boolean) => {
    setInner(v);
    onOpenChange?.(v);
  };
  const id = React.useId();
  const titleId = `${id}-title`;

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && (setOpen(false), onCancel?.());
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const primary = cn(
    "focus-ring h-10 w-full rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground",
    buttonClassName,
  );

  return (
    <MotionConfig transition={SPRING}>
      <LayoutGroup id={id}>
        <AnimatePresence>
          {open && backdrop && (
            <motion.div
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => (setOpen(false), onCancel?.())}
              className="fixed inset-0 z-40 bg-overlay/30 backdrop-blur-[2px]"
            />
          )}
        </AnimatePresence>
        <motion.div
          layout
          data-slot="morph-confirm"
          style={{ borderRadius: 28 }}
          className={cn("relative z-50 w-full max-w-[420px] overflow-hidden", className)}
        >
          <div className="relative z-10 flex w-full justify-center" style={{ pointerEvents: open ? "none" : "auto" }}>
            {!open && (
              <motion.button
                type="button"
                layoutId="confirm-primary"
                whileTap={{ scale: 0.95 }}
                onClick={() => setOpen(true)}
                className={cn(primary, "max-w-[300px]")}
              >
                <motion.span layout="position" className="inline-block">
                  {label}
                </motion.span>
              </motion.button>
            )}
          </div>
          <AnimatePresence mode="popLayout">
            {open && (
              <motion.div
                layout
                role="alertdialog"
                aria-labelledby={titleId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 550, damping: 45, mass: 0.7 }}
                className="relative flex flex-col rounded-[28px] border border-outline-variant bg-card p-4 text-card-foreground shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div id={titleId} className="flex items-center gap-2.5 text-lg font-medium">
                    {icon && <span className="flex size-10 items-center justify-center rounded-full bg-container-high [&_svg]:size-5">{icon}</span>}
                    {title}
                  </div>
                  <button
                    type="button"
                    aria-label="Close"
                    onClick={() => (setOpen(false), onCancel?.())}
                    className="focus-ring state-layer flex size-8 items-center justify-center rounded-full text-muted-foreground"
                  >
                    <XIcon className="size-5" />
                  </button>
                </div>
                {description && <p className="my-4 max-w-[34ch] text-sm text-muted-foreground">{description}</p>}
                <div className={cn("flex items-center gap-2", !description && "mt-4")}>
                  <button
                    type="button"
                    onClick={() => (setOpen(false), onCancel?.())}
                    className="focus-ring state-layer h-10 w-full rounded-full bg-container-high text-sm font-medium"
                  >
                    {cancelLabel}
                  </button>
                  <motion.button
                    type="button"
                    layoutId="confirm-primary"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => (setOpen(false), onConfirm?.())}
                    className={primary}
                  >
                    <motion.span layout="position" className="inline-block">
                      {label}
                    </motion.span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>
    </MotionConfig>
  );
}

export { MorphConfirm };
export type { MorphConfirmProps };
