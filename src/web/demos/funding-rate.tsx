import { FundingRate } from "@/components/trading/funding-rate";

// Illustrative values only. Feed these from your funding data and position stream.
const NEXT_FUNDING = Date.now() + 2 * 3_600_000 + 14 * 60_000 + 38_000;

export default function FundingRateDemo() {
  return (
    <div className="flex w-full max-w-md items-center justify-between gap-6 rounded-xl bg-container px-4 py-3">
      <FundingRate
        rate={0.000125}
        nextFundingTime={NEXT_FUNDING}
        intervalHours={8}
        lastRate={0.0001}
        capRate={0.0075}
        floorRate={-0.0075}
        positionSize={0.42}
        markPrice={67408.2}
      />
      <FundingRate
        label="ETH funding"
        rate={-0.000042}
        nextFundingTime={NEXT_FUNDING}
        intervalHours={8}
        lastRate={-0.00003}
        positionSize={-5}
        markPrice={3184.27}
      />
    </div>
  );
}
