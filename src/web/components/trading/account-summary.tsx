import {
  ArrowDownToLineIcon,
  ArrowLeftRightIcon,
  ArrowUpFromLineIcon,
  CheckIcon,
  ChevronDownIcon,
  CopyIcon,
  ExternalLinkIcon,
  EyeIcon,
  EyeOffIcon,
  LogOutIcon,
  PinIcon,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import { RiskMeter } from "@/components/trading/asset-panel";
import { Numeral } from "@/components/trading/numeral";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { shortenAddress } from "@/lib/trading";
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

function hueOf(text: string) {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) % 360;
  return h;
}

/** A deterministic two-tone disc for a wallet address. */
function AddressAvatar({ address, className }: { address: string; className?: string }) {
  const h = hueOf(address.toLowerCase());
  return (
    <span
      aria-hidden="true"
      className={cn("inline-block shrink-0 rounded-full", className)}
      style={{ background: `linear-gradient(135deg, oklch(0.72 0.14 ${h}), oklch(0.55 0.16 ${(h + 80) % 360}))` }}
    />
  );
}

export type AccountMetric = "totalValue" | "freeCollateral" | "unrealizedPnl" | "currentLeverage";

const METRIC_LABEL: Record<AccountMetric, string> = {
  totalValue: "Total value",
  freeCollateral: "Free collateral",
  unrealizedPnl: "Unrealized PnL",
  currentLeverage: "Current leverage",
};

export interface AccountSummaryProps {
  totalValue?: number | null;
  freeCollateral?: number | null;
  unrealizedPnl?: number | null;
  /** Unrealised ROI as a fraction. */
  unrealizedRoi?: number | null;
  currentLeverage?: number | null;
  /** Margin usage as a fraction — renders a risk meter in the popover. */
  marginUsage?: number | null;
  unit?: string;
  /** Connected wallet address. */
  address?: string;
  /** Network the wallet is on, shown under the address. */
  chainName?: ReactNode;
  /** The metric shown in the pill. */
  metric?: AccountMetric;
  defaultMetric?: AccountMetric;
  onMetricChange?: (metric: AccountMetric) => void;
  /** Which metrics are listed in the popover, in order. */
  metrics?: AccountMetric[];
  hideBalances?: boolean;
  defaultHideBalances?: boolean;
  onHideBalancesChange?: (hidden: boolean) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onDeposit?: () => void;
  onWithdraw?: () => void;
  onTransfer?: () => void;
  onDisconnect?: () => void;
  /** Open the address in a block explorer. */
  onOpenExplorer?: () => void;
  /** Called after the address is copied. Defaults to the clipboard API only. */
  onCopyAddress?: (address: string) => void;
  className?: string;
}

function CopyAddressButton({ address, onCopy }: { address: string; onCopy?: (address: string) => void }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      aria-label={copied ? "Address copied" : "Copy address"}
      onClick={() => {
        void navigator.clipboard?.writeText(address).catch(() => {});
        onCopy?.(address);
        setCopied(true);
      }}
      onPointerLeave={() => setCopied(false)}
      onBlur={() => setCopied(false)}
      className="focus-ring grid size-7 place-items-center rounded-full text-muted-foreground hover:bg-container-high hover:text-foreground"
    >
      {copied ? <CheckIcon className="size-3.5 text-emerald-600 dark:text-emerald-400" /> : <CopyIcon className="size-3.5" />}
    </button>
  );
}

