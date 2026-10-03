import { FingerprintIcon, SparklesIcon } from "lucide-react";

import { MovingBorder } from "@/components/dx/moving-border";

export default function MovingBorderDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8">
      <MovingBorder duration={1500} radius="30px" gap="6px" className="size-[92px] bg-container-high" contentClassName="bg-container">
        <FingerprintIcon className="size-8 text-muted-foreground" />
      </MovingBorder>
      <MovingBorder radius="9999px" gap="1.5px" color="var(--dx-pink-3)" size={60} className="bg-outline-variant" contentClassName="bg-surface px-5 py-2.5">
        <span className="flex items-center gap-2 text-sm font-medium">
          <SparklesIcon className="size-4" /> Upgrade to Pro
        </span>
      </MovingBorder>
    </div>
  );
}
