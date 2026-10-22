import { ChevronDownIcon, StarIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Numeral } from "@/components/trading/numeral";
import { SymbolBadge, SymbolDisplay } from "@/components/trading/token-icon";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatCountdown, toneOf, TONE_TEXT, useCountdown } from "@/lib/trading";
import { cn } from "@/lib/utils";

export type SymbolInfoStat = {
  label: ReactNode;
  value: ReactNode;
  /** Explanation shown in a tooltip when the label is hovered. */
  hint?: ReactNode;
};

export interface SymbolInfoBarProps {
  /** `PERP_BTC_USDC`, `BTC-PERP`… */
  symbol: string;
  iconSrc?: string;
  /** Last traded price. */
  price?: number | null;
  /** 24h change as a fraction (0.0123 = +1.23%). */
  change?: number | null;
  /** 24h change in quote currency. */
  changeAbs?: number | null;
  /** Price increment, used to format prices. */
  tick?: number;
  /** Max leverage badge. */
  maxLeverage?: number;
  /** Extra badge next to the symbol, e.g. `RWA`. */
  badge?: ReactNode;
  markPrice?: number | null;
  indexPrice?: number | null;
  /** 24h volume in quote currency. */
  volume24h?: number | null;
  /** Open interest in quote currency. */
  openInterest?: number | null;
  /** Predicted funding rate as a fraction (0.0001 = 0.01%). */
  fundingRate?: number | null;
  /** Next funding time — the countdown is display-only. */
  nextFundingTime?: number | Date | null;
  /** Additional stats appended after the built-ins. */
  stats?: SymbolInfoStat[];
  /** Whether the symbol is in favourites. Omit to hide the star. */
  favorite?: boolean;
  onFavoriteChange?: (favorite: boolean) => void;
  /** Called when the symbol is clicked — open your market selector here. */
  onSymbolClick?: () => void;
  /** `full` scrolls a row of stats; `compact` is the mobile two-line header. */
  variant?: "full" | "compact";
  /** Rendered at the far end, e.g. settings or layout buttons. */
  trailing?: ReactNode;
  className?: string;
}

export function DataItem({ label, value, hint }: SymbolInfoStat) {
  return (
    <div data-slot="data-item" className="flex shrink-0 flex-col items-start gap-0.5">
      {hint ? (
        <Tooltip>
          <TooltipTrigger
            render={<button type="button" />}
            className="cursor-help border-b border-dashed border-border text-[11px] whitespace-nowrap text-muted-foreground"
          >
            {label}
          </TooltipTrigger>
          <TooltipContent className="max-w-72">{hint}</TooltipContent>
        </Tooltip>
      ) : (
        <span className="text-[11px] whitespace-nowrap text-muted-foreground">{label}</span>
      )}
      <span className="font-mono text-xs whitespace-nowrap text-foreground tabular-nums">{value}</span>
    </div>
  );
}

function Countdown({ to }: { to: number | Date }) {
  const ms = useCountdown(to);
  return <span className="text-muted-foreground">{ms == null ? "—" : formatCountdown(ms)}</span>;
}

