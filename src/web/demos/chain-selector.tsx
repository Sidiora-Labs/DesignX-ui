import { useState } from "react";

import { ChainSelector, type ChainOption } from "@/components/trading/chain-selector";

// Illustrative chain list only. Pass the networks your app supports.
const CHAINS: ChainOption[] = [
  { id: "42161", name: "Arbitrum" },
  { id: "8453", name: "Base" },
  { id: "10", name: "Optimism" },
  { id: "1", name: "Ethereum" },
  { id: "137", name: "Polygon" },
  { id: "56", name: "BNB Chain" },
  { id: "421614", name: "Arbitrum Sepolia", testnet: true },
  { id: "84532", name: "Base Sepolia", testnet: true },
  { id: "11155111", name: "Sepolia", testnet: true },
];

export default function ChainSelectorDemo() {
  const [chain, setChain] = useState("42161");
  return (
    <div className="flex w-full max-w-md items-center justify-end gap-3">
      <ChainSelector chains={CHAINS} value={chain} onValueChange={setChain} recent={["42161", "8453"]} showName />
      <ChainSelector chains={CHAINS} value={chain} onValueChange={setChain} wrongNetwork />
    </div>
  );
}
