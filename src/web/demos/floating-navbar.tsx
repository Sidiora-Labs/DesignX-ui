import { useRef } from "react";

import FloatingNavbar from "@/components/elements/floating-navbar";

export default function FloatingNavbarDemo() {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className="relative h-80 w-full max-w-2xl overflow-y-auto rounded-2xl bg-muted/40" ref={ref}>
      <FloatingNavbar
        activeId="home"
        containerRef={ref}
        hideOnScroll
        items={[
          { id: "home", label: "Home" },
          { id: "components", label: "Components" },
          { id: "blocks", label: "Blocks" },
          { id: "pricing", label: "Pricing" },
        ]}
        logo={<span className="font-semibold">DX</span>}
      />
      <div className="h-[200%] p-8 pt-24 text-sm text-muted-foreground">Scroll down to hide the bar, up to show it.</div>
    </div>
  );
}
