import { useId, useState, type PointerEvent } from "react";

import { formatNumber } from "@/lib/trading";
import { cn } from "@/lib/utils";

export type Candle = {
  /** Unix ms of the candle open. */
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
};

export type CandlesType = "candles" | "hollow" | "line" | "area";

export interface CandlesProps {
  /** Oldest first. */
  data: readonly Candle[];
  type?: CandlesType;
  /** Volume bars along the bottom. */
  showVolume?: boolean;
  /** Price axis on the right. */
  showAxis?: boolean;
  /** Time labels along the bottom. */
  showTime?: boolean;
  /** Dashed last-price line with a tag on the axis. */
  showLastPrice?: boolean;
  /** OHLC legend in the top-left corner; follows the pointer. */
  showLegend?: boolean;
  /** Price increment for labels. */
  tick?: number;
  formatPrice?: (value: number) => string;
  formatTime?: (time: number) => string;
  /** Accessible summary. */
  label?: string;
  className?: string;
}

const UP = "text-emerald-600 dark:text-emerald-400";
const DOWN = "text-rose-600 dark:text-rose-400";
const PRICE_H = 100;

const timeFormat = new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
const dayFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

/**
 * A static SVG candlestick / line renderer — enough to preview a chart without a charting library.
 * Scales to its container through the viewBox; no data fetching, no timers.
 */
