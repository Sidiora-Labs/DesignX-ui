import { ArrowDownToLineIcon, ArrowLeftRightIcon, ArrowUpFromLineIcon, ChevronDownIcon, EyeIcon, EyeOffIcon, InfoIcon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState, type ReactNode } from "react";

import { Numeral } from "@/components/trading/numeral";
import { Button } from "@/components/ui/button";
import { Meter, MeterLabel } from "@/components/ui/meter";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { SPRING_LAYOUT } from "@/lib/ease";
import { formatNumber } from "@/lib/trading";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------ helpers */

function useControllable<T>(value: T | undefined, defaultValue: T, onChange?: (next: T) => void) {
  const [inner, setInner] = useState(defaultValue);
  const current = value !== undefined ? value : inner;
  const set = (next: T) => {
    if (value === undefined) setInner(next);
    onChange?.(next);
  };
  return [current, set] as const;
}

export interface HintLabelProps {
  children: ReactNode;
  /** What the value means. */
  hint?: ReactNode;
  /** How it is calculated — shown under a hairline in the tooltip. */
  formula?: ReactNode;
  className?: string;
}

/** A muted label with a dashed underline that explains itself in a tooltip. */
export function HintLabel({ children, hint, formula, className }: HintLabelProps) {
  if (!hint && !formula) return <span className={cn("text-[11px] whitespace-nowrap text-muted-foreground", className)}>{children}</span>;
  return (
    <Tooltip>
      <TooltipTrigger
        render={<button type="button" />}
        className={cn("cursor-help border-b border-dashed border-border text-[11px] whitespace-nowrap text-muted-foreground", className)}
      >
        {children}
      </TooltipTrigger>
      <TooltipContent className="max-w-64 text-xs leading-normal">
        {hint}
        {hint && formula && <span className="my-1.5 block h-px bg-current opacity-15" />}
        {formula && <span className="block opacity-80">{formula}</span>}
      </TooltipContent>
    </Tooltip>
  );
}

/* ------------------------------------------------------------ risk meter */

export type RiskLevel = "low" | "medium" | "high" | "none";

export type RiskThresholds = {
  /** Fraction at which the meter turns amber. */
  medium: number;
  /** Fraction at which the meter turns red. */
  high: number;
};

const DEFAULT_THRESHOLDS: RiskThresholds = { medium: 0.4, high: 0.8 };

/** Bucket a 0–1 risk fraction into low / medium / high. */
export function riskLevel(value: number | null | undefined, thresholds: RiskThresholds = DEFAULT_THRESHOLDS): RiskLevel {
  if (value == null || !Number.isFinite(value)) return "none";
  if (value >= thresholds.high) return "high";
  if (value >= thresholds.medium) return "medium";
  return "low";
}

const RISK_TEXT: Record<RiskLevel, string> = {
  low: "text-emerald-700 dark:text-emerald-400",
  medium: "text-amber-600 dark:text-amber-400",
  high: "text-rose-600 dark:text-rose-400",
  none: "text-muted-foreground",
};

const RISK_FILL: Record<RiskLevel, string> = {
  low: "bg-emerald-500",
  medium: "bg-amber-500",
  high: "bg-rose-500",
  none: "bg-transparent",
};

export interface RiskMeterProps {
  /** Risk as a fraction — 0.42 renders 42%. At 1 (100%) the account is liquidated. */
  value: number | null | undefined;
  label?: ReactNode;
  hint?: ReactNode;
  formula?: ReactNode;
  /** Where the colour turns amber and red. */
  thresholds?: RiskThresholds;
  /** Mask the value. */
  hidden?: boolean;
  /** Decimal places for the percentage. */
  dp?: number;
  className?: string;
}

