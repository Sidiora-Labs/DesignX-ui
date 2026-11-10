import * as React from "react";
import { Link } from "wouter";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";
import { SPRING_LAYOUT } from "@/lib/ease";

/**
 * Site chrome primitives — the "graphite on vellum" skin worn by the landing,
 * docs, blocks and themes pages. Not part of the registry: product components
 * live in `components/` and render inside a {@link Frame}.
 */

type BtnOptions = { variant?: "filled" | "ghost"; size?: "sm" | "md" | "lg"; className?: string };

/** Class string for the two chrome actions. Use on `<button>`, `<a>` or wouter's `<Link>`. */
export function btn({ variant = "filled", size = "md", className }: BtnOptions = {}) {
  return cn(
    "site-focus inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl font-ui font-medium whitespace-nowrap select-none",
    "transition-[background-color,border-color,opacity,transform] duration-150 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    size === "sm" && "h-8 px-3.5 text-[13px]",
    size === "md" && "h-9 px-5 text-sm",
    size === "lg" && "h-12 px-6 text-base tracking-[-0.01em]",
    variant === "filled" && "site-bevel bg-graphite text-on-graphite hover:opacity-90",
    variant === "ghost" && "border border-hairline bg-transparent text-ink hover:border-divider hover:bg-tile/60",
    className,
  );
}

/** Square icon action in the ghost family. */
export function iconBtn(className?: string) {
  return cn(
    "site-focus inline-flex size-9 shrink-0 items-center justify-center rounded-2xl text-pencil transition-colors hover:bg-tile hover:text-ink [&_svg]:size-4",
    className,
  );
}

/** Editorial punctuation: one serif phrase inside or after an Inter headline. */
export function Serif({ className, ...props }: React.ComponentProps<"span">) {
  return <span className={cn("font-editorial text-[1.22em] leading-none font-normal tracking-[-0.025em] italic", className)} {...props} />;
}

/** Mono micro-label. */
export function Eyebrow({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("font-code text-[11px] leading-[1.7] tracking-[0.06em] text-pencil uppercase", className)} {...props} />;
}

/** Section title + subhead, left-aligned by default. */
export function SectionHeading({
  eyebrow,
  title,
  children,
  id,
  align = "left",
  action,
  className,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  children?: React.ReactNode;
  id?: string;
  align?: "left" | "center";
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-10 flex flex-col gap-6 sm:mb-12 md:flex-row md:items-end md:justify-between", align === "center" && "items-center text-center md:flex-col md:items-center", className)}>
      <div className={cn("min-w-0", align === "center" && "flex flex-col items-center")}>
        {eyebrow && <Eyebrow className="mb-4">{eyebrow}</Eyebrow>}
        <h2 id={id} className="max-w-3xl text-[clamp(2rem,6vw,3rem)] leading-[1.13] font-bold tracking-[-0.025em] text-balance text-ink">
          {title}
        </h2>
        {children && <p className="mt-6 max-w-xl text-lg leading-[1.33] tracking-[-0.025em] text-pretty text-pencil sm:mt-8">{children}</p>}
      </div>
      {action && <div className="flex shrink-0 flex-wrap gap-2">{action}</div>}
    </div>
  );
}

/** Product showcase frame: hairline, 24px radius, no shadow. Children render with the shipped component theme. */
export function Frame({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("dx-scope overflow-hidden rounded-3xl border border-hairline bg-background", className)} {...props} />;
}

/** Flat grouped-content tile, one lightness step above the canvas. */
export function Tile({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("rounded-3xl bg-tile p-6", className)} {...props} />;
}

/** Small mono tag for metadata ("New", slugs, counts). */
export function Tag({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn("inline-flex h-6 items-center gap-1.5 rounded-full border border-hairline px-2.5 font-code text-[11px] tracking-[-0.01em] text-pencil", className)}
      {...props}
    />
  );
}

export type Segment<T extends string> = { value: T; label: React.ReactNode; icon?: React.ComponentType<{ className?: string }>; hint?: React.ReactNode };

