import { useEffect, useState } from "react";

import PriceFlow from "@/components/elements/price-flow";

export default function PriceFlowDemo() {
  const [value, setValue] = useState(24);
  useEffect(() => {
    const id = setInterval(() => setValue((v) => (v === 24 ? 19 : v === 19 ? 39 : 24)), 1800);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="flex items-baseline gap-1 text-5xl font-semibold tracking-tight">
      $<PriceFlow value={value} />
      <span className="text-base font-normal text-muted-foreground">/mo</span>
    </div>
  );
}
