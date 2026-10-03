import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

const data = [
  { day: "Mon", signups: 42, churn: 8 },
  { day: "Tue", signups: 58, churn: 12 },
  { day: "Wed", signups: 71, churn: 9 },
  { day: "Thu", signups: 64, churn: 14 },
  { day: "Fri", signups: 88, churn: 10 },
  { day: "Sat", signups: 39, churn: 6 },
  { day: "Sun", signups: 33, churn: 5 },
];

const config = {
  signups: { label: "Sign-ups", color: "var(--chart-2)" },
  churn: { label: "Churned", color: "var(--chart-4)" },
} satisfies ChartConfig;

export default function ChartBar() {
  return (
    <ChartContainer config={config} className="aspect-auto h-60 w-full max-w-xl">
      <BarChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Bar dataKey="signups" fill="var(--color-signups)" radius={6} />
        <Bar dataKey="churn" fill="var(--color-churn)" radius={6} />
      </BarChart>
    </ChartContainer>
  );
}