/**
 * Segmented selector. `tone="dark"` is the graphite capsule — the loudest
 * control on a page; `tone="quiet"` is its tile-coloured sibling for
 * secondary switches further down.
 */
export function SegmentedPill<T extends string>({
  items,
  value,
  onValueChange,
  id,
  label,
  tone = "dark",
  size = "md",
  controls,
  className,
}: {
  items: Segment<T>[];
  value: T;
  onValueChange: (v: T) => void;
  /** Unique id — scopes the sliding indicator. */
  id: string;
  label: string;
  tone?: "dark" | "quiet";
  size?: "sm" | "md";
  controls?: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const dark = tone === "dark";
  const onKeyDown = (e: React.KeyboardEvent) => {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const i = items.findIndex((s) => s.value === value);
    const next = items[(i + dir + items.length) % items.length];
    onValueChange(next.value);
    const tabs = e.currentTarget.querySelectorAll<HTMLElement>("[role=tab]");
    tabs[(i + dir + items.length) % items.length]?.focus();
  };
  return (
    // oxlint-disable-next-line jsx-a11y/interactive-supports-focus
    <div
      role="tablist"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={cn("inline-flex max-w-full rounded-full p-1 font-ui", dark ? "site-bevel bg-graphite" : "bg-tile", className)}
    >
      {items.map((s) => {
        const on = s.value === value;
        const Icon = s.icon;
        return (
          <button
            key={s.value}
            type="button"
            role="tab"
            aria-selected={on}
            aria-controls={controls}
            tabIndex={on ? 0 : -1}
            onClick={() => onValueChange(s.value)}
            className={cn(
              "relative flex min-w-0 items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap outline-none transition-colors",
              size === "md" ? "h-9 px-4 text-sm" : "h-7 px-3 text-[13px]",
              dark
                ? cn("focus-visible:ring-2 focus-visible:ring-on-graphite/60", on ? "text-on-graphite" : "text-on-graphite/55 hover:text-on-graphite")
                : cn("focus-visible:ring-2 focus-visible:ring-ink/40", on ? "text-ink" : "text-pencil hover:text-ink"),
            )}
          >
            {on && (
              <motion.span
                layoutId={`seg-${id}`}
                transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
                className={cn("absolute inset-0 rounded-full", dark ? "bg-on-graphite/16" : "bg-canvas")}
              />
            )}
            {Icon && <Icon className="relative size-4 shrink-0" />}
            <span className="relative truncate">{s.label}</span>
            {s.hint != null && <span className={cn("relative hidden font-code text-[11px] tabular-nums sm:inline", dark ? "text-on-graphite/55" : "text-faint")}>{s.hint}</span>}
          </button>
        );
      })}
    </div>
  );
}

/** Filter chip with an optional mono count, for gallery category rows. */
export function Chip({ active, count, className, children, ...props }: React.ComponentProps<"button"> & { active?: boolean; count?: number }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        "site-focus inline-flex h-8 shrink-0 items-center gap-2 rounded-2xl border px-3 font-ui text-[13px] font-medium whitespace-nowrap transition-colors",
        active ? "site-bevel border-transparent bg-graphite text-on-graphite" : "border-hairline text-pencil hover:border-divider hover:text-ink",
        className,
      )}
      {...props}
    >
      {children}
      {count != null && <span className={cn("font-code text-[11px] tabular-nums", active ? "text-on-graphite/60" : "text-faint")}>{count}</span>}
    </button>
  );
}

/** Breadcrumb trail in mono micro-type. The last item is the current page. */
export function Crumbs({ items, className }: { items: { title: string; href?: string }[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-2 font-code text-[11px] leading-[1.7] tracking-[0.06em] uppercase">
        {items.map((item, i) => (
          <li key={`${i}-${item.title}`} className="flex items-center gap-2">
            {i > 0 && (
              <span aria-hidden className="text-divider">
                /
              </span>
            )}
            {item.href ? (
              <Link href={item.href} className="site-focus rounded-sm text-faint transition-colors hover:text-ink">
                {item.title}
              </Link>
            ) : (
              <span aria-current="page" className="text-pencil">
                {item.title}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
