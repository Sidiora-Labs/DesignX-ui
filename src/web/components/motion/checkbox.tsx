import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef } from "react";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

const CHECK_PATH = "M5 13l4 4L19 7";
const INDETERMINATE_PATH = "M6 12h12";

export interface CheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  indeterminate?: boolean;
  label?: string;
  className?: string;
  id?: string;
  "aria-label"?: string;
  /** Associates an external message (e.g. a form error) with the control. */
  "aria-describedby"?: string;
}

export function Checkbox({
  checked,
  onCheckedChange,
  disabled,
  indeterminate,
  label,
  className,
  id: idProp,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
}: CheckboxProps) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const inputRef = useRef<HTMLInputElement>(null);
  const reduce = useReducedMotion();
  const showMark = checked || indeterminate;
  const path = indeterminate ? INDETERMINATE_PATH : CHECK_PATH;

  // `indeterminate` is a DOM property rather than a reflected HTML
  // attribute. Keep the native checkbox in sync so assistive technology and
  // form libraries receive the correct mixed state.
  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = Boolean(indeterminate);
  }, [indeterminate]);

  return (
    <label
      htmlFor={id}
      className={cn(
        "inline-flex items-center gap-3",
        disabled ? "cursor-not-allowed" : "cursor-pointer",
        className,
      )}
    >
      <span
        className={cn(
          "relative inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 outline-none transition-colors duration-200",
          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
          disabled ? "cursor-not-allowed opacity-60" : undefined,
          showMark
            ? "border-primary bg-primary text-primary-foreground"
            : "border-muted-foreground/50 bg-background hover:border-muted-foreground",
        )}
        data-state={
          checked ? "checked" : indeterminate ? "indeterminate" : "unchecked"
        }
      >
        <input
          ref={inputRef}
          id={id}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy}
          onChange={(event) => onCheckedChange(event.currentTarget.checked)}
          className="peer absolute inset-0 z-10 m-0 size-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
        />
        <AnimatePresence initial={false}>
          {showMark ? (
            <motion.svg
              key={indeterminate ? "indeterminate" : "checked"}
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 0.5 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
              exit={
                reduce
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.5, filter: "blur(4px)" }
              }
              transition={
                reduce ? { duration: 0 } : { duration: 0.16, ease: EASE_OUT }
              }
              aria-hidden
            >
              <title>{indeterminate ? "Partially selected" : "Selected"}</title>
              <motion.path
                d={path}
                initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={
                  reduce
                    ? { duration: 0 }
                    : {
                        duration: indeterminate ? 0.2 : 0.3,
                        ease: EASE_OUT,
                        delay: 0.04,
                      }
                }
              />
            </motion.svg>
          ) : null}
        </AnimatePresence>
      </span>
      {label ? (
        <span className={cn("select-none text-sm text-foreground", disabled && "opacity-60")}>
          {label}
        </span>
      ) : null}
    </label>
  );
}
