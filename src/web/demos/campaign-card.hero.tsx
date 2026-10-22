import { useState } from "react";

import { CampaignHero, CampaignTile, type Campaign } from "@/components/trading/campaign-card";

// Illustrative fixture data only — campaigns, prize pools and standings come from your campaign API.
const NOW = Date.now();
const DAY = 86_400_000;

const CAMPAIGNS: Campaign[] = [
  {
    id: "genesis",
    title: "Genesis Trading Battle",
    description: "Trade any perpetual market. Unlock a bigger pool as total volume grows.",
    startTime: NOW - 4 * DAY,
    endTime: NOW + 10 * DAY + 7 * 3_600_000,
    participants: 9_204,
    totalVolume: 742_000_000,
    prizePools: [
      { id: "vol", label: "Volume pool", total: 100_000, currency: "USDC", tiers: [{ position: 1, amount: 20_000 }, { position: 2, amount: 12_000 }, { position: 3, amount: 8_000 }, { range: [4, 25], amount: 2_000 }] },
      { id: "pnl", label: "PnL pool", total: 50_000, currency: "USDC", tiers: [{ position: 1, amount: 15_000 }, { position: 2, amount: 9_000 }, { position: 3, amount: 6_000 }, { range: [4, 10], amount: 2_000 }] },
    ],
  },
  {
    id: "sol-week",
    title: "SOL Week",
    gradient: "radial-gradient(120% 140% at 0% 0%, oklch(0.65 0.2 300 / 0.55), transparent 60%), radial-gradient(120% 140% at 100% 100%, oklch(0.78 0.15 170 / 0.5), transparent 60%), var(--container-high)",
    startTime: NOW + 2 * DAY,
    endTime: NOW + 9 * DAY,
    totalPrize: { amount: 40_000, currency: "USDC" },
    tags: ["SOL-PERP"],
  },
  {
    id: "summer",
    title: "Summer Showdown",
    startTime: NOW - 60 * DAY,
    endTime: NOW - 30 * DAY,
    totalPrize: { amount: 80_000, currency: "USDC" },
    participants: 6_120,
    totalVolume: 2_310_000_000,
  },
];

const VOLUME_TIERS = [
  { volume: 250_000_000, prize: 50_000 },
  { volume: 500_000_000, prize: 100_000 },
  { volume: 1_000_000_000, prize: 150_000 },
  { volume: 2_000_000_000, prize: 250_000 },
];

export default function CampaignHeroDemo() {
  const [current, setCurrent] = useState<Campaign["id"]>("genesis");
  const [joined, setJoined] = useState(false);
  const campaign = CAMPAIGNS.find((c) => c.id === current) ?? CAMPAIGNS[0];
  return (
    <div className="flex w-full max-w-4xl flex-col gap-3">
      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
        {CAMPAIGNS.map((c) => (
          <CampaignTile key={c.id} campaign={c} active={c.id === current} onSelect={setCurrent} className="w-44 shrink-0 sm:w-auto sm:flex-1" />
        ))}
      </div>
      <CampaignHero
        campaign={campaign}
        volumeTiers={campaign.id === "genesis" ? VOLUME_TIERS : undefined}
        joined={joined}
        onJoin={() => setJoined(true)}
        onTrade={() => {}}
        onLearnMore={() => {}}
      />
    </div>
  );
}
