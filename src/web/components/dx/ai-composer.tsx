import * as React from "react";
import { AnimatePresence, motion, MotionConfig, useReducedMotion } from "motion/react";
import { ArrowUpIcon, CheckIcon, ChevronDownIcon } from "lucide-react";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

/**
 * AI Composera composable prompt input for chat and agent UIs.
 * Animated placeholders, expanding mode toggles, a model picker, a send
 * button that morphs into stop, and a gradient burst on submit.
 */

const spring = { type: "spring" as const, stiffness: 300, damping: 30 };

type ComposerContextValue = {
  value: string;
  setValue: (v: string) => void;
  submit: () => void;
  stop: () => void;
  busy: boolean;
  disabled: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
};

const ComposerContext = React.createContext<ComposerContextValue | null>(null);

function useComposer() {
  const ctx = React.useContext(ComposerContext);
  if (!ctx) throw new Error("Composer components must be used inside <Composer>");
  return ctx;
}

type ComposerProps = Omit<React.ComponentProps<"form">, "onSubmit" | "onChange"> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Called with the trimmed prompt. The input clears afterwards. */
  onSubmit?: (value: string) => void;
  /** While true the send button becomes a stop button. */
  busy?: boolean;
  onStop?: () => void;
  disabled?: boolean;
};

function Composer({
  value: valueProp,
  defaultValue = "",
  onValueChange,
  onSubmit,
  busy = false,
  onStop,
  disabled = false,
  className,
  children,
  ...props
}: ComposerProps) {
  const [internal, setInternal] = React.useState(defaultValue);
  const controlled = valueProp !== undefined;
  const value = controlled ? valueProp : internal;
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const setValue = React.useCallback(
    (v: string) => {
      if (!controlled) setInternal(v);
      onValueChange?.(v);
    },
    [controlled, onValueChange],
  );

  const submit = React.useCallback(() => {
    if (busy || disabled) return;
    const text = value.trim();
    if (!text) return;
    onSubmit?.(text);
    setValue("");
  }, [busy, disabled, value, onSubmit, setValue]);

  const ctx = React.useMemo(
    () => ({ value, setValue, submit, stop: () => onStop?.(), busy, disabled, textareaRef }),
    [value, setValue, submit, onStop, busy, disabled],
  );

  return (
    <ComposerContext.Provider value={ctx}>
      <MotionConfig transition={spring}>
        <form
          data-slot="composer"
          data-busy={busy || undefined}
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className={cn(
            "relative isolate w-full rounded-2xl border border-outline-variant bg-container p-1 transition-shadow",
            "has-[textarea:focus-visible]:border-border has-[textarea:focus-visible]:shadow-float",
            disabled && "opacity-60",
            className,
          )}
          {...props}
        >
          {children}
        </form>
      </MotionConfig>
    </ComposerContext.Provider>
  );
}

type ComposerInputProps = Omit<React.ComponentProps<"textarea">, "value" | "defaultValue" | "onChange" | "placeholder"> & {
  /** Crossfades whenever it changes. */
  placeholder?: string;
  /** Rotate through several placeholders. */
  placeholders?: string[];
  /** Milliseconds per rotating placeholder. */
  interval?: number;
};

