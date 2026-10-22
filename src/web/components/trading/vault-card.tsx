import { ArrowUpRightIcon, InfoIcon, LockIcon, UsersIcon } from "lucide-react";
import { useId, type ReactNode } from "react";

import { Numeral } from "@/components/trading/numeral";
import { TokenIcon } from "@/components/trading/token-icon";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toneOf, type Tone } from "@/lib/trading";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------ status */

export type VaultStatus = "live" | "pre_launch" | "closing" | "closed";

const STATUS: Record<VaultStatus, { label: string; className: string }> = {
  live: { label: "Active", className: "bg-success-container text-success" },
  pre_launch: { label: "Launching soon", className: "bg-warning-container text-warning" },
  closing: { label: "Closing", className: "bg-destructive-container text-destructive" },
  closed: { label: "Closed", className: "bg-muted text-muted-foreground" },
};

/** A small pill for a vault's lifecycle state. */
export function VaultStatusBadge({ status, children, className }: { status: VaultStatus; children?: ReactNode; className?: string }) {
  const s = STATUS[status];
  return (
    <span
      data-slot="vault-status"
      className={cn("inline-flex h-5 w-fit items-center gap-1 rounded-md px-1.5 text-[11px] font-semibold tracking-wide", s.className, className)}
    >
      {status === "live" && <span aria-hidden className="size-1.5 rounded-full bg-current" />}
      {children ?? s.label}
    </span>
  );
}

/* ------------------------------------------------------------ sparkline */

const SPARK_STROKE: Record<Tone, string> = {
  up: "stroke-emerald-600 dark:stroke-emerald-400",
  down: "stroke-rose-600 dark:stroke-rose-400",
  flat: "stroke-muted-foreground",
};
const SPARK_FILL: Record<Tone, string> = {
  up: "text-emerald-500",
  down: "text-rose-500",
  flat: "text-muted-foreground",
};

export interface VaultSparklineProps {
  /** Ordered values — share price, NAV or cumulative return. */
  data: number[];
  width?: number;
  height?: number;
  /** Override the colour; defaults to the sign of last − first. */
  tone?: Tone;
  className?: string;
  "aria-label"?: string;
}

/** A tiny inline-SVG area sparkline. No axes, no interaction. */
export function VaultSparkline({ data, width = 96, height = 32, tone, className, "aria-label": ariaLabel }: VaultSparklineProps) {
  const id = useId().replace(/:/g, "");
  if (data.length < 2) return <svg width={width} height={height} className={className} aria-hidden />;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const pad = 2;
  const pts = data.map((v, i) => [(i / (data.length - 1)) * width, pad + (1 - (v - min) / span) * (height - pad * 2)] as const);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)}`).join(" ");
  const area = `${line} L${width} ${height} L0 ${height} Z`;
  const t = tone ?? toneOf(data[data.length - 1] - data[0]);
  return (
    <svg
      data-slot="vault-sparkline"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
      className={cn("overflow-visible", SPARK_FILL[t], className)}
    >
      <defs>
        <linearGradient id={`spark-${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity={0.24} />
          <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#spark-${id})`} />
      <path d={line} fill="none" strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" className={SPARK_STROKE[t]} />
    </svg>
  );
}

/* ------------------------------------------------------------ latest operation */

export type VaultOperationStatus = "new" | "pending" | "completed" | "rejected" | "failed";

export type VaultOperation = {
  type: "deposit" | "withdrawal";
  status: VaultOperationStatus;
  /** Amount in the vault asset. */
  amount: number;
};

const OP_DOT: Record<VaultOperationStatus, string> = {
  new: "bg-primary",
  pending: "bg-primary",
  completed: "bg-emerald-500",
  rejected: "bg-rose-500",
  failed: "bg-rose-500",
};

