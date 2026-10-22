import { FundingRate } from "@/components/trading/funding-rate";

// Illustrative values only. Feed these from your funding data and position stream.
const NEXT_FUNDING = Date.now() + 37 * 60_000 + 5_000;

export default function FundingRateStackedDemo() {
  return (
    <div className="w-full max-w-[220px] rounded-xl bg-container px-3 py-2.5">
      <FundingRate
        variant="stacked"
        detail="dialog"
        label="Pred. funding rate"
        rate={0.00021}
        nextFundingTime={NEXT_FUNDING}
        intervalHours={1}
        lastRate={0.00018}
        capRate={0.04}
        floorRate={-0.04}
        positionSize={120}
        markPrice={171.84}
      />
    </div>
  );
}
