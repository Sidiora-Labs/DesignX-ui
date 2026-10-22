import { ArrowDownUpIcon, InfoIcon, TriangleAlertIcon } from "lucide-react";
import { useId, useState, type ReactNode } from "react";

import { Numeral } from "@/components/trading/numeral";
import { ChainIcon, TokenIcon } from "@/components/trading/token-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatNumber, shortenAddress } from "@/lib/trading";
import { cn } from "@/lib/utils";

function useControllable<T>(value: T | undefined, defaultValue: T, onChange?: (next: T) => void) {
  const [inner, setInner] = useState(defaultValue);
  const current = value !== undefined ? value : inner;
  const set = (next: T) => {
    if (value === undefined) setInner(next);
    onChange?.(next);
  };
  return [current, set] as const;
}

export type TransferMode = "deposit" | "withdraw" | "transfer";

export type TransferToken = {
  symbol: string;
  iconSrc?: string;
  /** Longer name shown in the list, e.g. "USD Coin". */
  name?: string;
  /** Decimal places for amounts. */
  decimals?: number;
};

export type TransferNetwork = {
  id: string;
  name: string;
  iconSrc?: string;
};

export type TransferAccount = {
  id: string;
  label: string;
  /** Balance shown under the account, in the selected token. */
  balance?: number;
};

export type TransferRow = { label: ReactNode; value: ReactNode; hint?: ReactNode };

export type TransferSubmit = {
  mode: TransferMode;
  token: string;
  network?: string;
  amount: string;
  address?: string;
  fromAccount?: string;
  toAccount?: string;
};

export interface DepositWithdrawProps {
  mode?: TransferMode;
  defaultMode?: TransferMode;
  onModeChange?: (mode: TransferMode) => void;
  /** Tabs to show, in order. */
  modes?: TransferMode[];

  tokens: TransferToken[];
  token?: string;
  defaultToken?: string;
  onTokenChange?: (symbol: string) => void;

  /** Hidden in transfer mode or when empty. */
  networks?: TransferNetwork[];
  network?: string;
  defaultNetwork?: string;
  onNetworkChange?: (id: string) => void;

  amount?: string;
  defaultAmount?: string;
  onAmountChange?: (amount: string) => void;
  /** Available balance for the current mode and token — wallet balance for deposits, withdrawable for withdrawals. */
  balance?: number | null;
  /** Quick-fill fractions of the balance. */
  quickPercents?: number[];

  /** Fee for the current mode, in `feeUnit`. */
  fee?: number | null;
  /** Defaults to the selected token. */
  feeUnit?: string;
  /** What arrives. Defaults to amount − fee when the fee is in the same token. */
  receive?: number | null;
  minAmount?: number;
  maxAmount?: number;
  /** Extra summary rows — collateral ratio, LTV, estimated time… */
  rows?: TransferRow[];

  /** Withdraw destination. */
  address?: string;
  defaultAddress?: string;
  onAddressChange?: (address: string) => void;
  /** Connected wallet — offered as a one-tap destination. */
  connectedAddress?: string;
  addressError?: ReactNode;

  /** Accounts for internal transfers. */
  accounts?: TransferAccount[];
  fromAccount?: string;
  defaultFromAccount?: string;
  onFromAccountChange?: (id: string) => void;
  toAccount?: string;
  defaultToAccount?: string;
  onToAccountChange?: (id: string) => void;

  /** `loading` shows a spinner; `disabled` blocks submit and shows `disabledReason`. */
  submitState?: "idle" | "loading" | "disabled";
  /** Overrides the built-in reasons (enter an amount, insufficient balance…). */
  disabledReason?: ReactNode;
  submitLabel?: ReactNode;
  /** Warning shown above the button, e.g. "Wrong network". */
  notice?: ReactNode;
  onSubmit?: (values: TransferSubmit) => void;
  className?: string;
}

const MODE_LABEL: Record<TransferMode, string> = { deposit: "Deposit", withdraw: "Withdraw", transfer: "Transfer" };

function sanitizeAmount(raw: string, decimals: number) {
  let s = raw.replace(/,/g, ".").replace(/[^0-9.]/g, "");
  const dot = s.indexOf(".");
  if (dot !== -1) s = s.slice(0, dot + 1) + s.slice(dot + 1).replace(/\./g, "").slice(0, decimals);
  if (s.startsWith(".")) s = `0${s}`;
  return s;
}

function trimNumber(value: number, decimals: number) {
  const factor = 10 ** decimals;
  return String(Math.floor(value * factor) / factor);
}

