import type { ApiDoc } from "./api";

/** Trading kit API docs — positions. */
export const tradingApiPositions: Record<string, ApiDoc> = {
  "positions-table": {
    usage: `import { PositionsTable } from "@/components/trading/positions-table"

<PositionsTable
  positions={positions}
  summary={{ roi: account.unrealizedRoi }}
  onClose={(position, type) => openClose(position, type)}
  onCloseAll={() => setCloseAllOpen(true)}
  onTpSl={openTpSl}
  onAdjustMargin={openAdjustMargin}
  onReverse={openReverse}
  onShare={openSharePnl}
/>`,
    notes:
      "A table from `md` up and stacked cards below it. Every action is a callback with the position — pair them with `ClosePositionDialog`, `AdjustMarginDialog` and `ReversePositionDialog`. Action buttons only render when their callback is passed. The summary sums `unrealizedPnl` and `notional` from the rows unless you pass `summary`; ROI is shown only when provided. Margin and the adjust button appear for isolated positions.",
    align: "start",
    exampleTitles: { empty: "Empty" },
    props: [
      {
        component: "PositionsTable",
        rows: [
          ["positions", "Position[]"],
          ["summary", "{ unrealizedPnl?, roi?, notional? }", undefined, "Header totals; ROI is a fraction."],
          ["hideSummary", "boolean", "false"],
          ["quote", "string", '"USDC"'],
          ["pnlDp", "number", "2", "Decimals for PnL and notional."],
          ["loading", "boolean", "false", "Skeleton rows while empty."],
          ["onClose", '(position, type: "market" | "limit") => void'],
          ["onCloseAll", "() => void"],
          ["onTpSl / onShare / onReverse / onAdjustMargin / onSymbolClick", "(position) => void"],
          ["empty", "ReactNode", undefined, "Replaces the empty state."],
        ],
      },
      {
        component: "Position",
        rows: [
          ["id / symbol", "string"],
          ["side", '"long" | "short"'],
          ["quantity", "number", undefined, "Absolute size in base."],
          ["entryPrice / markPrice", "number"],
          ["liquidationPrice", "number | null"],
          ["leverage", "number"],
          ["marginMode", '"cross" | "isolated"'],
          ["margin", "number | null", undefined, "Isolated margin."],
          ["notional", "number", "quantity × markPrice"],
          ["unrealizedPnl", "number"],
          ["roi", "number | null", undefined, "Fraction."],
          ["takeProfitPrice / stopLossPrice", "number | null"],
          ["tick / baseDp / iconSrc", "number / number / string"],
        ],
      },
      { component: "PositionCard", description: "The mobile card on its own.", rows: [["position", "Position"], ["…actions", "same callbacks as PositionsTable"]] },
    ],
  },
  "close-position": {
    usage: `import { ClosePositionDialog, CloseAllPositionsDialog } from "@/components/trading/close-position"

<ClosePositionDialog
  trigger={<Button variant="outline">Close</Button>}
  symbol={position.symbol}
  side={position.side}
  positionQuantity={position.quantity}
  markPrice={ticker.mark}
  estimatedPnl={({ price, quantity }) => estimatePnl(position, price, quantity)}
  priceError={errors.price}
  onConfirm={({ orderType, price, quantity }) => submitClose(position, orderType, price, quantity)}
/>

<CloseAllPositionsDialog counts={{ all: 4, profitable: 3, losing: 1 }} onConfirm={closeAll} />`,
    notes:
      "Inputs default to the whole position and, for limit closes, the mark price. Order type, price and quantity are each controllable (`orderType` / `price` / `quantity` with `default*` and `on*Change`). `estimatedPnl` takes a number or a function of the current inputs — the component does no PnL maths itself. Validation errors come in as `priceError` / `quantityError`. `ClosePositionForm` is the same form without the dialog, for popovers and sheets.",
    props: [
      {
        component: "ClosePositionDialog",
        rows: [
          ["open / defaultOpen / onOpenChange", "boolean / boolean / (open) => void"],
          ["trigger", "ReactElement", undefined, "Opens the dialog."],
          ["symbol", "string"],
          ["side", '"long" | "short"', undefined, "Side of the position being closed."],
          ["positionQuantity", "number"],
          ["markPrice", "number | null"],
          ["leverage / tick / baseDp", "number"],
          ["quote", "string", '"USDC"'],
          ["orderType / defaultOrderType / onOrderTypeChange", '"market" | "limit"', '"market"'],
          ["price / defaultPrice / onPriceChange", "string"],
          ["quantity / defaultQuantity / onQuantityChange", "string", "whole position"],
          ["estimatedPnl", "number | null | (order) => number | null"],
          ["priceError / quantityError", "ReactNode"],
          ["submitting", "boolean"],
          ["onConfirm", "({ orderType, price, quantity }) => void"],
          ["closeOnConfirm", "boolean", "true"],
        ],
      },
      {
        component: "CloseAllPositionsDialog",
        rows: [
          ["open / defaultOpen / onOpenChange / trigger", "…"],
          ["scope / defaultScope / onScopeChange", '"all" | "profitable" | "losing"', '"all"'],
          ["counts", "Partial<Record<scope, number>>", undefined, "Options with 0 are disabled."],
          ["description", "ReactNode"],
          ["onConfirm", "(scope) => void"],
        ],
      },
    ],
  },
  "adjust-margin": {
    usage: `import { AdjustMarginDialog } from "@/components/trading/adjust-margin"

<AdjustMarginDialog
  trigger={<Button size="xs">Adjust</Button>}
  symbol={position.symbol}
  side={position.side}
  leverage={position.leverage}
  currentMargin={position.margin}
  maxAdd={freeCollateral}
  maxRemove={maxRemovable}
  liquidationPrice={position.liqPrice}
  liquidationPriceAfter={preview?.liqPrice}
  leverageAfter={preview?.leverage}
  onAmountChange={(_, { value, mode }) => setPreview(estimate(position, value, mode))}
  onConfirm={({ mode, amount }) => adjustMargin(position, mode, amount)}
/>`,
    notes:
      "The \"after\" values are yours to compute: listen to `onAmountChange` (fires on typing and slider moves with the parsed value and mode) and pass `liquidationPriceAfter` / `leverageAfter` back. `marginAfter` defaults to current ± amount. Switching between add and remove clears the amount. `AdjustMarginForm` renders the form without the dialog.",
    props: [
      {
        component: "AdjustMarginDialog",
        rows: [
          ["open / defaultOpen / onOpenChange / trigger", "…"],
          ["symbol", "string"],
          ["side", '"long" | "short"'],
          ["leverage", "number"],
          ["currentMargin", "number"],
          ["maxAdd / maxRemove", "number"],
          ["liquidationPrice / liquidationPriceAfter", "number | null"],
          ["marginAfter", "number | null", "current ± amount"],
          ["leverageAfter", "number | null", undefined, "Row hidden when omitted."],
          ["mode / defaultMode / onModeChange", '"add" | "remove"', '"add"'],
          ["amount / defaultAmount", "string"],
          ["onAmountChange", "(amount, { value, mode }) => void"],
          ["error", "ReactNode"],
          ["submitting", "boolean"],
          ["onConfirm", "({ mode, amount }) => void"],
          ["quote / tick / amountDp", "string / number / number", '"USDC" / — / 2'],
        ],
      },
    ],
  },
  "reverse-position": {
    usage: `import { ReversePositionDialog } from "@/components/trading/reverse-position"

<ReversePositionDialog
  trigger={<Button size="icon-xs" aria-label="Reverse"><ArrowLeftRightIcon /></Button>}
  symbol={position.symbol}
  side={position.side}
  quantity={position.quantity}
  leverage={position.leverage}
  markPrice={ticker.mark}
  estimatedPnl={position.unrealizedPnl}
  error={belowMin ? "Below minimum order size." : undefined}
  onConfirm={() => reverse(position)}
/>`,
    notes:
      "Two legs side by side from `sm` up — close the current position, open the opposite — stacked on phones. The confirm button takes the new side's colour. Pass `error` to replace the warning and disable confirm. `ReverseOrderCard` is exported for custom layouts.",
    props: [
      {
        component: "ReversePositionDialog",
        rows: [
          ["open / defaultOpen / onOpenChange / trigger", "…"],
          ["symbol", "string"],
          ["side", '"long" | "short"', undefined, "Current side."],
          ["quantity", "number"],
          ["reverseQuantity", "number", "quantity"],
          ["leverage / markPrice / tick / baseDp", "number"],
          ["estimatedPnl", "number | null", undefined, "Shown on the close leg."],
          ["estimatedLiquidationPrice", "number | null", undefined, "Shown on the open leg."],
          ["error / description", "ReactNode"],
          ["submitting", "boolean"],
          ["onConfirm", "() => void"],
        ],
      },
    ],
  },
  "orders-table": {
    usage: `import { DEFAULT_ORDER_TABS, OrdersTable } from "@/components/trading/orders-table"

<OrdersTable
  orders={orders}
  tabs={DEFAULT_ORDER_TABS.filter((t) => t.value !== "history")}
  markPrices={marks}
  onEdit={(order, { price, quantity }) => amendOrder(order.id, price, quantity)}
  onCancel={(order) => cancelOrder(order.id)}
  onCancelAll={(tab, list) => cancelOrders(list)}
/>`,
    notes:
      "Tabs are data: each has a `filter`, `columns`, and flags for counts and \"Cancel all\". The defaults are Open, TP/SL, Filled, Cancelled and Order history. On desktop, price and quantity of open limit orders edit inline (Enter saves, Escape discards); on mobile the Edit button opens `EditOrderDialog`. Edits and cancels are callbacks only — update `orders` when your API confirms.",
    align: "start",
    props: [
      {
        component: "OrdersTable",
        rows: [
          ["orders", "Order[]"],
          ["tabs", "OrdersTab[]", "DEFAULT_ORDER_TABS"],
          ["tab / defaultTab / onTabChange", "string"],
          ["onEdit", "(order, { price, quantity, triggerPrice? }) => void"],
          ["onCancel", "(order) => void"],
          ["onCancelAll", "(tab, orders) => void"],
          ["onShare", "(order) => void", undefined, "Filled orders."],
          ["onSymbolClick", "(order) => void"],
          ["markPrices", "Record<symbol, number>", undefined, "Shown in the edit dialog."],
          ["formatTime", "(time) => ReactNode", "YYYY-MM-DD HH:mm:ss"],
          ["loading", "boolean"],
          ["toolbar", "ReactNode", undefined, "End of the tab bar."],
        ],
      },
      {
        component: "Order",
        rows: [
          ["id / symbol", "string"],
          ["side", '"buy" | "sell"'],
          ["type", '"limit" | "market" | "stop_limit" | "stop_market" | "take_profit" | "stop_loss" | "tp_sl" | "trailing_stop"'],
          ["status", '"open" | "partially_filled" | "filled" | "cancelled" | "rejected"'],
          ["price", "number | null", undefined, "null renders Market."],
          ["triggerPrice / avgPrice", "number | null"],
          ["quantity / filled", "number"],
          ["time", "number | Date"],
          ["takeProfitPrice / stopLossPrice", "number | null", undefined, "Bracket legs."],
          ["realizedPnl / fee", "number | null"],
          ["reduceOnly / editable", "boolean"],
          ["tick / baseDp / iconSrc", "number / number / string"],
        ],
      },
      {
        component: "OrdersTab",
        rows: [
          ["value", "string"],
          ["label", "ReactNode"],
          ["filter", "(order) => boolean"],
          ["columns", '("symbol" | "side" | "type" | "price" | "avgPrice" | "trigger" | "quantity" | "tpsl" | "pnl" | "fee" | "status" | "time" | "actions")[]'],
          ["showCount / cancelAll", "boolean"],
          ["emptyText", "ReactNode"],
        ],
      },
    ],
  },
  "position-history": {
    usage: `import { PositionHistory } from "@/components/trading/position-history"

<PositionHistory
  positions={closedPositions}
  liquidations={liquidations}
  range={range}
  onRangeChange={setRange}
  onShare={openSharePnl}
/>`,
    notes:
      "Each row expands to a breakdown — realised PnL, funding and trading fees, net PnL, timestamps and liquidation fees. Statuses are Closed, Partially closed, Liquidated and ADL. Passing `liquidations` adds a Liquidations tab with margin-ratio details. The 1D / 7D / 30D / 90D chips only show when `onRangeChange` (or `range`) is passed — filtering is up to you.",
    align: "start",
    props: [
      {
        component: "PositionHistory",
        rows: [
          ["positions", "ClosedPosition[]"],
          ["liquidations", "LiquidationRecord[]", undefined, "Adds the Liquidations tab."],
          ["tab / defaultTab / onTabChange", '"positions" | "liquidations"', '"positions"'],
          ["ranges", "{ value, label }[]", "1D / 7D / 30D / 90D"],
          ["range / defaultRange / onRangeChange", "string"],
          ["onShare", "(position) => void"],
          ["onSymbolClick", "(symbol) => void"],
          ["formatTime", "(time) => ReactNode"],
          ["quote", "string", '"USDC"'],
          ["loading", "boolean"],
          ["toolbar", "ReactNode"],
        ],
      },
      {
        component: "ClosedPosition",
        rows: [
          ["id / symbol", "string"],
          ["side", '"long" | "short"'],
          ["status", '"closed" | "partially_closed" | "liquidated" | "adl"'],
          ["openTime / closeTime", "number | Date"],
          ["avgEntryPrice / avgClosePrice", "number"],
          ["closedQuantity / maxQuantity", "number"],
          ["realizedPnl / netPnl", "number", undefined, "netPnl defaults to realizedPnl."],
          ["fundingFee / tradingFee", "number | null", undefined, "Signed; negative is paid."],
          ["liquidation", "{ id?, liquidatorFee?, insuranceFundFee? }"],
          ["leverage / marginMode / tick / baseDp / iconSrc", "…"],
        ],
      },
      {
        component: "LiquidationRecord",
        rows: [
          ["id / time / symbol", "string | number / number | Date / string"],
          ["markPrice / quantity", "number"],
          ["feeRate / fee", "number | null", undefined, "Rate is a fraction."],
          ["marginRatio / maintenanceMarginRatio", "number | null", undefined, "Fractions."],
          ["collateral / notional", "number | null"],
        ],
      },
    ],
  },
  "funding-fee-history": {
    usage: `import { FundingFeeHistory } from "@/components/trading/funding-fee-history"

<FundingFeeHistory
  payments={fundingPayments}
  symbol={symbol}
  onSymbolChange={setSymbol}
/>`,
    notes:
      "Payments are signed: positive means received, negative means paid, and are coloured to match. The totals row sums the visible rows unless you pass `total` (e.g. a server-side total). The symbol filter lists the symbols in `payments` unless you pass `symbols`; set `filterLocally={false}` when your API already filters.",
    align: "start",
    props: [
      {
        component: "FundingFeeHistory",
        rows: [
          ["payments", "FundingPayment[]"],
          ["symbol / defaultSymbol / onSymbolChange", "string", '"all"'],
          ["symbols", "string[]", "from payments", "Pass [] to hide the filter."],
          ["total", "number | null", "sum of rows"],
          ["filterLocally", "boolean", "true"],
          ["quote", "string", '"USDC"'],
          ["formatTime", "(time) => ReactNode"],
          ["loading", "boolean"],
          ["toolbar", "ReactNode", undefined, "E.g. a date range picker."],
        ],
      },
      {
        component: "FundingPayment",
        rows: [
          ["id / symbol", "string"],
          ["time", "number | Date"],
          ["rate", "number", undefined, "Fraction — 0.0001 = 0.01%."],
          ["positionSize", "number"],
          ["side", '"long" | "short"'],
          ["payment", "number", undefined, "Signed, in quote."],
          ["status", '"settled" | "accrued"'],
        ],
      },
    ],
  },
};
