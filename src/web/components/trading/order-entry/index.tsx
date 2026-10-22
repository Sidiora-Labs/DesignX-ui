import { ChevronDownIcon, InfoIcon, PlusIcon } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useState, type FormEvent, type ReactNode } from "react";

import {
  LeverageDialog,
  type LeverageSelectorProps,
} from "@/components/trading/leverage-selector";
import {
  MARGIN_MODE_LABEL,
  MarginModeDialog,
  type MarginMode,
  type MarginModeSettingsItem,
} from "@/components/trading/margin-mode";
import { Numeral } from "@/components/trading/numeral";
import {
  EMPTY_TPSL,
  TpslEditor,
  type TpslErrors,
  type TpslMode,
  type TpslValue,
} from "@/components/trading/tpsl-editor";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SPRING_PANEL } from "@/lib/ease";
import {
  decimalsFromTick,
  formatNumber,
  parseSymbol,
  SIDE_FILL,
  type OrderSide,
} from "@/lib/trading";
import { cn } from "@/lib/utils";

import {
  capDecimals,
  cleanNumber,
  EntryField,
  entryInputClass,
  num,
  Segmented,
  toInput,
} from "./fields";
import { EntrySummary } from "./summary";

/* ------------------------------------------------------------ types */

export type OrderEntryType =
  | "limit"
  | "market"
  | "stop-limit"
  | "stop-market"
  | "scaled"
  | "trailing-stop";

export const ORDER_ENTRY_TYPE_LABEL: Record<OrderEntryType, string> = {
  limit: "Limit",
  market: "Market",
  "stop-limit": "Stop limit",
  "stop-market": "Stop market",
  scaled: "Scaled",
  "trailing-stop": "Trailing stop",
};

export const DEFAULT_ORDER_TYPES: OrderEntryType[] = [
  "limit",
  "market",
  "stop-limit",
  "stop-market",
  "scaled",
  "trailing-stop",
];

/** Time-in-force flag for limit orders. */
export type OrderExecution = "post-only" | "ioc" | "fok";

export type ScaledDistribution = "flat" | "ascending" | "descending" | "custom";

/**
 * Every value the form edits. Numbers are kept as the text the user typed (`"0."` survives);
 * parse them in your submit handler.
 */
export type OrderEntryValues = {
  side: OrderSide;
  type: OrderEntryType;
  price: string;
  triggerPrice: string;
  /** Size in base units. */
  quantity: string;
  /** Size in quote units — kept in step with `quantity` through the order price. */
  total: string;
  /** Which unit the size field takes. In `quote`, the user edits `total` and `quantity` is derived. */
  quantityUnit: "base" | "quote";
  startPrice: string;
  endPrice: string;
  totalOrders: string;
  distribution: ScaledDistribution;
  skew: string;
  activationPrice: string;
  callbackType: "value" | "rate";
  callbackValue: string;
  /** Percent as typed, e.g. `"1.5"`. */
  callbackRate: string;
  reduceOnly: boolean;
  execution: OrderExecution | null;
  tpslEnabled: boolean;
  tpsl: TpslValue;
};

export const DEFAULT_ORDER_ENTRY_VALUES: OrderEntryValues = {
  side: "buy",
  type: "limit",
  price: "",
  triggerPrice: "",
  quantity: "",
  total: "",
  quantityUnit: "base",
  startPrice: "",
  endPrice: "",
  totalOrders: "",
  distribution: "flat",
  skew: "",
  activationPrice: "",
  callbackType: "value",
  callbackValue: "",
  callbackRate: "",
  reduceOnly: false,
  execution: null,
  tpslEnabled: false,
  tpsl: EMPTY_TPSL,
};

export type OrderEntryField =
  | "price"
  | "triggerPrice"
  | "quantity"
  | "total"
  | "startPrice"
  | "endPrice"
  | "totalOrders"
  | "skew"
  | "activationPrice"
  | "callbackValue"
  | "callbackRate";

