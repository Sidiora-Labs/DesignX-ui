import { TraderSummary } from "@/components/trading/affiliate-summary";

// Illustrative values only.
const REBATES = [4.2, 6.8, 3.1, 9.4, 12.6, 7.7, 5.2];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function AffiliateSummaryTraderDemo() {
  return (
    <div className="w-full max-w-md">
      <TraderSummary
        referrerCode="PAXEER42"
        rebateRate={0.1}
        rebates={49.0}
        volume={182_400}
        defaultPeriod="7d"
        chartData={REBATES.map((commission, i) => ({ label: DAYS[i], commission }))}
      />
    </div>
  );
}
