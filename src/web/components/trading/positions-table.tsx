import { ArrowLeftRightIcon, LayersIcon, PencilIcon, Share2Icon, SlidersHorizontalIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Numeral, Statistic } from "@/components/trading/numeral";
import { SymbolBadge, SymbolDisplay } from "@/components/trading/token-icon";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toneOf, TONE_BG, TONE_TEXT } from "@/lib/trading";
import { cn } from "@/lib/utils";

export type PositionSide = "long" | "short";
export type MarginMode = "cross" | "isolated";
export type CloseType = "market" | "limit";

export interface Position {
  /** Stable key — usually symbol + margin mode. */
  id: string;
  /** `PERP_BTC_USDC`, `BTC-PERP`… */
  symbol: string;
  side: PositionSide;
  /** Absolute position size in the base asset. */
  quantity: number;
  entryPrice: number;
  markPrice: number;
  /** Estimated liquidation price. `null` renders a dash. */
  liquidationPrice?: number | null;
  leverage?: number;
  marginMode?: MarginMode;
  /** Isolated margin. Cross positions show a dash. */
  margin?: number | null;
  /** Position value in quote. Defaults to `quantity × markPrice`. */
  notional?: number;
  unrealizedPnl: number;
  /** Return on margin as a fraction — `0.124` is +12.40%. */
  roi?: number | null;
  takeProfitPrice?: number | null;
  stopLossPrice?: number | null;
  /** Price increment used to format prices. */
  tick?: number;
  /** Decimal places for the size. */
  baseDp?: number;
  iconSrc?: string;
}

export interface PositionsSummary {
  unrealizedPnl?: number | null;
  /** Fraction. */
  roi?: number | null;
  notional?: number | null;
}

export interface PositionsTableProps {
  positions: Position[];
  /** Header totals. Unrealised PnL and notional are summed from `positions` when omitted. */
  summary?: PositionsSummary;
  /** Hide the summary header. */
  hideSummary?: boolean;
  /** Quote currency label. */
  quote?: string;
  /** Decimal places for PnL and notional. */
  pnlDp?: number;
  /** Show placeholder rows. */
  loading?: boolean;
  onClose?: (position: Position, type: CloseType) => void;
  onCloseAll?: () => void;
  onTpSl?: (position: Position) => void;
  onShare?: (position: Position) => void;
  onReverse?: (position: Position) => void;
  onAdjustMargin?: (position: Position) => void;
  onSymbolClick?: (position: Position) => void;
  /** Replaces the default empty state. */
  empty?: ReactNode;
  className?: string;
}

const sideLabel = (side: PositionSide) => (side === "long" ? "Long" : "Short");
const sideTone = (side: PositionSide) => (side === "long" ? "up" : "down");
const notionalOf = (p: Position) => p.notional ?? p.quantity * p.markPrice;

/* ------------------------------------------------------------ small parts */

/** Long / Short pill with the position colours. */
export function PositionSideBadge({ side, className }: { side: PositionSide; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-4 items-center rounded-[5px] px-1 text-[10px] leading-none font-medium",
        TONE_BG[sideTone(side)],
        TONE_TEXT[sideTone(side)],
        className,
      )}
    >
      {sideLabel(side)}
    </span>
  );
}

