import { ArrowUpRightIcon, RocketIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

import { Numeral } from "@/components/trading/numeral";
import { TokenIcon } from "@/components/trading/token-icon";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatNumber, useCountdown } from "@/lib/trading";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------ types */

export type EpochStatus = "active" | "paused" | "ended";

export type EpochInfo = {
  /** Epoch number. */
  id: number;
  startTime: number | Date;
  endTime: number | Date;
  /** Total rewards distributed this epoch. */
  rewardPool: number;
  /** Reward token ticker, e.g. `PAX`. */
  token: string;
  tokenIconSrc?: string;
};

export type RewardAmount = { token: string; amount: number | null | undefined; iconSrc?: string };

export type RewardHistoryRow = {
  epochId: number;
  startTime: number | Date;
  endTime: number | Date;
  rewardPool: number;
  /** Rewards you earned — `null` when you did not trade. */
  earned: number | null;
  token: string;
  tokenIconSrc?: string;
  /** Tooltip content explaining the earned amount, e.g. a per-venue split. */
  breakdown?: ReactNode;
};

/* ------------------------------------------------------------ helpers */

const toMs = (t: number | Date) => (typeof t === "number" ? t : t.getTime());
const pad2 = (n: number) => String(n).padStart(2, "0");

const shortDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
const longDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit", year: "numeric", timeZone: "UTC" });
const timeOfDay = new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "UTC" });

function DurationUnits({ ms, className }: { ms: number; className?: string }) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const parts: [number, string][] = [
    [Math.floor(total / 86400), "D"],
    [Math.floor((total % 86400) / 3600), "H"],
    [Math.floor((total % 3600) / 60), "M"],
    [total % 60, "S"],
  ];
  return (
    <span className={cn("inline-flex items-baseline gap-1 text-xs text-muted-foreground", className)} role="timer" aria-live="off">
      {parts.map(([v, unit]) => (
        <span key={unit} className="inline-flex items-baseline gap-0.5">
          <span className="font-mono text-sm font-semibold text-foreground tabular-nums">{pad2(v)}</span>
          {unit}
        </span>
      ))}
    </span>
  );
}

function Panel({ className, ...props }: ComponentProps<"section">) {
  return <section className={cn("flex flex-col overflow-hidden rounded-2xl bg-container", className)} {...props} />;
}

function PanelHeader({ title, action }: { title: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h3 className="text-sm font-semibold">{title}</h3>
      {action}
    </div>
  );
}

function LinkAction({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="focus-ring flex items-center gap-0.5 rounded-sm text-xs font-medium text-primary hover:underline">
      {children}
      <ArrowUpRightIcon className="size-3.5" />
    </button>
  );
}

function TokenStat({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col gap-1.5 rounded-xl bg-linear-to-b from-container-high to-container-high/40 px-3 py-2.5">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span className="flex items-center gap-1.5 text-sm font-semibold">{children}</span>
    </div>
  );
}

/* ------------------------------------------------------------ current epoch */

export interface CurrentEpochCardProps {
  epoch?: EpochInfo | null;
  status?: EpochStatus;
  /** Your estimated rewards for this epoch. */
  estRewards?: number | null;
  /** Tooltip content explaining the estimate. */
  estRewardsHint?: ReactNode;
  /** Your trading volume this epoch, in quote currency. */
  volume?: number | null;
  /** Fees you paid this epoch, in quote currency. */
  fees?: number | null;
  /** Mask your figures — e.g. when no wallet is connected. */
  hideData?: boolean;
  /** When paused: countdown to the next epoch start. */
  nextEpochStart?: number | Date | null;
  /** Message for paused / ended states. */
  statusMessage?: ReactNode;
  /** Rendered at the bottom — e.g. a Connect wallet button. */
  footer?: ReactNode;
  className?: string;
}

