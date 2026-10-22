import { ChevronDownIcon, InfoIcon, TriangleAlertIcon } from "lucide-react";
import { useId, useState, type ReactElement, type ReactNode } from "react";

import { Numeral } from "@/components/trading/numeral";
import { SymbolBadge, SymbolDisplay } from "@/components/trading/token-icon";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { Spinner } from "@/components/ui/spinner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { decimalsFromTick, formatNumber, parseSymbol, TONE_BG, TONE_TEXT, type OrderSide } from "@/lib/trading";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------ types */

/** What the second input of each row edits: distance from entry in %, in quote, or the resulting PnL. */
export type TpslMode = "offset%" | "offset" | "pnl";
export type TpslOrderType = "market" | "limit";
/** Close the whole position when triggered, or a set quantity. */
export type TpslScope = "entire" | "partial";

export type TpslLeg = {
  /** Mark price that triggers the order. Kept as text so partial input survives typing. */
  triggerPrice: string;
  orderType: TpslOrderType;
  /** Limit price — used when `orderType` is `limit`. */
  orderPrice: string;
};

export type TpslValue = {
  tp: TpslLeg;
  sl: TpslLeg;
  scope: TpslScope;
  /** Quantity to close when `scope` is `partial`. */
  quantity: string;
};

export type TpslErrors = Partial<Record<"tpTriggerPrice" | "slTriggerPrice" | "tpOrderPrice" | "slOrderPrice" | "quantity", ReactNode>>;

export const EMPTY_TPSL: TpslValue = {
  tp: { triggerPrice: "", orderType: "market", orderPrice: "" },
  sl: { triggerPrice: "", orderType: "market", orderPrice: "" },
  scope: "entire",
  quantity: "",
};

export const TPSL_MODE_LABEL: Record<TpslMode, string> = { "offset%": "Offset %", offset: "Offset", pnl: "PnL" };

const MODE_MENU_LABEL: Record<TpslMode, string> = { "offset%": "Offset % (from entry)", offset: "Offset (from entry)", pnl: "PnL" };

function useControllable<T>(value: T | undefined, defaultValue: T, onChange?: (value: T) => void) {
  const [inner, setInner] = useState(defaultValue);
  const current = value !== undefined ? value : inner;
  const set = (next: T) => {
    if (value === undefined) setInner(next);
    onChange?.(next);
  };
  return [current, set] as const;
}

/** Keep digits and one decimal point. */
const cleanNumber = (text: string, allowMinus = false) => {
  let s = text.replace(allowMinus ? /[^0-9.-]/g : /[^0-9.]/g, "");
  if (allowMinus) s = s.replace(/(?!^)-/g, "");
  const dot = s.indexOf(".");
  return dot === -1 ? s : s.slice(0, dot + 1) + s.slice(dot + 1).replace(/\./g, "");
};

const num = (text: string | undefined) => {
  if (!text) return null;
  const n = Number(text);
  return Number.isFinite(n) ? n : null;
};

/* ------------------------------------------------------------ display math */

/**
 * Trivial display conversions between a trigger price and its offset / PnL.
 * `kind` is +1 for take-profit and -1 for stop-loss; longs profit above entry, shorts below.
 */
export function tpslFromTrigger(mode: TpslMode, trigger: number, entry: number, qty: number, side: OrderSide, kind: 1 | -1) {
  const dir = side === "buy" ? 1 : -1;
  const move = trigger - entry;
  if (mode === "pnl") return move * dir * qty;
  const offset = move * dir * kind;
  return mode === "offset" ? offset : (offset / entry) * 100;
}

export function tpslToTrigger(mode: TpslMode, input: number, entry: number, qty: number, side: OrderSide, kind: 1 | -1) {
  const dir = side === "buy" ? 1 : -1;
  if (mode === "pnl") {
    if (!qty) return null;
    // A stop-loss PnL is a loss whichever sign the user types.
    const pnl = kind === -1 ? -Math.abs(input) : input;
    return entry + pnl / (qty * dir);
  }
  const offset = mode === "offset" ? input : (input / 100) * entry;
  return entry + offset * dir * kind;
}

