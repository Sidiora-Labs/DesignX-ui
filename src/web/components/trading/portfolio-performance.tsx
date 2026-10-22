import { useId, useState, type ReactNode } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ReferenceLine, XAxis, YAxis } from "recharts";

import { Numeral } from "@/components/trading/numeral";
import { TokenIcon } from "@/components/trading/token-icon";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatCompact, formatNumber, formatUsd } from "@/lib/trading";
import { cn } from "@/lib/utils";

function useControllable<T>(value: T | undefined, defaultValue: T, onChange?: (next: T) => void) {
  const [inner, setInner] = useState(defaultValue);
  const current = value !== undefined ? value : inner;
  const set = (next: T) => {
    if (value === undefined) setInner(next);
    onChange?.(next);
  };
  return [current, set] as const;
}

export type PerformancePoint = {
  /** Day of the point — a timestamp, Date or preformatted label. */
  date: number | string | Date;
  /** Account value at the end of the day. */
  accountValue?: number;
  /** PnL for the day. */
  pnl?: number;
  /** Running PnL. Defaults to the running sum of `pnl`. */
  cumulativePnl?: number;
};

export type DistributionSlice = { token: string; value: number; iconSrc?: string };

export type PerformanceChart = "accountValue" | "dailyPnl" | "cumulativePnl";

export type PerformanceRange = { value: string; label: string };

export interface PortfolioPerformanceProps {
  data: PerformancePoint[];
  /** Period ROI as a fraction. */
  roi?: number | null;
  /** Period PnL. */
  pnl?: number | null;
  /** Period volume. */
  volume?: number | null;
  /** Shown next to the volume label, e.g. "Updated 02:15 UTC". */
  volumeNote?: ReactNode;
  ranges?: PerformanceRange[];
  range?: string;
  defaultRange?: string;
  onRangeChange?: (range: string) => void;
  chart?: PerformanceChart;
  defaultChart?: PerformanceChart;
  onChartChange?: (chart: PerformanceChart) => void;
  /** Holdings by token for the distribution donut. Omit to hide it. Slices past the fifth fold into "Other". */
  distribution?: DistributionSlice[];
  title?: ReactNode;
  unit?: string;
  /** Mask values and axes. */
  hideBalances?: boolean;
  loading?: boolean;
  formatDate?: (date: PerformancePoint["date"]) => string;
  className?: string;
}

const DEFAULT_RANGES: PerformanceRange[] = [
  { value: "7D", label: "7D" },
  { value: "30D", label: "30D" },
  { value: "90D", label: "90D" },
];

const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
const defaultFormatDate = (d: PerformancePoint["date"]) => (typeof d === "string" ? d : dateFormatter.format(d));

const UP = { light: "#047857", dark: "#34d399" };
const DOWN = { light: "#e11d48", dark: "#fb7185" };

const chartConfig = {
  accountValue: { label: "Account value", color: "var(--chart-1)" },
  pnl: { label: "Daily PnL" },
  cumulativePnl: { label: "Cumulative PnL" },
  up: { label: "Profit", theme: UP },
  down: { label: "Loss", theme: DOWN },
} satisfies ChartConfig;

const money = (v: unknown) => (typeof v === "number" ? formatNumber(v, "number", { dp: 2 }) : String(v));
const signed = (v: unknown) => (typeof v === "number" ? formatNumber(v, "number", { dp: 2, sign: true }) : String(v));

type TooltipItem = { color?: string; payload?: Record<string, unknown> };

function seriesFormatter(fmt: (v: unknown) => string, unit: string) {
  return function SeriesRow(value: unknown, name: unknown, item: TooltipItem) {
    return (
      <div className="flex flex-1 items-center justify-between gap-4 leading-none">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <span className="size-2 rounded-[2px]" style={{ background: (item.payload?.fill as string) ?? item.color }} />
          {chartConfig[name as keyof typeof chartConfig]?.label ?? String(name)}
        </span>
        <span className="font-mono font-medium text-foreground tabular-nums">
          {fmt(value)} {unit}
        </span>
      </div>
    );
  };
}

function sliceFormatter(hidden: boolean | undefined) {
  return function SliceRow(value: unknown, _name: unknown, item: TooltipItem) {
    return (
      <div className="flex flex-1 items-center justify-between gap-4 leading-none">
        <span className="text-muted-foreground">{String(item.payload?.token ?? "")}</span>
        <span className="font-mono font-medium text-foreground tabular-nums">{hidden ? "*****" : formatUsd(Number(value))}</span>
      </div>
    );
  };
}

type ChartRow = { label: string; accountValue?: number; pnl: number; runningPnl: number; cumulativePnl: number; fill: string };

const SLICE_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

function StatTile({ label, hint, aside, children }: { label: ReactNode; hint?: ReactNode; aside?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-1 rounded-xl bg-container-high px-3 py-2.5">
      <div className="flex items-center justify-between gap-2">
        {hint ? (
          <Tooltip>
            <TooltipTrigger
              render={<button type="button" />}
              className="cursor-help truncate border-b border-dashed border-border text-[11px] text-muted-foreground"
            >
              {label}
            </TooltipTrigger>
            <TooltipContent className="max-w-64 text-xs leading-normal">{hint}</TooltipContent>
          </Tooltip>
        ) : (
          <span className="truncate text-[11px] text-muted-foreground">{label}</span>
        )}
        {aside && <span className="hidden text-[10px] whitespace-nowrap text-muted-foreground sm:inline">{aside}</span>}
      </div>
      <div className="truncate text-base font-semibold">{children}</div>
    </div>
  );
}

/** Account value and PnL over time, with range tabs, headline stats and an asset distribution donut. */
export function PortfolioPerformance({
  data,
  roi,
  pnl,
  volume,
  volumeNote,
  ranges = DEFAULT_RANGES,
  range,
  defaultRange,
  onRangeChange,
  chart,
  defaultChart = "accountValue",
  onChartChange,
  distribution,
  title = "Performance",
  unit = "USDC",
  hideBalances,
  loading,
  formatDate = defaultFormatDate,
  className,
}: PortfolioPerformanceProps) {
  const [activeRange, setRange] = useControllable(range, defaultRange ?? ranges[0]?.value ?? "", onRangeChange);
  const [activeChart, setChart] = useControllable(chart, defaultChart, onChartChange);
  const gradientId = useId().replace(/:/g, "");
  const period = ranges.find((r) => r.value === activeRange)?.label ?? activeRange;

  const rows = data.reduce<ChartRow[]>((acc, p) => {
    const daily = p.pnl ?? 0;
    const running = (acc.at(-1)?.runningPnl ?? 0) + daily;
    acc.push({
      label: formatDate(p.date),
      accountValue: p.accountValue,
      pnl: daily,
      runningPnl: running,
      cumulativePnl: p.cumulativePnl ?? running,
      fill: daily >= 0 ? "var(--color-up)" : "var(--color-down)",
    });
    return acc;
  }, []);
  const lastCumulative = rows.at(-1)?.cumulativePnl ?? 0;
  const cumulativeColor = lastCumulative >= 0 ? "var(--color-up)" : "var(--color-down)";

  const tooltip = (fmt: (v: unknown) => string) => (
    <ChartTooltip
      cursor={activeChart === "dailyPnl" ? { fill: "var(--container-high)" } : true}
      content={
        <ChartTooltipContent
          formatter={seriesFormatter(fmt, unit)}
        />
      }
    />
  );

  const xAxis = <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} minTickGap={24} />;
  const yAxis = (
    <YAxis
      hide={hideBalances}
      width={48}
      tickLine={false}
      axisLine={false}
      tickFormatter={(v: number) => formatCompact(v, 1)}
      domain={activeChart === "accountValue" ? ["auto", "auto"] : undefined}
    />
  );

  let slices: DistributionSlice[] = [];
  if (distribution?.length) {
    const sorted = distribution.toSorted((a, b) => b.value - a.value);
    slices = sorted.length > 5 ? [...sorted.slice(0, 4), { token: "Other", value: sorted.slice(4).reduce((s, x) => s + x.value, 0) }] : sorted;
  }
  const sliceTotal = slices.reduce((s, x) => s + x.value, 0);

  return (
    <section data-slot="portfolio-performance" aria-label="Portfolio performance" className={cn("flex w-full flex-col gap-4 rounded-2xl border border-border bg-container p-4", className)}>
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-medium">{title}</h3>
        <ToggleGroup
          size="sm"
          aria-label="Period"
          value={[activeRange]}
          onValueChange={(v) => {
            if (v[0] != null) setRange(String(v[0]));
          }}
        >
          {ranges.map((r) => (
            <ToggleGroupItem key={r.value} value={r.value} className="px-3 text-xs">
              {r.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </header>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <StatTile label={`${period} ROI`} hint="ROI = PnL / (Start account value + Total deposits + Total transfers in)">
          <Numeral value={roi} rule="percent" coloring showSign hidden={hideBalances} />
        </StatTile>
        <StatTile
          label={`${period} PnL`}
          hint="PnL = Current account value − Start account value − Total deposits + Total withdrawals − Total transfers in + Total transfers out"
        >
          <Numeral value={pnl} coloring showSign hidden={hideBalances} unit={unit} unitClassName="text-xs" />
        </StatTile>
        <StatTile label={`${period} volume`} hint="Trading volume over the selected period." aside={volumeNote}>
          <Numeral value={volume} rule="usd" hidden={hideBalances} />
        </StatTile>
      </div>

      <div className={cn("grid grid-cols-1 gap-4", slices.length > 0 && "lg:grid-cols-[minmax(0,1fr)_240px]")}>
        <Tabs value={activeChart} onValueChange={(v) => setChart(v as PerformanceChart)} className="min-w-0 gap-3">
          <TabsList variant="line" className="max-w-full overflow-x-auto">
            <TabsTrigger value="accountValue">Account value</TabsTrigger>
            <TabsTrigger value="dailyPnl">Daily PnL</TabsTrigger>
            <TabsTrigger value="cumulativePnl">Cumulative PnL</TabsTrigger>
          </TabsList>
          {loading ? (
            <Skeleton className="h-56 w-full rounded-xl" />
          ) : rows.length < 2 ? (
            <div className="grid h-56 place-items-center rounded-xl border border-dashed border-border text-xs text-muted-foreground">Not enough data for this period yet.</div>
          ) : (
            <ChartContainer config={chartConfig} className="aspect-auto h-56 w-full">
              {activeChart === "dailyPnl" ? (
                <BarChart data={rows} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
                  <CartesianGrid vertical={false} />
                  {xAxis}
                  {yAxis}
                  <ReferenceLine y={0} stroke="var(--border)" />
                  {!hideBalances && tooltip(signed)}
                  <Bar dataKey="pnl" radius={4} maxBarSize={24}>
                    {rows.map((r, i) => (
                      <Cell key={i} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              ) : (
                <AreaChart data={rows} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id={`pp-${gradientId}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={activeChart === "accountValue" ? "var(--color-accountValue)" : cumulativeColor} stopOpacity={0.28} />
                      <stop offset="100%" stopColor={activeChart === "accountValue" ? "var(--color-accountValue)" : cumulativeColor} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} />
                  {xAxis}
                  {yAxis}
                  {activeChart === "cumulativePnl" && <ReferenceLine y={0} stroke="var(--border)" strokeDasharray="3 3" />}
                  {!hideBalances && tooltip(activeChart === "accountValue" ? money : signed)}
                  <Area
                    type="monotone"
                    dataKey={activeChart}
                    stroke={activeChart === "accountValue" ? "var(--color-accountValue)" : cumulativeColor}
                    strokeWidth={2}
                    fill={`url(#pp-${gradientId})`}
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--background)" }}
                  />
                </AreaChart>
              )}
            </ChartContainer>
          )}
        </Tabs>

        {slices.length > 0 && (
          <div className="flex flex-col gap-3 rounded-xl bg-container-high p-3">
            <span className="text-xs font-medium">Asset distribution</span>
            <div className="flex items-center gap-4 lg:flex-col lg:items-stretch">
              <ChartContainer config={{}} className="aspect-square h-32 shrink-0 lg:mx-auto">
                <PieChart>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        hideLabel
                        formatter={sliceFormatter(hideBalances)}
                      />
                    }
                  />
                  <Pie data={slices} dataKey="value" nameKey="token" innerRadius="62%" outerRadius="100%" paddingAngle={2} stroke="var(--container-high)" strokeWidth={2} isAnimationActive={false}>
                    {slices.map((s, i) => (
                      <Cell key={s.token} fill={SLICE_COLORS[i % SLICE_COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
              <ul className="flex min-w-0 flex-1 flex-col gap-1.5">
                {slices.map((s, i) => (
                  <li key={s.token} className="flex items-center gap-2 text-xs">
                    <span className="size-2 shrink-0 rounded-[2px]" style={{ background: SLICE_COLORS[i % SLICE_COLORS.length] }} />
                    {s.token === "Other" ? <span className="flex-1">Other</span> : (
                      <span className="flex flex-1 items-center gap-1.5">
                        <TokenIcon symbol={s.token} src={s.iconSrc} size="2xs" />
                        {s.token}
                      </span>
                    )}
                    <span className="font-mono text-muted-foreground tabular-nums">
                      {sliceTotal > 0 ? formatNumber(s.value / sliceTotal, "percent", { dp: 1 }) : "—"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