/** The running epoch: number and dates, countdown and progress, reward pool and your estimated share. */
export function CurrentEpochCard({
  epoch,
  status = "active",
  estRewards,
  estRewardsHint,
  volume,
  fees,
  hideData,
  nextEpochStart,
  statusMessage,
  footer,
  className,
}: CurrentEpochCardProps) {
  const remaining = useCountdown(status === "active" ? epoch?.endTime : status === "paused" ? nextEpochStart : null);

  if (status !== "active" || !epoch) {
    return (
      <Panel data-slot="current-epoch" data-status={status} className={cn("items-center justify-center gap-3 p-8 text-center", className)}>
        {status === "paused" && remaining != null && (
          <>
            <span className="text-xs text-muted-foreground">Next epoch starts in</span>
            <DurationUnits ms={remaining} />
          </>
        )}
        <p className="max-w-xs text-sm text-muted-foreground">
          {statusMessage ?? (status === "paused" ? "Trading rewards are paused for now." : status === "ended" ? "Trading rewards have ended." : "No epoch is running.")}
        </p>
        {footer}
      </Panel>
    );
  }

  const span = toMs(epoch.endTime) - toMs(epoch.startTime);
  const progress = span > 0 && remaining != null ? Math.min(1, Math.max(0, 1 - remaining / span)) : 0;

  return (
    <Panel data-slot="current-epoch" data-status={status} className={className}>
      <div className="flex items-center justify-center gap-2 bg-linear-to-b from-container-high to-container px-4 py-3">
        <span className="text-xs text-muted-foreground">Ends in</span>
        <DurationUnits ms={remaining ?? 0} />
      </div>
      <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-[11px] text-muted-foreground">
            <span>{shortDate.format(epoch.startTime)}</span>
            <span className="font-mono tabular-nums">{Math.round(progress * 100)}% elapsed</span>
            <span>{shortDate.format(epoch.endTime)}</span>
          </div>
          <Progress value={Math.round(progress * 100)} aria-label="Epoch progress" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] text-muted-foreground">Epoch</span>
            <span className="text-xl font-semibold text-primary tabular-nums">#{epoch.id}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[11px] text-muted-foreground">Epoch rewards</span>
            <span className="flex items-baseline gap-1">
              <Numeral value={epoch.rewardPool} dp={0} className="text-xl font-semibold text-primary" />
              <span className="text-xs text-muted-foreground">{epoch.token}</span>
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-xl bg-linear-to-br from-primary/14 via-primary/6 to-transparent px-4 py-5">
          <span className="text-sm text-muted-foreground">My est. rewards</span>
          <span className="flex items-center gap-2">
            <TokenIcon symbol={epoch.token} src={epoch.tokenIconSrc} size="md" />
            {estRewardsHint && !hideData ? (
              <Tooltip>
                <TooltipTrigger className="focus-ring cursor-help rounded-sm underline decoration-border decoration-dashed underline-offset-4">
                  <Numeral value={estRewards} hidden={hideData} mask="--" className="text-2xl font-semibold sm:text-3xl" />
                </TooltipTrigger>
                <TooltipContent className="max-w-64">{estRewardsHint}</TooltipContent>
              </Tooltip>
            ) : (
              <Numeral value={estRewards} hidden={hideData} mask="--" className="text-2xl font-semibold sm:text-3xl" />
            )}
          </span>
        </div>

        {(volume !== undefined || fees !== undefined) && (
          <div className="grid grid-cols-2 gap-3 text-xs">
            {volume !== undefined && (
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] text-muted-foreground">Your trading volume</span>
                <Numeral value={volume} rule="usd" hidden={hideData} mask="--" className="text-sm font-medium" />
              </div>
            )}
            {fees !== undefined && (
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] text-muted-foreground">Fees paid</span>
                <Numeral value={fees} rule="usd" hidden={hideData} mask="--" className="text-sm font-medium" />
              </div>
            )}
          </div>
        )}
        {footer}
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------ claim */

export interface ClaimableRewardsCardProps {
  /** One stat per reward token. */
  amounts: RewardAmount[];
  onClaim?: () => void;
  claiming?: boolean;
  /** Disable the Claim button — e.g. nothing to claim. Defaults to all amounts being zero. */
  disabled?: boolean;
  claimLabel?: ReactNode;
  /** Optional link-style action in the header, e.g. "History". */
  onViewDetails?: () => void;
  hideData?: boolean;
  className?: string;
}

