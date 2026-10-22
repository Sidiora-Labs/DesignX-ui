import { AffiliateSummary, type AffiliateChartPoint } from "@/components/trading/affiliate-summary";

// Illustrative values only. Pull these from your affiliate statistics API per period.
const COMMISSION = [212, 248, 196, 305, 412, 386, 298, 344, 471, 520, 438, 402, 515, 588];
const VOLUME = [0.71, 0.82, 0.64, 1.02, 1.38, 1.29, 0.99, 1.15, 1.57, 1.73, 1.46, 1.34, 1.72, 1.96];
const CHART: AffiliateChartPoint[] = COMMISSION.map((commission, i) => ({
  label: `Oct ${i + 8}`,
  commission,
  volume: VOLUME[i] * 1_000_000,
}));

export default function AffiliateSummaryDemo() {
  return (
    <div className="w-full max-w-4xl">
      <AffiliateSummary
        commission={5_335.42}
        commissionBreakdown={{ direct: 4_612.1, indirect: 723.32 }}
        volume={17_780_000}
        volumeBreakdown={{ direct: 14_210_000, indirect: 3_570_000 }}
        referees={248}
        refereesBreakdown={{ direct: 196, indirect: 52 }}
        traders={131}
        defaultPeriod="30d"
        chartData={CHART}
        referredBy="ALPHA7"
      />
    </div>
  );
}
