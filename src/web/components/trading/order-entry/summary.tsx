import { PencilIcon } from "lucide-react";
import { useId, useState, type ReactNode } from "react";

import { Numeral } from "@/components/trading/numeral";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverDescription, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatNumber } from "@/lib/trading";
import { cn } from "@/lib/utils";

import { cleanNumber, num } from "./fields";

function HintLabel({ children, hint }: { children: ReactNode; hint?: ReactNode }) {
  if (!hint) return <span className="text-muted-foreground">{children}</span>;
  return (
    <Tooltip>
      <TooltipTrigger
        render={(props) => <button type="button" {...props} />}
        className="cursor-help border-b border-dashed border-border text-left text-muted-foreground hover:text-foreground"
      >
        {children}
      </TooltipTrigger>
      <TooltipContent className="max-w-64">{hint}</TooltipContent>
    </Tooltip>
  );
}

export function SummaryRow({ label, hint, children }: { label: ReactNode; hint?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 text-[11px]">
      <HintLabel hint={hint}>{label}</HintLabel>
      <span className="flex min-w-0 items-center justify-end gap-1 text-right whitespace-nowrap text-foreground">{children}</span>
    </div>
  );
}

const SLIPPAGE_PRESETS = [0.001, 0.005, 0.01];

/** Fraction as a percentage without trailing zeros: 0.0005 → 0.05%. */
const pct = (fraction: number, dp = 3) => formatNumber(fraction, "percent", { dp, pad: false });

function SlippageEditor({ value, onSave }: { value: number; onSave: (fraction: number) => void }) {
  const [preset, setPreset] = useState<number | null>(SLIPPAGE_PRESETS.includes(value) ? value : null);
  const [custom, setCustom] = useState(SLIPPAGE_PRESETS.includes(value) ? "" : String(+(value * 100).toFixed(3)));
  const id = useId();
  const customPct = num(custom);
  const next = customPct != null ? customPct / 100 : preset;
  return (
    <div className="flex flex-col gap-3">
      <div>
        <PopoverTitle>Max slippage</PopoverTitle>
        <PopoverDescription className="text-[11px]">The order reverts if the price moves against you by more than this.</PopoverDescription>
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {SLIPPAGE_PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            aria-pressed={preset === p && !custom}
            onClick={() => {
              setPreset(p);
              setCustom("");
            }}
            className={cn(
              "focus-ring h-8 rounded-lg border font-mono text-xs tabular-nums",
              preset === p && !custom ? "border-primary text-foreground" : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            {pct(p)}
          </button>
        ))}
        <div className={cn("flex h-8 items-center rounded-lg border px-2 focus-within:border-primary", custom ? "border-primary" : "border-border")}>
          <label htmlFor={id} className="sr-only">
            Custom slippage percent
          </label>
          <input
            id={id}
            inputMode="decimal"
            autoComplete="off"
            placeholder="Custom"
            value={custom}
            onChange={(e) => setCustom(cleanNumber(e.target.value))}
            className="w-full min-w-0 bg-transparent font-mono text-xs tabular-nums outline-none placeholder:font-sans placeholder:text-muted-foreground"
          />
          <span className="text-xs text-muted-foreground">%</span>
        </div>
      </div>
      <Button size="sm" disabled={next == null || next <= 0} onClick={() => next != null && onSave(next)}>
        Save
      </Button>
    </div>
  );
}

export interface EntrySummaryProps {
  quote: string;
  tick?: number;
  estLiqPrice?: number | null;
  /** Shown for market orders. Fractions: 0.005 = 0.5%. */
  slippage?: number;
  estSlippage?: number | null;
  onSlippageChange?: (fraction: number) => void;
  showSlippage: boolean;
  /** Fee rates as fractions. */
  fees?: { taker: number; maker: number } | null;
}

/** Est. liq. price, slippage and fee rows under the submit button. */
export function EntrySummary({ quote, tick, estLiqPrice, slippage, estSlippage, onSlippageChange, showSlippage, fees }: EntrySummaryProps) {
  const [editing, setEditing] = useState(false);
  return (
    <div className="flex flex-col gap-1">
      {estLiqPrice !== undefined && (
        <SummaryRow label="Est. liq. price" hint="Estimated price at which this position would be liquidated. It depends on all your positions and can change.">
          <Numeral value={estLiqPrice} tick={tick} unit={quote} className="text-amber-600 dark:text-amber-400" />
        </SummaryRow>
      )}
      {showSlippage && slippage !== undefined && (
        <SummaryRow label="Slippage" hint="Estimated price impact of this market order, and the most you accept.">
          <span className="font-mono tabular-nums">
            Est: {estSlippage != null ? pct(estSlippage) : "—"} / Max:
          </span>
          {onSlippageChange ? (
            <Popover open={editing} onOpenChange={setEditing}>
              <PopoverTrigger
                render={<button type="button" aria-label={`Edit max slippage, currently ${pct(slippage)}`} />}
                className="focus-ring flex items-center gap-0.5 rounded px-0.5 font-mono text-primary tabular-nums"
              >
                {pct(slippage)}
                <PencilIcon className="size-2.5" />
              </PopoverTrigger>
              <PopoverContent align="end" className="w-72 p-3">
                <SlippageEditor
                  value={slippage}
                  onSave={(v) => {
                    onSlippageChange(v);
                    setEditing(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          ) : (
            <span className="font-mono text-primary tabular-nums">{pct(slippage)}</span>
          )}
        </SummaryRow>
      )}
      {fees !== undefined && (
        <SummaryRow label="Fees" hint="Taker fees apply when the order fills immediately; maker fees when it rests on the book.">
          <span className="font-mono tabular-nums">
            <span className="text-muted-foreground">Taker </span>
            {fees ? pct(fees.taker) : "—"}
            <span className="text-muted-foreground"> / Maker </span>
            {fees ? pct(fees.maker) : "—"}
          </span>
        </SummaryRow>
      )}
    </div>
  );
}
