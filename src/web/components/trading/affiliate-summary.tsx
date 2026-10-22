import { ArrowDownIcon, ArrowRightIcon, CoinsIcon, FileTextIcon, Share2Icon, UserRoundIcon, UsersRoundIcon } from "lucide-react";
import { useState, type ComponentType, type ReactNode } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Numeral } from "@/components/trading/numeral";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { formatCompact, formatNumber } from "@/lib/trading";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------ shared */

export type AffiliatePeriodOption = { value: string; label: ReactNode };

export const DEFAULT_AFFILIATE_PERIODS: AffiliatePeriodOption[] = [
  { value: "7d", label: "7D" },
  { value: "30d", label: "30D" },
  { value: "all", label: "All" },
];

function useControllable<T>(value: T | undefined, defaultValue: T, onChange?: (v: T) => void) {
  const [inner, setInner] = useState(defaultValue);
  const controlled = value !== undefined;
  const set = (v: T) => {
    if (!controlled) setInner(v);
    onChange?.(v);
  };
  return [controlled ? value : inner, set] as const;
}

function Segmented({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  options: AffiliatePeriodOption[];
  label: string;
}) {
  return (
    <ToggleGroup
      aria-label={label}
      size="sm"
      value={[value]}
      onValueChange={(v) => {
        if (v[0] != null) onChange(String(v[0]));
      }}
    >
      {options.map((o) => (
        <ToggleGroupItem key={o.value} value={o.value} className="h-7 px-2.5 text-xs">
          {o.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

export type StatBreakdown = { direct: number; indirect: number };

export interface AffiliateStatCardProps {
  label: ReactNode;
  value: number | null | undefined;
  /** `usd` renders `$1.2M`, `count` a grouped integer. */
  format?: "usd" | "count";
  breakdown?: StatBreakdown;
  /** Highlight the card, e.g. for commission. */
  emphasis?: boolean;
  hidden?: boolean;
  className?: string;
}

/** A stat with an optional "Direct / Indirect" split. */
export function AffiliateStatCard({ label, value, format = "usd", breakdown, emphasis, hidden, className }: AffiliateStatCardProps) {
  const fmt = (v: number) => (format === "usd" ? `$${formatCompact(v)}` : formatNumber(v, "number", { dp: 0 }));
  return (
    <div
      data-slot="affiliate-stat"
      className={cn(
        "flex min-w-0 flex-col gap-1 rounded-xl p-3 sm:p-4",
        emphasis ? "bg-linear-to-b from-emerald-500/14 to-emerald-500/4" : "bg-container-high",
        className,
      )}
    >
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <Numeral
        value={value}
        rule={format === "usd" ? "compact" : "number"}
        dp={format === "usd" ? 2 : 0}
        prefix={format === "usd" ? "$" : undefined}
        hidden={hidden}
        className={cn("text-xl font-semibold sm:text-2xl", emphasis && "text-emerald-700 dark:text-emerald-400")}
      />
      {breakdown && (
        <span className="truncate font-mono text-[11px] text-muted-foreground tabular-nums">
          Direct {hidden ? "***" : fmt(breakdown.direct)} / Indirect {hidden ? "***" : fmt(breakdown.indirect)}
        </span>
      )}
    </div>
  );
}

export type AffiliateChartPoint = { label: string; commission: number; volume?: number };

const chartConfig = {
  commission: { label: "Commission", color: "var(--chart-2)" },
  volume: { label: "Volume", color: "var(--chart-1)" },
} satisfies ChartConfig;

function tooltipRow(value: unknown, name: unknown) {
  return (
    <span className="flex flex-1 items-center justify-between gap-4">
      <span className="text-muted-foreground">{name === "volume" ? "Volume" : "Commission"}</span>
      <span className="font-mono font-medium tabular-nums">{formatNumber(Number(value), "usd", { dp: 2 })}</span>
    </span>
  );
}

/** Commission (or volume) per day as bars. */
export function CommissionChart({ data, metric = "commission", className }: { data: AffiliateChartPoint[]; metric?: "commission" | "volume"; className?: string }) {
  if (!data.length)
    return <div className={cn("grid h-44 place-items-center rounded-xl border border-dashed border-border text-xs text-muted-foreground", className)}>No data yet</div>;
  return (
    <ChartContainer config={chartConfig} className={cn("aspect-auto h-44 w-full", className)}>
      <BarChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} minTickGap={16} />
        <YAxis width={44} tickLine={false} axisLine={false} tickFormatter={(v: number) => `$${formatCompact(v, 1)}`} />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              formatter={tooltipRow}
            />
          }
        />
        <Bar dataKey={metric} fill={`var(--color-${metric})`} radius={[4, 4, 0, 0]} maxBarSize={28} />
      </BarChart>
    </ChartContainer>
  );
}

/* ------------------------------------------------------------ affiliate summary */

export interface AffiliateSummaryProps {
  title?: ReactNode;
  /** Commission earned in the period, in USD. */
  commission?: number | null;
  commissionBreakdown?: StatBreakdown;
  /** Volume traded by your referees in the period, in USD. */
  volume?: number | null;
  volumeBreakdown?: StatBreakdown;
  /** Number of referees bound to your codes. */
  referees?: number | null;
  refereesBreakdown?: StatBreakdown;
  /** Referees that traded in the period. */
  traders?: number | null;
  /** Selected period (controlled). */
  period?: string;
  defaultPeriod?: string;
  onPeriodChange?: (period: string) => void;
  periods?: AffiliatePeriodOption[];
  /** Points for the bar chart. Add `volume` to enable the Commission / Volume toggle. */
  chartData?: AffiliateChartPoint[];
  /** Shows "Referred by CODE". */
  referredBy?: string;
  hideBalances?: boolean;
  /** Rendered in the header next to the period picker. */
  trailing?: ReactNode;
  className?: string;
}

/** An affiliate's commission, referral volume, referees and traders for a period, with a commission chart. */
export function AffiliateSummary({
  title = "Summary",
  commission,
  commissionBreakdown,
  volume,
  volumeBreakdown,
  referees,
  refereesBreakdown,
  traders,
  period,
  defaultPeriod,
  onPeriodChange,
  periods = DEFAULT_AFFILIATE_PERIODS,
  chartData,
  referredBy,
  hideBalances,
  trailing,
  className,
}: AffiliateSummaryProps) {
  const [current, setCurrent] = useControllable(period, defaultPeriod ?? periods[1]?.value ?? periods[0]?.value ?? "", onPeriodChange);
  const [metric, setMetric] = useState<"commission" | "volume">("commission");
  const hasVolume = chartData?.some((d) => d.volume != null) ?? false;

  return (
    <section data-slot="affiliate-summary" className={cn("flex flex-col gap-4 rounded-2xl border border-border bg-container p-4 sm:p-5", className)}>
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-col">
          <h3 className="text-base font-semibold">{title}</h3>
          {referredBy && <span className="text-[11px] text-muted-foreground">Referred by {referredBy}</span>}
        </div>
        <div className="flex items-center gap-2">
          <Segmented label="Period" value={current} onChange={setCurrent} options={periods} />
          {trailing}
        </div>
      </header>

      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        <AffiliateStatCard label="Commission earned" value={commission} breakdown={commissionBreakdown} emphasis hidden={hideBalances} className="col-span-2 lg:col-span-1" />
        <AffiliateStatCard label="Referral volume" value={volume} breakdown={volumeBreakdown} className="col-span-2 sm:col-span-1" />
        <AffiliateStatCard label="Referees" value={referees} format="count" breakdown={refereesBreakdown} />
        <AffiliateStatCard label="Traders" value={traders} format="count" />
      </div>

      {chartData && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-muted-foreground">{metric === "volume" ? "Referral volume" : "Commission"} (USD)</span>
            {hasVolume && (
              <Segmented
                label="Chart metric"
                value={metric}
                onChange={(v) => setMetric(v as "commission" | "volume")}
                options={[
                  { value: "commission", label: "Commission" },
                  { value: "volume", label: "Volume" },
                ]}
              />
            )}
          </div>
          <CommissionChart data={chartData} metric={metric} />
        </div>
      )}
    </section>
  );
}

/* ------------------------------------------------------------ trader summary */

export interface TraderSummaryProps {
  /** The code you are bound to. */
  referrerCode?: string;
  /** Your fee rebate rate as a fraction. */
  rebateRate?: number | null;
  /** Rebates received in the period, in USD. */
  rebates?: number | null;
  /** Your trading volume in the period, in USD. */
  volume?: number | null;
  period?: string;
  defaultPeriod?: string;
  onPeriodChange?: (period: string) => void;
  periods?: AffiliatePeriodOption[];
  /** Rebates per day for the chart (uses the `commission` key). */
  chartData?: AffiliateChartPoint[];
  hideBalances?: boolean;
  className?: string;
}

/** The trader's (referee's) view: your referrer, rebate rate, rebates earned and trading volume. */
export function TraderSummary({
  referrerCode,
  rebateRate,
  rebates,
  volume,
  period,
  defaultPeriod,
  onPeriodChange,
  periods = DEFAULT_AFFILIATE_PERIODS,
  chartData,
  hideBalances,
  className,
}: TraderSummaryProps) {
  const [current, setCurrent] = useControllable(period, defaultPeriod ?? periods[1]?.value ?? periods[0]?.value ?? "", onPeriodChange);
  return (
    <section data-slot="trader-summary" className={cn("flex flex-col gap-4 rounded-2xl border border-border bg-container p-4 sm:p-5", className)}>
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold">Your referrer</h3>
          {referrerCode && <span className="rounded-full bg-container-high px-2.5 py-1 font-mono text-xs font-medium text-primary">{referrerCode}</span>}
        </div>
        <span className="flex items-baseline gap-1.5 text-xs text-muted-foreground">
          Rebate
          <Numeral value={rebateRate} rule="percent" className="text-lg font-semibold text-emerald-700 dark:text-emerald-400" />
        </span>
      </header>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-muted-foreground">Summary</span>
        <Segmented label="Period" value={current} onChange={setCurrent} options={periods} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <AffiliateStatCard label="Rebates (USD)" value={rebates} emphasis hidden={hideBalances} />
        <AffiliateStatCard label="Trading volume (USD)" value={volume} hidden={hideBalances} />
      </div>
      {chartData && <CommissionChart data={chartData} />}
    </section>
  );
}

/* ------------------------------------------------------------ onboarding */

export type AffiliateStep = { icon?: ComponentType<{ className?: string }>; title: ReactNode; description: ReactNode };

export const DEFAULT_AFFILIATE_STEPS: AffiliateStep[] = [
  { icon: FileTextIcon, title: "Trade or apply", description: "Unlock a referral code by trading, or apply for a higher rate." },
  { icon: Share2Icon, title: "Share", description: "Share your personal referral code or link with other traders." },
  { icon: CoinsIcon, title: "Earn", description: "Earn commission on their fees, or use a code to get rebates on your own trading." },
];

export interface AffiliateOnboardingProps {
  /** e.g. `Up to 60%`. */
  maxCommission?: ReactNode;
  /** Referee rebate headline, e.g. `10%`. */
  traderRebate?: ReactNode;
  /** Volume progress toward unlocking a code. Omit to hide. */
  requiredVolume?: number;
  completedVolume?: number;
  steps?: AffiliateStep[];
  onBecomeAffiliate?: () => void;
  onEnterCode?: () => void;
  className?: string;
}

/** The empty state before someone is an affiliate or trader: two role cards and the "How it works" steps. */
export function AffiliateOnboarding({
  maxCommission = "Up to 60%",
  traderRebate,
  requiredVolume,
  completedVolume = 0,
  steps = DEFAULT_AFFILIATE_STEPS,
  onBecomeAffiliate,
  onEnterCode,
  className,
}: AffiliateOnboardingProps) {
  const progress = requiredVolume ? Math.min(100, (completedVolume / requiredVolume) * 100) : 0;
  return (
    <section data-slot="affiliate-onboarding" className={cn("flex flex-col gap-4", className)}>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="flex flex-col justify-between gap-6 rounded-2xl bg-linear-to-br from-primary/16 to-primary/4 p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold">Referrer</h3>
              <p className="text-xs text-muted-foreground">Earn commission from your friends' trades. Want a higher rate? Apply to become an affiliate.</p>
            </div>
            <UsersRoundIcon className="size-10 shrink-0 text-primary/60" strokeWidth={1.5} />
          </div>
          <div className="flex items-end justify-between gap-3">
            <Button size="sm" onClick={onBecomeAffiliate}>
              Become an affiliate
              <ArrowRightIcon />
            </Button>
            <div className="flex flex-col items-end">
              <span className="text-lg font-semibold">{maxCommission}</span>
              <span className="text-[11px] text-muted-foreground">Commission</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-6 rounded-2xl bg-linear-to-br from-emerald-500/16 to-emerald-500/4 p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold">Referee (trader)</h3>
              <p className="text-xs text-muted-foreground">Get rebates on your trading fees by binding a referral code.</p>
            </div>
            <UserRoundIcon className="size-10 shrink-0 text-emerald-600/60 dark:text-emerald-400/60" strokeWidth={1.5} />
          </div>
          <div className="flex items-end justify-between gap-3">
            <Button size="sm" variant="tonal" onClick={onEnterCode}>
              Enter code
            </Button>
            {traderRebate != null && (
              <div className="flex flex-col items-end">
                <span className="text-lg font-semibold text-emerald-700 dark:text-emerald-400">{traderRebate}</span>
                <span className="text-[11px] text-muted-foreground">Fee rebate</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-container p-5">
        <h3 className="text-center text-sm font-semibold">How it works</h3>
        <ol className="flex flex-col gap-3 lg:flex-row lg:items-stretch">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <li key={i} className="flex flex-col gap-3 lg:flex-1 lg:flex-row lg:items-center">
                {i > 0 && <ArrowDownIcon aria-hidden className="mx-auto size-4 shrink-0 text-muted-foreground lg:mx-0 lg:-rotate-90" />}
                <div className="flex flex-1 items-start gap-3 lg:flex-col lg:items-center lg:text-center">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-container-high text-primary">
                    {Icon ? <Icon className="size-5" /> : <span className="font-mono text-sm font-semibold">{i + 1}</span>}
                  </span>
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="text-sm font-medium">{step.title}</span>
                    <span className="text-[11px] leading-relaxed text-muted-foreground">{step.description}</span>
                    {i === 0 && requiredVolume != null && (
                      <span className="mt-1.5 flex flex-col gap-1">
                        <Progress value={progress} aria-label="Volume progress" />
                        <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
                          {formatNumber(completedVolume, "usd", { dp: 0 })} of {formatNumber(requiredVolume, "usd", { dp: 0 })}
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
