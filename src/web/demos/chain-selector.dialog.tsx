import { useState } from "react";

import { ChainSelector, type ChainOption } from "@/components/trading/chain-selector";

// Illustrative chain list only.
const CHAINS: ChainOption[] = [
  { id: "42161", name: "Arbitrum" },
  { id: "8453", name: "Base" },
  { id: "10", name: "Optimism" },
  { id: "1", name: "Ethereum" },
  { id: "421614", name: "Arbitrum Sepolia", testnet: true },
  { id: "84532", name: "Base Sepolia", testnet: true },
];

export default function ChainSelectorDialogDemo() {
  const [chain, setChain] = useState("8453");
  return (
    <div className="flex w-full max-w-sm items-center justify-center rounded-2xl border border-border bg-container p-3">
      <ChainSelector layout="dialog" chains={CHAINS} value={chain} onValueChange={setChain} showName />
    </div>
  );
}