function ComposerInput({ placeholder = "Ask anything…", placeholders, interval = 3000, className, onKeyDown, ...props }: ComposerInputProps) {
  const { value, setValue, submit, disabled, textareaRef } = useComposer();
  const [index, setIndex] = React.useState(0);
  const reduce = useReducedMotion();

  React.useEffect(() => {
    if (!placeholders || placeholders.length < 2 || value) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % placeholders.length), interval);
    return () => clearInterval(id);
  }, [placeholders, interval, value]);

  const text = placeholders?.length ? placeholders[index % placeholders.length] : placeholder;

  return (
    <div data-slot="composer-input" className="relative">
      <textarea
        ref={textareaRef}
        rows={1}
        value={value}
        disabled={disabled}
        aria-label={props["aria-label"] ?? text}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          onKeyDown?.(e);
          if (e.defaultPrevented) return;
          if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault();
            submit();
          }
        }}
        className={cn(
          "block max-h-52 min-h-14 w-full resize-none bg-transparent px-4 py-4 text-[15px] leading-[1.35] outline-none [field-sizing:content]",
          className,
        )}
        {...props}
      />
      {!value && (
        <div aria-hidden className="pointer-events-none absolute inset-x-4 top-4 text-[15px] leading-[1.35] text-muted-foreground/60">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={text}
              className="absolute inset-x-0 truncate"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6, filter: "blur(2px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6, filter: "blur(2px)" }}
              transition={{ duration: 0.16 }}
            >
              {text}
            </motion.span>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function ComposerToolbar({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="composer-toolbar" className={cn("flex items-center justify-between gap-1 p-1", className)} {...props} />;
}

function ComposerGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="composer-group" className={cn("flex min-w-0 items-center gap-1", className)} {...props} />;
}

const composerButton =
  "focus-ring state-layer inline-flex h-9 shrink-0 cursor-pointer items-center gap-2 rounded-xl border border-outline-variant bg-background text-sm text-foreground outline-none disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0";
const composerButtonActive = "border-transparent bg-info-container text-info";

function ComposerButton({ className, active, ...props }: React.ComponentProps<"button"> & { active?: boolean }) {
  return (
    <button
      type="button"
      data-slot="composer-button"
      data-active={active || undefined}
      className={cn(composerButton, "px-3", active && composerButtonActive, className)}
      {...props}
    />
  );
}

type ComposerToggleProps = Omit<React.ComponentProps<typeof motion.button>, "children"> & {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  icon: React.ReactNode;
  /** Revealed while pressed. Also used as the accessible name. */
  label: string;
  /** Spin the icon half a turn when pressed. */
  spin?: boolean;
};

/** An icon chip that expands to reveal its label while pressed. */
function ComposerToggle({ pressed: pressedProp, defaultPressed = false, onPressedChange, icon, label, spin, className, ...props }: ComposerToggleProps) {
  const [internal, setInternal] = React.useState(defaultPressed);
  const pressed = pressedProp ?? internal;
  return (
    <motion.button
      type="button"
      data-slot="composer-toggle"
      aria-pressed={pressed}
      aria-label={label}
      layout
      onClick={() => {
        if (pressedProp === undefined) setInternal(!pressed);
        onPressedChange?.(!pressed);
      }}
      className={cn(composerButton, "overflow-hidden px-0", pressed && composerButtonActive, className)}
      style={{ borderRadius: 12 }}
      {...props}
    >
      <motion.span layout="position" className="flex size-9 shrink-0 items-center justify-center" animate={{ rotate: spin && pressed ? 180 : 0 }}>
        {icon}
      </motion.span>
      <AnimatePresence initial={false} mode="popLayout">
        {pressed && (
          <motion.span
            key="label"
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            className="-ml-2 pr-3 whitespace-nowrap"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

type ComposerModel = { id: string; name: string; icon?: React.ComponentType<{ className?: string }>; description?: string };

type ComposerModelSelectProps = {
  models: ComposerModel[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (id: string) => void;
  className?: string;
  side?: "top" | "bottom";
};

function ComposerModelSelect({ models, value: valueProp, defaultValue, onValueChange, className, side = "top" }: ComposerModelSelectProps) {
  const [internal, setInternal] = React.useState(defaultValue ?? models[0]?.id);
  const value = valueProp ?? internal;
  const current = models.find((m) => m.id === value) ?? models[0];
  const Icon = current?.icon;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        data-slot="composer-model-select"
        className={cn(composerButton, "group/model gap-1.5 border-transparent bg-transparent px-2.5", className)}
      >
        {Icon && <Icon />}
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span key={current?.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="truncate">
            {current?.name}
          </motion.span>
        </AnimatePresence>
        <ChevronDownIcon className="text-muted-foreground transition-transform group-data-popup-open/model:rotate-180" />
      </DropdownMenuTrigger>
      <DropdownMenuContent side={side} sideOffset={10} className="min-w-56">
        {models.map((m) => {
          const MIcon = m.icon;
          return (
            <DropdownMenuItem
              key={m.id}
              onClick={() => {
                if (valueProp === undefined) setInternal(m.id);
                onValueChange?.(m.id);
              }}
              className={cn(m.description && "h-auto py-2")}
            >
              {MIcon && <MIcon />}
              <span className="grid flex-1">
                <span>{m.name}</span>
                {m.description && <span className="text-xs text-muted-foreground">{m.description}</span>}
              </span>
              {m.id === value && <CheckIcon className="ml-auto" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type ComposerSendProps = Omit<React.ComponentProps<"button">, "children"> & {
  /** Visual style. */
  variant?: "default" | "primary";
};

/** Arrow that turns upright once there is text, and becomes a stop square while busy. */
function ComposerSend({ className, variant = "primary", ...props }: ComposerSendProps) {
  const { value, busy, disabled, stop } = useComposer();
  const ready = value.trim().length > 0;
  return (
    <button
      type={busy ? "button" : "submit"}
      data-slot="composer-send"
      aria-label={busy ? "Stop generating" : "Send"}
      disabled={disabled || (!busy && !ready)}
      onClick={busy ? stop : undefined}
      className={cn(
        composerButton,
        "relative size-9 justify-center overflow-hidden rounded-full p-0 transition-colors",
        variant === "primary" && (ready || busy) && "primary-fill border-transparent bg-primary text-primary-foreground",
        variant === "primary" && !ready && !busy && "bg-container-high",
        className,
      )}
      {...props}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {busy ? (
          <motion.span key="stop" initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.4, opacity: 0 }} className="size-3 rounded-[3px] bg-current" />
        ) : (
          <motion.span key="send" initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1, rotate: ready ? 0 : 90 }} exit={{ y: -16, opacity: 0 }}>
            <ArrowUpIcon className="size-[18px]" strokeWidth={2.25} />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

const BURST_COLORS = ["var(--dx-pink-4)", "var(--dx-red-3)", "var(--dx-yellow-3)", "var(--dx-blue-2)", "var(--dx-blue-4)"];

type ComposerBurstProps = {
  /** Change this value (e.g. a submit counter) to fire the burst. 0 never fires. */
  trigger: number;
  colors?: string[];
  className?: string;
};

/** A soft gradient wave that sweeps up through the composer on submit. Place inside a relative, overflow-hidden parent. */
function ComposerBurst({ trigger, colors = BURST_COLORS, className }: ComposerBurstProps) {
  const reduce = useReducedMotion();
  if (!trigger || reduce) return null;
  return (
    <motion.div
      key={trigger}
      aria-hidden
      data-slot="composer-burst"
      initial={{ y: "110%", opacity: 0.55 }}
      animate={{ y: "-120%", opacity: 0 }}
      transition={{ type: "spring", stiffness: 90, damping: 20 }}
      className={cn("pointer-events-none absolute inset-x-[-10%] top-0 z-[-1] flex h-[180%]", className)}
    >
      {[0, 1, 2].map((col) => (
        <div key={col} className={cn("flex h-full flex-1 flex-col -space-y-3", col === 1 && "-translate-y-6")}>
          {colors.map((c) => (
            <div key={c} className="flex-1 blur-xl" style={{ background: c }} />
          ))}
        </div>
      ))}
    </motion.div>
  );
}

export {
  Composer,
  ComposerBurst,
  ComposerButton,
  ComposerGroup,
  ComposerInput,
  ComposerModelSelect,
  ComposerSend,
  ComposerToggle,
  ComposerToolbar,
  useComposer,
};
export type { ComposerModel, ComposerProps, ComposerInputProps, ComposerToggleProps, ComposerModelSelectProps, ComposerBurstProps };
