import { FundingFeeHistory, type FundingPayment } from "@/components/trading/funding-fee-history";

// Illustrative payments only — eight-hour funding on three open positions.
const T = Date.UTC(2026, 9, 22, 8, 0);
const interval = (n: number) => T - n * 8 * 3_600_000;

const PAYMENTS: FundingPayment[] = [
  { id: "f1", time: interval(0), symbol: "PERP_BTC_USDC", rate: 0.000125, positionSize: 0.4215, side: "long", payment: -3.5512, baseDp: 4 },
  { id: "f2", time: interval(0), symbol: "PERP_ETH_USDC", rate: 0.0001, positionSize: 6.8, side: "short", payment: 2.2729, baseDp: 3 },
  { id: "f3", time: interval(0), symbol: "PERP_SOL_USDC", rate: -0.000042, positionSize: 145, side: "long", payment: 0.931, baseDp: 2, status: "accrued" },
  { id: "f4", time: interval(1), symbol: "PERP_BTC_USDC", rate: 0.0001, positionSize: 0.4215, side: "long", payment: -2.8227, baseDp: 4 },
  { id: "f5", time: interval(1), symbol: "PERP_ETH_USDC", rate: 0.000085, positionSize: 6.8, side: "short", payment: 1.9187, baseDp: 3 },
  { id: "f6", time: interval(2), symbol: "PERP_BTC_USDC", rate: -0.00002, positionSize: 0.3, side: "long", payment: 0.3895, baseDp: 4 },
  { id: "f7", time: interval(2), symbol: "PERP_ETH_USDC", rate: 0.00011, positionSize: 6.8, side: "short", payment: 2.4602, baseDp: 3 },
];

export default function FundingFeeHistoryDemo() {
  return (
    <div className="w-full max-w-4xl">
      <FundingFeeHistory payments={PAYMENTS} />
    </div>
  );
}
