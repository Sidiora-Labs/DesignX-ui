import * as React from "react";

import { StackScroll } from "@/components/dx/stack-scroll";

const gradient = (a: string, b: string) => <div className="size-full rounded-[inherit]" style={{ background: `linear-gradient(135deg, ${a}, ${b})` }} />;

const items = [
  { title: "Install", description: "Run one command to add DX UI to any React project.", media: gradient("var(--dx-blue-3)", "var(--dx-purple-3)") },
  { title: "Compose", description: "Pick componentsthey're your code, ready to edit.", media: gradient("var(--dx-purple-3)", "var(--dx-pink-3)") },
  { title: "Theme", description: "Swap tokens to rebrand everything in seconds.", media: gradient("var(--dx-pink-3)", "var(--dx-yellow-3)") },
  { title: "Ship", description: "Accessible, fast and motion-rich out of the box.", media: gradient("var(--dx-yellow-3)", "var(--dx-green-3)") },
];

export default function StackScrollDemo() {
  const ref = React.useRef<HTMLDivElement>(null);
  return (
    <div ref={ref} className="relative h-[460px] w-full overflow-y-auto rounded-xl border border-outline-variant">
      <div className="px-6 pt-6 text-center text-[13px] text-muted-foreground">Scroll inside this box ↓</div>
      <StackScroll items={items} containerRef={ref} scrollLength="1600px" />
    </div>
  );
}
