import { TransferHistory, type TransferRecord } from "@/components/trading/transfer-history";

// Illustrative records only. Feed these from your asset-history API.
const RECORDS: TransferRecord[] = [
  {
    id: "1",
    type: "deposit",
    token: "USDC",
    amount: 10000,
    fee: 0,
    network: "Arbitrum",
    status: "completed",
    time: Date.UTC(2026, 9, 21, 14, 32),
    txHash: "0x1b8e7d6c5a4f3e2d1c0b9a8f7e6d5c4b3a291807f6e5d4c3b2a1908f7e6d5c4b",
  },
  {
    id: "2",
    type: "withdraw",
    token: "USDC",
    amount: 2500,
    fee: 1,
    network: "Base",
    status: "processing",
    time: Date.UTC(2026, 9, 21, 9, 5),
    txHash: "0x9f2c4b7e1a3d58c06e2f9b14a7c3d8e5f60a1b2c3d4e5f60718293a4b5c6d7e8",
  },
  {
    id: "3",
    type: "transfer",
    token: "USDC",
    amount: 1200,
    status: "completed",
    time: Date.UTC(2026, 9, 20, 18, 47),
    from: "0x3e9fb1c07d2a64e5b8f0c1a2d3e4f5a6b7c8d9e0",
    to: "0x91a2b3c4d5e6f708192a3b4c5d6e7f8091a2b3c4",
  },
  {
    id: "4",
    type: "deposit",
    token: "ETH",
    amount: 1.25,
    decimals: 4,
    fee: 0,
    network: "Ethereum",
    status: "failed",
    time: Date.UTC(2026, 9, 19, 11, 20),
    txHash: "0x4c3b2a1908f7e6d5c4b1b8e7d6c5a4f3e2d1c0b9a8f7e6d5c4b3a291807f6e5d",
  },
  {
    id: "5",
    type: "withdraw",
    token: "USDC",
    amount: 640.5,
    fee: 1,
    network: "Optimism",
    status: "completed",
    time: Date.UTC(2026, 9, 17, 22, 3),
    txHash: "0x7e6d5c4b3a291807f6e5d4c3b2a1908f7e6d5c4b1b8e7d6c5a4f3e2d1c0b9a8f",
  },
  {
    id: "6",
    type: "deposit",
    token: "USDC",
    amount: 5000,
    vault: "Delta-neutral basis",
    status: "completed",
    time: Date.UTC(2026, 9, 16, 8, 41),
  },
];

const EXPLORERS: Record<string, string> = {
  Arbitrum: "https://arbiscan.io",
  Base: "https://basescan.org",
  Ethereum: "https://etherscan.io",
  Optimism: "https://optimistic.etherscan.io",
};

export default function TransferHistoryDemo() {
  return (
    <div className="w-full max-w-5xl">
      <TransferHistory
        records={RECORDS}
        explorerUrl={(r) => (r.network && r.txHash ? `${EXPLORERS[r.network]}/tx/${r.txHash}` : undefined)}
      />
    </div>
  );
}
