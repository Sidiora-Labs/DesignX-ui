import type { ApiDoc } from "./api";

/** Trading kit API docs — order. */
export const tradingApiOrder: Record<string, ApiDoc> = {
  "order-entry": {
    usage: `import { OrderEntry } from "@/components/trading/order-entry"

<OrderEntry
  symbol="PERP_BTC_USDC"
  tick={0.1}
  values={values}
  onValuesChange={setValues}
  referencePrice={ticker.mark}
  maxQuantity={risk.maxQty(values)}
  available={account.freeCollateral}
  marginMode={marginMode}
  onMarginModeChange={setMarginMode}
  leverage={leverage}
  maxLeverage={50}
  onLeverageChange={setLeverage}
  estLiqPrice={risk.estLiq(values)}
  fees={{ taker: 0.0005, maker: 0.0002 }}
  errors={validate(values)}
  onSubmit={(v) => openConfirm(v)}
/>`,
    notes:
      "A view only: it never prices, validates or sends an order. Form values stay as the text the user typed (so `0.` survives) — parse them in `onSubmit`. The size field switches between base and quote units; quantity and total are kept in step through the order price (the limit price, trigger, activation or `referencePrice` for market orders), and the percent slider maps to `maxQuantity`. Everything else — max quantity, fees, liquidation price and per-field `errors` — comes in as props; use `onValuesChange` to recompute them. Rates (`fees`, `slippage`, `estSlippage`) are fractions. The header opens the Margin Mode and Leverage Selector dialogs; the TP/SL toggle reveals a compact TP/SL Editor. Pair it with Order Confirm in your submit handler, as the example does.",
    align: "start",
    exampleTitles: { market: "Market order with slippage" },
    props: [
      {
        component: "OrderEntry",
        rows: [
          ["symbol", "string", undefined, "Base and quote units are parsed from it."],
          ["values / defaultValues", "OrderEntryValues / Partial<OrderEntryValues>"],
          ["onValuesChange", "(values: OrderEntryValues) => void", undefined, "Every edit."],
          ["onSubmit", "(values: OrderEntryValues) => void"],
          ["orderTypes", "OrderEntryType[]", "all six", "Limit and market render as tabs; the rest in an Advanced menu."],
          ["tick", "number", "0.01", "Price increment."],
          ["baseDp", "number", "4", "Quantity decimals."],
          ["referencePrice", "number | null", undefined, "Prices market orders for quantity ↔ total."],
          ["midPrice", "number | null", undefined, "Adds a Mid shortcut to the limit price."],
          ["maxQuantity", "number | null", undefined, "Max for the current side, in base units."],
          ["available", "number | null", undefined, "Free collateral in quote."],
          ["onDeposit", "() => void", undefined, "Shows a + button by the balance."],
          ["marginMode / onMarginModeChange", '"cross" | "isolated"'],
          ["marginModeSettings / onApplyMarginModeSettings", "MarginModeSettingsItem[]", undefined, "Bulk settings view inside the margin dialog."],
          ["leverage / maxLeverage / onLeverageChange", "number"],
          ["maxPositionNotional", "number | ((leverage) => number)", undefined, "Shown in the leverage dialog."],
          ["estLiqPrice", "number | null"],
          ["fees", "{ taker: number; maker: number } | null", undefined, "Fractions."],
          ["slippage / estSlippage / onSlippageChange", "number", undefined, "Fractions. Shown for market orders."],
          ["errors", "Partial<Record<OrderEntryField, ReactNode>> & { tpsl?: TpslErrors }"],
          ["slWarning", "ReactNode", undefined, "Non-blocking stop-loss notice."],
          ["tpslMode / onTpslModeChange", '"offset%" | "offset" | "pnl"'],
          ["submitting", "boolean"],
          ["disabled", "boolean", "false", "Read-only form."],
          ["submitLabel", "ReactNode", '"Buy / Long" | "Sell / Short"'],
        ],
      },
      {
        component: "OrderEntryValues",
        description: "Everything the form edits. Prices and sizes are strings.",
        rows: [
          ["side", '"buy" | "sell"'],
          ["type", '"limit" | "market" | "stop-limit" | "stop-market" | "scaled" | "trailing-stop"'],
          ["price / triggerPrice", "string"],
          ["quantity / total", "string", undefined, "Base and quote size."],
          ["quantityUnit", '"base" | "quote"', '"base"', "Unit of the size field. In quote, total is typed and quantity derived."],
          ["startPrice / endPrice / totalOrders / distribution / skew", "string", undefined, "Scaled orders."],
          ["activationPrice / callbackType / callbackValue / callbackRate", "string", undefined, "Trailing stop. callbackRate is a typed percent."],
          ["reduceOnly", "boolean"],
          ["execution", '"post-only" | "ioc" | "fok" | null', undefined, "Limit orders without TP/SL."],
          ["tpslEnabled / tpsl", "boolean / TpslValue"],
        ],
      },
    ],
  },
  "leverage-selector": {
    usage: `import { LeverageDialog, LeverageSelector } from "@/components/trading/leverage-selector"

<LeverageSelector
  max={50}
  currentLeverage={leverage}
  maxPositionNotional={(l) => tiers.maxNotional(l)}
  onConfirm={saveLeverage}
  onCancel={close}
/>

<LeverageDialog value={leverage} max={50} onConfirm={saveLeverage} />`,
    notes:
      "Slider marks are placed by value, so uneven steps line up with the track. Typed values clamp to `min`…`max`. `maxPositionNotional` can be a lookup so it follows the slider. The warning appears above `warnAbove` (half of `max` by default); pass `error` to block confirmation, for example when margin is insufficient. `LeverageDialog` drafts locally and reports the result on confirm. Use `onDraftChange` to recompute `error`.",
    align: "start",
    exampleTitles: { dialog: "Dialog with a blocking error" },
    props: [
      {
        component: "LeverageSelector",
        rows: [
          ["value / defaultValue / onValueChange", "number"],
          ["max", "number"],
          ["min", "number", "1"],
          ["currentLeverage", "number", undefined, "Shown as Current; confirm is disabled until it changes."],
          ["marks", "number[]", "evenly stepped"],
          ["presets", "number[]", undefined, "Quick-pick chips."],
          ["maxPositionNotional", "number | null | ((leverage) => number | null)"],
          ["quote", "string", '"USDC"'],
          ["warnAbove", "number", "max / 2"],
          ["warning / error", "ReactNode"],
          ["symbol / side / marginMode", "string / OrderSide / MarginMode", undefined, "Optional header."],
          ["onConfirm", "(leverage: number) => void"],
          ["onCancel", "() => void"],
          ["submitting / disabled", "boolean"],
        ],
      },
      {
        component: "LeverageDialog",
        rows: [
          ["value", "number", undefined, "Leverage in effect."],
          ["onConfirm", "(leverage: number) => void", undefined, "Uncontrolled dialogs close; controlled ones wait for you."],
          ["onDraftChange", "(leverage: number) => void"],
          ["trigger", "ReactElement", '"10x" button'],
          ["open / defaultOpen / onOpenChange", "boolean"],
          ["title", "ReactNode", '"Adjust leverage"'],
        ],
      },
    ],
  },
  "margin-mode": {
    usage: `import { MarginModeDialog, MarginModeToggle } from "@/components/trading/margin-mode"

<MarginModeToggle value={mode} onValueChange={setMode} showDescription />

<MarginModeDialog
  symbol="PERP_BTC_USDC"
  value={mode}
  onValueChange={switchMode}
  settings={symbols.map((s) => ({ symbol: s.id, mode: s.marginMode }))}
  onApplySettings={(ids, mode) => bulkSwitch(ids, mode)}
/>`,
    notes:
      "`MarginModeToggle` is an inline segmented control. `MarginModeOptions` renders two selectable cards with explainers and a Current tag. `MarginModeDialog` wraps the cards with Confirm and Cancel and, when `settings` is passed, links to a searchable bulk view (`MarginModeSettings`) for setting many symbols at once. Locked rows take a `disabledReason`, shown in a tooltip.",
    align: "start",
    exampleTitles: { dialog: "Dialog with per-symbol settings" },
    props: [
      {
        component: "MarginModeToggle",
        rows: [
          ["value / defaultValue / onValueChange", '"cross" | "isolated"', '"cross"'],
          ["showDescription", "boolean", "false"],
          ["disabledModes", "MarginMode[]"],
          ["size", '"sm" | "default"', '"default"'],
          ["disabled", "boolean"],
        ],
      },
      {
        component: "MarginModeOptions",
        rows: [
          ["value / onValueChange", "MarginMode"],
          ["currentMode", "MarginMode", undefined, "Tagged Current."],
          ["disabledModes", "MarginMode[]"],
          ["descriptions", "Partial<Record<MarginMode, ReactNode>>"],
        ],
      },
      {
        component: "MarginModeDialog",
        rows: [
          ["symbol", "string"],
          ["value", "MarginMode", undefined, "Mode in effect."],
          ["onValueChange", "(mode) => void", undefined, "On confirm."],
          ["settings", "{ symbol; mode; disabled?; disabledReason? }[]", undefined, "Enables the settings view."],
          ["onApplySettings", "(symbols: string[], mode) => void"],
          ["applying", "boolean"],
          ["trigger", "ReactElement", '"Cross ▾" button'],
          ["open / defaultOpen / onOpenChange", "boolean"],
        ],
      },
      {
        component: "MarginModeSettings",
        rows: [
          ["items", "MarginModeSettingsItem[]"],
          ["onApply", "(symbols: string[], mode) => void"],
          ["applying", "boolean"],
          ["listClassName", "string", undefined, "Sizes the scrolling list."],
        ],
      },
    ],
  },
  "tpsl-editor": {
    usage: `import { TpslDialog, TpslEditor } from "@/components/trading/tpsl-editor"

<TpslEditor
  layout="full"
  value={tpsl}
  onValueChange={setTpsl}
  side="buy"
  entryPrice={position.entryPrice}
  positionSize={position.size}
  errors={validateTpsl(tpsl)}
/>

<TpslDialog position={position} defaultValue={existing} onSubmit={saveTpsl} />`,
    notes:
      "Trigger prices are the source of truth. The second input of each row shows the same trigger as an Offset % or Offset $ from `entryPrice`, or as PnL for the position size, and typing there writes back a trigger price. These are display conversions only. Take-profit sits above entry for longs and below it for shorts. A stop-loss PnL is always treated as a loss. `compact` is the one-line layout used inside Order Entry; `full` adds order type and price per leg, entire / partial scope with a quantity slider, and a PnL / risk-reward summary.",
    align: "start",
    exampleTitles: { dialog: "Position TP/SL dialog" },
    props: [
      {
        component: "TpslEditor",
        rows: [
          ["value / defaultValue / onValueChange", "TpslValue", "EMPTY_TPSL"],
          ["side", '"buy" | "sell"', undefined, "Position side."],
          ["entryPrice", "number | null", undefined, "Reference for offsets and PnL."],
          ["positionSize", "number", "0", "Base units."],
          ["maxQuantity", "number", "positionSize", "Partial maximum."],
          ["base / quote", "string", 'quote "USDC"'],
          ["tick / baseDp", "number", "— / 4"],
          ["mode / defaultMode / onModeChange", '"offset%" | "offset" | "pnl"', '"offset%"'],
          ["modes", "TpslMode[]", "all three"],
          ["layout", '"compact" | "full"', '"compact"'],
          ["showScope", "boolean", "true"],
          ["showQuantity", "boolean", "true", "Quantity picker for partial scope."],
          ["showSummary", "boolean", "layout === full"],
          ["errors", "{ tpTriggerPrice?, slTriggerPrice?, tpOrderPrice?, slOrderPrice?, quantity? }"],
          ["slWarning", "ReactNode"],
          ["disabled", "boolean"],
        ],
      },
      {
        component: "TpslValue",
        rows: [
          ["tp / sl", "{ triggerPrice: string; orderType: \"market\" | \"limit\"; orderPrice: string }"],
          ["scope", '"entire" | "partial"'],
          ["quantity", "string", undefined, "Partial quantity."],
        ],
      },
      {
        component: "TpslDialog",
        rows: [
          ["position", "{ symbol; side; size; entryPrice; markPrice?; liqPrice?; leverage?; marginMode? }"],
          ["defaultValue", "TpslValue", undefined, "Existing TP/SL."],
          ["onValueChange", "(value) => void", undefined, "Draft edits, for live errors."],
          ["onSubmit", "(value: TpslValue) => void"],
          ["onCancel", "() => void"],
          ["submitting", "boolean"],
          ["trigger", "ReactElement", '"TP/SL" button'],
          ["open / defaultOpen / onOpenChange", "boolean"],
        ],
      },
      { component: "TpslRow", description: "A single leg, if you lay out TP and SL yourself.", rows: [["kind", '"tp" | "sl"'], ["value / onChange", "TpslLeg"], ["mode / onModeChange", "TpslMode"]] },
    ],
  },
  "order-confirm": {
    usage: `import { OrderConfirmDialog, ScaledOrderConfirmDialog } from "@/components/trading/order-confirm"

<OrderConfirmDialog
  open={confirming}
  onOpenChange={setConfirming}
  order={{ symbol, side, type: "limit", quantity: 0.25, price: 67380, fee, estLiqPrice, tpsl }}
  onConfirm={send}
  onDontShowAgainChange={setSkipConfirm}
/>`,
    notes:
      "Drive `open` from your submit handler or pass a `trigger`. Estimated total defaults to quantity × price. Market and stop-market orders show Market for the price. The \"Don't show this again\" checkbox only keeps local state, so persist it from `onDontShowAgainChange`. Closing the dialog any other way calls `onCancel`. `ScaledOrderConfirmDialog` lists each child order, adds up the totals, and flags children that would cross `bestAsk` / `bestBid`. `MarketNoticeDialog` gates the first order on a community-listed market behind an acknowledgement. `OrderConfirmDetails` is the summary on its own.",
    exampleTitles: { scaled: "Scaled order", notice: "Community market notice" },
    props: [
      {
        component: "OrderConfirmDialog",
        rows: [
          ["order", "OrderConfirmSummary"],
          ["tick / baseDp", "number", "— / 4"],
          ["onConfirm / onCancel", "() => void"],
          ["submitting", "boolean"],
          ["confirmLabel", "ReactNode", '"Confirm"'],
          ["showDontShowAgain", "boolean", "true"],
          ["defaultDontShowAgain", "boolean", "false"],
          ["onDontShowAgainChange", "(checked: boolean) => void"],
          ["trigger", "ReactElement"],
          ["open / defaultOpen / onOpenChange", "boolean"],
          ["title", "ReactNode", '"Confirm order"'],
        ],
      },
      {
        component: "OrderConfirmSummary",
        rows: [
          ["symbol / side / type", "string / OrderSide / ConfirmOrderType"],
          ["quantity", "number"],
          ["price / triggerPrice / notional", "number | null"],
          ["activationPrice / callbackValue / callbackRate", "number | null", undefined, "Trailing stop. callbackRate is a fraction."],
          ["tpsl", "{ scope?; quantity?; tpTriggerPrice?; tpOrderPrice?; slTriggerPrice?; slOrderPrice? } | null", undefined, "Missing order prices show Market."],
          ["fee / estLiqPrice", "number | null"],
          ["leverage / marginMode / reduceOnly / execution", "header tags"],
        ],
      },
      {
        component: "ScaledOrderConfirmDialog",
        rows: [
          ["symbol / side", "string / OrderSide"],
          ["orders", "{ price: number; quantity: number }[]"],
          ["bestAsk / bestBid", "number | null", undefined, "Flags orders that fill immediately."],
          ["tick / baseDp", "number"],
          ["onConfirm / onCancel / submitting", "—"],
        ],
      },
      {
        component: "MarketNoticeDialog",
        rows: [
          ["children", "ReactNode", "community-listed notice"],
          ["acknowledgeLabel", "ReactNode"],
          ["onConfirm / onCancel", "() => void"],
          ["trigger / open / onOpenChange", "—"],
        ],
      },
    ],
  },
};
