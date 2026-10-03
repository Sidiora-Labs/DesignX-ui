import { Meter, MeterLabel, MeterValue } from "@/components/ui/meter";

export default function MeterDemo() {
  return (
    <div className="grid w-full max-w-sm gap-6">
      <Meter value={68}>
        <MeterLabel>Storage used</MeterLabel>
        <MeterValue className="ml-auto" />
      </Meter>
      <Meter value={24} indicatorClassName="bg-chart-2">
        <MeterLabel>CPU</MeterLabel>
        <MeterValue className="ml-auto" />
      </Meter>
      <Meter value={91} indicatorClassName="bg-destructive">
        <MeterLabel>Memory</MeterLabel>
        <MeterValue className="ml-auto" />
      </Meter>
    </div>
  );
}