/* ------------------------------------------------------------ small parts */

function Field({
  id,
  label,
  suffix,
  invalid,
  warn,
  disabled,
  className,
  children,
}: {
  id: string;
  label: ReactNode;
  suffix?: ReactNode;
  invalid?: boolean;
  warn?: boolean;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      data-invalid={invalid || undefined}
      className={cn(
        "flex h-9 min-w-0 items-center gap-1.5 rounded-lg bg-container-high pl-2.5 ring-inset focus-within:ring-1 focus-within:ring-primary",
        invalid && "ring-1 ring-destructive focus-within:ring-destructive",
        warn && !invalid && "ring-1 ring-amber-500 focus-within:ring-amber-500",
        disabled && "opacity-60",
        suffix == null && "pr-2.5",
        className,
      )}
    >
      <label htmlFor={id} className="shrink-0 text-[11px] whitespace-nowrap text-muted-foreground">
        {label}
      </label>
      {children}
      {suffix}
    </div>
  );
}

const inputClass = "h-full w-full min-w-0 bg-transparent text-right font-mono text-xs tabular-nums outline-none placeholder:text-muted-foreground/60 disabled:cursor-not-allowed";

function SecondaryInput({
  kind,
  mode,
  modes,
  onModeChange,
  triggerPrice,
  onTriggerChange,
  entryPrice,
  quantity,
  side,
  tick,
  quote,
  disabled,
}: {
  kind: 1 | -1;
  mode: TpslMode;
  modes: TpslMode[];
  onModeChange: (mode: TpslMode) => void;
  triggerPrice: string;
  onTriggerChange: (value: string) => void;
  entryPrice?: number | null;
  quantity: number;
  side: OrderSide;
  tick?: number;
  quote: string;
  disabled?: boolean;
}) {
  const id = useId();
  const [draft, setDraft] = useState<string | null>(null);
  const trigger = num(triggerPrice);
  const canDerive = entryPrice != null && entryPrice > 0 && (mode !== "pnl" || quantity > 0);
  const derived = canDerive && trigger != null ? tpslFromTrigger(mode, trigger, entryPrice, quantity, side, kind) : null;
  const shown = derived == null ? "" : derived.toFixed(mode === "offset" && tick ? decimalsFromTick(tick) : 2);
  const tone = kind === 1 ? "up" : "down";

  return (
    <Field
      id={id}
      label={TPSL_MODE_LABEL[mode]}
      disabled={disabled || !canDerive}
      className="pr-0.5"
      suffix={
        <span className="flex shrink-0 items-center">
          <span className="text-[11px] text-muted-foreground">{mode === "offset%" ? "%" : quote}</span>
          <DropdownMenu>
            <DropdownMenuTrigger
              disabled={disabled}
              render={<button type="button" aria-label={`${kind === 1 ? "Take-profit" : "Stop-loss"} input mode`} />}
              className="focus-ring grid size-7 place-items-center rounded-md text-muted-foreground hover:text-foreground"
            >
              <ChevronDownIcon className="size-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-44">
              <DropdownMenuRadioGroup value={mode} onValueChange={(v) => onModeChange(v as TpslMode)}>
                {modes.map((m) => (
                  <DropdownMenuRadioItem key={m} value={m} className="text-xs">
                    {MODE_MENU_LABEL[m]}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </span>
      }
    >
      <input
        id={id}
        inputMode="decimal"
        autoComplete="off"
        placeholder={mode === "offset%" ? "0.00" : "0"}
        disabled={disabled || !canDerive}
        value={draft ?? shown}
        onFocus={() => setDraft(shown)}
        onBlur={() => setDraft(null)}
        onChange={(e) => {
          const text = cleanNumber(e.target.value, mode === "pnl");
          setDraft(text);
          const n = num(text);
          if (n == null || !canDerive) {
            if (!text) onTriggerChange("");
            return;
          }
          const next = tpslToTrigger(mode, n, entryPrice, quantity, side, kind);
          if (next != null && next > 0) onTriggerChange(next.toFixed(tick ? decimalsFromTick(tick) : 2));
        }}
        className={cn(inputClass, derived != null && derived !== 0 && draft == null && mode === "pnl" && TONE_TEXT[derived > 0 ? "up" : "down"], draft == null && mode !== "pnl" && TONE_TEXT[tone])}
      />
    </Field>
  );
}

function OrderTypeSwitch({ value, onChange, disabled, label }: { value: TpslOrderType; onChange: (v: TpslOrderType) => void; disabled?: boolean; label: string }) {
  return (
    <fieldset className="grid h-9 min-w-0 grid-cols-2 gap-0.5 rounded-lg bg-container-high p-0.5" disabled={disabled}>
      <legend className="sr-only">{label}</legend>
      {(["market", "limit"] as const).map((t) => (
        <button
          key={t}
          type="button"
          aria-pressed={value === t}
          onClick={() => onChange(t)}
          className={cn(
            "focus-ring rounded-md text-[11px] font-medium capitalize transition-colors disabled:opacity-50",
            value === t ? "bg-background text-foreground shadow-sm dark:bg-container-highest" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {t}
        </button>
      ))}
    </fieldset>
  );
}

function ErrorText({ children, tone = "error" }: { children: ReactNode; tone?: "error" | "warning" }) {
  return (
    <p className={cn("flex items-start gap-1 text-[11px] leading-snug", tone === "error" ? "text-destructive" : "text-amber-600 dark:text-amber-400")}>
      <TriangleAlertIcon aria-hidden className="mt-px size-3 shrink-0" />
      <span>{children}</span>
    </p>
  );
}

/* ------------------------------------------------------------ row */

export interface TpslRowProps {
  kind: "tp" | "sl";
  value: TpslLeg;
  onChange: (value: TpslLeg) => void;
  mode: TpslMode;
  modes?: TpslMode[];
  onModeChange: (mode: TpslMode) => void;
  side: OrderSide;
  entryPrice?: number | null;
  /** Quantity used for PnL conversions. */
  quantity?: number;
  tick?: number;
  quote?: string;
  /** `compact` is one line (trigger + offset); `full` adds a title and the order price / type line. */
  layout?: "compact" | "full";
  triggerError?: ReactNode;
  orderPriceError?: ReactNode;
  /** Non-blocking notice under the trigger, e.g. "close to liquidation price". */
  warning?: ReactNode;
  disabled?: boolean;
}

/** One take-profit or stop-loss row: trigger price, an offset / PnL twin input and, in `full` layout, order type and price. */
export function TpslRow({
  kind,
  value,
  onChange,
  mode,
  modes = ["offset%", "offset", "pnl"],
  onModeChange,
  side,
  entryPrice,
  quantity = 0,
  tick,
  quote = "USDC",
  layout = "compact",
  triggerError,
  orderPriceError,
  warning,
  disabled,
}: TpslRowProps) {
  const triggerId = useId();
  const priceId = useId();
  const k = kind === "tp" ? 1 : -1;
  const short = kind === "tp" ? "TP" : "SL";
  const set = (patch: Partial<TpslLeg>) => onChange({ ...value, ...patch });

  const trigger = (
    <Field id={triggerId} label={layout === "compact" ? `${short} price` : "Trigger"} suffix={<span className="pr-2.5 text-[11px] text-muted-foreground">{quote}</span>} invalid={!!triggerError} warn={!!warning} disabled={disabled}>
      <input
        id={triggerId}
        inputMode="decimal"
        autoComplete="off"
        placeholder="0.00"
        disabled={disabled}
        aria-invalid={!!triggerError || undefined}
        value={value.triggerPrice}
        onChange={(e) => set({ triggerPrice: cleanNumber(e.target.value) })}
        className={inputClass}
      />
    </Field>
  );
  const secondary = (
    <SecondaryInput
      kind={k}
      mode={mode}
      modes={modes}
      onModeChange={onModeChange}
      triggerPrice={value.triggerPrice}
      onTriggerChange={(triggerPrice) => set({ triggerPrice })}
      entryPrice={entryPrice}
      quantity={quantity}
      side={side}
      tick={tick}
      quote={quote}
      disabled={disabled}
    />
  );

  if (layout === "compact") {
    return (
      <div data-slot="tpsl-row" className="flex flex-col gap-1">
        <div className="grid grid-cols-2 gap-1">
          {trigger}
          {secondary}
        </div>
        {triggerError && <ErrorText>{triggerError}</ErrorText>}
        {warning && !triggerError && <ErrorText tone="warning">{warning}</ErrorText>}
      </div>
    );
  }

  return (
    <div data-slot="tpsl-row" className="flex flex-col gap-2">
      <span className={cn("text-sm font-medium", TONE_TEXT[k === 1 ? "up" : "down"])}>{kind === "tp" ? "Take profit" : "Stop loss"}</span>
      <div className="flex flex-col gap-1">
        <span className="text-[11px] text-muted-foreground">Trigger price</span>
        <div className="grid grid-cols-2 gap-1.5">
          {trigger}
          {secondary}
        </div>
        {triggerError && <ErrorText>{triggerError}</ErrorText>}
        {warning && !triggerError && <ErrorText tone="warning">{warning}</ErrorText>}
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[11px] text-muted-foreground">Order price</span>
        <div className="grid grid-cols-2 gap-1.5">
          <Field
            id={priceId}
            label={value.orderType === "limit" ? "Limit" : "Market"}
            suffix={<span className="pr-2.5 text-[11px] text-muted-foreground">{quote}</span>}
            invalid={!!orderPriceError}
            disabled={disabled || value.orderType === "market"}
          >
            <input
              id={priceId}
              inputMode="decimal"
              autoComplete="off"
              placeholder={value.orderType === "market" ? "Market" : "0.00"}
              disabled={disabled || value.orderType === "market"}
              aria-invalid={!!orderPriceError || undefined}
              value={value.orderType === "market" ? "" : value.orderPrice}
              onChange={(e) => set({ orderPrice: cleanNumber(e.target.value) })}
              className={inputClass}
            />
          </Field>
          <OrderTypeSwitch label={`${short} order type`} value={value.orderType} onChange={(orderType) => set({ orderType })} disabled={disabled} />
        </div>
        {orderPriceError && <ErrorText>{orderPriceError}</ErrorText>}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ editor */

export interface TpslEditorProps {
  value?: TpslValue;
  defaultValue?: TpslValue;
  onValueChange?: (value: TpslValue) => void;
  /** Side of the position (or of the order the TP/SL attaches to). */
  side: OrderSide;
  /** Reference for offsets and PnL — the position entry price, or the order price. */
  entryPrice?: number | null;
  /** Position size in base units, used for PnL and as the partial maximum. */
  positionSize?: number;
  /** Max quantity for a partial TP/SL. Defaults to `positionSize`. */
  maxQuantity?: number;
  base?: string;
  quote?: string;
  /** Price increment. */
  tick?: number;
  /** Quantity decimals. */
  baseDp?: number;
  mode?: TpslMode;
  defaultMode?: TpslMode;
  onModeChange?: (mode: TpslMode) => void;
  modes?: TpslMode[];
  /** `compact` fits under an order form; `full` adds order type and price per leg plus a PnL summary. */
  layout?: "compact" | "full";
  /** Show the entire / partial position switch. */
  showScope?: boolean;
  /** Show the quantity picker when `partial` is selected. Turn off when the size comes from elsewhere, e.g. an order form. */
  showQuantity?: boolean;
  /** Show estimated PnL and risk / reward. Defaults to on in `full` layout. */
  showSummary?: boolean;
  errors?: TpslErrors;
  /** Non-blocking stop-loss notice, e.g. close to liquidation. */
  slWarning?: ReactNode;
  disabled?: boolean;
  className?: string;
}

/** Take-profit and stop-loss editor. Trigger prices are the source of truth; offsets and PnL are display conversions. */
export function TpslEditor({
  value,
  defaultValue = EMPTY_TPSL,
  onValueChange,
  side,
  entryPrice,
  positionSize = 0,
  maxQuantity,
  base,
  quote = "USDC",
  tick,
  baseDp = 4,
  mode,
  defaultMode = "offset%",
  onModeChange,
  modes,
  layout = "compact",
  showScope = true,
  showQuantity = true,
  showSummary,
  errors = {},
  slWarning,
  disabled,
  className,
}: TpslEditorProps) {
  const [tpsl, setTpsl] = useControllable(value, defaultValue, onValueChange);
  const [currentMode, setMode] = useControllable(mode, defaultMode, onModeChange);
  const max = maxQuantity ?? positionSize;
  const partialQty = num(tpsl.quantity) ?? 0;
  const qty = tpsl.scope === "partial" && showQuantity ? Math.min(partialQty, max) : positionSize;
  const patch = (p: Partial<TpslValue>) => setTpsl({ ...tpsl, ...p });
  const summary = showSummary ?? layout === "full";

  const shared = {
    mode: currentMode,
    modes,
    onModeChange: setMode,
    side,
    entryPrice,
    quantity: qty,
    tick,
    quote,
    layout,
    disabled,
  } as const;

  return (
    <div data-slot="tpsl-editor" className={cn("flex flex-col", layout === "full" ? "gap-5" : "gap-1.5", className)}>
      {showScope && <ScopeSwitch value={tpsl.scope} onChange={(scope) => patch({ scope })} disabled={disabled} />}
      {showScope && showQuantity && tpsl.scope === "partial" && (
        <QuantityPicker
          value={tpsl.quantity}
          onChange={(quantity) => patch({ quantity })}
          max={max}
          base={base}
          baseDp={baseDp}
          error={errors.quantity}
          disabled={disabled}
        />
      )}
      <TpslRow kind="tp" value={tpsl.tp} onChange={(tp) => patch({ tp })} triggerError={errors.tpTriggerPrice} orderPriceError={errors.tpOrderPrice} {...shared} />
      <TpslRow kind="sl" value={tpsl.sl} onChange={(sl) => patch({ sl })} triggerError={errors.slTriggerPrice} orderPriceError={errors.slOrderPrice} warning={slWarning} {...shared} />
      {summary && <TpslSummary value={tpsl} side={side} entryPrice={entryPrice} quantity={qty} quote={quote} />}
    </div>
  );
}

function ScopeSwitch({ value, onChange, disabled }: { value: TpslScope; onChange: (v: TpslScope) => void; disabled?: boolean }) {
  const hint =
    value === "entire"
      ? "Closes the whole position at market or limit when triggered. The quantity is set at trigger time."
      : "Closes the quantity you set at market or limit when the mark price reaches the trigger price.";
  return (
    <div className="flex items-center gap-1.5">
      <fieldset className="flex items-center gap-0.5 rounded-lg bg-container p-0.5" disabled={disabled}>
        <legend className="sr-only">TP/SL quantity</legend>
        {(["entire", "partial"] as const).map((s) => (
          <button
            key={s}
            type="button"
            aria-pressed={value === s}
            onClick={() => onChange(s)}
            className={cn(
              "focus-ring h-6 rounded-md px-2 text-[11px] font-medium transition-colors",
              value === s ? "bg-background text-foreground shadow-sm dark:bg-container-highest" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {s === "entire" ? "Entire position" : "Partial"}
          </button>
        ))}
      </fieldset>
      <Tooltip>
        <TooltipTrigger
          render={<button type="button" aria-label="About TP/SL quantity" />}
          className="focus-ring grid size-5 place-items-center rounded-full text-muted-foreground hover:text-foreground"
        >
          <InfoIcon className="size-3" />
        </TooltipTrigger>
        <TooltipContent className="max-w-64">{hint}</TooltipContent>
      </Tooltip>
    </div>
  );
}

function QuantityPicker({
  value,
  onChange,
  max,
  base,
  baseDp,
  error,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  max: number;
  base?: string;
  baseDp: number;
  error?: ReactNode;
  disabled?: boolean;
}) {
  const id = useId();
  const qty = num(value) ?? 0;
  const pct = max > 0 ? Math.min(100, (qty / max) * 100) : 0;
  const fromPct = (p: number) => {
    const q = Math.floor(((max * p) / 100) * 10 ** baseDp) / 10 ** baseDp;
    onChange(q ? q.toFixed(baseDp).replace(/\.?0+$/, "") : "");
  };
  return (
    <div className="flex flex-col gap-1.5">
      <Field id={id} label="Quantity" suffix={base && <span className="pr-2.5 text-[11px] text-muted-foreground">{base}</span>} invalid={!!error} disabled={disabled}>
        <input
          id={id}
          inputMode="decimal"
          autoComplete="off"
          placeholder="0"
          disabled={disabled}
          value={value}
          onChange={(e) => {
            const text = cleanNumber(e.target.value);
            const n = num(text);
            onChange(n != null && n > max ? String(max) : text);
          }}
          className={inputClass}
        />
      </Field>
      <Slider value={pct} min={0} max={100} step={1} disabled={disabled || max <= 0} aria-label="Quantity percent" onValueChange={(v) => fromPct(Array.isArray(v) ? v[0] : (v as number))} />
      <div className="flex items-center justify-between text-[11px]">
        <span className="font-mono text-primary tabular-nums">{formatNumber(pct, "number", { dp: 0 })}%</span>
        <button type="button" disabled={disabled} onClick={() => fromPct(100)} className="focus-ring flex items-center gap-1 rounded px-0.5 text-muted-foreground hover:text-foreground">
          <span className="text-primary">Max</span>
          <Numeral value={max} dp={baseDp} pad={false} />
        </button>
      </div>
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}

/** Estimated PnL at each trigger and the risk / reward ratio. */
export function TpslSummary({ value, side, entryPrice, quantity, quote = "USDC", className }: { value: TpslValue; side: OrderSide; entryPrice?: number | null; quantity: number; quote?: string; className?: string }) {
  const pnlAt = (trigger: string) => {
    const t = num(trigger);
    return t != null && entryPrice ? tpslFromTrigger("pnl", t, entryPrice, quantity, side, 1) : null;
  };
  const tp = pnlAt(value.tp.triggerPrice);
  const sl = pnlAt(value.sl.triggerPrice);
  const ratio = tp != null && sl != null && sl !== 0 && tp !== 0 ? Math.abs(tp / sl) : null;
  return (
    <dl className={cn("flex flex-col gap-1 text-[11px]", className)}>
      <div className="flex justify-between gap-3">
        <dt className="text-muted-foreground">Est. TP PnL</dt>
        <dd>
          <Numeral value={tp} coloring showSign unit={quote} />
        </dd>
      </div>
      <div className="flex justify-between gap-3">
        <dt className="text-muted-foreground">Est. SL PnL</dt>
        <dd>
          <Numeral value={sl} coloring showSign unit={quote} />
        </dd>
      </div>
      <div className="flex justify-between gap-3">
        <dt className="text-muted-foreground">Risk / reward</dt>
        <dd>
          <Numeral value={ratio} dp={2} unit="x" />
        </dd>
      </div>
    </dl>
  );
}

/* ------------------------------------------------------------ dialog */

export type TpslPosition = {
  symbol: string;
  side: OrderSide;
  /** Absolute size in base units. */
  size: number;
  entryPrice: number;
  markPrice?: number | null;
  liqPrice?: number | null;
  leverage?: number;
  marginMode?: "cross" | "isolated";
};

export interface TpslDialogProps
  extends Pick<TpslEditorProps, "tick" | "baseDp" | "modes" | "defaultMode" | "errors" | "slWarning" | "showScope"> {
  position: TpslPosition;
  /** Initial values — e.g. the position's existing TP/SL. */
  defaultValue?: TpslValue;
  /** Reports edits so the host can return `errors`. */
  onValueChange?: (value: TpslValue) => void;
  onSubmit?: (value: TpslValue) => void;
  onCancel?: () => void;
  submitting?: boolean;
  title?: ReactNode;
  quote?: string;
  /** Custom trigger element. Defaults to a small "TP/SL" button. */
  trigger?: ReactElement;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * Edit the TP/SL of an open position in a dialog. Values are drafted locally and sent on confirm.
 * Uncontrolled dialogs close on confirm; with `open` controlled, close it yourself once saved.
 */
export function TpslDialog({ trigger, open, defaultOpen = false, onOpenChange, title = "Position TP/SL", ...props }: TpslDialogProps) {
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  return (
    <Dialog open={isOpen} onOpenChange={(o) => setOpen(o)}>
      <DialogTrigger
        render={
          trigger ?? (
            <Button variant="tonal" size="xs">
              TP/SL
            </Button>
          )
        }
      />
      <DialogContent className="max-h-[calc(100dvh-2rem)] gap-4 overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">{title}</DialogTitle>
          <DialogDescription className="sr-only">Set take-profit and stop-loss triggers for this position.</DialogDescription>
        </DialogHeader>
        <TpslDialogBody
          {...props}
          onCancel={() => {
            props.onCancel?.();
            setOpen(false);
          }}
          onSubmit={(v) => {
            props.onSubmit?.(v);
            // Controlled dialogs stay open so the host can show `submitting` and close when done.
            if (open === undefined) setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

function TpslDialogBody({
  position,
  defaultValue = EMPTY_TPSL,
  onValueChange,
  onSubmit,
  onCancel,
  submitting,
  quote = "USDC",
  tick,
  baseDp = 4,
  ...editor
}: Omit<TpslDialogProps, "trigger" | "open" | "defaultOpen" | "onOpenChange" | "title">) {
  const [draft, setDraft] = useState(defaultValue);
  const { base } = parseSymbol(position.symbol);
  const tone = position.side === "buy" ? "up" : "down";
  const hasTrigger = !!num(draft.tp.triggerPrice) || !!num(draft.sl.triggerPrice);
  const blocked = Object.values(editor.errors ?? {}).some(Boolean);

  return (
    <>
      <div className="flex flex-col gap-3 rounded-xl bg-container p-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <SymbolDisplay symbol={position.symbol} size="xs" className="text-sm" />
          <SymbolBadge className={cn(TONE_BG[tone], TONE_TEXT[tone])}>{position.side === "buy" ? "Long" : "Short"}</SymbolBadge>
          {position.marginMode && <SymbolBadge>{position.marginMode === "isolated" ? "Isolated" : "Cross"}</SymbolBadge>}
          {position.leverage != null && <SymbolBadge>{position.leverage}x</SymbolBadge>}
        </div>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-1 text-[11px]">
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Quantity</dt>
            <dd>
              <Numeral value={position.size} dp={baseDp} pad={false} />
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Entry price</dt>
            <dd>
              <Numeral value={position.entryPrice} tick={tick} />
            </dd>
          </div>
          {position.markPrice !== undefined && (
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Mark price</dt>
              <dd>
                <Numeral value={position.markPrice} tick={tick} />
              </dd>
            </div>
          )}
          {position.liqPrice !== undefined && (
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Liq. price</dt>
              <dd>
                <Numeral value={position.liqPrice} tick={tick} className="text-amber-600 dark:text-amber-400" />
              </dd>
            </div>
          )}
        </dl>
      </div>
      <TpslEditor
        {...editor}
        layout="full"
        value={draft}
        onValueChange={(v) => {
          setDraft(v);
          onValueChange?.(v);
        }}
        side={position.side}
        entryPrice={position.entryPrice}
        positionSize={position.size}
        base={base}
        quote={quote}
        tick={tick}
        baseDp={baseDp}
      />
      <div className="grid grid-cols-2 gap-2">
        <Button variant="tonal" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button disabled={!hasTrigger || blocked || submitting} onClick={() => onSubmit?.(draft)}>
          {submitting && <Spinner />}
          Confirm
        </Button>
      </div>
    </>
  );
}
