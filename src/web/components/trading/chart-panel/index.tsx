import {
  ChartAreaIcon,
  ChartCandlestickIcon,
  ChartLineIcon,
  ChevronDownIcon,
  EyeIcon,
  Maximize2Icon,
  Minimize2Icon,
  Settings2Icon,
  SquareFunctionIcon,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { type CandlesType } from "@/components/trading/chart-panel/candles";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export { Candles, CandlestickSeries, type Candle, type CandlesProps, type CandlesType } from "@/components/trading/chart-panel/candles";

export type ChartInterval = { value: string; label: string };
export type ChartType = CandlesType;
export type ChartDisplayOption = { id: string; label: ReactNode };

export const DEFAULT_CHART_INTERVALS: ChartInterval[] = [
  { value: "1m", label: "1m" },
  { value: "5m", label: "5m" },
  { value: "15m", label: "15m" },
  { value: "1h", label: "1h" },
  { value: "4h", label: "4h" },
  { value: "1D", label: "1D" },
  { value: "1W", label: "1W" },
];

export const MORE_CHART_INTERVALS: ChartInterval[] = [
  { value: "3m", label: "3m" },
  { value: "30m", label: "30m" },
  { value: "2h", label: "2h" },
  { value: "6h", label: "6h" },
  { value: "12h", label: "12h" },
  { value: "3D", label: "3D" },
  { value: "1M", label: "1M" },
];

const CHART_TYPE_META: Record<ChartType, { label: string; icon: LucideIcon }> = {
  candles: { label: "Candles", icon: ChartCandlestickIcon },
  hollow: { label: "Hollow candles", icon: ChartCandlestickIcon },
  line: { label: "Line", icon: ChartLineIcon },
  area: { label: "Area", icon: ChartAreaIcon },
};

function useControllable<T>(value: T | undefined, defaultValue: T, onChange?: (value: T) => void) {
  const [inner, setInner] = useState(defaultValue);
  const current = value !== undefined ? value : inner;
  const set = (next: T) => {
    if (value === undefined) setInner(next);
    onChange?.(next);
  };
  return [current, set] as const;
}

function ToolButton({ label, onClick, active, children }: { label: string; onClick?: () => void; active?: boolean; children: ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={<button type="button" />}
        aria-label={label}
        aria-pressed={active}
        onClick={onClick}
        className={cn(
          "focus-ring grid size-7 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-container-high hover:text-foreground [&_svg]:size-4",
          active && "bg-container-high text-foreground",
        )}
      >
        {children}
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

const sep = <span aria-hidden="true" className="mx-1 h-4 w-px shrink-0 bg-border" />;

export interface ChartPanelProps {
  /** Your chart — TradingView, lightweight-charts, Recharts or the bundled `Candles`. */
  children?: ReactNode;

  interval?: string;
  defaultInterval?: string;
  onIntervalChange?: (interval: string) => void;
  /** Intervals shown inline. */
  intervals?: ChartInterval[];
  /** Intervals in the "more" menu. Pass `[]` to hide it. */
  moreIntervals?: ChartInterval[];

  chartType?: ChartType;
  defaultChartType?: ChartType;
  onChartTypeChange?: (type: ChartType) => void;
  /** Chart types offered. A single type hides the switch. */
  chartTypes?: ChartType[];

  /** Shows the indicators button. */
  onIndicatorsClick?: () => void;
  /** Shows the settings button. */
  onSettingsClick?: () => void;

  /** Overlay toggles — positions, orders, liquidation price… */
  displayOptions?: ChartDisplayOption[];
  display?: Record<string, boolean>;
  defaultDisplay?: Record<string, boolean>;
  onDisplayChange?: (display: Record<string, boolean>) => void;

  /** Expanded to fill the viewport. Uncontrolled, the panel goes `fixed inset-0`. */
  fullscreen?: boolean;
  defaultFullscreen?: boolean;
  onFullscreenChange?: (fullscreen: boolean) => void;
  /** Hide the fullscreen button. */
  hideFullscreen?: boolean;

  /** Rendered at the end of the toolbar. */
  toolbarEnd?: ReactNode;
  /** Shown when there are no children. */
  placeholder?: ReactNode;
  className?: string;
  bodyClassName?: string;
}

/** A chart frame: interval, chart-type, indicator and display toolbars around your charting library. */
export function ChartPanel({
  children,
  interval: intervalProp,
  defaultInterval,
  onIntervalChange,
  intervals = DEFAULT_CHART_INTERVALS,
  moreIntervals = MORE_CHART_INTERVALS,
  chartType: chartTypeProp,
  defaultChartType,
  onChartTypeChange,
  chartTypes = ["candles", "line"],
  onIndicatorsClick,
  onSettingsClick,
  displayOptions,
  display: displayProp,
  defaultDisplay,
  onDisplayChange,
  fullscreen: fullscreenProp,
  defaultFullscreen = false,
  onFullscreenChange,
  hideFullscreen,
  toolbarEnd,
  placeholder = "Mount your charting library here.",
  className,
  bodyClassName,
}: ChartPanelProps) {
  const [interval, setChartInterval] = useControllable(intervalProp, defaultInterval ?? intervals[2]?.value ?? intervals[0]?.value ?? "", onIntervalChange);
  const [chartType, setChartType] = useControllable<ChartType>(chartTypeProp, defaultChartType ?? chartTypes[0] ?? "candles", onChartTypeChange);
  const [display, setDisplay] = useControllable<Record<string, boolean>>(
    displayProp,
    defaultDisplay ?? Object.fromEntries((displayOptions ?? []).map((o) => [o.id, true])),
    onDisplayChange,
  );
  const [fullscreen, setFullscreen] = useControllable(fullscreenProp, defaultFullscreen, onFullscreenChange);

  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fullscreen, setFullscreen]);

  const moreActive = moreIntervals.find((i) => i.value === interval);

  return (
    <section
      data-slot="chart-panel"
      data-fullscreen={fullscreen || undefined}
      aria-label="Chart"
      className={cn(
        "flex min-h-72 flex-col overflow-hidden rounded-2xl bg-container",
        fullscreen && "fixed inset-0 z-50 min-h-0 rounded-none",
        className,
      )}
    >
      <div role="toolbar" aria-label="Chart controls" className="flex h-10 shrink-0 items-center gap-0.5 border-b border-border px-1.5">
        <div className="flex min-w-0 items-center gap-0.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div role="group" aria-label="Interval" className="flex items-center gap-0.5">
            {intervals.map((i) => {
              const on = i.value === interval;
              return (
                <button
                  key={i.value}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setChartInterval(i.value)}
                  className={cn(
                    "focus-ring h-7 shrink-0 rounded-md px-2 text-xs font-medium transition-colors",
                    on ? "bg-container-high text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {i.label}
                </button>
              );
            })}
          </div>
          {moreIntervals.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label="More intervals"
                className={cn(
                  "focus-ring flex h-7 shrink-0 items-center gap-0.5 rounded-md px-1.5 text-xs font-medium transition-colors data-popup-open:bg-container-high",
                  moreActive ? "bg-container-high text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {moreActive?.label}
                <ChevronDownIcon className="size-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-w-28">
                <DropdownMenuRadioGroup value={interval} onValueChange={(v) => setChartInterval(String(v))}>
                  {moreIntervals.map((i) => (
                    <DropdownMenuRadioItem key={i.value} value={i.value} className="h-8 text-xs">
                      {i.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {(chartTypes.length > 1 || onIndicatorsClick || displayOptions?.length || onSettingsClick) && sep}

          {chartTypes.length > 1 && (
            <div role="group" aria-label="Chart type" className="flex items-center gap-0.5">
              {chartTypes.map((t) => {
                const meta = CHART_TYPE_META[t];
                const Icon = meta.icon;
                const on = t === chartType;
                return (
                  <Tooltip key={t}>
                    <TooltipTrigger
                      render={<button type="button" />}
                      aria-pressed={on}
                      aria-label={meta.label}
                      onClick={() => setChartType(t)}
                      className={cn(
                        "focus-ring grid size-7 shrink-0 place-items-center rounded-md transition-colors [&_svg]:size-4",
                        on ? "bg-container-high text-foreground" : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <Icon strokeWidth={t === "hollow" ? 1.25 : 2} />
                    </TooltipTrigger>
                    <TooltipContent>{meta.label}</TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          )}

          {onIndicatorsClick && (
            <button
              type="button"
              onClick={onIndicatorsClick}
              className="focus-ring flex h-7 shrink-0 items-center gap-1 rounded-md px-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-container-high hover:text-foreground"
            >
              <SquareFunctionIcon className="size-4" />
              <span className="hidden sm:inline">Indicators</span>
              <span className="sr-only sm:hidden">Indicators</span>
            </button>
          )}

          {displayOptions && displayOptions.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label="Display on chart"
                className="focus-ring grid size-7 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-container-high hover:text-foreground data-popup-open:bg-container-high data-popup-open:text-foreground"
              >
                <EyeIcon className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-w-48">
                {displayOptions.map((o) => (
                  <DropdownMenuCheckboxItem
                    key={o.id}
                    checked={display[o.id] ?? false}
                    onCheckedChange={(checked) => setDisplay({ ...display, [o.id]: checked })}
                    closeOnClick={false}
                    className="h-8 text-xs"
                  >
                    {o.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {onSettingsClick && (
            <ToolButton label="Chart settings" onClick={onSettingsClick}>
              <Settings2Icon />
            </ToolButton>
          )}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-0.5 pl-1">
          {toolbarEnd}
          {!hideFullscreen && (
            <ToolButton label={fullscreen ? "Exit fullscreen" : "Fullscreen"} onClick={() => setFullscreen(!fullscreen)} active={fullscreen}>
              {fullscreen ? <Minimize2Icon /> : <Maximize2Icon />}
            </ToolButton>
          )}
        </div>
      </div>

      <div className={cn("relative min-h-0 flex-1 p-2", bodyClassName)}>
        {children ?? <div className="grid size-full min-h-60 place-items-center rounded-xl border border-dashed border-border text-xs text-muted-foreground">{placeholder}</div>}
      </div>
    </section>
  );
}
