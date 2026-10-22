import { useState } from "react";

import { AccountSummary, type AccountMetric } from "@/components/trading/account-summary";

// Illustrative values only. Feed these from your account data and wallet connector.
export default function AccountSummaryDemo() {
  const [metric, setMetric] = useState<AccountMetric>("totalValue");
  return (
    <div className="flex w-full max-w-xl justify-end">
      <AccountSummary
        totalValue={48210.37}
        freeCollateral={31452.18}
        unrealizedPnl={1284.62}
        unrealizedRoi={0.0873}
        currentLeverage={4.32}
        marginUsage={0.264}
        address="0x7a3F9c21D4b8E05f6A1e2c93B07d4E58aF19c6B2"
        chainName="Arbitrum One"
        metric={metric}
        onMetricChange={setMetric}
        onDeposit={() => {}}
        onWithdraw={() => {}}
        onTransfer={() => {}}
        onDisconnect={() => {}}
        onOpenExplorer={() => {}}
      />
    </div>
  );
}
