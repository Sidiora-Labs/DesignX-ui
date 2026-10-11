import AnimatedTabs from "@/components/elements/animated-tabs";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "components", label: "Components" },
  { id: "blocks", label: "Blocks" },
  { id: "themes", label: "Themes" },
];

export default function AnimatedTabsDemo() {
  return (
    <div className="flex flex-col items-center gap-6">
      <AnimatedTabs layoutId="tabs-pill" tabs={tabs} variant="pill" />
      <AnimatedTabs layoutId="tabs-underline" tabs={tabs} variant="underline" />
      <AnimatedTabs layoutId="tabs-segment" tabs={tabs} variant="segment" />
    </div>
  );
}
