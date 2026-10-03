import * as React from "react";
import * as RechartsPrimitive from "recharts";

import { cn } from "@/lib/utils";

const THEMES = { light: "", dark: ".dark" } as const;

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & ({ color?: string; theme?: never } | { color?: never; theme: Record<keyof typeof THEMES, string> });
};

type ChartContextProps = { config: ChartConfig };
const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const ctx = React.useContext(ChartContext);
  if (!ctx) throw new Error("useChart must be used within a <ChartContainer />");
  return ctx;
}

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig;
  children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"];
}) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;
  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "flex aspect-video justify-center text-xs",
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-outline-variant [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border",
          "[&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-container [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-container",
          "[&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden",
          className,
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
  const colorConfig = Object.entries(config).filter(([, c]) => c.theme || c.color);
  if (!colorConfig.length) return null;
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, item]) => {
    const color = item.theme?.[theme as keyof typeof item.theme] || item.color;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .join("\n")}
}`,
          )
          .join("\n"),
      }}
    />
  );
}

const ChartTooltip = RechartsPrimitive.Tooltip;

type TooltipPayloadItem = {
  name?: string | number;
  value?: number | string | Array<number | string>;
  dataKey?: string | number;
  color?: string;
  fill?: string;
  payload?: Record<string, unknown>;
};

function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  formatter,
  nameKey,
  labelKey,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: React.ReactNode;
  className?: string;
  indicator?: "line" | "dot" | "dashed";
  hideLabel?: boolean;
  hideIndicator?: boolean;
  labelFormatter?: (label: React.ReactNode, payload: TooltipPayloadItem[]) => React.ReactNode;
  formatter?: (value: TooltipPayloadItem["value"], name: TooltipPayloadItem["name"], item: TooltipPayloadItem) => React.ReactNode;
  nameKey?: string;
  labelKey?: string;
}) {
  const { config } = useChart();

  if (!active || !payload?.length) return null;

  const first = payload[0];
  const labelCfg = getPayloadConfigFromPayload(config, first, labelKey || String(first.dataKey || first.name || "value"));
  const labelValue = !labelKey && typeof label === "string" ? config[label]?.label || label : labelCfg?.label;
  const tooltipLabel = hideLabel ? null : (
    <div className="font-medium">{labelFormatter ? labelFormatter(label, payload) : (labelValue as React.ReactNode)}</div>
  );

  return (
    <div className={cn("grid min-w-36 gap-1.5 rounded-md border border-outline-variant bg-popover px-3 py-2 text-xs shadow-float", className)}>
      {tooltipLabel}
      <div className="grid gap-1.5">
        {payload.map((item, i) => {
          const key = `${nameKey || item.name || item.dataKey || "value"}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);
          const indicatorColor = (item.payload?.fill as string) || item.color;
          return (
            <div key={i} className="flex w-full items-center gap-2">
              {!hideIndicator && (
                <div
                  className={cn("shrink-0 rounded-[2px]", {
                    "size-2.5": indicator === "dot",
                    "h-3 w-1": indicator === "line",
                    "h-3 w-0 border-[1.5px] border-dashed bg-transparent": indicator === "dashed",
                  })}
                  style={{ backgroundColor: indicator === "dashed" ? undefined : indicatorColor, borderColor: indicatorColor }}
                />
              )}
              {formatter && item.value !== undefined && item.name ? (
                formatter(item.value, item.name, item)
              ) : (
                <div className="flex flex-1 items-center justify-between gap-4 leading-none">
                  <span className="text-muted-foreground">{itemConfig?.label || item.name}</span>
                  {item.value !== undefined && (
                    <span className="font-mono font-medium text-foreground tabular-nums">
                      {typeof item.value === "number" ? item.value.toLocaleString() : String(item.value)}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const ChartLegend = RechartsPrimitive.Legend;

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey,
}: {
  className?: string;
  hideIcon?: boolean;
  payload?: Array<{ value?: string; dataKey?: string | number; color?: string }>;
  verticalAlign?: "top" | "bottom" | "middle";
  nameKey?: string;
}) {
  const { config } = useChart();
  if (!payload?.length) return null;
  return (
    <div className={cn("flex items-center justify-center gap-4", verticalAlign === "top" ? "pb-3" : "pt-3", className)}>
      {payload.map((item) => {
        const key = `${nameKey || item.dataKey || "value"}`;
        const itemConfig = config[key];
        return (
          <div key={String(item.value)} className="flex items-center gap-1.5 [&>svg]:size-3 [&>svg]:text-muted-foreground">
            {itemConfig?.icon && !hideIcon ? <itemConfig.icon /> : <div className="size-2 shrink-0 rounded-[2px]" style={{ backgroundColor: item.color }} />}
            <span className="text-muted-foreground">{itemConfig?.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function getPayloadConfigFromPayload(config: ChartConfig, payload: unknown, key: string) {
  if (typeof payload !== "object" || payload === null) return undefined;
  const p = payload as Record<string, unknown>;
  const inner = (p.payload && typeof p.payload === "object" ? p.payload : undefined) as Record<string, unknown> | undefined;
  let labelKey = key;
  if (key in p && typeof p[key] === "string") labelKey = p[key] as string;
  else if (inner && key in inner && typeof inner[key] === "string") labelKey = inner[key] as string;
  return labelKey in config ? config[labelKey] : config[key];
}

export { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartStyle };
