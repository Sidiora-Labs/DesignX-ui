import { ChainIcon, SymbolDisplay, TokenIcon } from "@/components/trading/token-icon";

export default function TokenIconDemo() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-end gap-3">
        {(["xs", "sm", "md", "lg", "xl"] as const).map((size, i) => (
          <TokenIcon key={size} size={size} symbol={["BTC", "ETH", "SOL", "PAX", "DOGE"][i]} />
        ))}
      </div>
      <div className="flex items-center gap-3">
        <ChainIcon name="Arbitrum" size="md" />
        <ChainIcon name="Base" size="md" />
        <ChainIcon name="Optimism" size="md" />
        <ChainIcon name="Solana" size="md" />
      </div>
      <div className="flex flex-col items-start gap-2 text-sm">
        <SymbolDisplay symbol="PERP_BTC_USDC" badge="50x" />
        <SymbolDisplay symbol="PERP_ETH_USDC" format="base-quote" />
        <SymbolDisplay symbol="SOL/USDC" format="base" badge="Spot" />
      </div>
    </div>
  );
}