/** Rewards ready to claim, per token, with a Claim button. */
export function ClaimableRewardsCard({
  amounts,
  onClaim,
  claiming,
  disabled,
  claimLabel = "Claim",
  onViewDetails,
  hideData,
  className,
}: ClaimableRewardsCardProps) {
  const nothing = amounts.every((a) => !a.amount);
  return (
    <Panel data-slot="claimable-rewards" className={cn("gap-4 p-4 sm:p-5", className)}>
      <PanelHeader title="Available to claim" action={onViewDetails && <LinkAction onClick={onViewDetails}>Details</LinkAction>} />
      <div className="flex gap-3">
        {amounts.map((a) => (
          <TokenStat key={a.token} label={a.token}>
            <TokenIcon symbol={a.token} src={a.iconSrc} size="xs" />
            <Numeral value={a.amount} hidden={hideData} mask="--" />
          </TokenStat>
        ))}
      </div>
      {onClaim && (
        <Button size="sm" disabled={disabled ?? (nothing || claiming)} onClick={onClaim}>
          {claiming ? "Claiming…" : claimLabel}
        </Button>
      )}
    </Panel>
  );
}

/* ------------------------------------------------------------ booster */

export interface StakeBoosterCardProps {
  /** Your average staked amount this epoch. */
  avgStaked?: number | null;
  /** Ticker(s) of the staked token(s). The first one is shown as the icon. */
  stakedTokens?: string[];
  /** Reward multiplier, e.g. 1.75. */
  multiplier?: number | null;
  onStake?: () => void;
  hideData?: boolean;
  className?: string;
}

