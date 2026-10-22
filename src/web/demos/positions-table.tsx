import { useState } from "react";
import { toast } from "sonner";

import { AdjustMarginDialog } from "@/components/trading/adjust-margin";
import { CloseAllPositionsDialog, ClosePositionDialog } from "@/components/trading/close-position";
import { PositionsTable, type CloseType, type Position } from "@/components/trading/positions-table";
import { ReversePositionDialog } from "@/components/trading/reverse-position";

// Illustrative positions only — feed these from your account stream.
const POSITIONS: Position[] = [
  {
    id: "PERP_BTC_USDC-cross",
    symbol: "PERP_BTC_USDC",
    side: "long",
    quantity: 0.4215,
    entryPrice: 65_820.4,
    markPrice: 67_408.2,
    liquidationPrice: 52_114.6,
    leverage: 20,
    marginMode: "cross",
    unrealizedPnl: 669.26,
    roi: 0.4824,
    takeProfitPrice: 71_000,
    stopLossPrice: 63_500,
    tick: 0.1,
    baseDp: 4,
  },
  {
    id: "PERP_ETH_USDC-isolated",
    symbol: "PERP_ETH_USDC",
    side: "short",
    quantity: 6.8,
    entryPrice: 3_284.15,
    markPrice: 3_342.6,
    liquidationPrice: 3_861.2,
    leverage: 10,
    marginMode: "isolated",
    margin: 2_233.22,
    unrealizedPnl: -397.46,
    roi: -0.1779,
    tick: 0.01,
    baseDp: 3,
  },
  {
    id: "PERP_SOL_USDC-isolated",
    symbol: "PERP_SOL_USDC",
    side: "long",
    quantity: 145,
    entryPrice: 148.32,
    markPrice: 152.87,
    liquidationPrice: 131.05,
    leverage: 8,
    marginMode: "isolated",
    margin: 2_688.3,
    unrealizedPnl: 659.75,
    roi: 0.2454,
    stopLossPrice: 139.5,
    tick: 0.01,
    baseDp: 2,
  },
];

type DialogState = { kind: "close"; position: Position; type: CloseType } | { kind: "margin" | "reverse"; position: Position } | { kind: "closeAll" } | null;

export default function PositionsTableDemo() {
  const [dialog, setDialog] = useState<DialogState>(null);
  const close = () => setDialog(null);
  const pos = dialog && "position" in dialog ? dialog.position : null;
  const sign = pos?.side === "long" ? 1 : -1;

  return (
    <div className="w-full max-w-6xl">
      <PositionsTable
        positions={POSITIONS}
        summary={{ roi: 0.1873 }}
        onClose={(position, type) => setDialog({ kind: "close", position, type })}
        onCloseAll={() => setDialog({ kind: "closeAll" })}
        onAdjustMargin={(position) => setDialog({ kind: "margin", position })}
        onReverse={(position) => setDialog({ kind: "reverse", position })}
        onTpSl={(p) => toast(`Open the TP/SL editor for ${p.symbol}`)}
        onShare={(p) => toast(`Share ${p.symbol} PnL card`)}
      />

      {pos && dialog?.kind === "close" && (
        <ClosePositionDialog
          open
          onOpenChange={(o) => !o && close()}
          defaultOrderType={dialog.type}
          symbol={pos.symbol}
          side={pos.side}
          positionQuantity={pos.quantity}
          markPrice={pos.markPrice}
          leverage={pos.leverage}
          tick={pos.tick}
          baseDp={pos.baseDp}
          estimatedPnl={({ price, quantity }) => ((price ?? pos.markPrice) - pos.entryPrice) * quantity * sign}
          onConfirm={(o) => toast.success(`${o.orderType === "market" ? "Market" : "Limit"} close ${o.quantity} ${pos.symbol}`)}
        />
      )}
      {pos && dialog?.kind === "margin" && (
        <AdjustMarginDialog
          open
          onOpenChange={(o) => !o && close()}
          symbol={pos.symbol}
          side={pos.side}
          leverage={pos.leverage}
          currentMargin={pos.margin ?? 0}
          maxAdd={8_420.15}
          maxRemove={(pos.margin ?? 0) * 0.4}
          liquidationPrice={pos.liquidationPrice}
          tick={pos.tick}
          onConfirm={(a) => toast.success(`${a.mode === "add" ? "Added" : "Removed"} ${a.amount} USDC`)}
        />
      )}
      {pos && dialog?.kind === "reverse" && (
        <ReversePositionDialog
          open
          onOpenChange={(o) => !o && close()}
          symbol={pos.symbol}
          side={pos.side}
          quantity={pos.quantity}
          leverage={pos.leverage}
          markPrice={pos.markPrice}
          tick={pos.tick}
          baseDp={pos.baseDp}
          estimatedPnl={pos.unrealizedPnl}
          onConfirm={() => toast.success(`Reversed ${pos.symbol}`)}
        />
      )}
      {dialog?.kind === "closeAll" && (
        <CloseAllPositionsDialog
          open
          onOpenChange={(o) => !o && close()}
          counts={{ all: 3, profitable: 2, losing: 1 }}
          onConfirm={(scope) => toast.success(`Closing ${scope} positions`)}
        />
      )}
    </div>
  );
}
