import { BoltIcon, LockIcon, PaletteIcon, SparklesIcon } from "lucide-react";

import { IconAccordion } from "@/components/dx/icon-accordion";

const items = [
  { icon: <PaletteIcon className="size-4" />, title: "Themeable", description: "Every color, radius and shadow is a CSS variable you own." },
  { icon: <BoltIcon className="size-4" />, title: "Fast", description: "No runtime CSS-in-JS. Components ship as plain React and Tailwind." },
  { icon: <LockIcon className="size-4" />, title: "Accessible", description: "Built on Base UI primitives with full keyboard and screen-reader support." },
  { icon: <SparklesIcon className="size-4" />, title: "Motion-rich", description: "Spring physics everywhere, respecting prefers-reduced-motion." },
];

export default function IconAccordionDemo() {
  return (
    <div className="w-full max-w-md">
      <IconAccordion items={items} defaultValue={0} />
    </div>
  );
}