function IconAction({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={<button type="button" aria-label={label} />}
        aria-label={label}
        onClick={onClick}
        className="focus-ring grid size-7 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-container-high hover:text-foreground [&_svg]:size-3.5"
      >
        {children}
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

function SymbolCell({ position, onSymbolClick }: { position: Position; onSymbolClick?: (p: Position) => void }) {
  const display = <SymbolDisplay symbol={position.symbol} iconSrc={position.iconSrc} size="sm" className="text-sm" />;
  return (
    <div className="flex min-w-0 flex-col items-start gap-1">
      {onSymbolClick ? (
        <button type="button" onClick={() => onSymbolClick(position)} className="focus-ring -mx-1 rounded-md px-1 hover:bg-container-high">
          {display}
        </button>
      ) : (
        display
      )}
      <span className="flex flex-wrap items-center gap-1">
        <PositionSideBadge side={position.side} />
        {position.marginMode && <SymbolBadge>{position.marginMode === "isolated" ? "Isolated" : "Cross"}</SymbolBadge>}
        {position.leverage != null && <SymbolBadge>{position.leverage}x</SymbolBadge>}
      </span>
    </div>
  );
}

function PnlValue({ position, dp, className }: { position: Position; dp: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-baseline gap-1", className)}>
      <Numeral value={position.unrealizedPnl} dp={dp} coloring showSign className="font-medium" />
      {position.roi != null && (
        <span className={cn("text-[0.9em]", TONE_TEXT[toneOf(position.roi)])}>
          (<Numeral value={position.roi} rule="percent" showSign />)
        </span>
      )}
    </span>
  );
}

function TpSlValue({ position, onTpSl }: { position: Position; onTpSl?: (p: Position) => void }) {
  const { takeProfitPrice: tp, stopLossPrice: sl } = position;
  const has = tp != null || sl != null;
  return (
    <span className="inline-flex items-center gap-1.5">
      {has ? (
        <span className="flex flex-col font-mono text-xs leading-tight tabular-nums">
          <Numeral value={tp} tick={position.tick} className={tp != null ? TONE_TEXT.up : "text-muted-foreground"} />
          <Numeral value={sl} tick={position.tick} className={sl != null ? TONE_TEXT.down : "text-muted-foreground"} />
        </span>
      ) : (
        onTpSl && (
          <button type="button" onClick={() => onTpSl(position)} className="focus-ring rounded-md text-xs font-medium text-foreground hover:underline">
            + Add
          </button>
        )
      )}
      {has && onTpSl && (
        <IconAction label={`Edit TP/SL for ${position.symbol}`} onClick={() => onTpSl(position)}>
          <PencilIcon />
        </IconAction>
      )}
      {!has && !onTpSl && <span className="text-muted-foreground">—</span>}
    </span>
  );
}

function MarginValue({ position, onAdjustMargin }: { position: Position; onAdjustMargin?: (p: Position) => void }) {
  const isolated = position.marginMode === "isolated";
  return (
    <span className="inline-flex items-center gap-1">
      <Numeral value={isolated ? position.margin : null} dp={2} />
      {isolated && onAdjustMargin && (
        <IconAction label={`Adjust margin for ${position.symbol}`} onClick={() => onAdjustMargin(position)}>
          <SlidersHorizontalIcon />
        </IconAction>
      )}
    </span>
  );
}

/* ------------------------------------------------------------ summary */

export function PositionsSummaryBar({
  unrealizedPnl,
  roi,
  notional,
  quote = "USDC",
  pnlDp = 2,
  onCloseAll,
  closeAllDisabled,
  className,
}: PositionsSummary & { quote?: string; pnlDp?: number; onCloseAll?: () => void; closeAllDisabled?: boolean; className?: string }) {
  return (
    <div data-slot="positions-summary" className={cn("flex flex-wrap items-end justify-between gap-x-6 gap-y-3 px-3 py-2.5", className)}>
      <div className="flex flex-wrap items-end gap-x-6 gap-y-2">
        <Statistic label={`Unrealized PnL (${quote})`}>
          <span className="inline-flex items-baseline gap-1">
            <Numeral value={unrealizedPnl} dp={pnlDp} coloring showSign />
            {roi != null && (
              <span className={cn("text-xs", TONE_TEXT[toneOf(roi)])}>
                (<Numeral value={roi} rule="percent" showSign />)
              </span>
            )}
          </span>
        </Statistic>
        <Statistic label={`Notional (${quote})`}>
          <Numeral value={notional} dp={pnlDp} />
        </Statistic>
      </div>
      {onCloseAll && (
        <Button variant="outline" size="xs" onClick={onCloseAll} disabled={closeAllDisabled}>
          Close all
        </Button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------ mobile card */

function Field({ label, children, align = "start" }: { label: ReactNode; children: ReactNode; align?: "start" | "end" | "center" }) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-0.5", align === "end" && "items-end text-right", align === "center" && "items-center text-center")}>
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span className="font-mono text-xs tabular-nums">{children}</span>
    </div>
  );
}

export function PositionCard({
  position,
  quote = "USDC",
  pnlDp = 2,
  onClose,
  onTpSl,
  onShare,
  onReverse,
  onAdjustMargin,
  onSymbolClick,
  className,
}: { position: Position; quote?: string; pnlDp?: number; className?: string } & Pick<
  PositionsTableProps,
  "onClose" | "onTpSl" | "onShare" | "onReverse" | "onAdjustMargin" | "onSymbolClick"
>) {
  const p = position;
  return (
    <article data-slot="position-card" className={cn("flex flex-col gap-3 rounded-xl bg-container p-3", className)}>
      <header className="flex items-start justify-between gap-3">
        <SymbolCell position={p} onSymbolClick={onSymbolClick} />
        <div className="flex items-start gap-1">
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-[11px] text-muted-foreground">Unrealized PnL ({quote})</span>
            <PnlValue position={p} dp={pnlDp} className="text-sm" />
          </div>
          {onShare && (
            <IconAction label={`Share ${p.symbol} PnL`} onClick={() => onShare(p)}>
              <Share2Icon />
            </IconAction>
          )}
        </div>
      </header>
      <div className="h-px bg-border" />
      <div className="grid grid-cols-3 gap-x-2 gap-y-2.5">
        <Field label="Qty">
          <Numeral value={p.quantity} dp={p.baseDp} pad={false} className={TONE_TEXT[sideTone(p.side)]} />
        </Field>
        <Field label="Margin" align="center">
          <MarginValue position={p} onAdjustMargin={onAdjustMargin} />
        </Field>
        <Field label={`Notional (${quote})`} align="end">
          <Numeral value={notionalOf(p)} dp={pnlDp} />
        </Field>
        <Field label="Entry price">
          <Numeral value={p.entryPrice} tick={p.tick} />
        </Field>
        <Field label="Mark price" align="center">
          <Numeral value={p.markPrice} tick={p.tick} />
        </Field>
        <Field label="Liq. price" align="end">
          <Numeral value={p.liquidationPrice} tick={p.tick} className={p.liquidationPrice ? "text-amber-600 dark:text-amber-400" : undefined} />
        </Field>
      </div>
      {(p.takeProfitPrice != null || p.stopLossPrice != null) && (
        <div className="flex items-center justify-between rounded-lg bg-container-high px-2.5 py-1.5 text-xs">
          <span className="text-muted-foreground">TP/SL</span>
          <span className="font-mono tabular-nums">
            <Numeral value={p.takeProfitPrice} tick={p.tick} className={TONE_TEXT.up} />
            <span className="px-1 text-muted-foreground">/</span>
            <Numeral value={p.stopLossPrice} tick={p.tick} className={TONE_TEXT.down} />
          </span>
        </div>
      )}
      {(onClose || onTpSl || onReverse) && (
        <div className="flex items-center gap-2">
          {onTpSl && (
            <Button variant="outline" size="xs" className="flex-1" onClick={() => onTpSl(p)}>
              TP/SL
            </Button>
          )}
          {onClose && (
            <>
              <Button variant="outline" size="xs" className="flex-1" onClick={() => onClose(p, "limit")}>
                Limit close
              </Button>
              <Button variant="outline" size="xs" className="flex-1" onClick={() => onClose(p, "market")}>
                Market close
              </Button>
            </>
          )}
          {onReverse && (
            <Button variant="outline" size="icon-xs" aria-label={`Reverse ${p.symbol} position`} onClick={() => onReverse(p)}>
              <ArrowLeftRightIcon />
            </Button>
          )}
        </div>
      )}
    </article>
  );
}

/* ------------------------------------------------------------ table */

function PositionsEmpty({ children }: { children?: ReactNode }) {
  if (children) return <>{children}</>;
  return (
    <Empty className="border-0 py-10">
      <EmptyHeader>
        <EmptyMedia>
          <LayersIcon />
        </EmptyMedia>
        <EmptyTitle className="text-sm">No open positions</EmptyTitle>
        <EmptyDescription className="text-xs">Positions you open will appear here with live PnL.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

/** Open positions: a summary header, a table on `md` and up, and stacked cards on small screens. */
export function PositionsTable({
  positions,
  summary,
  hideSummary,
  quote = "USDC",
  pnlDp = 2,
  loading,
  onClose,
  onCloseAll,
  onTpSl,
  onShare,
  onReverse,
  onAdjustMargin,
  onSymbolClick,
  empty,
  className,
}: PositionsTableProps) {
  const totals: PositionsSummary = {
    unrealizedPnl: summary?.unrealizedPnl !== undefined ? summary.unrealizedPnl : positions.reduce((s, p) => s + p.unrealizedPnl, 0),
    notional: summary?.notional !== undefined ? summary.notional : positions.reduce((s, p) => s + notionalOf(p), 0),
    roi: summary?.roi,
  };
  const hasActions = Boolean(onClose || onReverse);
  const isEmpty = !loading && positions.length === 0;
  const cardActions = { onClose, onTpSl, onShare, onReverse, onAdjustMargin, onSymbolClick };

  return (
    <div data-slot="positions-table" className={cn("flex w-full flex-col rounded-2xl border border-border bg-background", className)}>
      {!hideSummary && (
        <>
          <PositionsSummaryBar {...totals} quote={quote} pnlDp={pnlDp} onCloseAll={onCloseAll} closeAllDisabled={positions.length === 0} />
          <div className="h-px bg-border" />
        </>
      )}

      {isEmpty ? (
        <PositionsEmpty>{empty}</PositionsEmpty>
      ) : (
        <>
          {/* md and up: table */}
          <div className="hidden md:block">
            <Table className="text-xs">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead scope="col" className="h-9 text-[11px]">Symbol</TableHead>
                  <TableHead scope="col" className="h-9 text-right text-[11px]">Size</TableHead>
                  <TableHead scope="col" className="h-9 text-right text-[11px]">Entry price</TableHead>
                  <TableHead scope="col" className="h-9 text-right text-[11px]">Mark price</TableHead>
                  <TableHead scope="col" className="h-9 text-right text-[11px]">Liq. price</TableHead>
                  <TableHead scope="col" className="h-9 text-right text-[11px]">Margin</TableHead>
                  <TableHead scope="col" className="h-9 text-right text-[11px]">Unrealized PnL (ROI)</TableHead>
                  <TableHead scope="col" className="h-9 text-[11px]">TP/SL</TableHead>
                  {hasActions && (
                    <TableHead scope="col" className="h-9 text-right text-[11px]">
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && positions.length === 0
                  ? Array.from({ length: 3 }, (_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={hasActions ? 9 : 8}>
                          <Skeleton className="h-6 w-full" />
                        </TableCell>
                      </TableRow>
                    ))
                  : positions.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="relative py-2 pl-4">
                          <span aria-hidden className={cn("absolute top-2 bottom-2 left-1.5 w-[3px] rounded-full", p.side === "long" ? "bg-emerald-500" : "bg-rose-500")} />
                          <SymbolCell position={p} onSymbolClick={onSymbolClick} />
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="flex flex-col items-end">
                            <Numeral value={p.quantity} dp={p.baseDp} pad={false} className={cn("font-medium", TONE_TEXT[sideTone(p.side)])} />
                            <Numeral value={notionalOf(p)} dp={pnlDp} prefix="≈ $" className="text-[11px] text-muted-foreground" />
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Numeral value={p.entryPrice} tick={p.tick} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Numeral value={p.markPrice} tick={p.tick} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Numeral value={p.liquidationPrice} tick={p.tick} className={p.liquidationPrice ? "text-amber-600 dark:text-amber-400" : undefined} />
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="inline-flex justify-end">
                            <MarginValue position={p} onAdjustMargin={onAdjustMargin} />
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="inline-flex items-center justify-end gap-1">
                            <PnlValue position={p} dp={pnlDp} />
                            {onShare && (
                              <IconAction label={`Share ${p.symbol} PnL`} onClick={() => onShare(p)}>
                                <Share2Icon />
                              </IconAction>
                            )}
                          </span>
                        </TableCell>
                        <TableCell>
                          <TpSlValue position={p} onTpSl={onTpSl} />
                        </TableCell>
                        {hasActions && (
                          <TableCell className="text-right">
                            <span className="inline-flex items-center justify-end gap-1.5">
                              {onClose && (
                                <>
                                  <Button variant="outline" size="xs" className="h-6 px-2.5 text-[11px]" onClick={() => onClose(p, "market")}>
                                    Market
                                  </Button>
                                  <Button variant="outline" size="xs" className="h-6 px-2.5 text-[11px]" onClick={() => onClose(p, "limit")}>
                                    Limit
                                  </Button>
                                </>
                              )}
                              {onReverse && (
                                <IconAction label={`Reverse ${p.symbol} position`} onClick={() => onReverse(p)}>
                                  <ArrowLeftRightIcon />
                                </IconAction>
                              )}
                            </span>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </div>

          {/* below md: cards */}
          <div className="flex flex-col gap-2 p-2 md:hidden">
            {loading && positions.length === 0
              ? Array.from({ length: 2 }, (_, i) => <Skeleton key={i} className="h-44 w-full rounded-xl" />)
              : positions.map((p) => <PositionCard key={p.id} position={p} quote={quote} pnlDp={pnlDp} {...cardActions} />)}
          </div>
        </>
      )}
    </div>
  );
}
