import { useState } from "react";

import { EMPTY_TPSL, TpslEditor, type TpslValue } from "@/components/trading/tpsl-editor";

// Illustrative position: long 0.75 BTC from 66,250. Errors and warnings come from your validation.
const ENTRY = 66250;
const LIQ = 60210.4;

export default function TpslEditorDemo() {
  const [value, setValue] = useState<TpslValue>({
    ...EMPTY_TPSL,
    tp: { triggerPrice: "71000.0", orderType: "market", orderPrice: "" },
    sl: { triggerPrice: "61000.0", orderType: "limit", orderPrice: "60950.0" },
  });
  const sl = Number(value.sl.triggerPrice);
  const tp = Number(value.tp.triggerPrice);
  return (
    <div className="w-full max-w-sm rounded-2xl bg-background p-4 ring-1 ring-border">
      <TpslEditor
        layout="full"
        value={value}
        onValueChange={setValue}
        side="buy"
        entryPrice={ENTRY}
        positionSize={0.75}
        base="BTC"
        tick={0.1}
        baseDp={4}
        errors={{ tpTriggerPrice: tp && tp <= ENTRY ? "TP price must be above the entry price for a long." : undefined }}
        slWarning={sl && sl < LIQ * 1.02 ? "Stop losses near the liquidation price may not trigger." : undefined}
      />
    </div>
  );
}
