import { ChevronDownIcon, HistoryIcon, Share2Icon } from "lucide-react";
import { Fragment, useCallback, useState, type ReactNode } from "react";

import { Numeral } from "@/components/trading/numeral";
import { SymbolBadge, SymbolDisplay } from "@/components/trading/token-icon";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { TONE_BG, TONE_TEXT } from "@/lib/trading";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------ types */

export type ClosedPositionStatus = "closed" | "partially_closed" | "liquidated" | "adl";

export interface ClosedPosition {
  id: string;
  symbol: string;
  side: "long" | "short";
  leverage?: number;
  marginMode?: "cross" | "isolated";
  status: ClosedPositionStatus;
  openTime: number | Date;
  /** Close time, or last update for partially closed positions. */
  closeTime?: number | Date | null;
  avgEntryPrice: number;
  avgClosePrice?: number | null;
  /** Size closed so far, in base. */
  closedQuantity: number;
  /** Largest size the position reached, in base. */
  maxQuantity: number;
  realizedPnl: number;
  /** Signed — negative means paid. Shown in the details. */
  fundingFee?: number | null;
  /** Signed — negative means paid. Shown in the details. */
  tradingFee?: number | null;
  /** Headline PnL. Defaults to `realizedPnl`. */
  netPnl?: number | null;
  liquidation?: { id?: string | number; liquidatorFee?: number | null; insuranceFundFee?: number | null };
  tick?: number;
  baseDp?: number;
  iconSrc?: string;
}

export interface LiquidationRecord {
  id: string | number;
  time: number | Date;
  symbol: string;
  side?: "long" | "short";
  /** Mark price at liquidation. */
  markPrice: number;
  /** Liquidated size in base. */
  quantity: number;
  /** Fraction — 0.012 = 1.2%. */
  feeRate?: number | null;
  fee?: number | null;
  /** Fractions. */
  marginRatio?: number | null;
  maintenanceMarginRatio?: number | null;
  collateral?: number | null;
  notional?: number | null;
  tick?: number;
  baseDp?: number;
  iconSrc?: string;
}

export type PositionHistoryTab = "positions" | "liquidations";

export interface PositionHistoryProps {
  positions: ClosedPosition[];
  /** Adds a Liquidations tab when provided. */
  liquidations?: LiquidationRecord[];
  tab?: PositionHistoryTab;
  defaultTab?: PositionHistoryTab;
  onTabChange?: (tab: PositionHistoryTab) => void;
  /** Range chips are shown when `onRangeChange` is passed. */
  ranges?: { value: string; label: ReactNode }[];
  range?: string;
  defaultRange?: string;
  onRangeChange?: (range: string) => void;
  onShare?: (position: ClosedPosition) => void;
  onSymbolClick?: (symbol: string) => void;
  formatTime?: (time: number | Date) => ReactNode;
  quote?: string;
  loading?: boolean;
  /** Rendered at the end of the toolbar, e.g. a symbol filter. */
  toolbar?: ReactNode;
  className?: string;
}

/* ------------------------------------------------------------ helpers */

function useControllable<T>(value: T | undefined, defaultValue: T, onChange?: (value: T) => void) {
  const [inner, setInner] = useState(defaultValue);
  const controlled = value !== undefined;
  const set = useCallback(
    (next: T) => {
      if (!controlled) setInner(next);
      onChange?.(next);
    },
    [controlled, onChange],
  );
  return [controlled ? value : inner, set] as const;
}

const pad2 = (n: number) => String(n).padStart(2, "0");
function defaultFormatTime(time: number | Date) {
  const d = typeof time === "number" ? new Date(time) : time;
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
}

const DEFAULT_RANGES = [
  { value: "1d", label: "1D" },
  { value: "7d", label: "7D" },
  { value: "30d", label: "30D" },
  { value: "90d", label: "90D" },
];

const STATUS: Record<ClosedPositionStatus, { label: string; variant: "tonal" | "info" | "destructive" | "warning" }> = {
  closed: { label: "Closed", variant: "tonal" },
  partially_closed: { label: "Partially closed", variant: "info" },
  liquidated: { label: "Liquidated", variant: "destructive" },
  adl: { label: "ADL", variant: "warning" },
};

function ExpandButton({ open, onClick, label }: { open: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      aria-expanded={open}
      aria-label={label}
      onClick={onClick}
      className="focus-ring grid size-7 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-container-high hover:text-foreground"
    >
      <ChevronDownIcon className={cn("size-4 transition-transform duration-200", open && "rotate-180")} />
    </button>
  );
}

function ShareButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={<button type="button" aria-label={label} />}
        aria-label={label}
        onClick={onClick}
        className="focus-ring grid size-6 place-items-center rounded-full text-muted-foreground hover:bg-container-high hover:text-foreground [&_svg]:size-3.5"
      >
        <Share2Icon />
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

export function PositionStatusBadge({ status }: { status: ClosedPositionStatus }) {
  const s = STATUS[status];
  return (
    <Badge variant={s.variant} className="h-4 rounded-[5px] px-1 text-[10px]">
      {s.label}
    </Badge>
  );
}

function SymbolBlock({ p, onSymbolClick }: { p: ClosedPosition; onSymbolClick?: (symbol: string) => void }) {
  const tone = p.side === "long" ? "up" : "down";
  const display = <SymbolDisplay symbol={p.symbol} iconSrc={p.iconSrc} size="sm" />;
  return (
    <div className="flex min-w-0 flex-col items-start gap-1">
      {onSymbolClick ? (
        <button type="button" onClick={() => onSymbolClick(p.symbol)} className="focus-ring -mx-1 rounded-md px-1 hover:bg-container-high">
          {display}
        </button>
      ) : (
        display
      )}
      <span className="flex flex-wrap items-center gap-1">
        <SymbolBadge className={cn(TONE_BG[tone], TONE_TEXT[tone])}>{p.side === "long" ? "Long" : "Short"}</SymbolBadge>
        <PositionStatusBadge status={p.status} />
        {p.marginMode && <SymbolBadge>{p.marginMode === "isolated" ? "Isolated" : "Cross"}</SymbolBadge>}
        {p.leverage != null && <SymbolBadge>{p.leverage}x</SymbolBadge>}
      </span>
    </div>
  );
}

function Detail({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <dt className="text-[11px] text-muted-foreground">{label}</dt>
      <dd className="font-mono text-xs tabular-nums">{children}</dd>
    </div>
  );
}

function PositionDetails({ p, quote, formatTime }: { p: ClosedPosition; quote: string; formatTime: (t: number | Date) => ReactNode }) {
  return (
    <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 sm:grid-cols-4">
      <Detail label={`Realized PnL (${quote})`}>
        <Numeral value={p.realizedPnl} dp={2} coloring showSign />
      </Detail>
      {p.fundingFee !== undefined && (
        <Detail label="Funding fee">
          <Numeral value={p.fundingFee} dp={4} pad={false} coloring showSign />
        </Detail>
      )}
      {p.tradingFee !== undefined && (
        <Detail label="Trading fee">
          <Numeral value={p.tradingFee} dp={4} pad={false} coloring showSign />
        </Detail>
      )}
      <Detail label={`Net PnL (${quote})`}>
        <Numeral value={p.netPnl ?? p.realizedPnl} dp={2} coloring showSign />
      </Detail>
      <Detail label="Opened">{formatTime(p.openTime)}</Detail>
      <Detail label={p.status === "partially_closed" ? "Updated" : "Closed"}>{p.closeTime != null ? formatTime(p.closeTime) : "—"}</Detail>
      {p.liquidation?.id != null && <Detail label="Liquidation id">{p.liquidation.id}</Detail>}
      {p.liquidation?.liquidatorFee != null && (
        <Detail label="Liquidator fee">
          <Numeral value={-Math.abs(p.liquidation.liquidatorFee)} dp={2} coloring />
        </Detail>
      )}
      {p.liquidation?.insuranceFundFee != null && (
        <Detail label="Insurance fund fee">
          <Numeral value={-Math.abs(p.liquidation.insuranceFundFee)} dp={2} coloring />
        </Detail>
      )}
    </dl>
  );
}

function LiquidationDetails({ l }: { l: LiquidationRecord }) {
  return (
    <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 sm:grid-cols-4">
      <Detail label="Margin ratio">
        <Numeral value={l.marginRatio} rule="percent" />
      </Detail>
      <Detail label="Maint. margin ratio">
        <Numeral value={l.maintenanceMarginRatio} rule="percent" />
      </Detail>
      <Detail label="Collateral value">
        <Numeral value={l.collateral} dp={2} />
      </Detail>
      <Detail label="Position notional">
        <Numeral value={l.notional} dp={2} />
      </Detail>
    </dl>
  );
}