/** Staking boosts your rewards — average stake and the resulting multiplier. */
export function StakeBoosterCard({ avgStaked, stakedTokens = ["PAX"], multiplier, onStake, hideData, className }: StakeBoosterCardProps) {
  return (
    <Panel data-slot="stake-booster" className={cn("gap-4 p-4 sm:p-5", className)}>
      <PanelHeader title="Stake booster" action={onStake && <LinkAction onClick={onStake}>Stake</LinkAction>} />
      <div className="flex gap-3">
        <TokenStat label="Avg. staked amount">
          <span className="flex -space-x-1.5">
            {stakedTokens.slice(0, 2).map((t) => (
              <TokenIcon key={t} symbol={t} size="xs" className="ring-2 ring-container-high" />
            ))}
          </span>
          <Numeral value={avgStaked} hidden={hideData} mask="--" />
        </TokenStat>
        <TokenStat label="Booster">
          <RocketIcon className="size-4 text-primary" />
          <span className="font-mono text-primary tabular-nums">
            {hideData || multiplier == null ? "--" : `${formatNumber(multiplier, "number", { dp: 2 })}x`}
          </span>
        </TokenStat>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------ history */

export interface RewardHistoryTableProps {
  rows: RewardHistoryRow[];
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  emptyMessage?: ReactNode;
  className?: string;
}

function DateCell({ time }: { time: number | Date }) {
  return (
    <span className="inline-flex items-baseline gap-1 whitespace-nowrap">
      <span>{longDate.format(time)}</span>
      <span className="text-[11px] text-muted-foreground">{timeOfDay.format(time)}</span>
    </span>
  );
}

function Earned({ row }: { row: RewardHistoryRow }) {
  const value = <Numeral value={row.earned} placeholder="--" />;
  return (
    <span className="inline-flex items-center gap-1.5">
      {row.earned != null && <TokenIcon symbol={row.token} src={row.tokenIconSrc} size="2xs" />}
      {row.breakdown ? (
        <Tooltip>
          <TooltipTrigger className="focus-ring cursor-help rounded-sm underline decoration-border decoration-dashed underline-offset-4">
            {value}
          </TooltipTrigger>
          <TooltipContent className="max-w-64">{row.breakdown}</TooltipContent>
        </Tooltip>
      ) : (
        value
      )}
    </span>
  );
}

/** Past epochs with their reward pools and what you earned. */
export function RewardHistoryTable({ rows, loading, hasMore, onLoadMore, emptyMessage = "No reward history yet", className }: RewardHistoryTableProps) {
  const empty = !loading && rows.length === 0;
  return (
    <Panel data-slot="reward-history" className={cn("gap-3 p-4 sm:p-5", className)}>
      <PanelHeader title="Reward history" />

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-outline-variant text-left text-[11px] text-muted-foreground">
              <th scope="col" className="h-9 pr-3 font-medium">Epoch</th>
              <th scope="col" className="h-9 px-3 font-medium">Start &amp; end date (UTC)</th>
              <th scope="col" className="h-9 px-3 font-medium">Epoch rewards</th>
              <th scope="col" className="h-9 pl-3 text-right font-medium">Rewards earned</th>
            </tr>
          </thead>
          <tbody>
            {loading &&
              rows.length === 0 &&
              Array.from({ length: 4 }, (_, i) => (
                <tr key={i} className="border-b border-outline-variant/60 last:border-0">
                  {[0, 1, 2, 3].map((c) => (
                    <td key={c} className="h-14 px-3 first:pl-0 last:pr-0">
                      <Skeleton className="h-3 w-20" />
                    </td>
                  ))}
                </tr>
              ))}
            {rows.map((r) => (
              <tr key={r.epochId} className="border-b border-outline-variant/60 last:border-0">
                <td className="h-14 pr-3 font-medium">Epoch {r.epochId}</td>
                <td className="h-14 px-3 text-xs">
                  <span className="flex flex-col gap-0.5">
                    <DateCell time={r.startTime} />
                    <DateCell time={r.endTime} />
                  </span>
                </td>
                <td className="h-14 px-3">
                  <span className="inline-flex items-center gap-1.5">
                    <TokenIcon symbol={r.token} src={r.tokenIconSrc} size="2xs" />
                    <Numeral value={r.rewardPool} dp={0} />
                  </span>
                </td>
                <td className="h-14 pl-3 text-right">
                  <Earned row={r} />
                </td>
              </tr>
            ))}
            {empty && (
              <tr>
                <td colSpan={4} className="h-20 text-center text-xs text-muted-foreground">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ul className="flex flex-col divide-y divide-outline-variant/60 md:hidden">
        {rows.map((r) => (
          <li key={r.epochId} className="grid grid-cols-3 gap-x-2 gap-y-2.5 py-3 text-sm">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-muted-foreground">Epoch</span>
              <span className="font-medium">Epoch {r.epochId}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-muted-foreground">Epoch rewards</span>
              <span className="inline-flex items-center gap-1">
                <TokenIcon symbol={r.token} src={r.tokenIconSrc} size="2xs" />
                <Numeral value={r.rewardPool} dp={0} />
              </span>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-[11px] text-muted-foreground">Earned</span>
              <Earned row={r} />
            </div>
            <div className="col-span-3 flex justify-between text-xs">
              <DateCell time={r.startTime} />
              <span className="text-muted-foreground">→</span>
              <DateCell time={r.endTime} />
            </div>
          </li>
        ))}
        {empty && <li className="py-8 text-center text-xs text-muted-foreground">{emptyMessage}</li>}
      </ul>

      {onLoadMore && hasMore && (
        <Button variant="ghost" size="sm" className="self-center" onClick={onLoadMore}>
          Load more
        </Button>
      )}
    </Panel>
  );
}

/* ------------------------------------------------------------ composite */

export interface EpochRewardsProps {
  title?: ReactNode;
  description?: ReactNode;
  current: CurrentEpochCardProps;
  claim?: ClaimableRewardsCardProps;
  booster?: StakeBoosterCardProps;
  history?: RewardHistoryTableProps;
  className?: string;
}

/** The trading rewards page: current epoch, claimable rewards, stake booster and history. */
export function EpochRewards({ title = "Trading rewards", description, current, claim, booster, history, className }: EpochRewardsProps) {
  return (
    <div data-slot="epoch-rewards" className={cn("flex w-full flex-col gap-3", className)}>
      {(title || description) && (
        <Panel className="gap-2 p-4 sm:p-5">
          {title && <h2 className="text-base font-semibold tracking-[-0.01em]">{title}</h2>}
          {description && <div className="border-t border-outline-variant pt-2 text-sm text-muted-foreground">{description}</div>}
        </Panel>
      )}
      <div className="grid gap-3 md:grid-cols-2">
        <CurrentEpochCard {...current} className={cn((claim || booster) && "md:row-span-2", current.className)} />
        {claim && <ClaimableRewardsCard {...claim} />}
        {booster && <StakeBoosterCard {...booster} />}
      </div>
      {history && <RewardHistoryTable {...history} />}
    </div>
  );
}
