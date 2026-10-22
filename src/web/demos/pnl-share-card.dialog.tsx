import { Share2Icon } from "lucide-react";

import { PnlShareDialog, type PnlSharePosition } from "@/components/trading/pnl-share-card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

// Illustrative fixture data only — pass the closed position you are sharing.
const NOW = Date.now();

const POSITION: PnlSharePosition = {
  symbol: "PERP_ETH_USDC",
  side: "short",
  marginMode: "isolated",
  pnl: -312.44,
  roi: -0.1562,
  openPrice: 3_142.18,
  closePrice: 3_191.27,
  quantity: 6.4,
  leverage: 10,
  openTime: NOW - 5 * 3_600_000,
  closeTime: NOW - 20 * 60_000,
};

export default function PnlShareCardDialogDemo() {
  return (
    <div className="flex w-full max-w-sm justify-center">
      <PnlShareDialog
      trigger={
        <Button variant="outline">
          <Share2Icon /> Share position
        </Button>
      }
      position={POSITION}
      brand="DX Trade"
      domain="trade.example.com"
      timestamp={NOW}
      tick={0.01}
      defaultOptions={{ themeId: "ember" }}
      onDownload={(o) => toast(`Download requested — ${o.themeId}, ${o.fields.length} fields`)}
      onCopy={(o) => toast(`Copy requested — format ${o.format}`)}
      />
    </div>
  );
}