function HistoryEmpty({ title, description }: { title: string; description: string }) {
  return (
    <Empty className="border-0 py-10">
      <EmptyHeader>
        <EmptyMedia>
          <HistoryIcon />
        </EmptyMedia>
        <EmptyTitle className="text-sm">{title}</EmptyTitle>
        <EmptyDescription className="text-xs">{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

function MobileCard({ header, aside, children, details }: { header: ReactNode; aside: ReactNode; children: ReactNode; details: ReactNode }) {
  return (
    <Collapsible render={<article />} className="flex flex-col gap-2.5 rounded-xl bg-container p-3">
      <header className="flex items-start justify-between gap-2">
        {header}
        {aside}
      </header>
      <div className="h-px bg-border" />
      {children}
      <CollapsibleContent>
        <div className="rounded-lg bg-container-high p-2.5">{details}</div>
      </CollapsibleContent>
      <CollapsibleTrigger className="group/trigger focus-ring flex items-center justify-center gap-1 rounded-md py-0.5 text-[11px] text-muted-foreground hover:text-foreground">
        <span className="group-data-panel-open/trigger:hidden">Details</span>
        <span className="hidden group-data-panel-open/trigger:inline">Hide details</span>
        <ChevronDownIcon className="size-3.5 transition-transform group-data-panel-open/trigger:rotate-180" />
      </CollapsibleTrigger>
    </Collapsible>
  );
}

function skeletonRows(cols: number) {
  return Array.from({ length: 3 }, (_, i) => (
    <TableRow key={i}>
      <TableCell colSpan={cols}>
        <Skeleton className="h-6 w-full" />
      </TableCell>
    </TableRow>
  ));
}

/* ------------------------------------------------------------ component */

/** Closed and liquidated positions with realised PnL, status and an expandable detail row. */
export function PositionHistory({
  positions,
  liquidations,
  tab: tabProp,
  defaultTab = "positions",
  onTabChange,
  ranges = DEFAULT_RANGES,
  range: rangeProp,
  defaultRange,
  onRangeChange,
  onShare,
  onSymbolClick,
  formatTime = defaultFormatTime,
  quote = "USDC",
  loading,
  toolbar,
  className,
}: PositionHistoryProps) {
  const [tab, setTab] = useControllable<PositionHistoryTab>(tabProp, defaultTab, onTabChange);
  const [range, setRange] = useControllable(rangeProp, defaultRange ?? ranges[1]?.value ?? "", onRangeChange);
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(() => new Set());
  const toggle = (key: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  const showRanges = onRangeChange != null || rangeProp != null;
  const positionsPanel =
    !loading && positions.length === 0 ? (
      <HistoryEmpty title="No closed positions" description="Positions appear here once they are closed or liquidated." />
    ) : (
      <>
        <div className="hidden md:block">
          <Table className="text-xs">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead scope="col" className="h-9 text-[11px]">Symbol</TableHead>
                <TableHead scope="col" className="h-9 text-right text-[11px]">Closed / Max size</TableHead>
                <TableHead scope="col" className="h-9 text-right text-[11px]">Avg. entry</TableHead>
                <TableHead scope="col" className="h-9 text-right text-[11px]">Avg. close</TableHead>
                <TableHead scope="col" className="h-9 text-right text-[11px]">Realized PnL ({quote})</TableHead>
                <TableHead scope="col" className="h-9 text-[11px]">Opened</TableHead>
                <TableHead scope="col" className="h-9 text-[11px]">Closed</TableHead>
                <TableHead scope="col" className="h-9 w-10 text-[11px]">
                  <span className="sr-only">Details</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && positions.length === 0
                ? skeletonRows(8)
                : positions.map((p) => {
                    const key = `p-${p.id}`;
                    const open = expanded.has(key);
                    return (
                      <Fragment key={p.id}>
                        <TableRow className={cn(open && "border-b-0 bg-container/60")}>
                          <TableCell className="relative py-2 pl-4">
                            <span aria-hidden className={cn("absolute top-2 bottom-2 left-1.5 w-[3px] rounded-full", p.side === "long" ? "bg-emerald-500" : "bg-rose-500")} />
                            <SymbolBlock p={p} onSymbolClick={onSymbolClick} />
                          </TableCell>
                          <TableCell className="text-right">
                            <Numeral value={p.closedQuantity} dp={p.baseDp} pad={false} />
                            <span className="text-muted-foreground"> / </span>
                            <Numeral value={p.maxQuantity} dp={p.baseDp} pad={false} className="text-muted-foreground" />
                          </TableCell>
                          <TableCell className="text-right">
                            <Numeral value={p.avgEntryPrice} tick={p.tick} />
                          </TableCell>
                          <TableCell className="text-right">
                            <Numeral value={p.avgClosePrice} tick={p.tick} />
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="inline-flex items-center justify-end gap-1">
                              <Numeral value={p.netPnl ?? p.realizedPnl} dp={2} coloring showSign className="font-medium" />
                              {onShare && <ShareButton label={`Share ${p.symbol} PnL`} onClick={() => onShare(p)} />}
                            </span>
                          </TableCell>
                          <TableCell className="font-mono text-muted-foreground tabular-nums">{formatTime(p.openTime)}</TableCell>
                          <TableCell className="font-mono text-muted-foreground tabular-nums">{p.closeTime != null ? formatTime(p.closeTime) : "—"}</TableCell>
                          <TableCell className="px-1">
                            <ExpandButton open={open} onClick={() => toggle(key)} label={`${open ? "Hide" : "Show"} ${p.symbol} details`} />
                          </TableCell>
                        </TableRow>
                        {open && (
                          <TableRow className="bg-container/60 hover:bg-container/60">
                            <TableCell colSpan={8} className="h-auto px-4 pt-1 pb-3 whitespace-normal">
                              <PositionDetails p={p} quote={quote} formatTime={formatTime} />
                            </TableCell>
                          </TableRow>
                        )}
                      </Fragment>
                    );
                  })}
            </TableBody>
          </Table>
        </div>
        <div className="flex flex-col gap-2 p-2 md:hidden">
          {loading && positions.length === 0
            ? Array.from({ length: 2 }, (_, i) => <Skeleton key={i} className="h-40 w-full rounded-xl" />)
            : positions.map((p) => (
                <MobileCard
                  key={p.id}
                  header={<SymbolBlock p={p} onSymbolClick={onSymbolClick} />}
                  aside={
                    <span className="flex items-start gap-1">
                      <span className="flex flex-col items-end gap-0.5">
                        <span className="text-[11px] text-muted-foreground">Realized PnL</span>
                        <Numeral value={p.netPnl ?? p.realizedPnl} dp={2} coloring showSign className="text-sm font-medium" />
                      </span>
                      {onShare && <ShareButton label={`Share ${p.symbol} PnL`} onClick={() => onShare(p)} />}
                    </span>
                  }
                  details={<PositionDetails p={p} quote={quote} formatTime={formatTime} />}
                >
                  <dl className="grid grid-cols-3 gap-2">
                    <Detail label="Closed / Max">
                      <Numeral value={p.closedQuantity} dp={p.baseDp} pad={false} />
                      <span className="text-muted-foreground">/</span>
                      <Numeral value={p.maxQuantity} dp={p.baseDp} pad={false} className="text-muted-foreground" />
                    </Detail>
                    <Detail label="Avg. entry">
                      <Numeral value={p.avgEntryPrice} tick={p.tick} />
                    </Detail>
                    <Detail label="Avg. close">
                      <Numeral value={p.avgClosePrice} tick={p.tick} />
                    </Detail>
                  </dl>
                </MobileCard>
              ))}
        </div>
      </>
    );

  const liquidationsPanel =
    liquidations && !loading && liquidations.length === 0 ? (
      <HistoryEmpty title="No liquidations" description="Good news — none of your positions have been liquidated." />
    ) : (
      liquidations && (
        <>
          <div className="hidden md:block">
            <Table className="text-xs">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead scope="col" className="h-9 text-[11px]">Time</TableHead>
                  <TableHead scope="col" className="h-9 text-[11px]">Liquidation id</TableHead>
                  <TableHead scope="col" className="h-9 text-[11px]">Symbol</TableHead>
                  <TableHead scope="col" className="h-9 text-right text-[11px]">Liq. mark price</TableHead>
                  <TableHead scope="col" className="h-9 text-right text-[11px]">Quantity</TableHead>
                  <TableHead scope="col" className="h-9 text-right text-[11px]">Fee rate</TableHead>
                  <TableHead scope="col" className="h-9 text-right text-[11px]">Liquidation fee</TableHead>
                  <TableHead scope="col" className="h-9 w-10 text-[11px]">
                    <span className="sr-only">Details</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && liquidations.length === 0
                  ? skeletonRows(8)
                  : liquidations.map((l) => {
                      const key = `l-${l.id}`;
                      const open = expanded.has(key);
                      const tone = l.side === "short" ? "down" : l.side === "long" ? "up" : "flat";
                      return (
                        <Fragment key={l.id}>
                          <TableRow className={cn(open && "border-b-0 bg-container/60")}>
                            <TableCell className="font-mono text-muted-foreground tabular-nums">{formatTime(l.time)}</TableCell>
                            <TableCell className="font-mono tabular-nums">{l.id}</TableCell>
                            <TableCell>
                              <SymbolDisplay symbol={l.symbol} iconSrc={l.iconSrc} size="xs" />
                            </TableCell>
                            <TableCell className="text-right">
                              <Numeral value={l.markPrice} tick={l.tick} />
                            </TableCell>
                            <TableCell className="text-right">
                              <Numeral value={l.quantity} dp={l.baseDp} pad={false} className={TONE_TEXT[tone]} />
                            </TableCell>
                            <TableCell className="text-right">
                              <Numeral value={l.feeRate} rule="percent" />
                            </TableCell>
                            <TableCell className="text-right">
                              <Numeral value={l.fee != null ? -Math.abs(l.fee) : null} dp={2} coloring />
                            </TableCell>
                            <TableCell className="px-1">
                              <ExpandButton open={open} onClick={() => toggle(key)} label={`${open ? "Hide" : "Show"} liquidation ${l.id} details`} />
                            </TableCell>
                          </TableRow>
                          {open && (
                            <TableRow className="bg-container/60 hover:bg-container/60">
                              <TableCell colSpan={8} className="h-auto px-4 pt-1 pb-3 whitespace-normal">
                                <LiquidationDetails l={l} />
                              </TableCell>
                            </TableRow>
                          )}
                        </Fragment>
                      );
                    })}
              </TableBody>
            </Table>
          </div>
          <div className="flex flex-col gap-2 p-2 md:hidden">
            {liquidations.map((l) => (
              <MobileCard
                key={l.id}
                header={
                  <span className="flex flex-col gap-1">
                    <SymbolDisplay symbol={l.symbol} iconSrc={l.iconSrc} size="sm" />
                    <span className="font-mono text-[11px] text-muted-foreground tabular-nums">Liquidation id: {l.id}</span>
                  </span>
                }
                aside={<span className="font-mono text-[11px] text-muted-foreground tabular-nums">{formatTime(l.time)}</span>}
                details={<LiquidationDetails l={l} />}
              >
                <dl className="grid grid-cols-2 gap-2">
                  <Detail label="Liq. mark price">
                    <Numeral value={l.markPrice} tick={l.tick} />
                  </Detail>
                  <Detail label="Quantity">
                    <Numeral value={l.quantity} dp={l.baseDp} pad={false} />
                  </Detail>
                  <Detail label="Fee rate">
                    <Numeral value={l.feeRate} rule="percent" />
                  </Detail>
                  <Detail label="Liquidation fee">
                    <Numeral value={l.fee != null ? -Math.abs(l.fee) : null} dp={2} coloring />
                  </Detail>
                </dl>
              </MobileCard>
            ))}
          </div>
        </>
      )
    );

  const rangeChips = showRanges && (
    // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
    <div role="group" aria-label="Time range" className="flex items-center gap-1">
      {ranges.map((r) => (
        <button
          key={r.value}
          type="button"
          aria-pressed={range === r.value}
          onClick={() => setRange(r.value)}
          className={cn(
            "focus-ring h-6 rounded-md px-2 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground",
            range === r.value && "bg-primary/12 text-primary hover:text-primary",
          )}
        >
          {r.label}
        </button>
      ))}
    </div>
  );

  return (
    <div data-slot="position-history" className={cn("flex w-full flex-col rounded-2xl border border-border bg-background", className)}>
      {liquidations ? (
        <Tabs value={tab} onValueChange={(v) => setTab(v as PositionHistoryTab)} className="gap-0">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-border px-3">
            <TabsList variant="line" className="border-0">
              <TabsTrigger value="positions" className="text-xs">
                Position history
              </TabsTrigger>
              <TabsTrigger value="liquidations" className="text-xs">
                Liquidations
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2 pb-1 sm:pb-0">
              {tab === "positions" && rangeChips}
              {toolbar}
            </div>
          </div>
          <TabsContent value="positions">{positionsPanel}</TabsContent>
          <TabsContent value="liquidations">{liquidationsPanel}</TabsContent>
        </Tabs>
      ) : (
        <>
          {(rangeChips || toolbar) && (
            <div className="flex items-center justify-between gap-3 border-b border-border px-3 py-2">
              {rangeChips}
              {toolbar}
            </div>
          )}
          {positionsPanel}
        </>
      )}
    </div>
  );
}
