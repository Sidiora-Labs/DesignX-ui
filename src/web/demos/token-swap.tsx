import * as React from "react";
import { SiEthereum, SiSolana } from "react-icons/si";

import { TokenSwap } from "@/components/dx/token-swap";

const ETH = { symbol: "ETH", name: "Ethereum", icon: <SiEthereum />, color: "#627eea", balance: 111.82, price: 3445.86 };
const SOL = { symbol: "SOL", name: "Solana", icon: <SiSolana />, color: "#121317", balance: 2400, price: 158.4 };

export default function TokenSwapDemo() {
  const [flipped, setFlipped] = React.useState(false);
  const [from, to] = flipped ? [SOL, ETH] : [ETH, SOL];
  return (
    <TokenSwap
      key={from.symbol}
      from={from}
      to={to}
      rate={from.price / to.price}
      onFlip={() => setFlipped((f) => !f)}
    />
  );
}
