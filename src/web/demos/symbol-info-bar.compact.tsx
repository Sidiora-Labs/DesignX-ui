import { useState } from "react";

import { SymbolInfoBar } from "@/components/trading/symbol-info-bar";

export default function SymbolInfoBarCompactDemo() {
  const [favorite, setFavorite] = useState(false);
  return (
    <div className="w-full max-w-sm">
      <SymbolInfoBar
        variant="compact"
        symbol="PERP_ETH_USDC"
        price={3184.27}
        change={-0.0141}
        tick={0.01}
        maxLeverage={25}
        favorite={favorite}
        onFavoriteChange={setFavorite}
        onSymbolClick={() => {}}
      />
    </div>
  );
}