/** A header pill showing one account metric that opens the full account breakdown, address and transfer actions. */
export function AccountSummary({
  totalValue,
  freeCollateral,
  unrealizedPnl,
  unrealizedRoi,
  currentLeverage,
  marginUsage,
  unit = "USDC",
  address,
  chainName,
  metric,
  defaultMetric = "totalValue",
  onMetricChange,
  metrics = ["totalValue", "freeCollateral", "unrealizedPnl", "currentLeverage"],
  hideBalances,
  defaultHideBalances = false,
  onHideBalancesChange,
  open,
  defaultOpen = false,
  onOpenChange,
  onDeposit,
  onWithdraw,
  onTransfer,
  onDisconnect,
  onOpenExplorer,
  onCopyAddress,
  className,
}: AccountSummaryProps) {
  const [active, setActive] = useControllable(metric, defaultMetric, onMetricChange);
  const [hidden, setHidden] = useControllable(hideBalances, defaultHideBalances, onHideBalancesChange);
  const [isOpen, setIsOpen] = useControllable(open, defaultOpen, onOpenChange);

  const renderValue = (key: AccountMetric, size: "sm" | "xs") => {
    const cls = size === "sm" ? "text-sm font-medium" : "text-xs font-medium";
    switch (key) {
      case "totalValue":
        return <Numeral value={totalValue} hidden={hidden} unit={unit} className={cls} />;
      case "freeCollateral":
        return <Numeral value={freeCollateral} hidden={hidden} unit={unit} className={cls} />;
      case "unrealizedPnl":
        return (
          <span className={cn("inline-flex items-baseline gap-1", cls)}>
            <Numeral value={unrealizedPnl} hidden={hidden} coloring showSign />
            {unrealizedRoi != null && !hidden && (
              <span className="text-[0.85em]">
                (<Numeral value={unrealizedRoi} rule="percent" coloring showSign />)
              </span>
            )}
          </span>
        );
      case "currentLeverage":
        return <Numeral value={currentLeverage} unit="x" className={cls} />;
    }
  };

  const hasActions = onDeposit || onWithdraw || onTransfer;

  return (
    <div
      data-slot="account-summary"
      className={cn("inline-flex h-10 max-w-full items-center gap-0.5 rounded-full border border-border bg-container p-1 text-sm", className)}
    >
      <Popover open={isOpen} onOpenChange={(next) => setIsOpen(next)}>
        <PopoverTrigger
          className="focus-ring flex h-8 min-w-0 items-center gap-2 rounded-full pr-2 pl-1 hover:bg-container-high data-popup-open:bg-container-high"
        >
          {address && <AddressAvatar address={address} className="size-6" />}
          <span className="flex min-w-0 flex-col items-start leading-none">
            <span className="text-[10px] whitespace-nowrap text-muted-foreground">{METRIC_LABEL[active]}</span>
            <span className="mt-0.5 truncate">{renderValue(active, "xs")}</span>
          </span>
          {address && <span className="hidden font-mono text-xs text-muted-foreground sm:inline">{shortenAddress(address, 4, 4)}</span>}
          <ChevronDownIcon className="size-3.5 shrink-0 text-muted-foreground" />
        </PopoverTrigger>
        <PopoverContent align="end" className="w-[min(20rem,calc(100vw-1.5rem))] p-0">
          {address && (
            <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
              <AddressAvatar address={address} className="size-9" />
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="truncate font-mono text-sm font-medium">{shortenAddress(address)}</span>
                {chainName != null && (
                  <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    {chainName}
                  </span>
                )}
              </div>
              <CopyAddressButton address={address} onCopy={onCopyAddress} />
              {onOpenExplorer && (
                <button
                  type="button"
                  aria-label="View on explorer"
                  onClick={onOpenExplorer}
                  className="focus-ring grid size-7 place-items-center rounded-full text-muted-foreground hover:bg-container-high hover:text-foreground"
                >
                  <ExternalLinkIcon className="size-3.5" />
                </button>
              )}
            </div>
          )}

          <div className="flex flex-col gap-1 p-2">
            <div className="flex items-center justify-between px-2 pt-1 pb-1">
              <span className="text-[11px] text-muted-foreground">Account</span>
              <button
                type="button"
                aria-pressed={hidden}
                onClick={() => setHidden(!hidden)}
                className="focus-ring flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[11px] text-muted-foreground hover:text-foreground"
              >
                {hidden ? <EyeOffIcon className="size-3" /> : <EyeIcon className="size-3" />}
                {hidden ? "Show balances" : "Hide balances"}
              </button>
            </div>
            {metrics.map((key) => {
              const selected = key === active;
              return (
                <div
                  key={key}
                  className={cn("group flex h-9 items-center gap-2 rounded-lg pr-1 pl-2", selected ? "bg-container-high" : "hover:bg-container-high/60")}
                >
                  <span className="flex-1 text-xs text-muted-foreground">{METRIC_LABEL[key]}</span>
                  {renderValue(key, "xs")}
                  <button
                    type="button"
                    aria-pressed={selected}
                    aria-label={`Show ${METRIC_LABEL[key]} in header`}
                    onClick={() => setActive(key)}
                    className={cn(
                      "focus-ring grid size-6 place-items-center rounded-md transition-opacity",
                      selected ? "text-primary" : "text-muted-foreground opacity-40 group-hover:opacity-100 hover:text-foreground focus-visible:opacity-100",
                    )}
                  >
                    <PinIcon className={cn("size-3.5", selected && "fill-current")} />
                  </button>
                </div>
              );
            })}
            {marginUsage !== undefined && (
              <RiskMeter value={marginUsage} label="Margin usage" hidden={hidden} className="px-2 pt-2 pb-1" />
            )}
          </div>

          {(hasActions || onDisconnect) && (
            <div className="flex flex-col gap-2 border-t border-border p-3">
              {hasActions && (
                <div className="flex gap-2">
                  {onDeposit && (
                    <Button size="sm" className="flex-1" onClick={onDeposit}>
                      <ArrowDownToLineIcon className="size-3.5" />
                      Deposit
                    </Button>
                  )}
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
              )}
              {onDisconnect && (
                <Button size="sm" variant="ghost" className="w-full text-rose-600 dark:text-rose-400" onClick={onDisconnect}>
                  <LogOutIcon className="size-3.5" />
                  Disconnect
                </Button>
              )}
            </div>
          )}
        </PopoverContent>
      </Popover>
      <button
        type="button"
        aria-label={hidden ? "Show balances" : "Hide balances"}
        aria-pressed={hidden}
        onClick={() => setHidden(!hidden)}
        className="focus-ring grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-container-high hover:text-foreground"
      >
        {hidden ? <EyeOffIcon className="size-3.5" /> : <EyeIcon className="size-3.5" />}
      </button>
    </div>
  );
}
