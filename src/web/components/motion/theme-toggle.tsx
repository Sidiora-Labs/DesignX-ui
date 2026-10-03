import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { useReducedMotion } from "motion/react";
import { useEffect, useState, type ComponentPropsWithoutRef } from "react";
import { ActionSwapIcon } from "@/components/motion/action-swap";
import { EASE_OUT_CSS } from "@/lib/ease";
import { cn } from "@/lib/utils";

export type ThemeVariant = "rectangle" | "circle" | "circle-blur" | "blinds";

export type RectStart =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "center"
  | "bottom-up";

export interface ThemeToggleProps
  extends Omit<ComponentPropsWithoutRef<"button">, "children" | "onClick"> {
  /** Animation variant. Default: "rectangle". */
  variant?: ThemeVariant;
  /** Origin direction for the reveal. Default: "bottom-up". */
  start?: RectStart;
  iconClassName?: string;
}

const VT_STYLE_ID = "dx-theme-toggle-vt";

// View transitions animate in CSS, not motion springs, so easing here is
// either EASE_OUT_CSS or a keyword. The circle variants keep the Material
// standard curve because their reveal expands symmetrically rather than
// decelerating. Durations differ per variant to match native OS mode switches.
const VT_CSS = `
html[data-dx-vt="rect"]::view-transition-old(root) {
  animation: none;
  mix-blend-mode: normal;
}
html[data-dx-vt="rect"]::view-transition-new(root) {
  mix-blend-mode: normal;
  animation: dx-rect-reveal 400ms ease-out;
}
html[data-dx-vt="circle"]::view-transition-old(root),
html[data-dx-vt="circle-blur"]::view-transition-old(root) {
  animation: none;
  mix-blend-mode: normal;
}
html[data-dx-vt="circle"]::view-transition-new(root) {
  mix-blend-mode: normal;
  animation: dx-circle-reveal 700ms cubic-bezier(0.4, 0, 0.2, 1);
}
html[data-dx-vt="circle-blur"]::view-transition-new(root) {
  mix-blend-mode: normal;
  animation: dx-circle-blur-reveal 700ms cubic-bezier(0.4, 0, 0.2, 1);
}
html[data-dx-vt="blinds"]::view-transition-old(root) {
  animation: none;
  mix-blend-mode: normal;
}
/* Slats: a masked band widens inside every 72px tile, so the new theme opens
   across the page like a shutter. The band edge has to be a registered custom
   propertymask-image itself is not animatable, but it re-resolves every
   frame the property ticks. mask-size fixes the tile at 72px rather than
   letting a repeating gradient's last stop define it, which is what keeps the
   20px soft edge from dragging the tile wider than the slat and leaving a
   feathered gap that never closes; it also means both ends land clean, fully
   transparent at -20px and fully opaque at 72px. Falling back to no mask
   (unregistered property, so the var is invalid) reveals the page in one
   step. */
@property --dx-vt-slat {
  syntax: "<length>";
  inherits: false;
  initial-value: 72px;
}
html[data-dx-vt="blinds"]::view-transition-new(root) {
  mix-blend-mode: normal;
  mask-image: linear-gradient(
    90deg,
    #000 0 var(--dx-vt-slat),
    transparent calc(var(--dx-vt-slat) + 20px)
  );
  mask-size: 72px 100%;
  mask-repeat: repeat;
  animation: dx-blinds-reveal 700ms ${EASE_OUT_CSS};
}
@keyframes dx-rect-reveal {
  from { clip-path: var(--dx-vt-from, inset(100% 0 0 0)); }
  to   { clip-path: inset(0 0 0 0); }
}
@keyframes dx-circle-reveal {
  from { clip-path: circle(0% at var(--dx-vt-origin, 50% 100%)); }
  to   { clip-path: circle(150% at var(--dx-vt-origin, 50% 100%)); }
}
@keyframes dx-circle-blur-reveal {
  from { clip-path: circle(0% at var(--dx-vt-origin, 50% 100%)); filter: blur(8px); }
  to   { clip-path: circle(150% at var(--dx-vt-origin, 50% 100%)); filter: blur(0px); }
}
@keyframes dx-blinds-reveal {
  from { --dx-vt-slat: -20px; }
  to   { --dx-vt-slat: 72px; }
}
`;

const RECT_FROM: Record<RectStart, string> = {
  "top-left":    "inset(0 100% 100% 0)",
  "top-right":   "inset(0 0 100% 100%)",
  "bottom-left": "inset(100% 100% 0 0)",
  "bottom-right":"inset(100% 0 0 100%)",
  center:        "inset(50% 50% 50% 50%)",
  "bottom-up":   "inset(100% 0 0 0)",
};

const CIRCLE_ORIGIN: Record<RectStart, string> = {
  "top-left":    "0% 0%",
  "top-right":   "100% 0%",
  "bottom-left": "0% 100%",
  "bottom-right":"100% 100%",
  center:        "50% 50%",
  "bottom-up":   "50% 100%",
};

export function useThemeToggle({
  variant = "rectangle",
  start = "bottom-up",
}: { variant?: ThemeVariant; start?: RectStart } = {}) {
  const { setTheme, resolvedTheme } = useTheme();
  const reduce = useReducedMotion() ?? false;
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (document.getElementById(VT_STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = VT_STYLE_ID;
    el.textContent = VT_CSS;
    document.head.appendChild(el);
  }, []);
  const isDark = mounted && resolvedTheme === "dark";

  const toggle = () => {
    const next = isDark ? "light" : "dark";

    if (reduce || !("startViewTransition" in document)) {
      setTheme(next);
      return;
    }

    const root = document.documentElement;

    if (variant === "rectangle") {
      root.style.setProperty("--dx-vt-from", RECT_FROM[start]);
      root.dataset.dxVt = "rect";
    } else if (variant === "blinds") {
      // Slats sweep the whole viewport; there is no origin point to set.
      root.dataset.dxVt = "blinds";
    } else {
      root.style.setProperty("--dx-vt-origin", CIRCLE_ORIGIN[start]);
      root.dataset.dxVt = variant;
    }

    const vt = (
      document as Document & {
        startViewTransition(cb: () => void): { finished: Promise<void> };
      }
    ).startViewTransition(() => setTheme(next));

    vt.finished.finally(() => {
      delete root.dataset.dxVt;
    });
  };

  return { isDark, mounted, toggle };
}

export function ThemeToggle({
  variant = "rectangle",
  start = "bottom-up",
  className,
  iconClassName,
  ...rest
}: ThemeToggleProps) {
  const { isDark, mounted, toggle } = useThemeToggle({ variant, start });

  return (
    <button
      type="button"
      aria-label={mounted && isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggle}
      className={cn("flex items-center justify-center", className)}
      {...rest}
    >
      {mounted ? (
        <ActionSwapIcon
          value={isDark ? "dark" : "light"}
          animation="blur"
          className={iconClassName}
        >
          {isDark ? (
            <Sun className={iconClassName} />
          ) : (
            <Moon className={iconClassName} />
          )}
        </ActionSwapIcon>
      ) : (
        <span className={iconClassName} aria-hidden="true" />
      )}
    </button>
  );
}