/** A tonal meter for risk rate, LTV or margin usage — green, amber, then red as it fills. */
export function RiskMeter({ value, label = "Risk rate", hint, formula, thresholds = DEFAULT_THRESHOLDS, hidden, dp = 2, className }: RiskMeterProps) {
  const level = riskLevel(value, thresholds);
  const valid = value != null && Number.isFinite(value);
  const pct = valid ? Math.min(100, Math.max(0, value * 100)) : 0;
  const text = hidden ? "*****" : valid ? formatNumber(value, "percent", { dp }) : "—";
  return (
    <Meter
      data-slot="risk-meter"
      data-level={level}
      value={pct}
      aria-valuetext={hidden ? "Hidden" : text}
      className={cn("gap-x-1 gap-y-1.5 [&_[data-slot=meter-track]]:h-1.5 [&_[data-slot=meter-track]]:bg-container-higher", className)}
      indicatorClassName={cn(RISK_FILL[level], hidden && "opacity-0")}
    >
      <MeterLabel className="text-[11px] font-normal text-muted-foreground">{label}</MeterLabel>
      {(hint || formula) && (
        <Tooltip>
          <TooltipTrigger
            render={<button type="button" aria-label="About this metric" />}
            className="focus-ring grid size-4 place-items-center rounded-full text-muted-foreground hover:text-foreground"
          >
            <InfoIcon className="size-3" />
          </TooltipTrigger>
          <TooltipContent className="max-w-64 text-xs leading-normal">
            {hint}
            {hint && formula && <span className="my-1.5 block h-px bg-current opacity-15" />}
            {formula && <span className="block opacity-80">{formula}</span>}
          </TooltipContent>
        </Tooltip>
      )}
      <span className={cn("ml-auto font-mono text-xs font-medium tabular-nums", !hidden && RISK_TEXT[level])}>{text}</span>
    </Meter>
  );
}

export interface MarginRatioMeterProps extends Omit<RiskMeterProps, "value"> {
  /** Account margin ratio as a fraction (collateral / position notional). */
  marginRatio: number | null | undefined;
  /** Maintenance margin ratio as a fraction. */
  maintenanceMarginRatio: number | null | undefined;
}

/** The risk meter fed with margin ratios: risk = maintenance margin ratio / margin ratio. */
export function MarginRatioMeter({ marginRatio, maintenanceMarginRatio, ...props }: MarginRatioMeterProps) {
  const risk = marginRatio != null && maintenanceMarginRatio != null && marginRatio > 0 ? maintenanceMarginRatio / marginRatio : null;
  return (
    <RiskMeter
      value={risk}
      hint="Used to assess the risk level of the account. When it reaches 100%, the account will be liquidated."
      formula="Risk rate = Maintenance margin ratio / Margin ratio × 100%"
      {...props}
    />
  );
}

/* ------------------------------------------------------------ panel */

export interface AssetPanelNotice {
  title: ReactNode;
  description?: ReactNode;
  tone?: "default" | "warning";
  /** A call to action under the notice, e.g. a connect button. */
  action?: ReactNode;
}

export interface AssetPanelProps {
  /** Total account value in `unit`. */
  totalValue?: number | null;
  unrealizedPnl?: number | null;
  /** Unrealised ROI as a fraction. */
  unrealizedRoi?: number | null;
  freeCollateral?: number | null;
  /** Margin ratio as a fraction. */
  marginRatio?: number | null;
  /** Maintenance margin ratio as a fraction. */
  maintenanceMarginRatio?: number | null;
  maintenanceMargin?: number | null;
  /** Current account leverage, e.g. 3.2 for 3.2x. */
  currentLeverage?: number | null;
  /** Loan-to-value as a fraction — shown only when above zero. */
  ltv?: number | null;
  /** Risk rate as a fraction. Defaults to maintenance margin ratio / margin ratio. */
  riskRate?: number | null;
  unit?: string;
  hideBalances?: boolean;
  defaultHideBalances?: boolean;
  onHideBalancesChange?: (hidden: boolean) => void;
  /** Whether the detail list is expanded. */
  detailsOpen?: boolean;
  defaultDetailsOpen?: boolean;
  onDetailsOpenChange?: (open: boolean) => void;
  /** Buttons render only when their handler is passed. */
  onDeposit?: () => void;
  onWithdraw?: () => void;
  onTransfer?: () => void;
  /** Show the "Start trading" call to action instead of balances. */
  firstDeposit?: boolean;
  /** A status message above the panel — connect wallet, wrong network… */
  notice?: AssetPanelNotice;
  /** Rendered under the buttons, e.g. a testnet faucet link. */
  footer?: ReactNode;
  className?: string;
}

