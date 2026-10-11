import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import type React from "react";
import { Children, cloneElement, isValidElement, useId } from "react";
import { SPRING_DEFAULT } from "@/lib/animation";

export interface RadioGroupProps {
  /** Radio items to render */
  children: React.ReactNode;
  /** Optional CSS class for the group container */
  className?: string;
  /** The default value when uncontrolled */
  defaultValue?: string;
  /** Whether the entire group is disabled */
  disabled?: boolean;
  /** Name attribute for form submission */
  name?: string;
  /** Callback when the selected value changes */
  onValueChange?: (value: string) => void;
  /** Orientation of the radio group for arrow key navigation */
  orientation?: "horizontal" | "vertical";
  /** Whether a selection is required */
  required?: boolean;
  /** The controlled value of the selected radio item */
  value?: string;
}

export interface RadioProps {
  /** @internal Stagger index passed by RadioGroup */
  _staggerIndex?: number;
  /** Children (label content) to render next to the radio */
  children?: React.ReactNode;
  /** Optional CSS class */
  className?: string;
  /** Whether this radio is disabled */
  disabled?: boolean;
  /** ID for label association */
  id?: string;
  /** The value of this radio option */
  value: string;
}

/** Spring for the selection dot — playful bounce (0.2–0.3 reads as playful) */
const SPRING_DOT = {
  bounce: 0.2,
  duration: 0.25,
  type: "spring" as const,
};

/** Stagger delay per radio item on initial render */
const STAGGER_DELAY = 0.04;

export function RadioGroup({
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  className,
  children,
  name,
  required,
  orientation = "vertical",
}: RadioGroupProps) {
  const shouldReduceMotion = useReducedMotion();

  // Inject stagger index into Radio children for entrance stagger
  let radioIndex = 0;
  const enhancedChildren = Children.map(children, (child) => {
    if (
      isValidElement(child) &&
      (child.type === Radio ||
        (child.type as { displayName?: string })?.displayName === "Radio")
    ) {
      const currentIndex = radioIndex;
      radioIndex += 1;
      return cloneElement(child as React.ReactElement<RadioProps>, {
        _staggerIndex: currentIndex,
      });
    }
    return child;
  });

  return (
    <RadioGroupPrimitive
      className={cn(
        orientation === "vertical" ? "grid gap-3" : "flex items-center gap-4",
        className
      )}
      data-slot="radio-group"
      defaultValue={defaultValue}
      disabled={disabled}
      name={name}
      onValueChange={(v) => onValueChange?.(v as string)}
      required={required}
      value={value}
    >
      {shouldReduceMotion ? children : enhancedChildren}
    </RadioGroupPrimitive>
  );
}

export function Radio({
  value,
  disabled = false,
  className,
  id,
  children,
  _staggerIndex,
}: RadioProps) {
  const shouldReduceMotion = useReducedMotion();
  const staggerDelay =
    _staggerIndex === undefined ? 0 : _staggerIndex * STAGGER_DELAY;
  // The item has no inner text, so its accessible name is the sibling
  // <label>; generate an id when the consumer omits one.
  const generatedId = useId();
  const radioId = id ?? generatedId;

  const wrapper = (content: React.ReactNode) => {
    if (shouldReduceMotion || _staggerIndex === undefined) {
      return <div className="flex items-center gap-2">{content}</div>;
    }
    return (
      <motion.div
        animate={{ opacity: 1, transform: "translateY(0px)" }}
        className="flex items-center gap-2"
        initial={{ opacity: 0, transform: "translateY(4px)" }}
        transition={{
          ...SPRING_DEFAULT,
          delay: staggerDelay,
        }}
      >
        {content}
      </motion.div>
    );
  };

  return wrapper(
    <>
      <motion.div
        className="relative"
        transition={shouldReduceMotion ? { duration: 0 } : SPRING_DEFAULT}
        whileHover={shouldReduceMotion ? {} : { transform: "scale(1.1)" }}
      >
        <RadioPrimitive.Root
          className={cn(
            "group/radio focus-ring inline-flex aspect-square size-[18px] shrink-0 items-center justify-center rounded-full border-[1.5px] border-muted-foreground/70 outline-none transition-colors duration-150 data-checked:border-primary data-disabled:cursor-not-allowed data-disabled:opacity-40",
            className
          )}
          data-slot="radio-group-item"
          disabled={disabled}
          id={radioId}
          value={value}
        >
          <RadioPrimitive.Indicator
            className="flex items-center justify-center"
            data-slot="radio-group-indicator"
          >
            <motion.span
              animate={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 1, transform: "scale(1)" }
              }
              className="block size-2 rounded-full bg-primary"
              exit={
                shouldReduceMotion
                  ? { opacity: 0, transition: { duration: 0 } }
                  : {
                      opacity: 0,
                      transform: "scale(0)",
                      transition: { ...SPRING_DEFAULT, bounce: 0 },
                    }
              }
              initial={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 0, transform: "scale(0)" }
              }
              transition={shouldReduceMotion ? { duration: 0 } : SPRING_DOT}
            />
          </RadioPrimitive.Indicator>
        </RadioPrimitive.Root>
      </motion.div>
      {children ? (
        <label
          className={cn(
            "font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            disabled && "cursor-not-allowed opacity-70"
          )}
          htmlFor={radioId}
        >
          {children}
        </label>
      ) : null}
    </>
  );
}

Radio.displayName = "Radio";

export default RadioGroup;
