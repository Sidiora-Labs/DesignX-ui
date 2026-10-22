import { FeeTier, type FeeTierRow } from "@/components/trading/fee-tier";

// Illustrative fee schedule only. Your exchange publishes the real tiers.
const TIERS: FeeTierRow[] = [
  { tier: 1, minVolume: 0, maxVolume: 500_000, makerFee: 0.00025, takerFee: 0.0004 },
  { tier: 2, minVolume: 500_000, maxVolume: 1_000_000, makerFee: 0.0002, takerFee: 0.00035 },
  { tier: 3, minVolume: 1_000_000, maxVolume: 5_000_000, makerFee: 0.00018, takerFee: 0.0003 },
  { tier: 4, minVolume: 5_000_000, maxVolume: 20_000_000, makerFee: 0.00012, takerFee: 0.00025 },
  { tier: 5, minVolume: 20_000_000, maxVolume: 50_000_000, makerFee: 0.00009, takerFee: 0.00022 },
  { tier: 6, minVolume: 50_000_000, maxVolume: 100_000_000, makerFee: 0.00005, takerFee: 0.00018 },
  { tier: 7, minVolume: 100_000_000, makerFee: 0, takerFee: 0.00015 },
];

export default function FeeTierDemo() {
  return (
    <div className="w-full max-w-3xl">
      <FeeTier tiers={TIERS} volume30d={6_912_450} />
    </div>
  );
}