/** Per-field messages from your validation. `tpsl` is passed through to the TP/SL editor. */
export type OrderEntryErrors = Partial<Record<OrderEntryField, ReactNode>> & {
  tpsl?: TpslErrors;
};

export interface OrderEntryProps {
  /** `PERP_BTC_USDC`, `BTC-PERP`… — base and quote units come from here. */
  symbol: string;
  values?: OrderEntryValues;
  defaultValues?: Partial<OrderEntryValues>;
  /** Every edit, so the host can recompute max quantity, fees and errors. */
  onValuesChange?: (values: OrderEntryValues) => void;
  /** Called with the form values when the submit button is pressed. Validate and confirm in here. */
  onSubmit?: (values: OrderEntryValues) => void;
  /** Order types to offer, in order. Limit and market show as tabs, the rest in a menu. */
  orderTypes?: OrderEntryType[];
  /** Price increment. */
  tick?: number;
  /** Quantity decimals. */
  baseDp?: number;
  /** Mark or last price — prices market orders when converting quantity ↔ total. */
  referencePrice?: number | null;
  /** Mid price for the "Mid" shortcut on the limit price. */
  midPrice?: number | null;
  /** Largest quantity for the current side, in base units. Drives the percent slider. */
  maxQuantity?: number | null;
  /** Free collateral in quote. */
  available?: number | null;
  onDeposit?: () => void;
  marginMode?: MarginMode;
  onMarginModeChange?: (mode: MarginMode) => void;
  marginModeSettings?: MarginModeSettingsItem[];
  onApplyMarginModeSettings?: (symbols: string[], mode: MarginMode) => void;
  leverage?: number;
  maxLeverage?: number;
  onLeverageChange?: (leverage: number) => void;
  maxPositionNotional?: LeverageSelectorProps["maxPositionNotional"];
  estLiqPrice?: number | null;
  /** Fee rates as fractions (0.0005 = 0.05%). */
  fees?: { taker: number; maker: number } | null;
  /** Max slippage for market orders as a fraction. */
  slippage?: number;
  estSlippage?: number | null;
  onSlippageChange?: (fraction: number) => void;
  errors?: OrderEntryErrors;
  /** Non-blocking stop-loss notice, e.g. close to liquidation price. */
  slWarning?: ReactNode;
  tpslMode?: TpslMode;
  onTpslModeChange?: (mode: TpslMode) => void;
  /** Spinner on the submit button. */
  submitting?: boolean;
  /** Read-only form, e.g. while disconnected. */
  disabled?: boolean;
  /** Replaces "Buy / Long" and "Sell / Short". */
  submitLabel?: ReactNode;
  className?: string;
}

const isStop = (t: OrderEntryType) => t === "stop-limit" || t === "stop-market";
const hasLimitPrice = (t: OrderEntryType) =>
  t === "limit" || t === "stop-limit";
const supportsTpsl = (t: OrderEntryType) => t === "limit" || t === "market";

/** The price that turns quantity into total for the current order type. */
function pricingPrice(v: OrderEntryValues, ref: number | null | undefined) {
  switch (v.type) {
    case "limit":
    case "stop-limit":
      return num(v.price);
    case "stop-market":
      return num(v.triggerPrice) ?? ref ?? null;
    case "trailing-stop":
      return num(v.activationPrice) ?? ref ?? null;
    case "scaled": {
      const a = num(v.startPrice);
      const b = num(v.endPrice);
      return a != null && b != null ? (a + b) / 2 : (ref ?? null);
    }
    default:
      return ref ?? null;
  }
}

const MARKS = [0, 25, 50, 75, 100];

/* ------------------------------------------------------------ component */

