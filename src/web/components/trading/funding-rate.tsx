import type { ReactNode } from "react";

import { Numeral } from "@/components/trading/numeral";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";
import { formatCountdown, formatNumber, toneOf, TONE_TEXT, useCountdown } from "@/lib/trading";
import { cn } from "@/lib/utils";

export type FundingTimeframe = { label: string; hours: number };

export const DEFAULT_FUNDING_TIMEFRAMES: FundingTimeframe[] = [
  { label: "1H", hours: 1 },
  { label: "4H", hours: 4 },
  { label: "1D", hours: 24 },
  { label: "7D", hours: 168 },
  { label: "30D", hours: 720 },
];

/** A per-interval rate scaled to another horizon — display arithmetic only. */
export function scaleFundingRate(rate: number, intervalHours: number, hours: number) {
  return intervalHours > 0 ? (rate / intervalHours) * hours : Number.NaN;
}

/** Simple (non-compounded) annualised rate. */
export const annualizeFundingRate = (rate: number, intervalHours: number) => scaleFundingRate(rate, intervalHours, 24 * 365);

export interface FundingRateProps {
  /** Predicted rate for the current interval, as a fraction (0.0001 = 0.01%). */
  rate: number | null | undefined;
  /** When the current interval settles. The countdown is display-only. */
  nextFundingTime?: number | Date | null;
  /** Settlement interval in hours. */
  intervalHours?: number;
  /** Last settled rate, as a fraction. */
  lastRate?: number | null;
  /** Rate cap and floor per interval, as fractions. */
  capRate?: number | null;
  floorRate?: number | null;
  /** Signed position size in base units: positive long, negative short. */
  positionSize?: number | null;
  /** Mark price used to value the position. */
  markPrice?: number | null;
  /** Signed position notional — wins over `positionSize × markPrice`. */
  positionNotional?: number | null;
  quote?: string;
  /** Horizons for the "estimated rate" rows. */
  timeframes?: FundingTimeframe[];
  label?: ReactNode;
  /** `inline` sits in a stats bar; `stacked` is the mobile two-line readout. */
  variant?: "inline" | "stacked";
  /** Where the details open. `none` renders a plain readout. */
  detail?: "popover" | "dialog" | "none";
  /** Explanation under the details. */
  description?: ReactNode;
  className?: string;
}

const DEFAULT_DESCRIPTION =
  "Funding is exchanged between longs and shorts every interval. When the rate is positive, longs pay shorts; when negative, shorts pay longs. Estimates change until settlement.";

function Countdown({ to }: { to: number | Date }) {
  const ms = useCountdown(to);
  return <span className="font-mono text-muted-foreground tabular-nums">{ms == null ? "—" : formatCountdown(ms)}</span>;
}

function Row({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-mono text-foreground tabular-nums">{children}</dd>
    </div>
  );
}

const pct = (v: number | null | undefined, dp = 4) => (v == null ? "—" : formatNumber(v, "percent", { dp, sign: true }));

const rateTone = (v: number | null | undefined) => (v != null && v < 0 ? TONE_TEXT.down : "text-amber-600 dark:text-amber-400");

/** The funding detail list — interval, cap / floor, last and annualised rate, estimates and payment. */
export function FundingRateDetails({
  rate,
  intervalHours = 8,
  lastRate,
  capRate,
  floorRate,
  positionSize,
  markPrice,
  positionNotional,
  quote = "USDC",
  timeframes = DEFAULT_FUNDING_TIMEFRAMES,
  description = DEFAULT_DESCRIPTION,
  nextFundingTime,
}: Omit<FundingRateProps, "label" | "variant" | "detail" | "className">) {
  const notional =
    positionNotional ?? (positionSize != null && markPrice != null ? positionSize * markPrice : null);
  // Longs pay a positive rate; from the trader's side a payment is negative.
  const payment = rate != null && notional != null && notional !== 0 ? -rate * notional : null;

  return (
    <div className="flex flex-col gap-3 text-xs">
      <dl className="flex flex-col gap-1.5">
        <Row label="Predicted rate">
          <span className={rateTone(rate)}>{pct(rate)}</span>
          {nextFundingTime != null && (
            <>
              {" "}
              <span className="text-muted-foreground">in</span> <Countdown to={nextFundingTime} />
            </>
          )}
        </Row>
        <Row label="Interval">{intervalHours}h</Row>
        {(capRate != null || floorRate != null) && (
          <Row label="Cap / floor">
            {pct(capRate, 2)} / {pct(floorRate, 2)}
          </Row>
        )}
        {lastRate !== undefined && (
          <Row label="Last rate / annualised">
            {pct(lastRate)} / {lastRate == null ? "—" : formatNumber(annualizeFundingRate(lastRate, intervalHours), "percent", { sign: true })}
          </Row>
        )}
        {rate != null &&
          timeframes.map((t) => (
            <Row key={t.label} label={`Est. rate (${t.label})`}>
              {pct(scaleFundingRate(rate, intervalHours, t.hours), t.hours >= 24 * 7 ? 3 : 4)}
            </Row>
          ))}
        {rate != null && (
          <Row label="Est. annualised">{formatNumber(annualizeFundingRate(rate, intervalHours), "percent", { sign: true })}</Row>
        )}
        {notional != null && (
          <Row label={payment != null && payment > 0 ? "Est. funding received" : "Est. funding paid"}>
            {payment == null ? (
              "—"
            ) : (
              <Numeral value={Math.abs(payment)} dp={4} unit={quote} className={TONE_TEXT[toneOf(payment)]} />
            )}
          </Row>
        )}
      </dl>
      {description && <p className="border-t border-border pt-3 text-[11px] leading-relaxed text-muted-foreground">{description}</p>}
    </div>
  );
}

/** A funding rate readout with a settlement countdown and a details popover or dialog. */
export function FundingRate({
  label = "Funding / countdown",
  variant = "inline",
  detail = "popover",
  className,
  ...props
}: FundingRateProps) {
  const { rate, nextFundingTime } = props;
  const labelClass = cn(
    "text-[11px] whitespace-nowrap text-muted-foreground",
    detail !== "none" &&
      "focus-ring cursor-pointer rounded-xs underline decoration-border decoration-dashed underline-offset-4 hover:text-foreground",
  );
  const value = (
    <span className={cn("flex items-center gap-1.5 text-xs whitespace-nowrap", variant === "stacked" && "text-[11px]")}>
      <Numeral value={rate} rule="percent" dp={4} className={rateTone(rate)} />
      {nextFundingTime != null && (
        <>
          {variant === "stacked" && <span className="text-muted-foreground">in</span>}
          <Countdown to={nextFundingTime} />
        </>
      )}
    </span>
  );
  const body = (trigger: ReactNode) => (
    <div data-slot="funding-rate" className={cn("flex min-w-0 flex-col items-start gap-0.5", className)}>
      {trigger}
      {value}
    </div>
  );

  if (detail === "none") return body(<span className={labelClass}>{label}</span>);

  if (detail === "dialog")
    return body(
      <Dialog>
        <DialogTrigger className={labelClass}>{label}</DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base">Funding rate</DialogTitle>
            <DialogDescription className="sr-only">Funding interval, rates and estimated payment.</DialogDescription>
          </DialogHeader>
          <FundingRateDetails {...props} />
        </DialogContent>
      </Dialog>,
    );

  return body(
    <Popover>
      <PopoverTrigger openOnHover delay={200} className={labelClass}>
        {label}
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 p-4">
        <PopoverTitle className="mb-3">Funding rate</PopoverTitle>
        <FundingRateDetails {...props} />
      </PopoverContent>
    </Popover>,
  );
}
