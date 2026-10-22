import { ChevronRightIcon, InfoIcon, TrophyIcon, UsersIcon } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";

import { Numeral } from "@/components/trading/numeral";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatCompact, formatCountdown, formatNumber, useCountdown } from "@/lib/trading";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------ types */

export type CampaignStatus = "upcoming" | "live" | "ended";

export type CampaignPrizeTier = {
  /** Single place, e.g. 1. */
  position?: number;
  /** Inclusive place range, e.g. [4, 10]. */
  range?: [number, number];
  /** Overrides the generated "1st" / "4th – 10th" label. */
  label?: ReactNode;
  /** Prize per trader in the pool currency. */
  amount: number;
};

export type CampaignPrizePool = {
  id: string;
  label: string;
  total: number;
  currency: string;
  /** What the pool ranks by. */
  metric?: "volume" | "pnl";
  tiers?: CampaignPrizeTier[];
};

/** Volume-unlocked prize steps — the pool grows as the campaign hits volume targets. */
export type CampaignVolumeTier = { volume: number; prize: number };

export type Campaign = {
  id: string | number;
  title: string;
  description?: ReactNode;
  /** Cover image URL. */
  image?: string;
  /** CSS background used when there is no image. */
  gradient?: string;
  startTime: number | Date;
  endTime: number | Date;
  prizePools?: CampaignPrizePool[];
  /** Total prize pool. Defaults to the sum of `prizePools` totals. */
  totalPrize?: { amount: number; currency: string };
  participants?: number | null;
  /** Total campaign volume in quote currency. */
  totalVolume?: number | null;
  /** Referral codes or other short tags shown under the title. */
  tags?: string[];
};

export type CampaignYou = {
  rank?: number | null;
  volume?: number | null;
  pnl?: number | null;
};

/* ------------------------------------------------------------ helpers */

const DEFAULT_GRADIENT =
  "radial-gradient(120% 140% at 0% 0%, color-mix(in oklch, var(--primary) 55%, transparent) 0%, transparent 60%), radial-gradient(120% 140% at 100% 100%, oklch(0.62 0.17 300 / 0.5) 0%, transparent 60%), var(--container-high)";

const dateFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
const yearFmt = new Intl.DateTimeFormat("en-US", { year: "numeric" });

function formatDateRange(start: number | Date, end: number | Date) {
  return `${dateFmt.format(start)} – ${dateFmt.format(end)}, ${yearFmt.format(end)}`;
}

function ordinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`;
}

function tierLabel(tier: CampaignPrizeTier) {
  if (tier.label != null) return tier.label;
  if (tier.range) return `${ordinal(tier.range[0])} – ${ordinal(tier.range[1])}`;
  return tier.position != null ? ordinal(tier.position) : "—";
}

function totalPrizeOf(campaign: Campaign) {
  if (campaign.totalPrize) return campaign.totalPrize;
  const pools = campaign.prizePools ?? [];
  if (!pools.length) return null;
  return { amount: pools.reduce((sum, p) => sum + p.total, 0), currency: pools[0].currency };
}

function coverStyle(campaign: Campaign): CSSProperties {
  return campaign.image
    ? { backgroundImage: `url(${campaign.image})`, backgroundSize: "cover", backgroundPosition: "center" }
    : { background: campaign.gradient ?? DEFAULT_GRADIENT };
}

/**
 * Display-only campaign state: status from the clock (or `override`) and the time left to the next boundary.
 * Re-renders once a second via `useCountdown`.
 */
export function useCampaignStatus(startTime: number | Date, endTime: number | Date, override?: CampaignStatus) {
  const toStart = useCountdown(startTime) ?? 0;
  const toEnd = useCountdown(endTime) ?? 0;
  const status: CampaignStatus = override ?? (toStart > 0 ? "upcoming" : toEnd > 0 ? "live" : "ended");
  const remaining = status === "upcoming" ? toStart : status === "live" ? toEnd : 0;
  return { status, remaining };
}

const STATUS_LABEL: Record<CampaignStatus, string> = { upcoming: "Upcoming", live: "Live", ended: "Ended" };

/** Upcoming / Live / Ended pill. */
export function CampaignStatusTag({ status, className }: { status: CampaignStatus; className?: string }) {
  return (
    <span
      data-status={status}
      className={cn(
        "inline-flex h-5 items-center gap-1.5 rounded-full px-2 text-[11px] font-semibold backdrop-blur-md",
        status === "live" && "bg-emerald-500/18 text-emerald-700 dark:text-emerald-300",
        status === "upcoming" && "bg-primary/16 text-primary",
        status === "ended" && "bg-background/70 text-muted-foreground",
        className,
      )}
    >
      {status === "live" && (
        <span className="relative flex size-1.5">
          <span className="absolute inset-0 animate-ping rounded-full bg-current opacity-60 motion-reduce:hidden" />
          <span className="relative size-1.5 rounded-full bg-current" />
        </span>
      )}
      {STATUS_LABEL[status]}
    </span>
  );
}

function PrizeTag({ amount, currency }: { amount: number; currency: string }) {
  return (
    <span className="inline-flex h-5 items-center gap-1 rounded-full bg-amber-400/85 px-2 text-[11px] font-semibold text-amber-950 backdrop-blur-sm">
      <TrophyIcon className="size-3" />
      {formatCompact(amount, 1)} {currency}
    </span>
  );
}

function splitDuration(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return [
    { value: Math.floor(total / 86400), label: "Days" },
    { value: Math.floor((total % 86400) / 3600), label: "Hours" },
    { value: Math.floor((total % 3600) / 60), label: "Minutes" },
    { value: total % 60, label: "Seconds" },
  ];
}

/** "Ends in 3d 04:12:09" line, or large day / hour / minute / second units. */
export function CampaignCountdown({
  status,
  remaining,
  variant = "inline",
  className,
}: {
  status: CampaignStatus;
  remaining: number;
  variant?: "inline" | "units";
  className?: string;
}) {
  if (variant === "units") {
    if (status === "ended") {
      return (
        <div className={cn("flex w-full items-center gap-4", className)}>
          <span className="h-px flex-1 bg-linear-to-r from-transparent to-primary/60" />
          <span className="text-sm font-medium text-muted-foreground sm:text-base">This campaign has ended</span>
          <span className="h-px flex-1 bg-linear-to-l from-transparent to-primary/60" />
        </div>
      );
    }
    return (
      <div className={cn("flex w-full items-center gap-3 sm:gap-4", className)}>
        <span className="h-px flex-1 bg-linear-to-r from-transparent to-primary/60" />
        <div className="flex flex-col items-center gap-1.5 sm:gap-2" role="timer" aria-live="off">
          <span className="text-sm font-medium text-muted-foreground sm:text-base">{status === "live" ? "Ends in" : "Starts in"}</span>
          <div className="flex items-center gap-2 sm:gap-2.5">
            {splitDuration(remaining).map((u, i) => (
              <div key={u.label} className="flex items-center gap-2 sm:gap-2.5">
                {i > 0 && <span aria-hidden="true" className="size-1 rounded-full bg-muted-foreground/40" />}
                <div className="flex w-11 flex-col items-center gap-0.5 sm:w-16">
                  <span className="font-mono text-xl leading-6 font-medium tabular-nums sm:text-4xl sm:leading-11">
                    {String(u.value).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] text-muted-foreground sm:text-xs">{u.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <span className="h-px flex-1 bg-linear-to-l from-transparent to-primary/60" />
      </div>
    );
  }
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs text-muted-foreground", className)}>
      {status === "ended" ? (
        "Ended"
      ) : (
        <>
          {status === "live" ? "Ends in" : "Starts in"}
          <span className="font-mono font-medium text-foreground tabular-nums">{formatCountdown(remaining)}</span>
        </>
      )}
    </span>
  );
}

/** Prize tiers of one or more pools as a compact list. */
export function PrizePoolBreakdown({ pools, maxTiers = 4, className }: { pools: CampaignPrizePool[]; maxTiers?: number; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      {pools.map((pool) => {
        const tiers = pool.tiers ?? [];
        const shown = tiers.slice(0, maxTiers);
        return (
          <div key={pool.id} className="flex flex-col gap-1">
            {pools.length > 1 && (
              <div className="flex items-baseline justify-between text-[11px]">
                <span className="font-medium text-foreground">{pool.label}</span>
                <Numeral value={pool.total} dp={0} unit={pool.currency} className="text-muted-foreground" />
              </div>
            )}
            <ul className="flex flex-col">
              {shown.map((tier, i) => (
                <li key={i} className="flex items-center justify-between py-0.5 text-xs">
                  <span className={cn("text-muted-foreground", i === 0 && !tier.range && "font-medium text-amber-600 dark:text-amber-400")}>
                    {tierLabel(tier)}
                  </span>
                  <Numeral value={tier.amount} dp={0} unit={pool.currency} />
                </li>
              ))}
              {tiers.length > shown.length && (
                <li className="pt-0.5 text-[11px] text-muted-foreground">+{tiers.length - shown.length} more tiers</li>
              )}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

interface CampaignActionProps {
  /** Override the clock-derived status. */
  status?: CampaignStatus;
  /** Whether you have joined. Shows Join until true. */
  joined?: boolean;
  joining?: boolean;
  onJoin?: () => void;
  onTrade?: () => void;
  onLearnMore?: () => void;
  tradeLabel?: ReactNode;
  learnMoreLabel?: ReactNode;
}

function Actions({
  status,
  joined,
  joining,
  onJoin,
  onTrade,
  onLearnMore,
  tradeLabel = "Trade now",
  learnMoreLabel = "View rules",
  size = "sm",
}: CampaignActionProps & { status: CampaignStatus; size?: "sm" | "default" }) {
  const showJoin = !joined && status !== "ended" && onJoin;
  const showTrade = joined && status === "live" && onTrade;
  if (!onLearnMore && !showJoin && !showTrade) return null;
  return (
    <div className="flex gap-2">
      {onLearnMore && (
        <Button variant="outline" size={size} className="flex-1" onClick={onLearnMore}>
          {learnMoreLabel}
        </Button>
      )}
      {showJoin && (
        <Button size={size} className="flex-1" disabled={joining} onClick={onJoin}>
          {joining ? "Joining…" : "Join now"}
        </Button>
      )}
      {showTrade && (
        <Button size={size} className="flex-1" onClick={onTrade}>
          {tradeLabel}
        </Button>
      )}
    </div>
  );
}

function YourStats({ you }: { you: CampaignYou }) {
  return (
    <div className="grid grid-cols-3 gap-2 rounded-xl bg-primary/[0.07] px-3 py-2">
      <div className="flex flex-col gap-0.5">
        <span className="text-[11px] text-muted-foreground">Your rank</span>
        <span className="font-mono text-sm font-medium tabular-nums">{you.rank != null ? `#${formatNumber(you.rank, "number", { dp: 0 })}` : "—"}</span>
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-[11px] text-muted-foreground">Your volume</span>
        <Numeral value={you.volume} rule="compact" prefix="$" className="text-sm font-medium" />
      </div>
      <div className="flex flex-col items-end gap-0.5">
        <span className="text-[11px] text-muted-foreground">Your PnL</span>
        <Numeral value={you.pnl} rule="usd" coloring showSign className="text-sm font-medium" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ card */

