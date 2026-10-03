import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const config = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
  mobile: { label: "Mobile", color: "var(--chart-5)" },
} satisfies ChartConfig;

// Deterministic pseudo-random series so the chart is stable across renders.
const series = Array.from({ length: 90 }, (_, i) => {
  const d = new Date(2026, 6, 1);
  d.setDate(d.getDate() + i);
  const wave = Math.sin(i / 6) * 80 + Math.cos(i / 13) * 60;
  return {
    date: d.toISOString().slice(0, 10),
    desktop: Math.round(260 + wave + ((i * 37) % 90)),
    mobile: Math.round(170 + wave * 0.7 + ((i * 53) % 70)),
  };
});

export const ranges = { "90d": 90, "30d": 30, "7d": 7 } as const;
export type Range = keyof typeof ranges;

export function ChartArea({ range, onRangeChange }: { range: Range; onRangeChange: (r: Range) => void }) {
  const data = React.useMemo(() => series.slice(-ranges[range]), [range]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Total visitors</CardTitle>
        <CardDescription>Desktop and mobile, last {ranges[range]} days</CardDescription>
        <CardAction>
          <ToggleGroup size="sm" value={[range]} onValueChange={(v) => v[0] && onRangeChange(v[0] as Range)}>
            {(Object.keys(ranges) as Range[]).map((r) => (
              <ToggleGroupItem key={r} value={r} className="px-3">
                {r}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="aspect-auto h-64 w-full">
          <AreaChart data={data} margin={{ left: 4, right: 4 }}>
            <defs>
              {Object.keys(config).map((k) => (
                <linearGradient key={k} id={`dash-fill-${k}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={`var(--color-${k})`} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={`var(--color-${k})`} stopOpacity={0.02} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(v: string) => new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  labelFormatter={(v) => new Date(String(v)).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                />
              }
            />
            <Area dataKey="mobile" type="natural" stroke="var(--color-mobile)" strokeWidth={2} fill="url(#dash-fill-mobile)" stackId="a" />
            <Area dataKey="desktop" type="natural" stroke="var(--color-desktop)" strokeWidth={2} fill="url(#dash-fill-desktop)" stackId="a" />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