export function Candles({
  data,
  type = "candles",
  showVolume = true,
  showAxis = true,
  showTime = true,
  showLastPrice = true,
  showLegend = true,
  tick,
  formatPrice = (v) => formatNumber(v, "price", { tick }),
  formatTime,
  label = "Price chart",
  className,
}: CandlesProps) {
  const gradientId = `candles-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [hover, setHover] = useState<number | null>(null);
  const n = data.length;

  if (n === 0)
    return (
      <div className={cn("grid size-full place-items-center text-xs text-muted-foreground", className)} role="img" aria-label={label}>
        No data
      </div>
    );

  let lo = Infinity;
  let hi = -Infinity;
  let maxVol = 0;
  for (const c of data) {
    lo = Math.min(lo, c.low);
    hi = Math.max(hi, c.high);
    maxVol = Math.max(maxVol, c.volume ?? 0);
  }
  const pad = (hi - lo || hi || 1) * 0.08;
  lo -= pad;
  hi += pad;
  const vol = showVolume && maxVol > 0;
  const y = (v: number) => ((hi - v) / (hi - lo)) * PRICE_H;
  const priceFrac = vol ? 0.78 : 1;
  const pct = (v: number) => `${(y(v) / PRICE_H) * priceFrac * 100}%`;

  const span = n > 1 ? data[n - 1].time - data[0].time : 0;
  const fmtTime = formatTime ?? ((t: number) => (span > 2 * 86_400_000 ? dayFormat.format(t) : timeFormat.format(t)));
  const levels = Array.from({ length: 5 }, (_, i) => lo + ((hi - lo) * (i + 0.5)) / 5);
  const timeIdx = n > 1 ? Array.from({ length: 5 }, (_, i) => Math.round(((n - 1) * (i + 0.5)) / 5)) : [0];

  const last = data[n - 1];
  const shown = data[hover ?? n - 1];
  const shownUp = shown.close >= shown.open;
  const lastUp = last.close >= (n > 1 ? data[n - 2].close : last.open);

  const linePoints = data.map((c, i) => `${i + 0.5},${y(c.close)}`).join(" ");

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const i = Math.floor(((e.clientX - rect.left) / rect.width) * n);
    setHover(i >= 0 && i < n ? i : null);
  };

  return (
    <div
      data-slot="candles"
      className={cn("relative flex size-full min-h-40 flex-col font-mono text-[10px] text-muted-foreground tabular-nums select-none", className)}
    >
      <div className="relative flex min-h-0 flex-1">
        {/* plot */}
        {/* oxlint-disable-next-line jsx-a11y/no-static-element-interactions -- pointer legend only; the chart is an image */}
        <div className="relative min-w-0 flex-1" onPointerMove={onMove} onPointerLeave={() => setHover(null)}>
          {/* grid */}
          {levels.map((v) => (
            <div key={v} aria-hidden="true" className="absolute inset-x-0 border-t border-border/50" style={{ top: pct(v) }} />
          ))}
          <svg
            role="img"
            aria-label={`${label}: ${n} candles, last ${formatPrice(last.close)}`}
            viewBox={`0 0 ${n} ${PRICE_H}`}
            preserveAspectRatio="none"
            className={cn("absolute inset-x-0 top-0 h-full w-full overflow-visible", vol && "h-[78%]")}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.28" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
              </linearGradient>
            </defs>
            {hover != null && (
              <rect x={hover} y={0} width={1} height={PRICE_H} className="fill-foreground/5" />
            )}
            {type === "line" || type === "area" ? (
              <g className="text-primary">
                {type === "area" && (
                  <polygon points={`0.5,${PRICE_H} ${linePoints} ${n - 0.5},${PRICE_H}`} fill={`url(#${gradientId})`} />
                )}
                <polyline points={linePoints} fill="none" stroke="currentColor" strokeWidth={1.5} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
              </g>
            ) : (
              data.map((c, i) => {
                const up = c.close >= c.open;
                const top = y(Math.max(c.open, c.close));
                const h = Math.max(Math.abs(y(c.open) - y(c.close)), 0.25);
                const hollow = type === "hollow" && up;
                return (
                  <g key={c.time} className={up ? UP : DOWN}>
                    <line x1={i + 0.5} x2={i + 0.5} y1={y(c.high)} y2={y(c.low)} stroke="currentColor" strokeWidth={1} vectorEffect="non-scaling-stroke" />
                    <rect
                      x={i + 0.18}
                      y={top}
                      width={0.64}
                      height={h}
                      fill={hollow ? "var(--color-background)" : "currentColor"}
                      stroke={hollow ? "currentColor" : "none"}
                      strokeWidth={1}
                      vectorEffect="non-scaling-stroke"
                    />
                  </g>
                );
              })
            )}
            {showLastPrice && (
              <line
                x1={0}
                x2={n}
                y1={y(last.close)}
                y2={y(last.close)}
                stroke="currentColor"
                strokeDasharray="3 3"
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
                className={lastUp ? UP : DOWN}
              />
            )}
          </svg>
          {vol && (
            <svg aria-hidden="true" viewBox={`0 0 ${n} 100`} preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-[18%] w-full">
              {data.map((c, i) => (
                <rect
                  key={c.time}
                  x={i + 0.18}
                  width={0.64}
                  y={100 - ((c.volume ?? 0) / maxVol) * 100}
                  height={((c.volume ?? 0) / maxVol) * 100}
                  fill="currentColor"
                  className={cn(c.close >= c.open ? UP : DOWN, "opacity-35")}
                />
              ))}
            </svg>
          )}
          {showLegend && (
            <div aria-hidden="true" className="pointer-events-none absolute top-1.5 left-2 flex flex-wrap gap-x-2 gap-y-0.5 rounded-md bg-background/70 px-1.5 py-0.5 backdrop-blur-sm">
              {(["open", "high", "low", "close"] as const).map((k) => (
                <span key={k}>
                  {k[0].toUpperCase()} <span className={shownUp ? UP : DOWN}>{formatPrice(shown[k])}</span>
                </span>
              ))}
              {shown.volume != null && (
                <span>
                  V <span className="text-foreground/80">{formatNumber(shown.volume, "compact")}</span>
                </span>
              )}
            </div>
          )}
        </div>

        {/* price axis */}
        {showAxis && (
          <div aria-hidden="true" className="relative w-16 shrink-0 border-l border-border/50">
            <div className="absolute inset-0">
              {levels.map((v) => (
                <span key={v} className="absolute right-1.5 -translate-y-1/2" style={{ top: pct(v) }}>
                  {formatPrice(v)}
                </span>
              ))}
              {showLastPrice && (
                <span
                  className={cn(
                    "absolute inset-x-1 -translate-y-1/2 rounded-sm px-1 py-0.5 text-center text-white",
                    lastUp ? "bg-emerald-600 dark:bg-emerald-500" : "bg-rose-600 dark:bg-rose-500",
                  )}
                  style={{ top: pct(last.close) }}
                >
                  {formatPrice(last.close)}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* time axis */}
      {showTime && (
        <div aria-hidden="true" className={cn("relative h-5 shrink-0 border-t border-border/50", showAxis && "mr-16")}>
          {timeIdx.map((i) => (
            <span key={i} className="absolute top-1 -translate-x-1/2 whitespace-nowrap" style={{ left: `${((i + 0.5) / n) * 100}%` }}>
              {fmtTime(data[i].time)}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/** Alias of `Candles`. */
export const CandlestickSeries = Candles;
