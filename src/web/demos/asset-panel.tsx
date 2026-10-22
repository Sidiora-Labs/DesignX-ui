import { useState } from "react";

import { AssetPanel } from "@/components/trading/asset-panel";

// Illustrative values only. Feed these from your account and margin data.
export default function AssetPanelDemo() {
  const [hidden, setHidden] = useState(false);
  return (
    <div className="w-full max-w-[320px]">
      <AssetPanel
        totalValue={48210.37}
        unrealizedPnl={1284.62}
        unrealizedRoi={0.0873}
        freeCollateral={31452.18}
        marginRatio={0.2315}
        maintenanceMarginRatio={0.0612}
        maintenanceMargin={1802.44}
        currentLeverage={4.32}
        ltv={0.18}
        hideBalances={hidden}
        onHideBalancesChange={setHidden}
        onDeposit={() => {}}
        onWithdraw={() => {}}
        onTransfer={() => {}}
      />
    </div>
  );
}
