import { AffiliateOnboarding } from "@/components/trading/affiliate-summary";

// Illustrative values only — the volume target and progress come from your referral API.
export default function AffiliateSummaryOnboardingDemo() {
  return (
    <div className="w-full max-w-4xl">
      <AffiliateOnboarding
        maxCommission="Up to 60%"
        traderRebate="10%"
        requiredVolume={10_000}
        completedVolume={3_840}
        onBecomeAffiliate={() => {}}
        onEnterCode={() => {}}
      />
    </div>
  );
}
