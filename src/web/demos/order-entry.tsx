import { useState } from "react";
import { toast } from "sonner";

import { OrderConfirmDialog, ScaledOrderConfirmDialog, type ScaledChildOrder } from "@/components/trading/order-confirm";
import { DEFAULT_ORDER_ENTRY_VALUES, OrderEntry, type OrderEntryErrors, type OrderEntryValues } from "@/components/trading/order-entry";
import type { MarginMode } from "@/components/trading/margin-mode";

// Illustrative values only. Max quantity, fees and liquidation price come from your account and pricing logic.
const MARK = 67412.5;
const AVAILABLE = 12_480.32;
const SYMBOLS = ["PERP_BTC_USDC", "PERP_ETH_USDC", "PERP_SOL_USDC", "PERP_ARB_USDC", "PERP_DOGE_USDC"];

export default function OrderEntryDemo() {
  const [values, setValues] = useState<OrderEntryValues>({ ...DEFAULT_ORDER_ENTRY_VALUES, price: "67380.0" });
  const [leverage, setLeverage] = useState(10);
  const [marginMode, setMarginMode] = useState<MarginMode>("cross");
  const [confirming, setConfirming] = useState(false);

  // A stand-in for your risk engine: buying power ÷ price.
  const price = Number(values.price) || MARK;
  const maxQuantity = Math.floor(((AVAILABLE * leverage) / price) * 1e4) / 1e4;
  const qty = Number(values.quantity) || 0;
  const errors: OrderEntryErrors = {};
  if (qty > maxQuantity) errors.quantity = `Quantity can't exceed ${maxQuantity} BTC.`;
  const scaled = values.type === "scaled" ? splitScaled(values, qty) : [];
  const estLiq = qty > 0 ? price * (values.side === "buy" ? 1 - 0.9 / leverage : 1 + 0.9 / leverage) : null;

  return (
    <div className="w-full max-w-[320px] rounded-2xl bg-background p-3 ring-1 ring-border">
      <OrderEntry
        symbol="PERP_BTC_USDC"
        tick={0.1}
        baseDp={4}
        values={values}
        onValuesChange={setValues}
        referencePrice={MARK}
        midPrice={67410.4}
        maxQuantity={maxQuantity}
        available={AVAILABLE}
        onDeposit={() => toast("Open your deposit flow")}
        marginMode={marginMode}
        onMarginModeChange={setMarginMode}
        marginModeSettings={SYMBOLS.map((s, i) => ({ symbol: s, mode: i === 2 ? "isolated" : "cross" }))}
        onApplyMarginModeSettings={(symbols, mode) => toast.success(`Set ${symbols.length} symbols to ${mode}`)}
        leverage={leverage}
        maxLeverage={50}
        onLeverageChange={setLeverage}
        maxPositionNotional={(l) => Math.round(50_000_000 / l)}
        estLiqPrice={estLiq}
        fees={{ taker: 0.0005, maker: 0.0002 }}
        errors={errors}
        onSubmit={() => {
          if (!errors.quantity && qty > 0) setConfirming(true);
          else toast.error("Enter a valid quantity");
        }}
      />
      <ScaledOrderConfirmDialog
        open={confirming && values.type === "scaled"}
        onOpenChange={setConfirming}
        symbol="PERP_BTC_USDC"
        side={values.side}
        orders={scaled}
        tick={0.1}
        bestAsk={67413.1}
        bestBid={67411.9}
        onConfirm={() => {
          setConfirming(false);
          toast.success(`${scaled.length} scaled orders submitted`);
        }}
      />
      <OrderConfirmDialog
        open={confirming && values.type !== "scaled"}
        onOpenChange={setConfirming}
        tick={0.1}
        order={{
          symbol: "PERP_BTC_USDC",
          side: values.side,
          type: values.type,
          quantity: qty,
          price: Number(values.price) || null,
          triggerPrice: Number(values.triggerPrice) || null,
          notional: Number(values.total) || null,
          activationPrice: Number(values.activationPrice) || null,
          callbackValue: values.callbackType === "value" ? Number(values.callbackValue) || null : null,
          // The form keeps the typed percent; the summary takes a fraction.
          callbackRate: values.callbackType === "rate" && values.callbackRate ? Number(values.callbackRate) / 100 : null,
          leverage,
          marginMode,
          reduceOnly: values.reduceOnly,
          execution: values.execution,
          fee: qty * price * 0.0005,
          estLiqPrice: estLiq,
          tpsl: values.tpslEnabled
            ? {
                scope: values.tpsl.scope,
                quantity: qty,
                tpTriggerPrice: Number(values.tpsl.tp.triggerPrice) || null,
                slTriggerPrice: Number(values.tpsl.sl.triggerPrice) || null,
              }
            : null,
        }}
        onConfirm={() => {
          setConfirming(false);
          toast.success(`${values.side === "buy" ? "Buy" : "Sell"} ${qty} BTC submitted`);
        }}
        onDontShowAgainChange={(skip) => toast(skip ? "Confirmations off — persist this in your settings" : "Confirmations on")}
      />
    </div>
  );
}

/** Demo-only: spread a scaled order evenly between start and end price. */
function splitScaled(v: OrderEntryValues, qty: number): ScaledChildOrder[] {
  const start = Number(v.startPrice);
  const end = Number(v.endPrice);
  const n = Math.min(20, Math.max(2, Number(v.totalOrders) || 0));
  if (!start || !end || !qty) return [];
  return Array.from({ length: n }, (_, i) => ({
    price: Math.round((start + ((end - start) * i) / (n - 1)) * 10) / 10,
    quantity: Math.floor((qty / n) * 1e4) / 1e4,
  }));
}