export interface CampaignCardProps extends CampaignActionProps {
  campaign: Campaign;
  /** Your standing — omit when not connected or not joined. */
  you?: CampaignYou | null;
  /** How many prize tiers to list per pool. */
  maxTiers?: number;
  className?: string;
}

/** A trading competition card — cover, status, countdown, prize pool tiers, your standing and join / trade actions. */
export function CampaignCard({ campaign, you, maxTiers = 3, status: statusProp, className, ...actions }: CampaignCardProps) {
  const { status, remaining } = useCampaignStatus(campaign.startTime, campaign.endTime, statusProp);
  const total = totalPrizeOf(campaign);
  return (
    <article
      data-slot="campaign-card"
      data-status={status}
      className={cn("flex w-full flex-col overflow-hidden rounded-2xl border border-outline-variant bg-container", className)}
    >
      <div className={cn("relative h-28 shrink-0", status === "ended" && "grayscale-[0.6]")} style={coverStyle(campaign)}>
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-container" />
        <div className="absolute inset-x-3 top-3 flex items-center justify-between">
          <CampaignStatusTag status={status} />
          {total && <PrizeTag amount={total.amount} currency={total.currency} />}
        </div>
      </div>

      <div className="-mt-4 flex flex-1 flex-col gap-3 px-4 pb-4">
        <div className="relative flex flex-col gap-1">
          <h3 className="text-base leading-tight font-semibold tracking-[-0.01em]">{campaign.title}</h3>
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <span className="text-xs text-muted-foreground">{formatDateRange(campaign.startTime, campaign.endTime)}</span>
            <CampaignCountdown status={status} remaining={remaining} />
          </div>
          {campaign.tags?.length ? <span className="text-[11px] text-muted-foreground">{campaign.tags.join(" · ")}</span> : null}
        </div>

        {total && (
          <div className="flex flex-col gap-2 rounded-xl bg-background/60 p-3">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[11px] text-muted-foreground">Total prize pool</span>
              <span className="bg-linear-to-r from-primary to-violet-500 bg-clip-text font-mono text-lg font-semibold text-transparent tabular-nums">
                {formatNumber(total.amount, "number", { dp: 0 })} {total.currency}
              </span>
            </div>
            {campaign.prizePools?.some((p) => p.tiers?.length) && <PrizePoolBreakdown pools={campaign.prizePools} maxTiers={maxTiers} />}
          </div>
        )}

        {(campaign.participants != null || campaign.totalVolume != null) && (
          <div className="flex items-center gap-4 text-xs">
            {campaign.participants != null && (
              <span className="flex items-center gap-1 text-muted-foreground">
                <UsersIcon className="size-3.5" />
                <Numeral value={campaign.participants} dp={0} className="text-foreground" />
                traders
              </span>
            )}
            {campaign.totalVolume != null && (
              <span className="flex items-center gap-1 text-muted-foreground">
                Volume
                <Numeral value={campaign.totalVolume} rule="compact" prefix="$" className="text-foreground" />
              </span>
            )}
          </div>
        )}

        {you && <YourStats you={you} />}

        <div className="mt-auto">
          <Actions status={status} {...actions} />
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------ tile */

export interface CampaignTileProps {
  campaign: Campaign;
  active?: boolean;
  status?: CampaignStatus;
  onSelect?: (id: Campaign["id"]) => void;
  className?: string;
}

/** A compact selectable cover tile — for a row or carousel of campaigns above the hero. */
export function CampaignTile({ campaign, active, status: statusProp, onSelect, className }: CampaignTileProps) {
  const { status } = useCampaignStatus(campaign.startTime, campaign.endTime, statusProp);
  const total = totalPrizeOf(campaign);
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={() => onSelect?.(campaign.id)}
      className={cn(
        "group focus-ring relative flex h-20 w-full min-w-40 flex-col items-center justify-center gap-0.5 overflow-hidden rounded-xl border px-3 text-center transition-colors",
        active ? "border-primary" : "border-transparent hover:border-outline-variant",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn("absolute inset-0 transition-opacity", active ? "opacity-100" : "opacity-45 grayscale group-hover:opacity-100 group-hover:grayscale-0")}
        style={coverStyle(campaign)}
      />
      <span aria-hidden="true" className="absolute inset-0 bg-background/35" />
      <CampaignStatusTag status={status} className="absolute top-1.5 left-1.5 h-4 px-1.5 text-[10px]" />
      {total && (
        <span className="absolute top-1.5 right-1.5 inline-flex h-4 items-center gap-0.5 rounded-full bg-amber-400/85 px-1.5 text-[10px] font-semibold text-amber-950">
          <TrophyIcon className="size-2.5" />
          {formatCompact(total.amount, 1)}
        </span>
      )}
      <span className={cn("relative mt-3 line-clamp-1 text-sm font-semibold", active ? "text-foreground" : "text-foreground/70 group-hover:text-foreground")}>
        {campaign.title}
      </span>
      {campaign.tags?.length ? <span className="relative text-[10px] text-muted-foreground">{campaign.tags.join(", ")}</span> : null}
    </button>
  );
}

/* ------------------------------------------------------------ hero */

function VolumeTierProgress({ tiers, volume, currency }: { tiers: CampaignVolumeTier[]; volume: number; currency: string }) {
  const n = tiers.length;
  const pos = (i: number) => ((i + 1) / (n + 1)) * 100;
  let reached = -1;
  tiers.forEach((t, i) => {
    if (volume >= t.volume) reached = i;
  });
  let progress: number;
  if (reached < 0) progress = tiers[0] ? (Math.min(volume, tiers[0].volume) / tiers[0].volume) * pos(0) : 0;
  else if (reached === n - 1) progress = pos(n - 1) + Math.min(1, volume / tiers[n - 1].volume - 1) * (100 - pos(n - 1));
  else {
    const a = tiers[reached];
    const b = tiers[reached + 1];
    progress = pos(reached) + ((volume - a.volume) / (b.volume - a.volume)) * (pos(reached + 1) - pos(reached));
  }
  return (
    <div className="relative rounded-xl border border-outline-variant px-4 pt-9 pb-9">
      <div
        className="relative h-2.5 rounded-full bg-container-highest"
        // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- a native <meter> cannot host the tier markers
        role="meter"
        aria-label="Prize pool unlock progress"
        aria-valuemin={0}
        aria-valuemax={tiers[n - 1]?.volume ?? 0}
        aria-valuenow={volume}
      >
        <div className="h-full rounded-full bg-linear-to-r from-primary/70 to-primary transition-[width] duration-500" style={{ width: `${Math.min(100, progress)}%` }} />
        {tiers.map((t, i) => {
          const hit = i <= reached;
          return (
            <div key={t.volume} className="absolute top-1/2" style={{ left: `${pos(i)}%` }}>
              <span className={cn("absolute size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full", hit ? "bg-primary-foreground" : "bg-muted-foreground/60")} />
              <span className={cn("absolute -top-7 -translate-x-1/2 font-mono text-[11px] whitespace-nowrap tabular-nums", hit ? "text-foreground" : "text-muted-foreground")}>
                &gt;${formatCompact(t.volume, 0)}
              </span>
              <span
                className={cn(
                  "absolute top-3.5 -translate-x-1/2 font-mono text-xs whitespace-nowrap tabular-nums",
                  i === reached ? "font-semibold text-primary" : hit ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {formatNumber(t.prize, "number", { dp: 0 })} {currency}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export interface CampaignHeroProps extends CampaignActionProps {
  campaign: Campaign;
  /** Volume targets that unlock a bigger pool, shown as a progress track. */
  volumeTiers?: CampaignVolumeTier[];
  /** A second highlighted pool next to the total, e.g. a raffle. */
  highlightPool?: { label: ReactNode; amount: number; currency: string };
  you?: CampaignYou | null;
  className?: string;
}

/** The campaign page header — dates, title, a big countdown and the prize pool panel with actions. */
export function CampaignHero({ campaign, volumeTiers, highlightPool, you, status: statusProp, className, ...actions }: CampaignHeroProps) {
  const { status, remaining } = useCampaignStatus(campaign.startTime, campaign.endTime, statusProp);
  const total = totalPrizeOf(campaign);
  const pools = campaign.prizePools?.filter((p) => p.tiers?.length) ?? [];
  return (
    <section
      data-slot="campaign-hero"
      data-status={status}
      className={cn("relative isolate flex w-full flex-col items-center gap-8 overflow-hidden rounded-3xl px-3 py-10 sm:px-6 sm:py-14", className)}
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10" style={coverStyle(campaign)} />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-b from-background via-background/40 to-background" />

      <header className="flex max-w-xl flex-col items-center gap-2.5 text-center">
        <span className="text-sm font-medium text-muted-foreground">{formatDateRange(campaign.startTime, campaign.endTime)}</span>
        <h2 className="text-3xl leading-tight font-bold tracking-[-0.02em] text-balance sm:text-5xl">{campaign.title}</h2>
        {campaign.description && <p className="max-w-sm text-sm font-medium text-muted-foreground">{campaign.description}</p>}
      </header>

      <CampaignCountdown status={status} remaining={remaining} variant="units" className="max-w-2xl" />

      <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-outline-variant bg-background/50 backdrop-blur-md">
        {(campaign.participants != null || campaign.totalVolume != null) && status !== "upcoming" && (
          <div className="flex items-center gap-4 px-4 py-2.5 text-[11px] font-medium">
            {campaign.participants != null && (
              <span className="flex items-center gap-1 text-muted-foreground">
                Participants <Numeral value={campaign.participants} dp={0} className="text-foreground" />
              </span>
            )}
            {campaign.totalVolume != null && (
              <span className="flex items-center gap-1 text-muted-foreground">
                Trading volume <Numeral value={campaign.totalVolume} rule="usd" className="text-foreground" />
              </span>
            )}
            {actions.onLearnMore && (
              <button
                type="button"
                onClick={actions.onLearnMore}
                className="focus-ring ml-auto flex items-center gap-0.5 rounded-sm text-muted-foreground hover:text-foreground sm:hidden"
              >
                Rules <ChevronRightIcon className="size-3.5" />
              </button>
            )}
          </div>
        )}
        <div className="flex flex-col gap-4 rounded-2xl border-t border-outline-variant bg-primary/[0.06] p-4 sm:p-5">
          <div className="flex flex-wrap items-start gap-x-8 gap-y-3">
            <div className="flex flex-col">
              <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                Total prize pool
                {pools.length > 0 && (
                  <Tooltip>
                    <TooltipTrigger
                      aria-label="Prize pool breakdown"
                      className="focus-ring grid size-4 place-items-center rounded-full hover:text-foreground"
                    >
                      <InfoIcon className="size-3.5" />
                    </TooltipTrigger>
                    <TooltipContent className="w-60">
                      <ul className="flex flex-col gap-1">
                        {pools.map((p) => (
                          <li key={p.id} className="flex justify-between gap-3 text-[11px]">
                            <span className="opacity-70">{p.label}</span>
                            <span className="font-mono tabular-nums">
                              {formatNumber(p.total, "number", { dp: 0 })} {p.currency}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </TooltipContent>
                  </Tooltip>
                )}
              </span>
              <span className="bg-linear-to-r from-primary to-violet-500 bg-clip-text font-mono text-2xl font-bold text-transparent tabular-nums sm:text-[28px]">
                {total ? `${formatNumber(total.amount, "number", { dp: 0 })} ${total.currency}` : "—"}
              </span>
            </div>
            {highlightPool && (
              <div className="flex flex-col">
                <span className="text-xs font-medium text-muted-foreground">{highlightPool.label}</span>
                <span className="bg-linear-to-r from-primary to-violet-500 bg-clip-text font-mono text-2xl font-bold text-transparent tabular-nums sm:text-[28px]">
                  {formatNumber(highlightPool.amount, "number", { dp: 0 })} {highlightPool.currency}
                </span>
              </div>
            )}
          </div>

          {volumeTiers?.length ? (
            <VolumeTierProgress tiers={volumeTiers} volume={campaign.totalVolume ?? 0} currency={total?.currency ?? "USDC"} />
          ) : pools.length > 0 ? (
            <PrizePoolBreakdown pools={pools} maxTiers={4} className="sm:grid sm:grid-cols-2 sm:gap-x-6" />
          ) : null}

          {you && <YourStats you={you} />}

          <Actions status={status} size="default" {...actions} />
        </div>
      </div>
    </section>
  );
}
