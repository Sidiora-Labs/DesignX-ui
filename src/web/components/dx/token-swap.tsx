import * as React from "react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { ArrowDownUpIcon, ChevronDownIcon, EqualIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { DigitInput } from "@/components/dx/digit-input";
import { NumberFlow } from "@/components/dx/number-flow";

/**
 * TokenSwapa two-leg swap card. Typed digits roll in, the fiat value
 * flows character by character, "Use Max" morphs to "Using Max", and an
 * over-balance amount swaps the value for a shaking error.
 */

type SwapToken = {
  symbol: string;
  name: string;
  icon?: React.ReactNode;
  /** Brand colour for the fallback icon. */
  color?: string;
};

type TokenSwapProps = {
  from: SwapToken & { balance: number; price: number };
  to: SwapToken;
  /** How many `to` tokens one `from` token buys. */
  rate: number;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string, amount: number) => void;
  /** Hard ceiling for the input. */
  max?: number;
  currency?: string;
  locale?: string;
  onFlip?: () => void;
  className?: string;
};

const spring = { type: "spring", stiffness: 400, damping: 35 } as const;

function TokenIcon({ token, className }: { token: SwapToken; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("flex size-10 shrink-0 items-center justify-center rounded-full text-white [&_svg]:size-5", className)}
      style={{ background: token.color ?? "var(--primary)" }}
    >
      {token.icon ?? <span className="text-sm font-semibold">{token.symbol.slice(0, 1)}</span>}
    </span>
  );
}

function sanitize(raw: string, max: number) {
  let v = raw.replace(/,/g, ".").replace(/[^\d.]/g, "");
  const dot = v.indexOf(".");
  if (dot !== -1) v = v.slice(0, dot + 1) + v.slice(dot + 1).replace(/\./g, "");
  if (v.length > 1 && v.startsWith("0") && v[1] !== ".") v = v.replace(/^0+/, "") || "0";
  const n = parseFloat(v) || 0;
  if (n > max) return String(max);
  return v;
}

function TokenSwap({
  from,
  to,
  rate,
  value: valueProp,
  defaultValue = "",
  onValueChange,
  max = 1_000_000,
  currency = "USD",
  locale = "en-US",
  onFlip,
  className,
}: TokenSwapProps) {
  const [inner, setInner] = React.useState(defaultValue);
  const value = valueProp ?? inner;
  const amount = parseFloat(value) || 0;
  const fiat = amount * from.price;
  const insufficient = amount > from.balance;
  const usingMax = amount > 0 && amount === from.balance;

  const set = (v: string) => {
    if (valueProp === undefined) setInner(v);
    onValueChange?.(v, parseFloat(v) || 0);
  };

  const fmt = (n: number) => n.toLocaleString(locale, { maximumFractionDigits: 4 });

  return (
    <MotionConfig transition={spring}>
      <div data-slot="token-swap" className={cn("flex w-full max-w-[360px] flex-col gap-2", className)}>
        <div className="relative flex flex-col gap-5 rounded-3xl border border-outline-variant bg-card p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TokenIcon token={from} />
              <div>
                <p className="text-base font-semibold tracking-tight">{from.name}</p>
                <p className="text-sm text-muted-foreground">
                  {fmt(from.balance)} {from.symbol}
                </p>
              </div>
            </div>
            <motion.button
              layout
              type="button"
              onClick={() => set(String(from.balance))}
              aria-pressed={usingMax}
              className="state-layer focus-ring flex items-center gap-1 overflow-hidden rounded-full bg-container-high px-3 py-1 text-sm font-semibold"
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={usingMax ? "using" : "use"}
                  layout
                  initial={{ opacity: 0, filter: "blur(4px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(4px)" }}
                >
                  {usingMax ? "Using" : "Use"}
                </motion.span>
              </AnimatePresence>
              <motion.span layout>Max</motion.span>
            </motion.button>
          </div>

          <div className="border-t border-outline-variant" />

          <div className="mb-6 flex flex-col items-center gap-3">
            <DigitInput
              value={value}
              onValueChange={(v) => set(sanitize(v, max))}
              inputMode="decimal"
              aria-label={`Amount of ${from.symbol}`}
              aria-invalid={insufficient || undefined}
              wrapperClassName="text-[44px] font-semibold"
            />
            <div className="flex h-7 items-center justify-center">
              <AnimatePresence initial={false} mode="popLayout">
                {!insufficient ? (
                  <motion.div
                    key="fiat"
                    style={{ transformOrigin: "top center" }}
                    initial={{ opacity: 0, y: "100%", scale: 0 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    className="flex items-center gap-2"
                  >
                    <span className="rounded-full bg-container-high p-1">
                      <EqualIcon className="size-4" />
                    </span>
                    <NumberFlow
                      value={fiat}
                      locale={locale}
                      format={{ style: "currency", currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }}
                      className="font-semibold tracking-tight"
                    />
                    <ArrowDownUpIcon className="size-4 text-muted-foreground" />
                  </motion.div>
                ) : (
                  <motion.p
                    key="error"
                    role="alert"
                    style={{ transformOrigin: "bottom center" }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      x: [0, -5, 5, -3, 3, 0],
                      transition: { ...spring, x: { delay: 0.2, duration: 0.4, times: [0, 0.2, 0.4, 0.6, 0.8, 1] } },
                    }}
                    exit={{ opacity: 0, scale: 0 }}
                    className="font-semibold tracking-tight text-destructive"
                  >
                    Not enough {from.symbol}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          <button
            type="button"
            onClick={onFlip}
            disabled={!onFlip}
            aria-label="Swap direction"
            className="state-layer focus-ring absolute -bottom-5 left-1/2 z-10 -translate-x-1/2 rounded-full border border-outline-variant bg-card p-1.5 text-muted-foreground disabled:cursor-default"
          >
            <ChevronDownIcon className="size-5" />
          </button>
        </div>

        <div className="flex items-center justify-between rounded-3xl border border-outline-variant bg-card p-3">
          <div className="flex items-center gap-3">
            <TokenIcon token={to} />
            <div>
              <p className="text-base font-semibold tracking-tight">{to.name}</p>
              <p className="text-sm text-muted-foreground">Receive {to.symbol}</p>
            </div>
          </div>
          <NumberFlow
            value={insufficient ? 0 : amount * rate}
            locale={locale}
            format={{ maximumFractionDigits: 2 }}
            className="pr-2 text-lg font-semibold tabular-nums"
          />
        </div>

        <button
          type="button"
          onClick={() => set("")}
          className="state-layer focus-ring w-full rounded-full bg-container-high py-2.5 text-sm font-medium text-muted-foreground"
        >
          Clear
        </button>
      </div>
    </MotionConfig>
  );
}

export { TokenSwap };
export type { SwapToken, TokenSwapProps };
