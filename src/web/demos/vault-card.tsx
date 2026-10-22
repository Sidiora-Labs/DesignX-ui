import { VaultCard, VaultGrid } from "@/components/trading/vault-card";

// Illustrative values only. Feed these from your vaults API.
const SPARK_UP = [1.0, 1.004, 1.002, 1.009, 1.013, 1.011, 1.018, 1.022, 1.019, 1.027, 1.031, 1.036];
const SPARK_DOWN = [1.0, 0.998, 1.003, 0.996, 0.991, 0.994, 0.988, 0.985, 0.989, 0.982];

export default function VaultCardDemo() {
  return (
    <VaultGrid className="w-full max-w-5xl">
      <VaultCard
        name="Paxeer OmniVault"
        manager="Paxeer Labs"
        description="Earn passive yield with no trading expertise. OmniVault runs market-making strategies, takes on liquidations and accrues platform fees."
        tags={["Market making", "Liquidations"]}
        status="live"
        tvl={48_210_400}
        apy30d={0.1842}
        allTimeReturn={0.2215}
        performance={SPARK_UP}
        deposits={12_500}
        earnings={384.27}
        availableBalance={3_120.55}
        lockupHours={48}
        performanceFee={0.1}
        depositors={6_412}
        latestOperation={{ type: "deposit", status: "completed", amount: 2_500 }}
        onDeposit={() => {}}
        onWithdraw={() => {}}
        onViewMore={() => {}}
      />
      <VaultCard
        name="Delta Neutral Basis"
        manager="Kestrel Capital"
        description="Captures funding-rate carry by pairing spot holdings with short perpetuals across majors."
        tags={["Delta neutral", "Funding carry"]}
        status="closing"
        tvl={6_904_100}
        apy30d={-0.0312}
        allTimeReturn={0.0874}
        performance={SPARK_DOWN}
        deposits={4_000}
        earnings={-62.4}
        availableBalance={3_120.55}
        lockupHours={72}
        performanceFee={0.15}
        depositors={812}
        onDeposit={() => {}}
        onWithdraw={() => {}}
      />
      <VaultCard
        name="Momentum Alpha"
        manager="Northwind Quant"
        description="Trend-following across the top 20 perpetual markets with volatility-scaled sizing."
        tags={["Trend following", "Multi-asset"]}
        status="pre_launch"
        tvl={0}
        apy30d={null}
        allTimeReturn={null}
        lockupHours={24}
        performanceFee={0.2}
        onDeposit={() => {}}
        onWithdraw={() => {}}
        withdrawDisabled
      />
    </VaultGrid>
  );
}
