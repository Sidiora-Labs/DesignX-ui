import { useState } from "react";

import { DepositStatus, type TransferStatusGroup, type TransferStatusItem } from "@/components/trading/deposit-status";

// Illustrative transfers only. Feed these from your transfer-history polling or webhooks.
const ITEMS: TransferStatusItem[] = [
  {
    id: "d1",
    type: "deposit",
    token: "USDC",
    amount: 2500,
    network: "Arbitrum",
    step: "confirming",
    confirmations: 7,
    requiredConfirmations: 12,
    time: "2 min ago",
    eta: "~1 min",
    txHash: "0x9f2c4b7e1a3d58c06e2f9b14a7c3d8e5f60a1b2c3d4e5f60718293a4b5c6d7e8",
  },
  {
    id: "d2",
    type: "withdraw",
    token: "ETH",
    amount: 1.25,
    network: "Base",
    step: "submitted",
    time: "Just now",
  },
  {
    id: "d3",
    type: "deposit",
    token: "USDC",
    amount: 10000,
    network: "Ethereum",
    step: "credited",
    confirmations: 64,
    requiredConfirmations: 64,
    time: "14 min ago",
    txHash: "0x1b8e7d6c5a4f3e2d1c0b9a8f7e6d5c4b3a291807f6e5d4c3b2a1908f7e6d5c4b",
  },
];

export default function DepositStatusDemo() {
  const [items, setItems] = useState(ITEMS);
  const dismiss = (group: TransferStatusGroup) =>
    setItems((list) => list.filter((i) => (group === "completed" ? i.step !== "credited" : group === "failed" ? i.step !== "failed" : i.step === "credited" || i.step === "failed")));
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <DepositStatus items={items} defaultOpen onDismiss={dismiss} explorerUrl={(i) => `https://arbiscan.io/tx/${i.txHash}`} />
      {items.length === 0 && (
        <button type="button" className="text-xs text-muted-foreground underline" onClick={() => setItems(ITEMS)}>
          Reset demo
        </button>
      )}
    </div>
  );
}