function DetailRow({ label, hint, formula, children }: { label: ReactNode; hint?: ReactNode; formula?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <HintLabel hint={hint} formula={formula}>
        {label}
      </HintLabel>
      <span className="font-mono text-xs text-foreground tabular-nums">{children}</span>
    </div>
  );
}

/** The account card beside the order form: total value, PnL, risk meter, margin details and transfer actions. */
export function AssetPanel({
  totalValue,
  unrealizedPnl,
  unrealizedRoi,
  freeCollateral,
  marginRatio,
  maintenanceMarginRatio,
  maintenanceMargin,
  currentLeverage,
  ltv,
  riskRate,
  unit = "USDC",
  hideBalances,
  defaultHideBalances = false,
  onHideBalancesChange,
  detailsOpen,
  defaultDetailsOpen = true,
  onDetailsOpenChange,
  onDeposit,
  onWithdraw,
  onTransfer,
  firstDeposit,
  notice,
  footer,
  className,
}: AssetPanelProps) {
  const [hidden, setHidden] = useControllable(hideBalances, defaultHideBalances, onHideBalancesChange);
  const [open, setOpen] = useControllable(detailsOpen, defaultDetailsOpen, onDetailsOpenChange);
  const reduce = useReducedMotion();
  const risk =
    riskRate !== undefined
      ? riskRate
      : marginRatio != null && maintenanceMarginRatio != null && marginRatio > 0
        ? maintenanceMarginRatio / marginRatio
        : null;
  const showLtv = ltv != null && Number.isFinite(ltv) && ltv > 0;

  const depositButton = onDeposit && (
    <Button size="sm" className="flex-1" onClick={onDeposit}>
      <ArrowDownToLineIcon className="size-3.5" />
      Deposit
    </Button>
  );
  const actions = (onDeposit || onWithdraw || onTransfer) && (
    <div className="flex items-center gap-2">
      {depositButton}
      {onTransfer && (
        <Button size="sm" variant="tonal" className="flex-1" onClick={onTransfer}>
          <ArrowLeftRightIcon className="size-3.5" />
          Transfer
        </Button>
      )}
      {onWithdraw && (
        <Button size="sm" variant="tonal" className="flex-1" onClick={onWithdraw}>
          <ArrowUpFromLineIcon className="size-3.5" />
          Withdraw
        </Button>
      )}
    </div>
  );

  return (
    <section data-slot="asset-panel" aria-label="Account assets" className={cn("flex w-full flex-col gap-4 rounded-2xl border border-border bg-container p-4 text-sm", className)}>
      {notice && (
        <div className="flex flex-col items-center gap-1 text-center">
          <p className={cn("text-base font-semibold", notice.tone === "warning" ? "text-amber-600 dark:text-amber-400" : "text-foreground")}>{notice.title}</p>
          {notice.description && <p className="text-xs text-muted-foreground">{notice.description}</p>}
          {notice.action && <div className="mt-3 w-full">{notice.action}</div>}
        </div>
      )}

      {firstDeposit ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-base font-semibold text-primary">Start trading</p>
            <p className="text-xs text-muted-foreground">Deposit assets from any supported network to fund your account.</p>
          </div>
          {depositButton && <div className="flex">{depositButton}</div>}
          {footer}
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center gap-1">
            <Numeral value={totalValue} hidden={hidden} dp={2} className="text-2xl font-semibold tracking-tight" />
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-muted-foreground">My assets ({unit})</span>
              <button
                type="button"
                aria-label={hidden ? "Show balances" : "Hide balances"}
                aria-pressed={hidden}
                onClick={() => setHidden(!hidden)}
                className="focus-ring grid size-6 place-items-center rounded-full text-muted-foreground hover:bg-container-high hover:text-foreground"
              >
                {hidden ? <EyeOffIcon className="size-3.5" /> : <EyeIcon className="size-3.5" />}
              </button>
            </div>
          </div>

          {unrealizedPnl !== undefined && (
            <div className="flex items-center justify-between gap-3 rounded-xl bg-container-high px-3 py-2">
              <span className="text-[11px] text-muted-foreground">Unrealized PnL</span>
              <span className="flex items-baseline gap-1 text-xs">
                <Numeral value={unrealizedPnl} coloring showSign hidden={hidden} className="font-medium" />
                {unrealizedRoi != null && !hidden && (
                  <span className="text-[11px]">
                    (<Numeral value={unrealizedRoi} rule="percent" coloring showSign />)
                  </span>
                )}
              </span>
            </div>
          )}

          <RiskMeter
            value={risk}
            hidden={hidden}
            hint="Used to assess the risk level of the account. When it reaches 100%, the account will be liquidated."
            formula="Risk rate = Maintenance margin ratio / Margin ratio × 100%"
          />

          <div>
            <button
              type="button"
              aria-expanded={open}
              aria-label={open ? "Hide account details" : "Show account details"}
              onClick={() => setOpen(!open)}
              className="focus-ring group flex w-full items-center gap-2 rounded-full py-1 text-muted-foreground hover:text-foreground"
            >
              <span className="h-px flex-1 bg-border" />
              <ChevronDownIcon className={cn("size-3.5 transition-transform duration-200", open && "rotate-180")} />
              <span className="h-px flex-1 bg-border" />
            </button>
            <motion.div
              initial={false}
              animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
              transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
              className="overflow-hidden"
              inert={!open}
            >
              <div className="flex flex-col gap-2 pt-2">
                <DetailRow
                  label="Free collateral"
                  hint="Free collateral for placing new orders."
                  formula="Free collateral = Total balance + Total unsettled PnL − Total position initial margin"
                >
                  <Numeral value={freeCollateral} hidden={hidden} unit={unit} />
                </DetailRow>
                <DetailRow
                  label="Margin ratio"
                  hint="The proportion of collateral relative to the total position value."
                  formula="Margin ratio = Total collateral value / Total position notional × 100%"
                >
                  <Numeral value={marginRatio} rule="percent" hidden={hidden} />
                </DetailRow>
                <DetailRow
                  label="Maintenance margin ratio"
                  hint="The minimum margin ratio required to keep positions open. Below it, the account is liquidated."
                  formula="Sum(Position notional × Symbol MMR) / Total position notional × 100%"
                >
                  <Numeral value={maintenanceMarginRatio} rule="percent" hidden={hidden} />
                </DetailRow>
                <DetailRow
                  label="Maintenance margin"
                  hint="The minimum margin required to keep all open positions alive."
                  formula="Maintenance margin = Sum(Position notional × Symbol MMR)"
                >
                  <Numeral value={maintenanceMargin} hidden={hidden} unit={unit} />
                </DetailRow>
                <DetailRow
                  label="Current leverage"
                  hint="How much leverage you are using across open positions."
                  formula="Current leverage = Total position notional / Total collateral value"
                >
                  <Numeral value={currentLeverage} unit="x" />
                </DetailRow>
                {showLtv && (
                  <DetailRow label="LTV" hint="Loan-to-value of your non-USDC collateral against negative balances.">
                    <span className={hidden ? undefined : RISK_TEXT[riskLevel(ltv, { medium: 0.5, high: 0.8 })]}>
                      {hidden ? "*****" : formatNumber(ltv, "percent")}
                    </span>
                  </DetailRow>
                )}
              </div>
            </motion.div>
          </div>

          {actions}
          {footer}
        </>
      )}
    </section>
  );
}
