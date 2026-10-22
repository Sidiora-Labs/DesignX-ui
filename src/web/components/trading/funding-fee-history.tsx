import { CoinsIcon } from "lucide-react";
import { useCallback, useState, type ReactNode } from "react";

import { Numeral } from "@/components/trading/numeral";
import { SymbolDisplay } from "@/components/trading/token-icon";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { parseSymbol, TONE_TEXT } from "@/lib/trading";
import { cn } from "@/lib/utils";

export interface FundingPayment {
  id: string;
  time: number | Date;
  symbol: string;
  /** Funding rate for the interval as a fraction — 0.0001 = 0.01%. */
  rate: number;
  /** Position size in base at funding time. */
  positionSize: number;
  side?: "long" | "short";
  /** Signed payment in quote — positive received, negative paid. */
  payment: number;
  status?: "settled" | "accrued";
  tick?: number;
  baseDp?: number;
  iconSrc?: string;
}

export interface FundingFeeHistoryProps {
  payments: FundingPayment[];
  /** Symbol filter value. `"all"` shows every symbol. */
  symbol?: string;
  defaultSymbol?: string;
  onSymbolChange?: (symbol: string) => void;
  /** Options for the symbol filter. Defaults to the symbols found in `payments`. Pass `[]` to hide the filter. */
  symbols?: string[];
  /** Override the totals row — e.g. a server-side total across all pages. */
  total?: number | null;
  /** Filter rows locally by the selected symbol. Turn off when the server already filters. */
  filterLocally?: boolean;
  quote?: string;
  formatTime?: (time: number | Date) => ReactNode;
  loading?: boolean;
  /** Rendered at the end of the toolbar, e.g. a date range picker. */
  toolbar?: ReactNode;
  className?: string;
}

const ALL = "all";
const pad2 = (n: number) => String(n).padStart(2, "0");
function defaultFormatTime(time: number | Date) {
  const d = typeof time === "number" ? new Date(time) : time;
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
}

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

function PaymentType({ payment }: { payment: number }) {
  return <span className={payment >= 0 ? TONE_TEXT.up : TONE_TEXT.down}>{payment >= 0 ? "Received" : "Paid"}</span>;
}

