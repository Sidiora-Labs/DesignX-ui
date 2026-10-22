import { useState } from "react";

import { SymbolInfoBar } from "@/components/trading/symbol-info-bar";

// Illustrative values only. Feed these from your market data source.
const NEXT_FUNDING = Date.now() + 47 * 60 * 1000 + 12 * 1000;

export default function SymbolInfoBarDemo() {
  const [favorite, setFavorite] = useState(true);
  return (
    <div className="w-full max-w-4xl">
      <SymbolInfoBar
        symbol="PERP_BTC_USDC"
        price={67412.5}
        change={0.0234}
        changeAbs={1542.1}
        tick={0.1}
        maxLeverage={50}
        markPrice={67408.2}
        indexPrice={67395.9}
        volume24h={1_284_000_000}
        openInterest={412_600_000}
        fundingRate={0.000125}
        nextFundingTime={NEXT_FUNDING}
        favorite={favorite}
        onFavoriteChange={setFavorite}
        onSymbolClick={() => {}}
      />
    </div>
  );
}