/** A perpetuals order form. Pure view: values in, edits and submit out — no pricing, validation or account logic. */
export function OrderEntry({
  symbol,
  values: valuesProp,
  defaultValues,
  onValuesChange,
  onSubmit,
  orderTypes = DEFAULT_ORDER_TYPES,
  tick = 0.01,
  baseDp = 4,
  referencePrice,
  midPrice,
  maxQuantity,
  available,
  onDeposit,
  marginMode,
  onMarginModeChange,
  marginModeSettings,
  onApplyMarginModeSettings,
  leverage,
  maxLeverage,
  onLeverageChange,
  maxPositionNotional,
  estLiqPrice,
  fees,
  slippage,
  estSlippage,
  onSlippageChange,
  errors = {},
  slWarning,
  tpslMode,
  onTpslModeChange,
  submitting,
  disabled,
  submitLabel,
  className,
}: OrderEntryProps) {
  const { base, quote: parsedQuote } = parseSymbol(symbol);
  const quote = parsedQuote || "USDC";
  const priceDp = decimalsFromTick(tick);
  const reduce = useReducedMotion();
  const ids = {
    price: useId(),
    trigger: useId(),
    qty: useId(),
    total: useId(),
    start: useId(),
    end: useId(),
    orders: useId(),
    skew: useId(),
    activation: useId(),
    callback: useId(),
    tpsl: useId(),
    reduce: useId(),
  };

  const [inner, setInner] = useState<OrderEntryValues>(() => ({
    ...DEFAULT_ORDER_ENTRY_VALUES,
    ...defaultValues,
  }));
  const v = valuesProp ?? inner;
  const commit = (next: OrderEntryValues) => {
    if (!valuesProp) setInner(next);
    onValuesChange?.(next);
  };

  /** Patch values and keep quantity ↔ total in step through the pricing price. */
  const update = (
    patch: Partial<OrderEntryValues>,
    driver: "quantity" | "total" = v.quantityUnit === "base" &&
    num(v.quantity) != null
      ? "quantity"
      : "total",
  ) => {
    const next = { ...v, ...patch };
    if (!supportsTpsl(next.type)) next.tpslEnabled = false;
    if (next.type !== "limit") next.execution = null;
    const p = pricingPrice(next, referencePrice);
    if (p && driver === "quantity")
      next.total = toInput((num(next.quantity) ?? 0) * p, 2);
    else if (p)
      next.quantity = toInput((num(next.total) ?? 0) / p, baseDp, "floor");
    commit(next);
  };

  /* ---------- sizing */
  const [totalMode, setTotalMode] = useState<"size" | "margin">("size");
  const [marginDraft, setMarginDraft] = useState<string | null>(null);
  const inQuote = v.quantityUnit === "quote";
  const lev = leverage && leverage > 0 ? leverage : 1;
  const qty = num(v.quantity) ?? 0;
  const max = maxQuantity ?? 0;
  const pct = max > 0 ? Math.min(100, (qty / max) * 100) : 0;
  const setPct = (p: number) =>
    update({ quantity: toInput((max * p) / 100, baseDp, "floor") }, "quantity");
  const tone = v.side === "buy" ? "buy" : "sell";
  const sideRange =
    v.side === "buy"
      ? "[&_[data-slot=slider-range]]:bg-emerald-500 [&_[data-slot=slider-thumb]]:bg-emerald-500"
      : "[&_[data-slot=slider-range]]:bg-rose-500 [&_[data-slot=slider-thumb]]:bg-rose-500";

  /* ---------- order types */
  const basicTypes: OrderEntryType[] = orderTypes.filter((t) => t === "limit" || t === "market");
  const advancedTypes: OrderEntryType[] = orderTypes.filter(
    (t) => t !== "limit" && t !== "market",
  );
  const advancedItems = [
    { label: "Advanced", value: null as OrderEntryType | null },
    ...advancedTypes.map((t) => ({
      label: ORDER_ENTRY_TYPE_LABEL[t],
      value: t as OrderEntryType | null,
    })),
  ];
  const isAdvanced = advancedTypes.includes(v.type);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!disabled && !submitting) onSubmit?.(v);
  };

  const priceInput = (
    id: string,
    key:
      "price" | "triggerPrice" | "startPrice" | "endPrice" | "activationPrice",
    label: string,
    extra?: ReactNode,
  ) => (
    <EntryField
      id={id}
      label={label}
      error={errors[key]}
      disabled={disabled}
      suffix={
        <>
          {extra}
          <span>{quote}</span>
        </>
      }
    >
      <input
        id={id}
        inputMode="decimal"
        autoComplete="off"
        placeholder="0"
        disabled={disabled}
        aria-invalid={!!errors[key] || undefined}
        value={v[key]}
        onChange={(e) =>
          update({
            [key]: capDecimals(cleanNumber(e.target.value), priceDp),
          } as Partial<OrderEntryValues>)
        }
        className={entryInputClass}
      />
    </EntryField>
  );

  const marginValue =
    marginDraft ??
    (num(v.total) != null ? toInput((num(v.total) ?? 0) / lev, 2) : "");

  return (
    <form
      data-slot="order-entry"
      onSubmit={submit}
      noValidate
      className={cn("flex w-full flex-col gap-3 text-sm", className)}
    >
      {/* margin mode + leverage */}
      {(marginMode || leverage != null) && (
        <div className="flex h-8 items-center rounded-lg bg-container">
          {marginMode && (
            <MarginModeDialog
              symbol={symbol}
              value={marginMode}
              onValueChange={onMarginModeChange}
              settings={marginModeSettings}
              onApplySettings={onApplyMarginModeSettings}
              disabled={disabled || !onMarginModeChange}
              trigger={
                <button
                  type="button"
                  aria-label="Switch margin mode"
                  className="focus-ring flex h-full flex-1 items-center justify-center gap-1 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground disabled:cursor-not-allowed"
                >
                  {MARGIN_MODE_LABEL[marginMode]}
                </button>
              }
            />
          )}
          {marginMode && leverage != null && (
            <span aria-hidden className="h-4 w-px bg-border" />
          )}
          {leverage != null && (
            <LeverageDialog
              value={leverage}
              max={maxLeverage ?? Math.max(leverage, 1)}
              onConfirm={onLeverageChange}
              maxPositionNotional={maxPositionNotional}
              quote={quote}
              symbol={symbol}
              side={v.side}
              marginMode={marginMode}
              disabled={disabled || !onLeverageChange}
              trigger={
                <button
                  type="button"
                  aria-label="Adjust leverage"
                  className="focus-ring flex h-full flex-1 items-center justify-center rounded-lg font-mono text-xs font-semibold text-muted-foreground tabular-nums hover:text-foreground disabled:cursor-not-allowed"
                >
                  {leverage}x
                </button>
              }
            />
          )}
        </div>
      )}

      {/* order type */}
      <div className="flex gap-1">
        {basicTypes.map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={v.type === t}
            disabled={disabled}
            onClick={() => update({ type: t })}
            className={cn(
              "focus-ring h-8 flex-1 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50",
              v.type === t
                ? "bg-container-highest text-foreground"
                : "bg-container text-muted-foreground hover:text-foreground",
            )}
          >
            {ORDER_ENTRY_TYPE_LABEL[t]}
          </button>
        ))}
        {advancedTypes.length > 0 && (
          <Select
            items={advancedItems}
            value={isAdvanced ? v.type : null}
            onValueChange={(t) => t && update({ type: t })}
            disabled={disabled}
          >
            <SelectTrigger
              size="sm"
              aria-label="Advanced order type"
              className={cn(
                "h-8 min-w-0 flex-[1.4] rounded-lg border-none px-2.5 text-xs font-semibold data-[size=sm]:rounded-lg",
                isAdvanced
                  ? "bg-container-highest text-foreground"
                  : "bg-container text-muted-foreground",
              )}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false} align="end">
              {advancedTypes.map((t) => (
                <SelectItem key={t} value={t} className="h-8 text-xs">
                  {ORDER_ENTRY_TYPE_LABEL[t]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* side */}
      <div className="grid grid-cols-2 gap-1.5">
        {(["buy", "sell"] as const).map((s) => (
          <button
            key={s}
            type="button"
            aria-pressed={v.side === s}
            disabled={disabled}
            onClick={() => update({ side: s })}
            className={cn(
              "focus-ring h-9 rounded-lg text-[13px] font-semibold transition-colors disabled:opacity-50",
              v.side === s
                ? SIDE_FILL[s]
                : "bg-container text-muted-foreground hover:text-foreground",
            )}
          >
            {s === "buy" ? "Buy" : "Sell"}
          </button>
        ))}
      </div>

      {/* available */}
      {available !== undefined && (
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-muted-foreground">Available</span>
          <span className="flex items-center gap-1">
            <Numeral
              value={disabled ? 0 : available}
              dp={2}
              pad={false}
              unit={quote}
            />
            {onDeposit && (
              <button
                type="button"
                aria-label="Deposit"
                onClick={onDeposit}
                className="focus-ring grid size-5 place-items-center rounded-full text-primary hover:bg-container-high"
              >
                <PlusIcon className="size-3" />
              </button>
            )}
          </span>
        </div>
      )}

      {/* inputs */}
      <div className="flex flex-col gap-1">
        {isStop(v.type) &&
          priceInput(ids.trigger, "triggerPrice", "Trigger price")}
        {hasLimitPrice(v.type) &&
          priceInput(
            ids.price,
            "price",
            "Price",
            v.type === "limit" && midPrice != null ? (
              <button
                type="button"
                disabled={disabled}
                onClick={() => update({ price: midPrice.toFixed(priceDp) })}
                className="focus-ring rounded px-1 font-medium text-primary hover:bg-primary/10"
              >
                Mid
              </button>
            ) : undefined,
          )}

        {v.type === "scaled" && (
          <>
            {priceInput(ids.start, "startPrice", "Start price")}
            {priceInput(ids.end, "endPrice", "End price")}
          </>
        )}

        {v.type === "trailing-stop" && (
          <>
            {priceInput(
              ids.activation,
              "activationPrice",
              "Activation price (optional)",
            )}
            <EntryField
              id={ids.callback}
              label={
                v.callbackType === "rate" ? "Trailing rate" : "Trailing value"
              }
              error={
                v.callbackType === "rate"
                  ? errors.callbackRate
                  : errors.callbackValue
              }
              disabled={disabled}
              suffix={
                <Segmented
                  label="Trailing unit"
                  className="w-24"
                  itemClassName="h-5 rounded"
                  value={v.callbackType}
                  disabled={disabled}
                  onChange={(callbackType) => update({ callbackType })}
                  options={[
                    { value: "value", label: quote },
                    { value: "rate", label: "%" },
                  ]}
                />
              }
              footer={
                v.callbackType === "rate" && (
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 5].map((r) => (
                      <button
                        key={r}
                        type="button"
                        aria-pressed={v.callbackRate === String(r)}
                        disabled={disabled}
                        onClick={() => update({ callbackRate: String(r) })}
                        className={cn(
                          "focus-ring h-5 flex-1 rounded border font-mono text-[10px] tabular-nums",
                          v.callbackRate === String(r)
                            ? "border-foreground/40 text-foreground"
                            : "border-border text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {r}%
                      </button>
                    ))}
                  </div>
                )
              }
            >
              <input
                id={ids.callback}
                inputMode="decimal"
                autoComplete="off"
                placeholder="0"
                disabled={disabled}
                value={
                  v.callbackType === "rate" ? v.callbackRate : v.callbackValue
                }
                onChange={(e) => {
                  const text = cleanNumber(e.target.value);
                  update(
                    v.callbackType === "rate"
                      ? { callbackRate: capDecimals(text, 1) }
                      : { callbackValue: capDecimals(text, priceDp) },
                  );
                }}
                className={entryInputClass}
              />
            </EntryField>
          </>
        )}

        <EntryField
          id={ids.qty}
          label={v.type === "scaled" ? "Total quantity" : "Quantity"}
          suffix={
            <Segmented
              label="Quantity unit"
              className="w-28"
              itemClassName="h-5 rounded"
              value={v.quantityUnit}
              disabled={disabled}
              onChange={(quantityUnit) => update({ quantityUnit })}
              options={[
                { value: "base", label: base },
                { value: "quote", label: quote },
              ]}
            />
          }
          footer={
            inQuote && (
              <span className="text-[11px] text-muted-foreground">
                ≈{" "}
                <Numeral
                  value={num(v.quantity)}
                  dp={baseDp}
                  pad={false}
                  unit={base}
                  placeholder="0"
                />
              </span>
            )
          }
          error={inQuote ? (errors.total ?? errors.quantity) : errors.quantity}
          disabled={disabled}
        >
          {inQuote ? (
            <input
              id={ids.qty}
              inputMode="decimal"
              autoComplete="off"
              placeholder="0"
              disabled={disabled}
              aria-invalid={!!(errors.total ?? errors.quantity) || undefined}
              value={v.total}
              onChange={(e) =>
                update(
                  { total: capDecimals(cleanNumber(e.target.value), 2) },
                  "total",
                )
              }
              className={entryInputClass}
            />
          ) : (
            <input
              id={ids.qty}
              inputMode="decimal"
              autoComplete="off"
              placeholder="0"
              disabled={disabled}
              aria-invalid={!!errors.quantity || undefined}
              value={v.quantity}
              onChange={(e) =>
                update(
                  {
                    quantity: capDecimals(cleanNumber(e.target.value), baseDp),
                  },
                  "quantity",
                )
              }
              className={entryInputClass}
            />
          )}
        </EntryField>

        {!inQuote && (
          <EntryField
            id={ids.total}
            label={totalMode === "size" ? "Order size ≈" : "Initial margin ≈"}
            labelAddon={
              <DropdownMenu>
                <DropdownMenuTrigger
                  disabled={disabled}
                  render={
                    <button
                      type="button"
                      aria-label="Switch between order size and initial margin"
                    />
                  }
                  className="focus-ring grid size-4 place-items-center rounded text-muted-foreground hover:text-foreground"
                >
                  <ChevronDownIcon className="size-3" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="min-w-36">
                  <DropdownMenuRadioGroup
                    value={totalMode}
                    onValueChange={(m) => setTotalMode(m as "size" | "margin")}
                  >
                    <DropdownMenuRadioItem value="size" className="h-8 text-xs">
                      Order size
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                      value="margin"
                      className="h-8 text-xs"
                    >
                      Initial margin
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            }
            suffix={<span>{quote}</span>}
            error={errors.total}
            disabled={disabled}
          >
            {totalMode === "size" ? (
              <input
                id={ids.total}
                inputMode="decimal"
                autoComplete="off"
                placeholder="0"
                disabled={disabled}
                aria-invalid={!!errors.total || undefined}
                value={v.total}
                onChange={(e) =>
                  update(
                    { total: capDecimals(cleanNumber(e.target.value), 2) },
                    "total",
                  )
                }
                className={entryInputClass}
              />
            ) : (
              <input
                id={ids.total}
                inputMode="decimal"
                autoComplete="off"
                placeholder="0"
                disabled={disabled}
                aria-invalid={!!errors.total || undefined}
                value={marginValue}
                onFocus={() => setMarginDraft(marginValue)}
                onBlur={() => setMarginDraft(null)}
                onChange={(e) => {
                  const text = capDecimals(cleanNumber(e.target.value), 2);
                  setMarginDraft(text);
                  const m = num(text);
                  update(
                    { total: m != null ? toInput(m * lev, 2) : "" },
                    "total",
                  );
                }}
                className={entryInputClass}
              />
            )}
          </EntryField>
        )}

        {v.type === "scaled" && (
          <>
            <EntryField
              id={ids.orders}
              label="Total orders"
              error={errors.totalOrders}
              disabled={disabled}
            >
              <input
                id={ids.orders}
                inputMode="numeric"
                autoComplete="off"
                placeholder="2–20"
                disabled={disabled}
                value={v.totalOrders}
                onChange={(e) =>
                  update({
                    totalOrders: e.target.value
                      .replace(/[^0-9]/g, "")
                      .slice(0, 3),
                  })
                }
                className={entryInputClass}
              />
            </EntryField>
            <div className="flex flex-col gap-1.5 rounded-lg bg-container-high p-2.5">
              <span className="text-[11px] text-muted-foreground">
                Quantity distribution
              </span>
              <Segmented
                label="Quantity distribution"
                value={v.distribution}
                disabled={disabled}
                onChange={(distribution) => update({ distribution })}
                options={[
                  { value: "flat", label: "Flat" },
                  { value: "ascending", label: "Asc." },
                  { value: "descending", label: "Desc." },
                  { value: "custom", label: "Custom" },
                ]}
              />
            </div>
            {v.distribution === "custom" && (
              <EntryField
                id={ids.skew}
                label="Skew (size at end ÷ size at start)"
                error={errors.skew}
                disabled={disabled}
              >
                <input
                  id={ids.skew}
                  inputMode="decimal"
                  autoComplete="off"
                  placeholder="1"
                  disabled={disabled}
                  value={v.skew}
                  onChange={(e) =>
                    update({
                      skew: capDecimals(cleanNumber(e.target.value), 2),
                    })
                  }
                  className={entryInputClass}
                />
              </EntryField>
            )}
          </>
        )}
      </div>

      {/* percent slider */}
      <div className="flex flex-col gap-1 px-0.5">
        <Slider
          value={pct}
          min={0}
          max={100}
          step={1}
          disabled={disabled || max <= 0}
          aria-label="Quantity as percent of max"
          className={sideRange}
          onValueChange={(p) => setPct(Array.isArray(p) ? p[0] : (p as number))}
        />
        <div className="relative h-4">
          {MARKS.map((m, i) => (
            <button
              key={m}
              type="button"
              disabled={disabled || max <= 0}
              onClick={() => setPct(m)}
              style={{ left: `${m}%` }}
              className={cn(
                "focus-ring absolute top-0 rounded px-0.5 font-mono text-[10px] tabular-nums transition-colors disabled:opacity-50",
                i === 0
                  ? ""
                  : i === MARKS.length - 1
                    ? "-translate-x-full"
                    : "-translate-x-1/2",
                pct >= m && max > 0
                  ? v.side === "buy"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-rose-600 dark:text-rose-400"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {m}%
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-mono text-muted-foreground tabular-nums">
            {formatNumber(pct, "number", { dp: 0 })}%
          </span>
          <button
            type="button"
            disabled={disabled || max <= 0}
            onClick={() => setPct(100)}
            className="focus-ring flex items-center gap-1 rounded px-0.5 text-muted-foreground hover:text-foreground"
          >
            {v.side === "buy" ? "Max buy" : "Max sell"}
            <Numeral
              value={disabled ? 0 : maxQuantity}
              dp={baseDp}
              pad={false}
              unit={base}
              className="text-foreground"
            />
          </button>
        </div>
      </div>

      {/* submit */}
      <Button
        type="submit"
        disabled={disabled || submitting}
        className={cn("h-10 w-full rounded-lg", SIDE_FILL[tone])}
      >
        {submitting && <Spinner />}
        {submitLabel ?? (v.side === "buy" ? "Buy / Long" : "Sell / Short")}
      </Button>

      <EntrySummary
        quote={quote}
        tick={tick}
        estLiqPrice={estLiqPrice}
        slippage={slippage}
        estSlippage={estSlippage}
        onSlippageChange={onSlippageChange}
        showSlippage={v.type === "market"}
        fees={fees}
      />

      <div className="h-px bg-border" />

      {/* TP/SL */}
      {supportsTpsl(v.type) && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <Switch
              id={ids.tpsl}
              size="sm"
              checked={v.tpslEnabled}
              disabled={disabled}
              onCheckedChange={(c) =>
                update({ tpslEnabled: c, execution: c ? null : v.execution })
              }
            />
            <label htmlFor={ids.tpsl} className="text-xs select-none">
              TP/SL
            </label>
          </div>
          <AnimatePresence initial={false}>
            {v.tpslEnabled && (
              <motion.div
                key="tpsl"
                initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                animate={
                  reduce ? { opacity: 1 } : { height: "auto", opacity: 1 }
                }
                exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                transition={reduce ? { duration: 0.12 } : SPRING_PANEL}
                className="overflow-hidden"
              >
                <TpslEditor
                  className="px-px pt-2"
                  layout="compact"
                  showQuantity={false}
                  value={v.tpsl}
                  onValueChange={(tpsl) => update({ tpsl })}
                  side={v.side}
                  entryPrice={pricingPrice(v, referencePrice)}
                  positionSize={qty}
                  base={base}
                  quote={quote}
                  tick={tick}
                  baseDp={baseDp}
                  mode={tpslMode}
                  onModeChange={onTpslModeChange}
                  errors={errors.tpsl}
                  slWarning={slWarning}
                  disabled={disabled}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* reduce only */}
      <div className="flex items-center gap-2">
        <Switch
          id={ids.reduce}
          size="sm"
          checked={v.reduceOnly}
          disabled={disabled}
          onCheckedChange={(c) => update({ reduceOnly: c })}
        />
        <label htmlFor={ids.reduce} className="text-xs select-none">
          Reduce only
        </label>
      </div>

      {/* time in force */}
      {orderTypes.includes("limit") && (
        <ExecutionOptions
          value={v.execution}
          onChange={(execution) => update({ execution })}
          disabled={disabled || v.type !== "limit" || v.tpslEnabled}
        />
      )}
    </form>
  );
}

const EXECUTIONS: { value: OrderExecution; label: string; hint: string }[] = [
  {
    value: "post-only",
    label: "Post only",
    hint: "Maker-only — cancels if it would fill immediately.",
  },
  {
    value: "ioc",
    label: "IOC",
    hint: "Fills immediately; any unfilled part is cancelled.",
  },
  {
    value: "fok",
    label: "FOK",
    hint: "Fills immediately in full, or is cancelled entirely.",
  },
];

function ExecutionOptions({
  value,
  onChange,
  disabled,
}: {
  value: OrderExecution | null;
  onChange: (v: OrderExecution | null) => void;
  disabled?: boolean;
}) {
  const base = useId();
  return (
    <div className="flex items-center gap-2 rounded-lg bg-container px-3 py-2.5">
      <fieldset
        disabled={disabled}
        className={cn(
          "flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-2",
          disabled && "opacity-60",
        )}
      >
        <legend className="sr-only">Time in force</legend>
        {EXECUTIONS.map((o) => (
          <div key={o.value} className="flex items-center gap-1.5">
            <Checkbox
              id={`${base}-${o.value}`}
              checked={value === o.value}
              disabled={disabled}
              onCheckedChange={(c) => onChange(c ? o.value : null)}
              className="size-4"
            />
            <label
              htmlFor={`${base}-${o.value}`}
              className="text-[11px] select-none"
            >
              {o.label}
            </label>
          </div>
        ))}
      </fieldset>
      <Tooltip>
        <TooltipTrigger
          render={<button type="button" aria-label="About time in force" />}
          className="focus-ring grid size-5 shrink-0 place-items-center rounded-full text-muted-foreground hover:text-foreground"
        >
          <InfoIcon className="size-3" />
        </TooltipTrigger>
        <TooltipContent className="max-w-64">
          <ul className="flex flex-col gap-1">
            {EXECUTIONS.map((o) => (
              <li key={o.value}>
                <span className="font-semibold">{o.label}:</span> {o.hint}
              </li>
            ))}
          </ul>
          <p className="mt-1 opacity-80">
            Available for limit orders without TP/SL.
          </p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
