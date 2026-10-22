import { useState } from "react";

import { DepositWithdraw, type TransferMode } from "@/components/trading/deposit-withdraw";

// Illustrative balances, fees and limits only. Your app quotes these per mode, token and network.
const TOKENS = [
  { symbol: "USDC", name: "USD Coin", decimals: 2 },
  { symbol: "ETH", name: "Ether", decimals: 6 },
  { symbol: "USDT", name: "Tether", decimals: 2 },
];

const NETWORKS = [
  { id: "42161", name: "Arbitrum" },
  { id: "8453", name: "Base" },
  { id: "10", name: "Optimism" },
  { id: "1", name: "Ethereum" },
];

const ACCOUNTS = [
  { id: "0x3e9fb1c07d2a64e5b8f0c1a2d3e4f5a6b7c8d9e0", label: "Main account", balance: 28450.12 },
  { id: "0x91a2b3c4d5e6f708192a3b4c5d6e7f8091a2b3c4", label: "Market making", balance: 4120.5 },
  { id: "0xc0ffee254729296a45a3885639ac7e10f9d54979", label: "Hedging", balance: 812.04 },
];

const QUOTES: Record<TransferMode, { balance: number; fee: number; min?: number; max?: number }> = {
  deposit: { balance: 12840.55, fee: 0.32 },
  withdraw: { balance: 28450.12, fee: 1, min: 2, max: 250000 },
  transfer: { balance: 28450.12, fee: 0 },
};

export default function DepositWithdrawDemo() {
  const [mode, setMode] = useState<TransferMode>("deposit");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const quote = QUOTES[mode];
  return (
    <div className="w-full max-w-[420px]">
      <DepositWithdraw
        mode={mode}
        onModeChange={(m) => {
          setMode(m);
          setAmount("");
          setLoading(false);
        }}
        tokens={TOKENS}
        networks={NETWORKS}
        accounts={ACCOUNTS}
        amount={amount}
        onAmountChange={(a) => {
          setAmount(a);
          setLoading(false);
        }}
        balance={quote.balance}
        fee={mode === "transfer" ? undefined : quote.fee}
        minAmount={quote.min}
        maxAmount={quote.max}
        rows={mode === "deposit" ? [{ label: "Collateral ratio", value: "100%", hint: "How much of the asset's value counts as margin." }] : []}
        connectedAddress="0x7a3F9c21D4b8E05f6A1e2c93B07d4E58aF19c6B2"
        submitState={loading ? "loading" : "idle"}
        onSubmit={() => setLoading(true)}
      />
    </div>
  );
}
