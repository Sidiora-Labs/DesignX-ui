import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { SPRING_DEFAULT } from "@/lib/animation";

export interface CheckboxProps {
  /** Accessible name, for checkboxes without a visible `<label>` */
  "aria-label"?: string;
  /** ID of the element labelling the checkbox */
  "aria-labelledby"?: string;
  /** Whether the checkbox is checked */
  checked?: boolean;
  /** Optional CSS class */
  className?: string;
  /** Whether the checkbox is disabled */
  disabled?: boolean;
  /** ID for label association */
  id?: string;
  /** Whether the checkbox is in an indeterminate state */
  indeterminate?: boolean;
  /** Name attribute for form submission */
  name?: string;
  /** Callback when the checked state changes */
  onCheckedChange?: (checked: boolean) => void;
  /** Whether the checkbox is required */
  required?: boolean;
  /** Value attribute for form submission */
  value?: string;
}

const CheckmarkPath = motion.path;
const MotionSvg = motion.svg;

export default function Checkbox({
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  checked = false,
  indeterminate = false,
  onCheckedChange,
  disabled = false,
  className,
  name,
  value,
  id,
  required,
}: CheckboxProps) {
  const shouldReduceMotion = useReducedMotion();

  const derivedState = indeterminate
    ? "indeterminate"
    : checked
      ? "checked"
      : "unchecked";

  const handleChange = (state: boolean) => {
    onCheckedChange?.(state);
  };

  return (
    <CheckboxPrimitive.Root
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      checked={checked}
      indeterminate={indeterminate}
      className={cn(
        "peer focus-ring inline-flex size-[18px] shrink-0 items-center justify-center rounded-[5px] border-[1.5px] border-muted-foreground/70 bg-transparent text-primary-foreground outline-none transition-[background-color,border-color] duration-150 data-checked:border-primary data-checked:bg-primary data-indeterminate:border-primary data-indeterminate:bg-primary data-disabled:cursor-not-allowed data-disabled:opacity-40 data-invalid:border-destructive",
        className
      )}
      data-slot="checkbox"
      disabled={disabled}
      id={id}
      name={name}
      onCheckedChange={handleChange}
      required={required}
      value={value}
    >
      <CheckboxPrimitive.Indicator
        className="grid place-content-center text-current"
        data-slot="checkbox-indicator"
        keepMounted
      >
        <AnimatePresence mode="wait">
          {derivedState === "checked" && (
            <MotionSvg
              animate={
                shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }
              }
              className="size-3.5"
              exit={
                shouldReduceMotion
                  ? { opacity: 0, transition: { duration: 0 } }
                  : { opacity: 0, scale: 0.8 }
              }
              fill="none"
              initial={
                shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.8 }
              }
              key="check"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              transition={shouldReduceMotion ? { duration: 0 } : SPRING_DEFAULT}
              viewBox="0 0 24 24"
            >
              <title>Checked</title>
              <CheckmarkPath
                animate={shouldReduceMotion ? {} : { pathLength: 1 }}
                d="M20 6L9 17l-5-5"
                initial={shouldReduceMotion ? {} : { pathLength: 0 }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { ...SPRING_DEFAULT, delay: 0.05 }
                }
              />
            </MotionSvg>
          )}
          {derivedState === "indeterminate" && (
            <MotionSvg
              animate={
                shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }
              }
              className="size-3.5"
              exit={
                shouldReduceMotion
                  ? { opacity: 0, transition: { duration: 0 } }
                  : { opacity: 0, scale: 0.8 }
              }
              fill="none"
              initial={
                shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.8 }
              }
              key="indeterminate"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              transition={shouldReduceMotion ? { duration: 0 } : SPRING_DEFAULT}
              viewBox="0 0 24 24"
            >
              <title>Indeterminate</title>
              <CheckmarkPath
                animate={shouldReduceMotion ? {} : { pathLength: 1 }}
                d="M5 12h14"
                initial={shouldReduceMotion ? {} : { pathLength: 0 }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { ...SPRING_DEFAULT, delay: 0.05 }
                }
              />
            </MotionSvg>
          )}
        </AnimatePresence>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
