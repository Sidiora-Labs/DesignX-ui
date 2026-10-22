import { PortfolioAssets, type PortfolioAsset } from "@/components/trading/portfolio-assets";

// Illustrative balances only. Feed these from your account holdings and index prices.
const ASSETS: PortfolioAsset[] = [
  { token: "USDC", balance: 28450.12, decimals: 2, indexPrice: 1, value: 28450.12, collateralRatio: 1, collateralContribution: 28450.12 },
  { token: "ETH", balance: 4.2185, indexPrice: 3184.27, value: 13432.85, collateralRatio: 0.9, collateralContribution: 12089.57 },
  { token: "BTC", balance: 0.0812, indexPrice: 67412.5, value: 5473.89, collateralRatio: 0.95, collateralContribution: 5200.2 },
  { token: "SOL", balance: 18.4, decimals: 2, indexPrice: 146.82, value: 2701.49, collateralRatio: 0.8, collateralContribution: 2161.19 },
];

export default function PortfolioAssetsDemo() {
  return (
    <div className="w-full max-w-4xl">
      <PortfolioAssets
        assets={ASSETS}
        ltv={0.12}
        ltvThreshold={0.9}
        onDeposit={() => {}}
        onWithdraw={() => {}}
        onTransfer={() => {}}
        onAssetTransfer={() => {}}
        onAssetConvert={() => {}}
      />
    </div>
  );
}