/** The instrument header above a trading chart: symbol, last price, 24h change and market stats. */
export function SymbolInfoBar({
  symbol,
  iconSrc,
  price,
  change,
  changeAbs,
  tick,
  maxLeverage,
  badge,
  markPrice,
  indexPrice,
  volume24h,
  openInterest,
  fundingRate,
  nextFundingTime,
  stats = [],
  favorite,
  onFavoriteChange,
  onSymbolClick,
  variant = "full",
  trailing,
  className,
}: SymbolInfoBarProps) {
  const tone = toneOf(change);
  const symbolNode = (
    <SymbolDisplay
      symbol={symbol}
      iconSrc={iconSrc}
      size={variant === "compact" ? "md" : "sm"}
      className="text-sm font-semibold"
    />
  );
  const trigger = onSymbolClick ? (
    <button
      type="button"
      onClick={onSymbolClick}
      className="focus-ring -mx-1.5 flex items-center gap-1 rounded-lg px-1.5 py-1 hover:bg-container-high"
    >
      {symbolNode}
      <ChevronDownIcon className="size-3.5 text-muted-foreground" />
    </button>
  ) : (
    symbolNode
  );
  const star = favorite !== undefined && (
    <button
      type="button"
      aria-label={favorite ? "Remove from favourites" : "Add to favourites"}
      aria-pressed={favorite}
      onClick={() => onFavoriteChange?.(!favorite)}
      className="focus-ring grid size-7 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-container-high"
    >
      <StarIcon className={cn("size-3.5 transition-colors", favorite && "fill-amber-400 text-amber-400")} />
    </button>
  );
  const badges = (maxLeverage != null || badge != null) && (
    <span className="flex items-center gap-1">
      {maxLeverage != null && <SymbolBadge className="bg-primary/12 text-primary">{maxLeverage}x</SymbolBadge>}
      {badge != null && <SymbolBadge>{badge}</SymbolBadge>}
    </span>
  );

  if (variant === "compact") {
    return (
      <div data-slot="symbol-info-bar" className={cn("flex items-center gap-3 rounded-xl bg-container px-3 py-2", className)}>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center gap-1">
            {trigger}
            {star}
          </div>
          {badges}
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <Numeral value={price} tick={tick} className={cn("text-base font-semibold", TONE_TEXT[tone])} />
          <Numeral value={change} rule="percent" showSign coloring className="text-xs" />
        </div>
        {trailing}
      </div>
    );
  }

  const builtIns: SymbolInfoStat[] = [];
  if (change !== undefined || changeAbs !== undefined)
    builtIns.push({
      label: "24h change",
      value: (
        <span className={TONE_TEXT[tone]}>
          {changeAbs != null && <Numeral value={changeAbs} tick={tick} showSign />}
          {changeAbs != null && " / "}
          <Numeral value={change} rule="percent" showSign />
        </span>
      ),
    });
  if (markPrice !== undefined)
    builtIns.push({ label: "Mark", value: <Numeral value={markPrice} tick={tick} />, hint: "The fair price used to calculate unrealized PnL and liquidations." });
  if (indexPrice !== undefined)
    builtIns.push({ label: "Index", value: <Numeral value={indexPrice} tick={tick} />, hint: "The weighted average spot price across major venues." });
  if (volume24h !== undefined) builtIns.push({ label: "24h volume", value: <Numeral value={volume24h} rule="compact" prefix="$" /> });
  if (openInterest !== undefined)
    builtIns.push({ label: "Open interest", value: <Numeral value={openInterest} rule="compact" prefix="$" />, hint: "Total value of outstanding positions." });
  if (fundingRate !== undefined)
    builtIns.push({
      label: "Funding / countdown",
      value: (
        <span className="flex items-center gap-1.5">
          <Numeral value={fundingRate} rule="percent" dp={4} className={fundingRate != null && fundingRate < 0 ? TONE_TEXT.down : "text-amber-600 dark:text-amber-400"} />
          {nextFundingTime != null && <Countdown to={nextFundingTime} />}
        </span>
      ),
      hint: "Paid between longs and shorts every funding interval. Positive rates mean longs pay shorts.",
    });

  return (
    <div
      data-slot="symbol-info-bar"
      className={cn("flex h-14 w-full items-center gap-4 rounded-xl bg-container px-3 text-sm", className)}
    >
      <div className="flex shrink-0 items-center gap-1">
        {star}
        {trigger}
        {badges}
      </div>
      <Numeral value={price} tick={tick} className={cn("shrink-0 text-lg font-semibold", TONE_TEXT[tone])} />
      <div className="h-7 w-px shrink-0 bg-border" />
      <div className="flex min-w-0 flex-1 items-center gap-6 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {[...builtIns, ...stats].map((s, i) => (
          <DataItem key={i} {...s} />
        ))}
      </div>
      {trailing && <div className="flex shrink-0 items-center gap-1">{trailing}</div>}
    </div>
  );
}
