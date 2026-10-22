import {
  ArrowUpRightIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleMinusIcon,
  CoinsIcon,
  MegaphoneIcon,
  TrophyIcon,
  VoteIcon,
  WrenchIcon,
  XIcon,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useId, useState, type ReactNode } from "react";

import { SPRING_SWAP } from "@/lib/ease";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------ types */

export type AnnouncementType = "general" | "listing" | "delisting" | "maintenance" | "campaign" | "vote";

export type Announcement = {
  id: string;
  type?: AnnouncementType;
  /** Overrides the type label, e.g. "BTC-PERP delisting". */
  title?: ReactNode;
  message: ReactNode;
  /** Published or updated time. */
  time?: number | Date;
  /** Where "Learn more" / "Join now" goes. */
  url?: string;
  /** Overrides the link label. */
  actionLabel?: ReactNode;
};

/* ------------------------------------------------------------ helpers */

const TYPE: Record<AnnouncementType, { label: string; icon: typeof MegaphoneIcon; tone: string; action: string }> = {
  general: { label: "Announcement", icon: MegaphoneIcon, tone: "text-foreground", action: "Learn more" },
  listing: { label: "New listing", icon: CoinsIcon, tone: "text-emerald-700 dark:text-emerald-400", action: "Trade now" },
  delisting: { label: "Delisting", icon: CircleMinusIcon, tone: "text-rose-600 dark:text-rose-400", action: "Learn more" },
  maintenance: { label: "Maintenance", icon: WrenchIcon, tone: "text-warning", action: "Learn more" },
  campaign: { label: "Campaign", icon: TrophyIcon, tone: "text-primary", action: "Join now" },
  vote: { label: "Community vote", icon: VoteIcon, tone: "text-violet-600 dark:text-violet-400", action: "Vote now" },
};

const pad2 = (n: number) => String(n).padStart(2, "0");
function stamp(t: number | Date) {
  const d = new Date(t);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

function useControllable<T>(value: T | undefined, defaultValue: T, onChange?: (value: T) => void) {
  const [inner, setInner] = useState(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? value : inner;
  const set = useCallback(
    (next: T) => {
      if (!controlled) setInner(next);
      onChange?.(next);
    },
    [controlled, onChange],
  );
  return [current, set] as const;
}

function AnnouncementLink({
  item,
  onLinkClick,
  className,
  iconOnlyOnMobile,
}: {
  item: Announcement;
  onLinkClick?: (item: Announcement) => void;
  className?: string;
  iconOnlyOnMobile?: boolean;
}) {
  if (!item.url && !onLinkClick) return null;
  const label = item.actionLabel ?? TYPE[item.type ?? "general"].action;
  const body = (
    <>
      <span className={cn(iconOnlyOnMobile && "sr-only sm:not-sr-only")}>{label}</span>
      <ArrowUpRightIcon className="size-3.5" />
    </>
  );
  const cls = cn("focus-ring inline-flex shrink-0 items-center gap-0.5 rounded-sm text-xs font-medium text-primary hover:underline", className);
  if (onLinkClick)
    return (
      <button type="button" onClick={() => onLinkClick(item)} className={cls}>
        {body}
      </button>
    );
  return (
    <a href={item.url} target="_blank" rel="noreferrer" className={cls}>
      {body}
    </a>
  );
}

const navBtn =
  "focus-ring grid size-6 place-items-center rounded-full bg-container-high text-muted-foreground transition-colors hover:bg-container-highest hover:text-foreground disabled:pointer-events-none disabled:opacity-40";

/* ------------------------------------------------------------ bar */

export interface AnnouncementBarProps {
  announcements: Announcement[];
  /** Index of the visible announcement. */
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  /** Auto-advance every `interval` ms (pauses on hover and focus). Omit for arrows only. */
  interval?: number;
  /** Handle links yourself (router, analytics). Without it, `url` opens in a new tab. */
  onLinkClick?: (item: Announcement) => void;
  /** Dismiss the visible announcement. Shows a close button. */
  onDismiss?: (item: Announcement) => void;
  /** Dismiss everything — shows a "Close all" button. */
  onDismissAll?: () => void;
  className?: string;
}

/** A slim top bar rotating through exchange announcements, with arrows, a counter, a link and dismiss. */
export function AnnouncementBar({
  announcements,
  index: indexProp,
  defaultIndex = 0,
  onIndexChange,
  interval,
  onLinkClick,
  onDismiss,
  onDismissAll,
  className,
}: AnnouncementBarProps) {
  const [rawIndex, setIndex] = useControllable(indexProp, defaultIndex, onIndexChange);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const total = announcements.length;
  const index = total ? Math.min(Math.max(0, rawIndex), total - 1) : 0;
  const [direction, setDirection] = useState(1);

  const go = (step: number) => {
    if (total < 2) return;
    setDirection(step);
    setIndex((index + step + total) % total);
  };

  // The one display timer this kit allows: optional auto-rotation.
  useEffect(() => {
    if (!interval || paused || total < 2) return;
    const id = window.setTimeout(() => {
      setDirection(1);
      setIndex((index + 1) % total);
    }, interval);
    return () => window.clearTimeout(id);
  }, [interval, paused, total, index, setIndex]);

  if (!total) return null;
  const item = announcements[index];
  const meta = TYPE[item.type ?? "general"];
  const Icon = meta.icon;

  return (
    <section
      data-slot="announcement-bar"
      aria-label="Announcements"
      aria-roledescription="carousel"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      className={cn("flex h-10 w-full items-center gap-2 rounded-xl bg-container pr-1.5 pl-3 text-xs sm:gap-3", className)}
    >
      <span className={cn("flex shrink-0 items-center gap-1.5 font-medium", meta.tone)}>
        <Icon className="size-3.5" />
        <span className="hidden sm:inline">{item.title ?? meta.label}</span>
      </span>
      <span aria-hidden="true" className="hidden h-3.5 w-px shrink-0 bg-border sm:block" />

      <div className="relative min-w-0 flex-1 overflow-hidden" aria-live={interval && !paused ? "off" : "polite"} aria-atomic="true">
        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          <motion.div
            key={item.id}
            custom={direction}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: direction * 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: direction * -12 }}
            transition={SPRING_SWAP}
            className="flex min-w-0 items-center gap-2"
          >
            <span className="sr-only sm:hidden">{item.title ?? meta.label}: </span>
            <span className="truncate text-foreground">{item.message}</span>
            <AnnouncementLink item={item} onLinkClick={onLinkClick} iconOnlyOnMobile />
          </motion.div>
        </AnimatePresence>
      </div>

      {total > 1 && (
        <div className="flex shrink-0 items-center gap-1.5">
          <button type="button" aria-label="Previous announcement" onClick={() => go(-1)} className={navBtn}>
            <ChevronLeftIcon className="size-3.5" />
          </button>
          <span className="min-w-7 text-center font-mono text-[11px] text-muted-foreground tabular-nums">
            {index + 1}/{total}
          </span>
          <button type="button" aria-label="Next announcement" onClick={() => go(1)} className={navBtn}>
            <ChevronRightIcon className="size-3.5" />
          </button>
        </div>
      )}
      {onDismissAll && total > 1 && (
        <button type="button" onClick={onDismissAll} className="focus-ring hidden shrink-0 rounded-sm text-[11px] font-medium text-primary hover:underline sm:block">
          Close all ({total})
        </button>
      )}
      {(onDismiss || onDismissAll) && (
        <button
          type="button"
          aria-label={onDismiss ? "Dismiss announcement" : "Dismiss all announcements"}
          onClick={() => (onDismiss ? onDismiss(item) : onDismissAll?.())}
          className="focus-ring grid size-7 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-container-high hover:text-foreground"
        >
          <XIcon className="size-3.5" />
        </button>
      )}
    </section>
  );
}

