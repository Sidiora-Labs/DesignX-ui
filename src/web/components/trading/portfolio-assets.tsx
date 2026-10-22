import { ArrowDownToLineIcon, ArrowLeftRightIcon, ArrowUpFromLineIcon, EyeIcon, EyeOffIcon, RefreshCwIcon, WalletIcon } from "lucide-react";
import { useState, type ReactNode } from "react";

import { HintLabel, RiskMeter } from "@/components/trading/asset-panel";
import { Numeral } from "@/components/trading/numeral";
import { TokenIcon } from "@/components/trading/token-icon";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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

export type PortfolioAsset = {
  /** Token ticker, e.g. `USDC`. */
  token: string;
  iconSrc?: string;
  /** Quantity held. */
  balance: number;
  /** Decimal places for the balance. */
  decimals?: number;
  /** Index price in USD. */
  indexPrice?: number | null;
  /** Value in USD. */
  value: number;
  /** Share of the value that counts as margin, as a fraction (0.95 = 95%). */
  collateralRatio: number;
  /** Value counted towards collateral in USD. */
  collateralContribution: number;
};

export interface PortfolioAssetsProps {
  assets: PortfolioAsset[];
  title?: ReactNode;
  /** Total account value. Defaults to the sum of asset values. */
  totalValue?: number | null;
  /** Loan-to-value as a fraction. Omit to hide the LTV meter. */
  ltv?: number | null;
  /** LTV at which collateral is auto-converted, as a fraction — shown in the hint. */
  ltvThreshold?: number;
  unit?: string;
  hideBalances?: boolean;
  defaultHideBalances?: boolean;
  onHideBalancesChange?: (hidden: boolean) => void;
  onDeposit?: () => void;
  onWithdraw?: () => void;
  onTransfer?: () => void;
  /** Per-row transfer action. */
  onAssetTransfer?: (asset: PortfolioAsset) => void;
  /** Per-row convert action — not shown for the settlement token (`unit`). */
  onAssetConvert?: (asset: PortfolioAsset) => void;
  loading?: boolean;
  emptyText?: ReactNode;
  className?: string;
}

const COLUMNS = ["Token", "Balance", "Index price", "Value", "Collateral ratio", "Collateral contribution"];

const RATIO_HINT = "Collateral ratio shows how much of an asset's value can be used as margin.";