/** The "latest deposit / withdrawal request" row shown under vault actions. */
export function VaultLatestOperation({ operation, asset = "USDC", className }: { operation: VaultOperation; asset?: string; className?: string }) {
  return (
    <div data-slot="vault-latest-operation" className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-[11px] text-muted-foreground">{operation.type === "deposit" ? "Latest deposit" : "Latest withdrawal request"}</span>
      <div className="flex h-10 items-center gap-1.5 rounded-lg border border-border px-3 text-xs">
        <span aria-hidden className={cn("size-1.5 rounded-full", OP_DOT[operation.status])} />
        <span className="capitalize">{operation.status}</span>
        <TokenIcon symbol={asset} size="2xs" className="ms-auto" />
        <Numeral value={operation.amount} className="text-sm font-semibold" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ card */

export interface VaultCardProps {
  name: ReactNode;
  /** Strategy provider / manager name. */
  manager?: string;
  /** Manager or broker logo. Falls back to a lettered disc. */
  managerIconSrc?: string;
  description?: ReactNode;
  /** Strategy tags, e.g. `Market making`, `Delta neutral`. */
  tags?: string[];
  status?: VaultStatus;
  /** Deposit asset. */
  asset?: string;
  /** Total value locked, in the vault asset. */
  tvl?: number | null;
  /** 30-day APY as a fraction (0.124 = 12.4%). */
  apy30d?: number | null;
  /** Annualised return since inception, as a fraction. `null` shows a dash with `allTimeReturnHint`. */
  allTimeReturn?: number | null;
  allTimeReturnHint?: ReactNode;
  /** Values for the sparkline — share price or cumulative return over the last 30 days. */
  performance?: number[];
  /** Your deposits, in the vault asset. Omit to hide the "you" block. */
  deposits?: number | null;
  /** Your unrealised earnings / PnL, in the vault asset. */
  earnings?: number | null;
  /** Your available account balance. */
  availableBalance?: number | null;
  /** Lock-up after deposit, in hours. */
  lockupHours?: number;
  /** Performance fee as a fraction. */
  performanceFee?: number;
  /** Number of depositors. */
  depositors?: number;
  /** Mask balance values. */
  hideBalances?: boolean;
  latestOperation?: VaultOperation;
  onDeposit?: () => void;
  onWithdraw?: () => void;
  /** Shows a "View more" link-button. */
  onViewMore?: () => void;
  /** Defaults to `status !== "live"`. */
  depositDisabled?: boolean;
  withdrawDisabled?: boolean;
  /** Replaces the deposit / withdraw buttons, e.g. a connect-wallet button. */
  actions?: ReactNode;
  className?: string;
}

function Kpi({ label, hint, children }: { label: ReactNode; hint?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-0.5 rounded-xl border border-border px-3 py-2">
      <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
        {label}
        {hint && (
          <Tooltip>
            <TooltipTrigger render={<button type="button" aria-label="More info" />} className="focus-ring rounded-full">
              <InfoIcon className="size-3" />
            </TooltipTrigger>
            <TooltipContent className="max-w-64">{hint}</TooltipContent>
          </Tooltip>
        )}
      </span>
      <span className="text-base font-semibold">{children}</span>
    </div>
  );
}

function Row({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground">{children}</span>
    </div>
  );
}

/** A strategy vault: name, manager, tags, TVL and returns, your position and deposit / withdraw actions. */
export function VaultCard({
  name,
  manager,
  managerIconSrc,
  description,
  tags = [],
  status = "live",
  asset = "USDC",
  tvl,
  apy30d,
  allTimeReturn,
  allTimeReturnHint = "Annualised return since inception. Available once the vault is 7 days old.",
  performance,
  deposits,
  earnings,
  availableBalance,
  lockupHours,
  performanceFee,
  depositors,
  hideBalances,
  latestOperation,
  onDeposit,
  onWithdraw,
  onViewMore,
  depositDisabled,
  withdrawDisabled = false,
  actions,
  className,
}: VaultCardProps) {
  const showYou = deposits !== undefined || earnings !== undefined;
  const depositOff = depositDisabled ?? status !== "live";
  const meta: ReactNode[] = [];
  if (lockupHours != null)
    meta.push(
      <span key="lock" className="inline-flex items-center gap-1">
        <LockIcon className="size-3" />
        {lockupHours}h lock-up
      </span>,
    );
  if (performanceFee != null) meta.push(<span key="fee">{Math.round(performanceFee * 1000) / 10}% perf. fee</span>);
  if (depositors != null)
    meta.push(
      <span key="lps" className="inline-flex items-center gap-1">
        <UsersIcon className="size-3" />
        {depositors.toLocaleString("en-US")}
      </span>,
    );

  return (
    <article data-slot="vault-card" className={cn("flex h-full flex-col gap-4 rounded-2xl border border-border bg-container p-5", className)}>
      <header className="flex items-start gap-3">
        {manager != null && <TokenIcon symbol={manager} src={managerIconSrc} size="lg" shape="square" />}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h3 className="text-base leading-tight font-semibold break-words">{name}</h3>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <VaultStatusBadge status={status} />
            {manager != null && <span className="truncate text-[11px] text-muted-foreground">by {manager}</span>}
          </div>
        </div>
      </header>

      {(description != null || onViewMore) && (
        <div className="flex flex-col gap-1">
          {description != null && <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">{description}</p>}
          {onViewMore && (
            <button type="button" onClick={onViewMore} className="focus-ring inline-flex w-fit items-center gap-0.5 rounded-sm text-xs font-medium text-primary hover:underline">
              View more
              <ArrowUpRightIcon className="size-3.5" />
            </button>
          )}
        </div>
      )}

      {tags.length > 0 && (
        <ul className="flex flex-wrap gap-1" aria-label="Strategy">
          {tags.map((t) => (
            <li key={t} className="rounded-md bg-container-high px-1.5 py-0.5 text-[11px] text-muted-foreground">
              {t}
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-2">
        <Kpi label="TVL">
          <Numeral value={tvl} rule="compact" prefix="$" />
        </Kpi>
        <Kpi label="30D APY">
          <span className="flex items-center justify-between gap-2">
            <Numeral value={apy30d} rule="percent" coloring />
            {performance && performance.length > 1 && <VaultSparkline data={performance} width={56} height={22} aria-label="30-day performance" />}
          </span>
        </Kpi>
      </div>

      {allTimeReturn !== undefined && (
        <Row
          label={
            <Tooltip>
              <TooltipTrigger render={<button type="button" />} className="cursor-help border-b border-dashed border-border">
                All-time return
              </TooltipTrigger>
              <TooltipContent className="max-w-64">{allTimeReturnHint}</TooltipContent>
            </Tooltip>
          }
        >
          <Numeral value={allTimeReturn} rule="percent" showSign coloring />
        </Row>
      )}

      {showYou && (
        <div className="flex flex-col gap-2 rounded-xl bg-container-high p-3">
          <Row label="My deposits">
            <Numeral value={deposits} unit={asset} hidden={hideBalances} />
          </Row>
          <Row label="My earnings">
            <Numeral value={earnings} unit={asset} coloring showSign hidden={hideBalances} />
          </Row>
        </div>
      )}

      <div className="mt-auto flex flex-col gap-3">
        {availableBalance !== undefined && (
          <Row label="Account balance">
            <Numeral value={availableBalance} unit={asset} hidden={hideBalances} />
          </Row>
        )}
        {meta.length > 0 && <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">{meta}</div>}
        {actions ?? (
          <div className="flex gap-2">
            <Button size="sm" className="flex-1" disabled={depositOff} onClick={onDeposit}>
              Deposit
            </Button>
            <Button size="sm" variant="tonal" className="flex-1" disabled={withdrawDisabled} onClick={onWithdraw}>
              Withdraw
            </Button>
          </div>
        )}
        {latestOperation && <VaultLatestOperation operation={latestOperation} asset={asset} />}
      </div>
    </article>
  );
}

/** Lays vault cards out in a responsive grid. */
export function VaultGrid({ children, className }: { children: ReactNode; className?: string }) {
  return <div data-slot="vault-grid" className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3", className)}>{children}</div>;
}
