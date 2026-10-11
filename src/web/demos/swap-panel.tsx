import { useState } from "react";

import SwapPanel from "@/components/elements/swap-panel";

const tokens = [
  { name: "DX Credits", symbol: "DXC", balance: 1240 },
  { name: "US Dollar", symbol: "USD", balance: 320 },
];

export default function SwapPanelDemo() {
  const [amount, setAmount] = useState("100");
  const [flipped, setFlipped] = useState(false);
  const [from, to] = flipped ? [tokens[1], tokens[0]] : tokens;
  const rate = flipped ? 4 : 0.25;
  return (
    <SwapPanel
      amount={amount}
      className="w-full max-w-sm"
      from={from}
      onAmountChange={setAmount}
      onFlip={() => setFlipped((f) => !f)}
      onSubmit={() => {}}
      quote={{ rate, output: (Number(amount) || 0) * rate, fee: 0.5, priceImpact: 0.1 }}
      status="ready"
      to={to}
    />
  );
}