/* ------------------------------------------------------------ list */

export interface AnnouncementListProps {
  announcements: Announcement[];
  /** Id of the expanded item — one at a time. */
  expanded?: string | null;
  defaultExpanded?: string | null;
  onExpandedChange?: (id: string | null) => void;
  onLinkClick?: (item: Announcement) => void;
  /** Heading above the list. Pass `null` to hide it. */
  title?: ReactNode;
  /** `divided` separates items with hairlines; `plain` highlights them on hover. */
  variant?: "plain" | "divided";
  emptyMessage?: ReactNode;
  className?: string;
}

/** All announcements as an expandable list — for a bell popover or an announcements page. */
export function AnnouncementList({
  announcements,
  expanded: expandedProp,
  defaultExpanded = null,
  onExpandedChange,
  onLinkClick,
  title = "Announcements",
  variant = "plain",
  emptyMessage = "No announcements",
  className,
}: AnnouncementListProps) {
  const [expanded, setExpanded] = useControllable<string | null>(expandedProp, defaultExpanded, onExpandedChange);
  const uid = useId();
  return (
    <div data-slot="announcement-list" className={cn("flex w-full flex-col gap-2", className)}>
      {title != null && <h3 className="px-2 text-sm font-semibold">{title}</h3>}
      {announcements.length === 0 ? (
        <p className="py-10 text-center text-xs text-muted-foreground">{emptyMessage}</p>
      ) : (
        <ul className={cn("flex flex-col", variant === "divided" ? "divide-y divide-outline-variant" : "gap-0.5")}>
          {announcements.map((a) => {
            const meta = TYPE[a.type ?? "general"];
            const Icon = meta.icon;
            const open = expanded === a.id;
            const panelId = `${uid}-${a.id}`;
            return (
              <li key={a.id} className={cn(variant === "plain" && "rounded-lg transition-colors hover:bg-container", variant === "plain" && open && "bg-container")}>
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setExpanded(open ? null : a.id)}
                  className="focus-ring flex w-full items-start gap-2.5 rounded-lg px-2 py-2 text-left"
                >
                  <span className={cn("mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-container-high", meta.tone)}>
                    <Icon className="size-3.5" />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="text-xs font-semibold">{a.title ?? meta.label}</span>
                    {a.time != null && <span className="font-mono text-[11px] text-muted-foreground tabular-nums">{stamp(a.time)}</span>}
                    {!open && <span className="line-clamp-1 text-[11px] text-muted-foreground">{a.message}</span>}
                  </span>
                  <ChevronDownIcon className={cn("mt-1 size-4 shrink-0 text-muted-foreground transition-transform duration-300", open && "rotate-180")} />
                </button>
                <section
                  id={panelId}
                  aria-label={typeof a.title === "string" ? a.title : meta.label}
                  hidden={!open}
                  className="pr-3 pb-2.5 pl-[42px]"
                >
                  <div className="flex flex-col items-start gap-2 text-xs leading-relaxed text-foreground/85">
                    <div>{a.message}</div>
                    <AnnouncementLink item={a} onLinkClick={onLinkClick} />
                  </div>
                </section>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