function SummaryRow({ label, value, hint }: TransferRow) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="flex items-center gap-1 text-[11px] text-muted-foreground">
        {label}
        {hint && (
          <Tooltip>
            <TooltipTrigger
              render={<button type="button" aria-label="More info" />}
              className="focus-ring grid size-4 place-items-center rounded-full hover:text-foreground"
            >
              <InfoIcon className="size-3" />
            </TooltipTrigger>
            <TooltipContent className="max-w-64 text-xs leading-normal">{hint}</TooltipContent>
          </Tooltip>
        )}
      </dt>
      <dd className="font-mono text-xs text-foreground tabular-nums">{value}</dd>
    </div>
  );
}

/** Deposit, withdraw and transfer funds — token and network selects, amount with quick fills, fees and what you receive. */
export function DepositWithdraw({
  mode,
  defaultMode = "deposit",
  onModeChange,
  modes = ["deposit", "withdraw", "transfer"],
  tokens,
  token,
  defaultToken,
  onTokenChange,
  networks = [],
  network,
  defaultNetwork,
  onNetworkChange,
  amount,
  defaultAmount = "",
  onAmountChange,
  balance,
  quickPercents = [0.25, 0.5, 0.75, 1],
  fee,
  feeUnit,
  receive,
  minAmount,
  maxAmount,
  rows = [],
  address,
  defaultAddress = "",
  onAddressChange,
  connectedAddress,
  addressError,
  accounts = [],
  fromAccount,
  defaultFromAccount,
  onFromAccountChange,
  toAccount,
  defaultToAccount,
  onToAccountChange,
  submitState = "idle",
  disabledReason,
  submitLabel,
  notice,
  onSubmit,
  className,
}: DepositWithdrawProps) {
  const id = useId();
  const [activeMode, setMode] = useControllable(mode, defaultMode, onModeChange);
  const [tokenSymbol, setToken] = useControllable(token, defaultToken ?? tokens[0]?.symbol ?? "", onTokenChange);
  const [networkId, setNetwork] = useControllable(network, defaultNetwork ?? networks[0]?.id ?? "", onNetworkChange);
  const [value, setValue] = useControllable(amount, defaultAmount, onAmountChange);
  const [dest, setDest] = useControllable(address, defaultAddress, onAddressChange);
  const [from, setFrom] = useControllable(fromAccount, defaultFromAccount ?? accounts[0]?.id ?? "", onFromAccountChange);
  const [to, setTo] = useControllable(toAccount, defaultToAccount ?? accounts[1]?.id ?? "", onToAccountChange);

  const current = tokens.find((t) => t.symbol === tokenSymbol) ?? tokens[0];
  const decimals = current?.decimals ?? 6;
  const symbol = current?.symbol ?? "";
  const qty = Number(value);
  const hasAmount = value !== "" && Number.isFinite(qty) && qty > 0;
  const showNetwork = activeMode !== "transfer" && networks.length > 0;
  const feeSymbol = feeUnit ?? symbol;
  const youReceive = receive !== undefined ? receive : hasAmount && fee != null && feeSymbol === symbol ? Math.max(0, qty - fee) : hasAmount && fee == null ? qty : null;

  const autoReason = !hasAmount
    ? "Enter an amount"
    : balance != null && qty > balance
      ? "Insufficient balance"
      : minAmount != null && qty < minAmount
        ? `Minimum is ${formatNumber(minAmount, "number", { dp: decimals, pad: false })} ${symbol}`
        : maxAmount != null && qty > maxAmount
          ? `Maximum is ${formatNumber(maxAmount, "number", { dp: decimals, pad: false })} ${symbol}`
          : activeMode === "withdraw" && !dest.trim()
            ? "Enter a destination address"
            : activeMode === "transfer" && (!from || !to || from === to)
              ? "Choose two different accounts"
              : null;
  const reason = submitState === "disabled" ? (disabledReason ?? autoReason ?? "Unavailable") : (disabledReason ?? autoReason);
  const loading = submitState === "loading";
  const blocked = loading || reason != null;

  const label = submitLabel ?? `${MODE_LABEL[activeMode]}${symbol ? ` ${symbol}` : ""}`;
  const amountInvalid = hasAmount && balance != null && qty > balance;

  const submit = () => {
    if (blocked) return;
    onSubmit?.({
      mode: activeMode,
      token: symbol,
      network: showNetwork ? networkId : undefined,
      amount: value,
      address: activeMode === "withdraw" ? dest.trim() : undefined,
      fromAccount: activeMode === "transfer" ? from : undefined,
      toAccount: activeMode === "transfer" ? to : undefined,
    });
  };

  const accountSelect = (which: "from" | "to") => {
    const val = which === "from" ? from : to;
    const set = which === "from" ? setFrom : setTo;
    const acct = accounts.find((a) => a.id === val);
    return (
      <div className="flex flex-col gap-1.5">
        <span id={`${id}-${which}`} className="text-[11px] text-muted-foreground">
          {which === "from" ? "From" : "To"}
        </span>
        <Select value={val} onValueChange={(v) => v != null && set(String(v))}>
          <SelectTrigger aria-labelledby={`${id}-${which}`} className="h-12 w-full">
            <SelectValue>
              {() =>
                acct ? (
                  <span className="flex min-w-0 flex-col items-start leading-tight">
                    <span className="truncate text-sm">{acct.label}</span>
                    <span className="font-mono text-[11px] text-muted-foreground">{shortenAddress(acct.id, 6, 4)}</span>
                  </span>
                ) : (
                  <span className="text-muted-foreground">Select account</span>
                )
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {accounts.map((a) => (
              <SelectItem key={a.id} value={a.id} className="h-auto py-2">
                <span className="flex min-w-0 flex-1 flex-col leading-tight">
                  <span className="truncate">{a.label}</span>
                  <span className="font-mono text-[11px] text-muted-foreground">{shortenAddress(a.id, 6, 4)}</span>
                </span>
                {a.balance != null && <Numeral value={a.balance} dp={2} unit={symbol} className="text-xs" />}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  };

  return (
    <section data-slot="deposit-withdraw" aria-label="Move funds" className={cn("flex w-full flex-col gap-4 rounded-2xl border border-border bg-container p-4", className)}>
      {modes.length > 1 && (
        <Tabs value={activeMode} onValueChange={(v) => setMode(v as TransferMode)}>
          <TabsList className="w-full">
            {modes.map((m) => (
              <TabsTrigger key={m} value={m} className="flex-1">
                {MODE_LABEL[m]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      {activeMode === "transfer" && accounts.length > 0 && (
        <div className="relative flex flex-col gap-2">
          {accountSelect("from")}
          <div className="-my-1 flex justify-center">
            <button
              type="button"
              aria-label="Swap accounts"
              onClick={() => {
                const f = from;
                setFrom(to);
                setTo(f);
              }}
              className="focus-ring grid size-8 place-items-center rounded-full border border-border bg-background text-primary hover:bg-container-high"
            >
              <ArrowDownUpIcon className="size-3.5" />
            </button>
          </div>
          {accountSelect("to")}
        </div>
      )}

      <div className={cn("grid grid-cols-1 gap-3", showNetwork && "sm:grid-cols-2")}>
        <div className="flex flex-col gap-1.5">
          <span id={`${id}-token`} className="text-[11px] text-muted-foreground">
            Token
          </span>
          <Select value={tokenSymbol} onValueChange={(v) => v != null && setToken(String(v))}>
            <SelectTrigger aria-labelledby={`${id}-token`} className="w-full">
              <SelectValue>
                {() =>
                  current ? (
                    <span className="flex items-center gap-2">
                      <TokenIcon symbol={current.symbol} src={current.iconSrc} size="xs" />
                      {current.symbol}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Select token</span>
                  )
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {tokens.map((t) => (
                <SelectItem key={t.symbol} value={t.symbol}>
                  <TokenIcon symbol={t.symbol} src={t.iconSrc} size="xs" />
                  <span>{t.symbol}</span>
                  {t.name && <span className="truncate text-xs text-muted-foreground">{t.name}</span>}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {showNetwork && (
          <div className="flex flex-col gap-1.5">
            <span id={`${id}-network`} className="text-[11px] text-muted-foreground">
              Network
            </span>
            <Select value={networkId} onValueChange={(v) => v != null && setNetwork(String(v))}>
              <SelectTrigger aria-labelledby={`${id}-network`} className="w-full">
                <SelectValue>
                  {() => {
                    const n = networks.find((x) => x.id === networkId);
                    return n ? (
                      <span className="flex items-center gap-2">
                        <ChainIcon name={n.name} src={n.iconSrc} size="xs" />
                        <span className="truncate">{n.name}</span>
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Select network</span>
                    );
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {networks.map((n) => (
                  <SelectItem key={n.id} value={n.id}>
                    <ChainIcon name={n.name} src={n.iconSrc} size="xs" />
                    {n.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <label htmlFor={`${id}-amount`} className="text-[11px] text-muted-foreground">
            Amount
          </label>
          {balance !== undefined && (
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              {activeMode === "deposit" ? "Wallet balance" : "Available"}
              <Numeral value={balance} dp={Math.min(decimals, 6)} pad={false} className="text-foreground" />
            </span>
          )}
        </div>
        <InputGroup className="h-12">
          <InputGroupInput
            id={`${id}-amount`}
            inputMode="decimal"
            autoComplete="off"
            placeholder="0.00"
            aria-invalid={amountInvalid || undefined}
            value={value}
            onChange={(e) => setValue(sanitizeAmount(e.target.value, decimals))}
            className="font-mono text-base tabular-nums"
          />
          <InputGroupAddon align="inline-end" className="gap-1.5 pr-1.5">
            <span className="text-xs text-muted-foreground">{symbol}</span>
            {balance != null && (
              <Button size="xs" variant="tonal" onClick={() => setValue(trimNumber(balance, decimals))}>
                Max
              </Button>
            )}
          </InputGroupAddon>
        </InputGroup>
        {balance != null && quickPercents.length > 0 && (
          <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${quickPercents.length}, minmax(0, 1fr))` }}>
            {quickPercents.map((p) => {
              const target = trimNumber(balance * p, decimals);
              const pressed = hasAmount && value === target;
              return (
                <button
                  key={p}
                  type="button"
                  aria-pressed={pressed}
                  onClick={() => setValue(target)}
                  className={cn(
                    "focus-ring h-7 rounded-lg border text-[11px] font-medium transition-colors",
                    pressed ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-container-high hover:text-foreground",
                  )}
                >
                  {p === 1 ? "Max" : `${Math.round(p * 100)}%`}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {activeMode === "withdraw" && (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2">
            <label htmlFor={`${id}-address`} className="text-[11px] text-muted-foreground">
              Destination address
            </label>
            {connectedAddress && dest !== connectedAddress && (
              <button type="button" onClick={() => setDest(connectedAddress)} className="focus-ring rounded text-[11px] font-medium text-primary hover:underline">
                Use connected wallet
              </button>
            )}
          </div>
          <Input
            id={`${id}-address`}
            value={dest}
            onChange={(e) => setDest(e.target.value)}
            placeholder="0x…"
            autoComplete="off"
            spellCheck={false}
            aria-invalid={addressError ? true : undefined}
            aria-describedby={addressError ? `${id}-address-error` : undefined}
            className="font-mono text-xs"
          />
          {addressError && (
            <p id={`${id}-address-error`} className="text-[11px] text-rose-600 dark:text-rose-400">
              {addressError}
            </p>
          )}
        </div>
      )}

      <dl className="flex flex-col gap-1.5 rounded-xl bg-container-high px-3 py-2.5">
        {fee !== undefined && (
          <SummaryRow
            label={activeMode === "deposit" ? "Est. gas fee" : "Fee"}
            value={fee == null ? "—" : `${formatNumber(fee, "number", { dp: Math.min(decimals, 6), pad: false })} ${feeSymbol}`}
            hint={activeMode === "deposit" ? "Estimated network fee to bridge your deposit. Paid from your wallet." : undefined}
          />
        )}
        {(minAmount != null || maxAmount != null) && (
          <SummaryRow
            label="Min / max"
            value={`${minAmount != null ? formatNumber(minAmount, "number", { dp: decimals, pad: false }) : "—"} / ${
              maxAmount != null ? formatNumber(maxAmount, "number", { dp: decimals, pad: false }) : "—"
            } ${symbol}`}
          />
        )}
        {rows.map((r, i) => (
          <SummaryRow key={i} {...r} />
        ))}
        <div className="my-0.5 h-px bg-border" />
        <div className="flex items-center justify-between gap-3">
          <dt className="text-xs font-medium">You receive</dt>
          <dd className="font-mono text-sm font-semibold tabular-nums">
            {youReceive == null ? "—" : `${formatNumber(youReceive, "number", { dp: Math.min(decimals, 6), pad: false })} ${symbol}`}
          </dd>
        </div>
      </dl>

      {notice && (
        <div className="flex items-start gap-2 rounded-xl bg-warning-container px-3 py-2 text-xs text-warning">
          <TriangleAlertIcon className="mt-px size-3.5 shrink-0" />
          <div>{notice}</div>
        </div>
      )}

      <Button size="lg" className="w-full" disabled={blocked} aria-busy={loading || undefined} onClick={submit}>
        {loading && <Spinner className="size-4" />}
        {loading ? "Processing…" : (reason ?? label)}
      </Button>
    </section>
  );
}
