import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";

import { NumberFlow } from "@/components/dx/number-flow";
import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

type Kpi = { label: string; value: number; prefix?: string; suffix?: string; delta: number; note: string; format?: Intl.NumberFormatOptions };

const int = { maximumFractionDigits: 0 };
const one = { maximumFractionDigits: 1 };

export function SectionCards({ scale }: { scale: number }) {
  const kpis: Kpi[] = [
    { label: "Total revenue", value: 1250 * scale, prefix: "$", delta: 12.5, note: "Trending up this period", format: int },
    { label: "New customers", value: 1234 * scale * 0.08, delta: -20, note: "Acquisition needs attention", format: int },
    { label: "Active accounts", value: 45678 * Math.min(scale, 3) * 0.33, delta: 12.5, note: "Strong user retention", format: int },
    { label: "Growth rate", value: 4.5 + scale * 0.2, suffix: "%", delta: 4.5, note: "Meets growth projections", format: one },
  ];
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((k) => {
        const up = k.delta >= 0;
        return (
          <Card key={k.label} variant="tonal" className="gap-3">
            <CardHeader>
              <CardDescription>{k.label}</CardDescription>
              <CardTitle className="text-3xl font-normal tracking-[-0.02em]">
                <NumberFlow value={k.value} prefix={k.prefix} suffix={k.suffix} format={k.format} />
              </CardTitle>
              <CardAction>
                <Badge variant={up ? "success" : "destructive"}>
                  {up ? <TrendingUpIcon /> : <TrendingDownIcon />}
                  {up ? "+" : ""}
                  {k.delta}%
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="text-[13px] text-muted-foreground">{k.note}</CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
