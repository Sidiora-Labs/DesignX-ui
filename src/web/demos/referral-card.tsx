import { ReferralCard, ReferralCodeForm } from "@/components/trading/referral-card";

// Illustrative values only. Codes, links and rates come from your referral API.
export default function ReferralCardDemo() {
  return (
    <div className="grid w-full max-w-3xl gap-4 md:grid-cols-2">
      <ReferralCard
        code="PAXEER42"
        link="https://app.paxeer.network/r/PAXEER42"
        badge="Multilevel"
        rebateRate={0.3}
        refereeRate={0.1}
        indirectRate={0.05}
        tradingFeeRebate={0.1}
        onCopy={() => {}}
        onConfigure={() => {}}
        onSetTradingFeeRebate={() => {}}
      />
      <div className="rounded-2xl border border-border bg-container p-5">
        <ReferralCodeForm
          totalSplit={0.4}
          maxKeep={0.32}
          defaultKeep={0.3}
          directRate={0.4}
          indirectRate={0.05}
          baseRefereeRate={0.05}
          onSubmit={() => {}}
          onCancel={() => {}}
        />
      </div>
    </div>
  );
}
