import { useState } from "react";

import { CampaignCard, type Campaign } from "@/components/trading/campaign-card";

// Illustrative fixture data only — campaigns, prize pools and standings come from your campaign API.
const NOW = Date.now();
const DAY = 86_400_000;

const LIVE: Campaign = {
  id: "q4-perp-cup",
  title: "Q4 Perp Cup",
  startTime: NOW - 6 * DAY,
  endTime: NOW + 8 * DAY + 4 * 3_600_000,
  participants: 4_812,
  totalVolume: 1_284_000_000,
  prizePools: [
    {
      id: "volume",
      label: "Volume pool",
      total: 150_000,
      currency: "USDC",
      metric: "volume",
      tiers: [
        { position: 1, amount: 30_000 },
        { position: 2, amount: 18_000 },
        { position: 3, amount: 12_000 },
        { range: [4, 10], amount: 5_000 },
        { range: [11, 50], amount: 1_000 },
      ],
    },
  ],
};

const UPCOMING: Campaign = {
  id: "eth-sprint",
  title: "ETH Weekend Sprint",
  gradient: "radial-gradient(120% 140% at 100% 0%, oklch(0.7 0.15 230 / 0.55), transparent 60%), radial-gradient(100% 120% at 0% 100%, oklch(0.75 0.15 160 / 0.45), transparent 60%), var(--container-high)",
  startTime: NOW + DAY + 5 * 3_600_000,
  endTime: NOW + 3 * DAY,
  tags: ["ETH-PERP only"],
  prizePools: [
    {
      id: "pnl",
      label: "PnL pool",
      total: 25_000,
      currency: "USDC",
      metric: "pnl",
      tiers: [
        { position: 1, amount: 8_000 },
        { position: 2, amount: 5_000 },
        { position: 3, amount: 3_000 },
        { range: [4, 20], amount: 500 },
      ],
    },
  ],
};

export default function CampaignCardDemo() {
  const [joined, setJoined] = useState(true);
  const [joinedUpcoming, setJoinedUpcoming] = useState(false);
  return (
    <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-2">
      <CampaignCard
        campaign={LIVE}
        joined={joined}
        onJoin={() => setJoined(true)}
        onTrade={() => {}}
        onLearnMore={() => {}}
        you={{ rank: 37, volume: 4_210_880, pnl: 12_440.5 }}
      />
      <CampaignCard campaign={UPCOMING} joined={joinedUpcoming} onJoin={() => setJoinedUpcoming(true)} onLearnMore={() => {}} />
    </div>
  );
}
