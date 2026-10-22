import { AssetPanel } from "@/components/trading/asset-panel";

export default function AssetPanelFirstDepositDemo() {
  return (
    <div className="w-full max-w-[320px]">
      <AssetPanel firstDeposit onDeposit={() => {}} />
    </div>
  );
}
