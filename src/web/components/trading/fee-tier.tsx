import type { ReactNode } from "react";

import { Numeral } from "@/components/trading/numeral";
import { Progress } from "@/components/ui/progress";
import { formatCompact, formatNumber, formatUsd } from "@/lib/trading";
import { cn } from "@/lib/utils";

export type FeeTierRow = {
  tier: number | string;
  /** Lower bound of the 30-day volume, inclusive. */
  minVolume: number;
  /** Upper bound, exclusive. Omit for the top tier. */
  maxVolume?: number | null;
  /** Fraction (0.0002 = 0.02%) or preformatted text such as "0.02% / 0%". */
  makerFee: number | string;
  takerFee: number | string;
};

export interface FeeTierProps {
  tiers: FeeTierRow[];
  /** Your 30-day trading volume. */
  volume30d?: number | null;
  /** Your tier. Defaults to the highest tier whose minimum `volume30d` reaches. */
  currentTier?: number | string;
  title?: ReactNode;
  /** When the tier is recalculated, e.g. "Updated daily ~02:15 UTC". */
  updateNote?: ReactNode;
  unit?: string;
  /** Fee formatter for numeric fees. */
  formatFee?: (fraction: number) => string;
  className?: string;
}

const defaultFormatFee = (v: number) => formatNumber(v, "percent", { dp: 3, pad: false });

const volumeRange = (t: FeeTierRow) =>
  t.maxVolume == null ? `≥ ${formatCompact(t.minVolume, 1)}` : `${t.minVolume === 0 ? "0" : formatCompact(t.minVolume, 1)} – ${formatCompact(t.maxVolume, 1)}`;

/** Maker and taker fee tiers by 30-day volume, with your tier highlighted and progress to the next one. */
export function FeeTier({
  tiers,
  volume30d,
  currentTier,
  title = "Fee tier",
  updateNote = "Updated daily ~02:15 UTC",
  unit = "USDC",
  formatFee = defaultFormatFee,
  className,
}: FeeTierProps) {
  const fee = (v: number | string) => (typeof v === "number" ? formatFee(v) : v);
  let index = currentTier !== undefined ? tiers.findIndex((t) => t.tier === currentTier) : -1;
  if (index === -1 && currentTier === undefined && volume30d != null) {
    tiers.forEach((t, i) => {
      if (volume30d >= t.minVolume) index = i;
    });
  }
  const current = index >= 0 ? tiers[index] : undefined;
  const next = index >= 0 ? tiers[index + 1] : undefined;
  const span = current && next ? next.minVolume - current.minVolume : 0;
  const progress = volume30d != null && current && next && span > 0 ? Math.min(1, Math.max(0, (volume30d - current.minVolume) / span)) : current && !next ? 1 : 0;
  const remaining = volume30d != null && next ? Math.max(0, next.minVolume - volume30d) : null;

  const stats: { label: string; value: ReactNode }[] = [
    { label: "Your tier", value: current ? <span className="text-primary">Tier {current.tier}</span> : "—" },
    { label: `30d volume (${unit})`, value: <Numeral value={volume30d} dp={2} /> },
    { label: "Taker fee rate", value: current ? fee(current.takerFee) : "—" },
    { label: "Maker fee rate", value: current ? fee(current.makerFee) : "—" },
  ];

  return (
    <section data-slot="fee-tier" aria-label="Fee tiers" className={cn("flex w-full flex-col gap-4 rounded-2xl border border-border bg-container p-4", className)}>
      <header className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-medium">{title}</h3>
        {updateNote && <span className="text-[11px] text-muted-foreground">{updateNote}</span>}
      </header>

      <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col gap-1 rounded-xl bg-container-high px-3 py-2.5">
            <dt className="text-[11px] text-muted-foreground">{s.label}</dt>
            <dd className="font-mono text-base font-semibold tabular-nums">{s.value}</dd>
          </div>
        ))}
      </dl>

      {current && (
        <div className="flex flex-col gap-1.5">
          <Progress value={progress * 100} aria-label="Progress to next tier" className="[&_[data-slot=progress-track]]:h-1.5" />
          <p className="text-[11px] text-muted-foreground">
            {next && remaining != null ? (
              remaining > 0 ? (
                <>
                  Trade <span className="font-mono text-foreground tabular-nums">{formatUsd(remaining, 0)}</span> more in 30 days to reach Tier {next.tier}.
                </>
              ) : (
                <>You qualify for Tier {next.tier} at the next update.</>
              )
            ) : (
              "You're on the top tier."
            )}
          </p>
        </div>
      )}

      <div className="-mx-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th scope="col" className="h-9 pr-3 pl-4 text-left text-[11px] font-normal text-muted-foreground">
                Tier
              </th>
              <th scope="col" className="h-9 px-3 text-left text-[11px] font-normal whitespace-nowrap text-muted-foreground">
                30d volume ({unit})
              </th>
              <th scope="col" className="h-9 px-3 text-right text-[11px] font-normal text-muted-foreground">
                Maker
              </th>
              <th scope="col" className="h-9 pr-4 pl-3 text-right text-[11px] font-normal text-muted-foreground">
                Taker
              </th>
            </tr>
          </thead>
          <tbody>
            {tiers.map((t, i) => {
              const isCurrent = i === index;
              return (
                <tr
                  key={String(t.tier)}
                  aria-current={isCurrent ? "true" : undefined}
                  className={cn("border-b border-border/60 last:border-0", isCurrent ? "bg-primary/8" : "hover:bg-container-high/50")}
                >
                  <th scope="row" className={cn("h-10 pr-3 pl-4 text-left text-xs font-medium", isCurrent && "relative before:absolute before:inset-y-1 before:left-0 before:w-0.5 before:rounded-full before:bg-primary")}>
                    <span className="flex items-center gap-1.5">
                      Tier {t.tier}
                      {isCurrent && <span className="rounded-full bg-primary/15 px-1.5 py-px text-[10px] font-medium text-primary">You</span>}
                    </span>
                  </th>
                  <td className="px-3 font-mono text-xs whitespace-nowrap tabular-nums">{volumeRange(t)}</td>
                  <td className="px-3 text-right font-mono text-xs whitespace-nowrap tabular-nums">{fee(t.makerFee)}</td>
                  <td className="pr-4 pl-3 text-right font-mono text-xs whitespace-nowrap tabular-nums">{fee(t.takerFee)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