/** Token balances with value, collateral weight and contribution, plus an LTV summary. */
export function PortfolioAssets({
  assets,
  title = "Assets",
  totalValue,
  ltv,
  ltvThreshold,
  unit = "USDC",
  hideBalances,
  defaultHideBalances = false,
  onHideBalancesChange,
  onDeposit,
  onWithdraw,
  onTransfer,
  onAssetTransfer,
  onAssetConvert,
  loading,
  emptyText = "No assets yet. Deposit to start trading.",
  className,
}: PortfolioAssetsProps) {
  const [hidden, setHidden] = useControllable(hideBalances, defaultHideBalances, onHideBalancesChange);
  const total = totalValue !== undefined ? totalValue : assets.reduce((s, a) => s + a.value, 0);
  const collateral = assets.reduce((s, a) => s + a.collateralContribution, 0);
  const rowActions = onAssetTransfer || onAssetConvert;

  const actionsFor = (asset: PortfolioAsset) => (
    <div className="flex items-center justify-end gap-1.5">
      {onAssetConvert && asset.token.toUpperCase() !== unit.toUpperCase() && (
        <Button size="xs" variant="outline" onClick={() => onAssetConvert(asset)} aria-label={`Convert ${asset.token}`}>
          <RefreshCwIcon />
          Convert
        </Button>
      )}
      {onAssetTransfer && (
        <Button size="xs" variant="outline" onClick={() => onAssetTransfer(asset)} aria-label={`Transfer ${asset.token}`}>
          <ArrowLeftRightIcon />
          Transfer
        </Button>
      )}
    </div>
  );

  return (
    <section data-slot="portfolio-assets" aria-label="Portfolio assets" className={cn("flex w-full flex-col gap-4 rounded-2xl border border-border bg-container p-4", className)}>
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <h3 className="text-sm font-medium">{title}</h3>
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
          <Numeral value={total} hidden={hidden} unit={unit} className="text-2xl font-semibold tracking-tight" unitClassName="text-sm" />
        </div>
        {(onDeposit || onWithdraw || onTransfer) && (
          <div className="flex w-full gap-2 sm:w-auto">
            {onDeposit && (
              <Button size="sm" className="flex-1 sm:flex-none" onClick={onDeposit}>
                <ArrowDownToLineIcon className="size-3.5" />
                Deposit
              </Button>
            )}
            {onTransfer && (
              <Button size="sm" variant="tonal" className="flex-1 sm:flex-none" onClick={onTransfer}>
                <ArrowLeftRightIcon className="size-3.5" />
                Transfer
              </Button>
            )}
            {onWithdraw && (
              <Button size="sm" variant="tonal" className="flex-1 sm:flex-none" onClick={onWithdraw}>
                <ArrowUpFromLineIcon className="size-3.5" />
                Withdraw
              </Button>
            )}
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 gap-3 rounded-xl bg-container-high p-3 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-6">
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] text-muted-foreground">Collateral value</span>
          <Numeral value={collateral} rule="usd" hidden={hidden} className="text-sm font-medium" />
        </div>
        {ltv !== undefined && (
          <RiskMeter
            value={ltv}
            label="LTV"
            hidden={hidden}
            thresholds={{ medium: 0.5, high: 0.8 }}
            hint={`Loan-to-value of your non-${unit} collateral against negative ${unit} balances.${
              ltvThreshold != null ? ` Above ${Math.round(ltvThreshold * 100)}%, collateral is converted automatically.` : ""
            }`}
          />
        )}
      </div>

      {loading ? (
        <div className="flex flex-col gap-2">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-11 w-full rounded-lg" />
          ))}
        </div>
      ) : assets.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-8 text-center text-sm text-muted-foreground">
          <WalletIcon className="size-5" />
          {emptyText}
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="-mx-4 hidden overflow-x-auto md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {COLUMNS.map((c) => (
                    <th key={c} scope="col" className={cn("h-9 px-4 text-[11px] font-normal whitespace-nowrap text-muted-foreground", c === "Token" ? "text-left" : "text-right")}>
                      {c === "Collateral ratio" ? (
                        <HintLabel hint={RATIO_HINT}>{c}</HintLabel>
                      ) : c === "Collateral contribution" ? (
                        <HintLabel hint="Value counted towards your margin: value × collateral ratio.">{c}</HintLabel>
                      ) : (
                        c
                      )}
                    </th>
                  ))}
                  {rowActions && (
                    <th scope="col" className="h-9 px-4">
                      <span className="sr-only">Actions</span>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {assets.map((a) => (
                  <tr key={a.token} className="border-b border-border/60 last:border-0 hover:bg-container-high/50">
                    <th scope="row" className="h-12 px-4 text-left font-medium">
                      <span className="flex items-center gap-2">
                        <TokenIcon symbol={a.token} src={a.iconSrc} size="sm" />
                        {a.token}
                      </span>
                    </th>
                    <td className="px-4 text-right">
                      <Numeral value={a.balance} dp={a.decimals ?? 4} pad={false} hidden={hidden} />
                    </td>
                    <td className="px-4 text-right">
                      <Numeral value={a.indexPrice} rule="usd" dp={4} pad={false} />
                    </td>
                    <td className="px-4 text-right">
                      <Numeral value={a.value} rule="usd" hidden={hidden} />
                    </td>
                    <td className="px-4 text-right">
                      <Numeral value={a.collateralRatio} rule="percent" />
                    </td>
                    <td className="px-4 text-right">
                      <Numeral value={a.collateralContribution} rule="usd" hidden={hidden} />
                    </td>
                    {rowActions && <td className="px-4">{actionsFor(a)}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <ul className="flex flex-col gap-2 md:hidden">
            {assets.map((a) => (
              <li key={a.token} className="flex flex-col gap-3 rounded-xl border border-border p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <TokenIcon symbol={a.token} src={a.iconSrc} size="sm" />
                    {a.token}
                  </span>
                  <Numeral value={a.value} rule="usd" hidden={hidden} className="text-sm font-medium" />
                </div>
                <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                  <div className="flex flex-col gap-0.5">
                    <dt className="text-[11px] text-muted-foreground">Balance</dt>
                    <dd>
                      <Numeral value={a.balance} dp={a.decimals ?? 4} pad={false} hidden={hidden} />
                    </dd>
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <dt className="text-[11px] text-muted-foreground">Index price</dt>
                    <dd>
                      <Numeral value={a.indexPrice} rule="usd" dp={4} pad={false} />
                    </dd>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <dt className="text-[11px] text-muted-foreground">Collateral ratio</dt>
                    <dd>
                      <Numeral value={a.collateralRatio} rule="percent" />
                    </dd>
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <dt className="text-[11px] text-muted-foreground">Contribution</dt>
                    <dd>
                      <Numeral value={a.collateralContribution} rule="usd" hidden={hidden} />
                    </dd>
                  </div>
                </dl>
                {rowActions && actionsFor(a)}
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
