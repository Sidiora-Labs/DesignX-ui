import { ArrowDownToLineIcon, ArrowUpFromLineIcon, CheckIcon } from "lucide-react";
import { Fragment, useId, useState, type ReactNode } from "react";

import { Numeral } from "@/components/trading/numeral";
import { TokenIcon } from "@/components/trading/token-icon";
import { VaultLatestOperation, type VaultOperation } from "@/components/trading/vault-card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatNumber } from "@/lib/trading";
import { cn } from "@/lib/utils";

export type VaultFormTab = "deposit" | "withdraw";

/* ------------------------------------------------------------ helpers */

function useControllable<T>(value: T | undefined, defaultValue: T, onChange?: (v: T) => void) {
  const [inner, setInner] = useState(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? value : inner;
  const set = (v: T) => {
    if (!controlled) setInner(v);
    onChange?.(v);
  };
  return [current, set] as const;
}

/** Keep digits and one dot, capped at `dp` decimals. */
function sanitizeAmount(text: string, dp: number) {
  const clean = text.replace(/,/g, "").replace(/[^0-9.]/g, "");
  const [int, ...rest] = clean.split(".");
  if (!rest.length) return int;
  return `${int}.${rest.join("").slice(0, dp)}`;
}

/* ------------------------------------------------------------ process steps */

export type VaultProcessStep = { label: ReactNode; description?: ReactNode };

export const DEFAULT_WITHDRAW_STEPS: VaultProcessStep[] = [
  { label: "Request", description: "Shares are locked" },
  { label: "Processing", description: "Vault settles the period" },
  { label: "Claimable", description: "Funds sent to your account" },
];

export interface VaultWithdrawProcessProps {
  steps?: VaultProcessStep[];
  /** Index of the active step. Omit to show the process without progress. */
  current?: number;
  /** Shown at the top right, e.g. `Up to 6 hours`. */
  duration?: ReactNode;
  title?: ReactNode;
  className?: string;
}

/** The request → processing → claimable timeline of a vault withdrawal. */
export function VaultWithdrawProcess({ steps = DEFAULT_WITHDRAW_STEPS, current, duration, title = "Withdraw process", className }: VaultWithdrawProcessProps) {
  return (
    <div data-slot="vault-withdraw-process" className={cn("flex flex-col gap-3 rounded-xl border border-border p-3", className)}>
      <div className="flex items-center justify-between gap-2 text-xs font-medium">
        <span className="text-muted-foreground">{title}</span>
        {duration != null && <span className="text-primary">{duration}</span>}
      </div>
      <div aria-hidden className="flex items-center px-0.5">
        {steps.map((_, i) => {
          const done = current != null && i < current;
          const active = current != null && i === current;
          return (
            <Fragment key={i}>
              {i > 0 && <span className={cn("h-px flex-1", current != null && i <= current ? "bg-primary" : "bg-border")} />}
              <span
                className={cn(
                  "grid size-4 shrink-0 place-items-center rounded-full border-2",
                  done ? "border-primary bg-primary text-primary-foreground" : active ? "border-primary bg-background" : "border-border bg-background",
                )}
              >
                {done && <CheckIcon className="size-2.5" strokeWidth={3} />}
                {active && <span className="size-1.5 rounded-full bg-primary" />}
              </span>
            </Fragment>
          );
        })}
      </div>
      <ol className="-mt-1.5 flex justify-between gap-2">
        {steps.map((step, i) => {
          const reached = current != null && i <= current;
          return (
            <li
              key={i}
              aria-current={current === i ? "step" : undefined}
              className={cn("flex flex-1 flex-col gap-0.5", i === 0 ? "text-left" : i === steps.length - 1 ? "text-right" : "text-center")}
            >
              <span className={cn("text-[11px] font-medium", reached ? "text-foreground" : "text-muted-foreground")}>{step.label}</span>
              {step.description != null && <span className="hidden text-[11px] leading-tight text-muted-foreground sm:block">{step.description}</span>}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ------------------------------------------------------------ form */

export type VaultFormSubmit = { type: VaultFormTab; amount: number };

export interface VaultFormProps {
  /** Active tab (controlled). */
  tab?: VaultFormTab;
  defaultTab?: VaultFormTab;
  onTabChange?: (tab: VaultFormTab) => void;
  /** Amount text (controlled) — the deposit amount or the number of shares to withdraw. Reset to `""` on tab change. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Deposit asset. */
  asset?: string;
  assetIconSrc?: string;
  /** Available balance to deposit. */
  balance?: number | null;
  /** Your redeemable shares. */
  shares?: number | null;
  /** Estimated price per share in the asset — used for the previews. */
  sharePrice?: number | null;
  /** Override the deposit preview (otherwise amount ÷ share price). */
  estimatedShares?: number | null;
  /** Override the withdraw preview (otherwise shares × share price). */
  estimatedReceive?: number | null;
  /** Lock-up after deposit, in hours. */
  lockupHours?: number;
  /** Fee rows, e.g. `{ label: "Performance fee", value: "10%" }`. Shown on both tabs unless `tab` is set. */
  fees?: { label: ReactNode; value: ReactNode; tab?: VaultFormTab }[];
  /** Validation / limit message under the input, e.g. "Minimum deposit is 10 USDC". */
  error?: ReactNode;
  /** Neutral hint under the input. */
  hint?: ReactNode;
  /** Warning above the button, e.g. "Switch to your main account to continue." */
  warning?: ReactNode;
  depositDisabled?: boolean;
  withdrawDisabled?: boolean;
  submitting?: boolean;
  /** Withdrawal timeline. `withdrawStep` highlights a pending request's progress. */
  withdrawSteps?: VaultProcessStep[];
  withdrawStep?: number;
  /** e.g. `Up to 6 hours`. */
  withdrawDuration?: ReactNode;
  /** Confirm withdrawals in a dialog before calling `onSubmit`. */
  confirmWithdraw?: boolean;
  /** Shown in the withdraw confirmation dialog. */
  withdrawNote?: ReactNode;
  latestDeposit?: VaultOperation;
  latestWithdrawal?: VaultOperation;
  onSubmit?: (payload: VaultFormSubmit) => void;
  className?: string;
}

function KV({ label, children, className }: { label: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center justify-between gap-3 text-xs", className)}>
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium text-foreground">{children}</span>
    </div>
  );
}

/** Deposit into / withdraw from a vault: amount with Max, shares preview, lock-up, fees and the withdrawal process. */
export function VaultForm({
  tab: tabProp,
  defaultTab = "deposit",
  onTabChange,
  value,
  defaultValue = "",
  onValueChange,
  asset = "USDC",
  assetIconSrc,
  balance,
  shares,
  sharePrice,
  estimatedShares,
  estimatedReceive,
  lockupHours,
  fees = [],
  error,
  hint,
  warning,
  depositDisabled,
  withdrawDisabled,
  submitting,
  withdrawSteps,
  withdrawStep,
  withdrawDuration,
  confirmWithdraw = true,
  withdrawNote = "The estimate uses the current price per share. The final amount is set when the vault period ends.",
  latestDeposit,
  latestWithdrawal,
  onSubmit,
  className,
}: VaultFormProps) {
  const inputId = useId();
  const [tab, setTab] = useControllable(tabProp, defaultTab, onTabChange);
  const [amount, setAmount] = useControllable(value, defaultValue, onValueChange);
  const [confirming, setConfirming] = useState(false);

  const isDeposit = tab === "deposit";
  const max = isDeposit ? balance : shares;
  const unit = isDeposit ? asset : "Shares";
  const n = Number(amount);
  const qty = amount !== "" && Number.isFinite(n) ? n : null;
  const price = sharePrice != null && sharePrice > 0 ? sharePrice : null;
  const previewShares = estimatedShares !== undefined ? estimatedShares : qty != null && price ? qty / price : null;
  const previewReceive = estimatedReceive !== undefined ? estimatedReceive : qty != null && price ? qty * price : null;
  const blocked = (isDeposit ? depositDisabled : withdrawDisabled) || submitting || qty == null || qty <= 0 || error != null;

  const submit = () => {
    if (qty == null) return;
    if (!isDeposit && confirmWithdraw) {
      setConfirming(true);
      return;
    }
    onSubmit?.({ type: tab, amount: qty });
  };

  const tabFees = fees.filter((f) => !f.tab || f.tab === tab);
  const latest = isDeposit ? latestDeposit : latestWithdrawal;

  return (
    <div data-slot="vault-form" className={cn("flex flex-col gap-4", className)}>
      <Tabs
        value={tab}
        onValueChange={(v) => {
          setTab(v as VaultFormTab);
          setAmount("");
        }}
      >
        <TabsList className="w-full">
          <TabsTrigger value="deposit" className="flex-1">
            <ArrowDownToLineIcon />
            Deposit
          </TabsTrigger>
          <TabsTrigger value="withdraw" className="flex-1">
            <ArrowUpFromLineIcon />
            Withdraw
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <label htmlFor={inputId} className="text-muted-foreground">
            {isDeposit ? "Amount" : "Shares to withdraw"}
          </label>
          <span className="text-muted-foreground">
            {isDeposit ? "Available" : "Redeemable"}{" "}
            <Numeral value={max} dp={isDeposit ? 2 : 4} unit={unit} className="text-foreground" />
          </span>
        </div>
        <InputGroup className="h-12 rounded-xl bg-container">
          <InputGroupAddon>
            {isDeposit ? <TokenIcon symbol={asset} src={assetIconSrc} size="xs" /> : <span className="text-xs font-medium">Shares</span>}
          </InputGroupAddon>
          <InputGroupInput
            id={inputId}
            inputMode="decimal"
            autoComplete="off"
            placeholder="0.00"
            value={amount}
            aria-invalid={error != null || undefined}
            onChange={(e) => setAmount(sanitizeAmount(e.target.value, 6))}
            className="font-mono text-base tabular-nums"
          />
          <InputGroupAddon align="inline-end">
            {isDeposit && <span className="text-xs">{asset}</span>}
            <Button
              type="button"
              size="xs"
              variant="tonal"
              disabled={max == null || max <= 0}
              onClick={() => max != null && setAmount(formatNumber(max, "number", { dp: 6, pad: false }).replace(/,/g, ""))}
            >
              Max
            </Button>
          </InputGroupAddon>
        </InputGroup>
        {(error ?? hint) != null && <p className={cn("text-[11px]", error != null ? "text-destructive" : "text-muted-foreground")}>{error ?? hint}</p>}
      </div>

      <div className="flex flex-col gap-2">
        {isDeposit ? (
          <>
            <KV label="Est. shares">
              <Numeral value={previewShares} dp={6} pad={false} unit="Shares" />
            </KV>
            {lockupHours != null && (
              <KV label="Lock-up duration">
                <Numeral value={lockupHours} dp={0} unit="hrs" />
              </KV>
            )}
          </>
        ) : (
          <>
            <KV label="Est. price per share">
              <Numeral value={sharePrice} dp={4} prefix="$" />
            </KV>
            <KV label="Est. receiving amount">
              <Numeral value={previewReceive} unit={asset} />
            </KV>
          </>
        )}
        {tabFees.map((f, i) => (
          <KV key={i} label={f.label}>
            {f.value}
          </KV>
        ))}
      </div>

      {!isDeposit && <VaultWithdrawProcess steps={withdrawSteps} current={withdrawStep} duration={withdrawDuration} />}

      {warning != null && <p className="text-center text-xs font-medium text-warning">{warning}</p>}

      <Button className="w-full" disabled={blocked} onClick={submit}>
        {submitting ? (isDeposit ? "Depositing…" : "Requesting…") : isDeposit ? "Deposit" : "Withdraw"}
      </Button>

      {latest && <VaultLatestOperation operation={latest} asset={asset} />}

      <Dialog open={confirming} onOpenChange={setConfirming}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm withdrawal details</DialogTitle>
            <DialogDescription className="sr-only">Review the shares you are withdrawing and the estimated amount.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <KV label="Withdrawal amount">
              <Numeral value={qty} dp={6} pad={false} unit="Shares" />
            </KV>
            <KV label="Estimated receiving">
              <Numeral value={previewReceive} unit={asset} />
            </KV>
          </div>
          {withdrawNote != null && <p className="text-xs font-medium text-warning">{withdrawNote}</p>}
          <VaultWithdrawProcess steps={withdrawSteps} duration={withdrawDuration} />
          <Button
            className="w-full"
            disabled={submitting}
            onClick={() => {
              if (qty != null) onSubmit?.({ type: "withdraw", amount: qty });
              setConfirming(false);
            }}
          >
            Initiate withdrawal
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
