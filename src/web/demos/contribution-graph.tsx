import ContributionGraph from "@/components/elements/contribution-graph";

export default function ContributionGraphDemo() {
  return (
    <div className="w-full max-w-3xl overflow-x-auto">
      <ContributionGraph showLegend showTooltips />
    </div>
  );
}
