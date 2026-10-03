import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

const data = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 273, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "Jun", desktop: 314, mobile: 240 },
];

const config = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
  mobile: { label: "Mobile", color: "var(--chart-5)" },
} satisfies ChartConfig;

export default function ChartDemo() {
  return (
    <ChartContainer config={config} className="aspect-auto h-64 w-full max-w-xl">
      <AreaChart data={data} margin={{ left: 8, right: 8 }}>
        <defs>
          {Object.keys(config).map((k) => (
            <linearGradient key={k} id={`fill-${k}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={`var(--color-${k})`} stopOpacity={0.35} />
              <stop offset="100%" stopColor={`var(--color-${k})`} stopOpacity={0.02} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
        <Area dataKey="mobile" type="natural" stroke="var(--color-mobile)" strokeWidth={2} fill="url(#fill-mobile)" stackId="a" />
        <Area dataKey="desktop" type="natural" stroke="var(--color-desktop)" strokeWidth={2} fill="url(#fill-desktop)" stackId="a" />
        <ChartLegend content={<ChartLegendContent />} />
      </AreaChart>
    </ChartContainer>
  );
}
