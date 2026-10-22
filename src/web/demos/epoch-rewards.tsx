import { useState } from "react";

import { EpochRewards, type RewardHistoryRow } from "@/components/trading/epoch-rewards";

// Illustrative fixture data only — epochs, estimates and balances come from your rewards API.
const NOW = Date.now();
const DAY = 86_400_000;
const EPOCH_START = NOW - 9 * DAY - 6 * 3_600_000;
const EPOCH_END = EPOCH_START + 14 * DAY;

const HISTORY: RewardHistoryRow[] = [41, 40, 39, 38].map((id, i) => {
  const end = EPOCH_START - i * 14 * DAY;
  return {
    epochId: id,
    startTime: end - 14 * DAY,
    endTime: end,
    rewardPool: 250_000,
    token: i % 2 ? "esPAX" : "PAX",
    earned: i === 2 ? null : [1_284.52, 902.18, 0, 433.07][i],
    breakdown: i === 0 ? "1,032.40 from this exchange · 252.12 from other venues on the network" : undefined,
  };
});

export default function EpochRewardsDemo() {
  const [claimable, setClaimable] = useState({ pax: 2_186.7, esPax: 1_335.25 });
  return (
    <div className="w-full max-w-4xl">
      <EpochRewards
        description="Earn PAX and esPAX by trading. Rewards are distributed at the end of each two-week epoch."
        current={{
          epoch: { id: 42, startTime: EPOCH_START, endTime: EPOCH_END, rewardPool: 250_000, token: "PAX" },
          estRewards: 846.31,
          estRewardsHint: "Based on your share of fees paid this epoch. Final rewards may differ.",
          volume: 3_482_116.4,
          fees: 1_218.74,
        }}
        claim={{
          amounts: [
            { token: "PAX", amount: claimable.pax },
            { token: "esPAX", amount: claimable.esPax },
          ],
          onClaim: () => setClaimable({ pax: 0, esPax: 0 }),
          onViewDetails: () => {},
        }}
        booster={{ avgStaked: 12_400, stakedTokens: ["PAX", "esPAX"], multiplier: 1.75, onStake: () => {} }}
        history={{ rows: HISTORY, hasMore: true, onLoadMore: () => {} }}
      />
    </div>
  );
}