/** Funding payments per position and interval, with a totals row and a symbol filter. */
export function FundingFeeHistory({
  payments,
  symbol: symbolProp,
  defaultSymbol = ALL,
  onSymbolChange,
  symbols,
  total,
  filterLocally = true,
  quote = "USDC",
  formatTime = defaultFormatTime,
  loading,
  toolbar,
  className,
}: FundingFeeHistoryProps) {
  const [symbol, setSymbol] = useControllable(symbolProp, defaultSymbol, onSymbolChange);
  const options = symbols ?? Array.from(new Set(payments.map((p) => p.symbol)));
  const rows = filterLocally && symbol !== ALL ? payments.filter((p) => p.symbol === symbol) : payments;
  const sum = total !== undefined ? total : rows.reduce((s, p) => s + p.payment, 0);
  const items = [{ label: "All symbols", value: ALL }, ...options.map((s) => ({ label: parseSymbol(s).base, value: s }))];
  const empty = !loading && rows.length === 0;

  return (
    <div data-slot="funding-fee-history" className={cn("flex w-full flex-col rounded-2xl border border-border bg-background", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-3 py-2">
        <div className="flex items-center gap-2">
          {options.length > 0 && (
            <Select items={items} value={symbol} onValueChange={(v) => setSymbol((v as string | null) ?? ALL)}>
              <SelectTrigger size="sm" className="min-w-36 text-xs" aria-label="Filter by symbol">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {items.map((i) => (
                  <SelectItem key={i.value} value={i.value} className="text-xs">
                    {i.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {toolbar}
        </div>
        <div className="flex items-baseline gap-2 text-xs">
          <span className="text-muted-foreground">Total funding ({quote})</span>
          <Numeral value={sum} dp={4} pad={false} coloring showSign className="text-sm font-medium" />
        </div>
      </div>

      {empty ? (
        <Empty className="border-0 py-10">
          <EmptyHeader>
            <EmptyMedia>
              <CoinsIcon />
            </EmptyMedia>
            <EmptyTitle className="text-sm">No funding payments</EmptyTitle>
            <EmptyDescription className="text-xs">Funding is exchanged between longs and shorts every interval while you hold a position.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <>
          <div className="hidden md:block">
            <Table className="text-xs">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead scope="col" className="h-9 text-[11px]">Time</TableHead>
                  <TableHead scope="col" className="h-9 text-[11px]">Symbol</TableHead>
                  <TableHead scope="col" className="h-9 text-right text-[11px]">Funding rate</TableHead>
                  <TableHead scope="col" className="h-9 text-right text-[11px]">Position size</TableHead>
                  <TableHead scope="col" className="h-9 text-[11px]">Type</TableHead>
                  <TableHead scope="col" className="h-9 text-right text-[11px]">Payment ({quote})</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && rows.length === 0
                  ? Array.from({ length: 4 }, (_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={6}>
                          <Skeleton className="h-5 w-full" />
                        </TableCell>
                      </TableRow>
                    ))
                  : rows.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="h-10 font-mono text-muted-foreground tabular-nums">{formatTime(p.time)}</TableCell>
                        <TableCell className="h-10">
                          <SymbolDisplay symbol={p.symbol} iconSrc={p.iconSrc} size="xs" />
                        </TableCell>
                        <TableCell className="h-10 text-right">
                          <Numeral value={p.rate} rule="percent" dp={4} showSign className={p.rate < 0 ? TONE_TEXT.down : undefined} />
                        </TableCell>
                        <TableCell className="h-10 text-right">
                          <Numeral
                            value={p.positionSize}
                            dp={p.baseDp}
                            pad={false}
                            className={p.side ? TONE_TEXT[p.side === "long" ? "up" : "down"] : undefined}
                          />
                        </TableCell>
                        <TableCell className="h-10">
                          <span className="inline-flex items-center gap-1.5">
                            <PaymentType payment={p.payment} />
                            {p.status === "accrued" && <span className="text-[10px] text-muted-foreground">Accrued</span>}
                          </span>
                        </TableCell>
                        <TableCell className="h-10 text-right">
                          <Numeral value={p.payment} dp={4} pad={false} coloring showSign className="font-medium" />
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
              {rows.length > 0 && (
                <TableFooter className="bg-container/60">
                  <TableRow className="hover:bg-transparent">
                    <TableHead scope="row" colSpan={5} className="h-10 text-[11px]">
                      Total · {rows.length} {rows.length === 1 ? "payment" : "payments"}
                    </TableHead>
                    <TableCell className="h-10 text-right">
                      <Numeral value={sum} dp={4} pad={false} coloring showSign className="font-semibold" />
                    </TableCell>
                  </TableRow>
                </TableFooter>
              )}
            </Table>
          </div>

          <ul className="flex flex-col md:hidden">
            {loading && rows.length === 0
              ? Array.from({ length: 3 }, (_, i) => (
                  <li key={i} className="p-3">
                    <Skeleton className="h-12 w-full" />
                  </li>
                ))
              : rows.map((p) => (
                  <li key={p.id} className="flex flex-col gap-2 border-b border-border px-3 py-2.5 last:border-b-0">
                    <div className="flex items-center justify-between gap-2">
                      <SymbolDisplay symbol={p.symbol} iconSrc={p.iconSrc} size="xs" className="text-xs" />
                      <span className="font-mono text-[11px] text-muted-foreground tabular-nums">{formatTime(p.time)}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[11px] text-muted-foreground">Funding rate</span>
                        <Numeral value={p.rate} rule="percent" dp={4} showSign className={cn("text-xs", p.rate < 0 && TONE_TEXT.down)} />
                      </div>
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="text-[11px] text-muted-foreground">Size</span>
                        <Numeral value={p.positionSize} dp={p.baseDp} pad={false} className="text-xs" />
                      </div>
                      <div className="flex flex-col items-end gap-0.5">
                        <span className="text-[11px]">
                          <PaymentType payment={p.payment} />
                        </span>
                        <Numeral value={p.payment} dp={4} pad={false} coloring showSign className="text-xs font-medium" />
                      </div>
                    </div>
                  </li>
                ))}
          </ul>
          {rows.length > 0 && (
            <div className="flex items-center justify-between border-t border-border bg-container/60 px-3 py-2.5 text-xs md:hidden">
              <span className="text-muted-foreground">
                Total · {rows.length} {rows.length === 1 ? "payment" : "payments"}
              </span>
              <Numeral value={sum} dp={4} pad={false} coloring showSign className="font-semibold" />
            </div>
          )}
        </>
      )}
    </div>
  );
}
