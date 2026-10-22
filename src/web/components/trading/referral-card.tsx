import { CheckIcon, CopyIcon, InfoIcon, Settings2Icon } from "lucide-react";
import { useId, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------ helpers */

/** `0.25` → `25%`, `0.125` → `12.5%`. */
const pct = (fraction: number) => `${Number((fraction * 100).toFixed(2))}%`;
/** Fraction → whole-percent slider units. */
const toPct = (f: number) => Math.round(f * 10000) / 100;

function useControllable<T>(value: T | undefined, defaultValue: T, onChange?: (v: T) => void) {
  const [inner, setInner] = useState(defaultValue);
  const controlled = value !== undefined;
  const set = (v: T) => {
    if (!controlled) setInner(v);
    onChange?.(v);
  };
  return [controlled ? value : inner, set] as const;
}

/** Uppercase A–Z / 0–9 only — formatting, not validation. */
export const formatReferralCode = (text: string, max = 15) => text.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, max);

export type ReferralCopyKind = "code" | "link";

export interface CopyButtonProps {
  value: string;
  label?: string;
  onCopy?: (value: string) => void;
  className?: string;
}

/**
 * Writes `value` to the clipboard (when available) and calls `onCopy`.
 * The check mark stays until the pointer or focus leaves — no timers.
 */
export function CopyButton({ value, label = "Copy", onCopy, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      aria-label={copied ? "Copied" : label}
      onClick={async () => {
        try {
          await navigator.clipboard?.writeText(value);
        } catch {
          // clipboard unavailable (insecure context) — still report the intent
        }
        setCopied(true);
        onCopy?.(value);
      }}
      onPointerLeave={() => setCopied(false)}
      onBlur={() => setCopied(false)}
      className={cn(
        "focus-ring grid size-7 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-container-higher hover:text-foreground",
        className,
      )}
    >
      {copied ? <CheckIcon className="size-3.5 text-emerald-600 dark:text-emerald-400" /> : <CopyIcon className="size-3.5" />}
    </button>
  );
}

function CopyRow({ label, value, onCopy, mono }: { label: string; value: string; onCopy?: (v: string) => void; mono?: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-xl bg-container-high py-1.5 ps-3 pe-1.5">
      <span className="shrink-0 text-[11px] text-muted-foreground">{label}</span>
      <span className={cn("min-w-0 flex-1 truncate text-end text-sm font-medium text-primary", mono && "font-mono tracking-wide")} title={value}>
        {value}
      </span>
      <CopyButton value={value} label={`Copy ${label.toLowerCase()}`} onCopy={onCopy} />
    </div>
  );
}

function HintLabel({ children, hint }: { children: ReactNode; hint?: ReactNode }) {
  if (!hint) return <span className="text-[11px] text-muted-foreground">{children}</span>;
  return (
    <Tooltip>
      <TooltipTrigger
        render={<button type="button" />}
        className="w-fit cursor-help border-b border-dashed border-border text-left text-[11px] text-muted-foreground"
      >
        {children}
      </TooltipTrigger>
      <TooltipContent className="max-w-64">{hint}</TooltipContent>
    </Tooltip>
  );
}

/* ------------------------------------------------------------ split bar */

export interface RateSplitProps {
  /** Your share as a fraction of the trading fee. */
  keep: number;
  /** Your referees' share as a fraction of the trading fee. */
  referee: number;
  keepLabel?: ReactNode;
  refereeLabel?: ReactNode;
  className?: string;
}

/** "You keep X% / Referees get Y%" with a proportional bar. */
export function RateSplit({ keep, referee, keepLabel = "You keep", refereeLabel = "Referees get", className }: RateSplitProps) {
  const total = keep + referee;
  const keepPct = total > 0 ? (keep / total) * 100 : 50;
  return (
    <div data-slot="rate-split" className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-end justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-[11px] text-muted-foreground">{keepLabel}</span>
          <span className="font-mono text-lg font-semibold text-emerald-700 tabular-nums dark:text-emerald-400">{pct(keep)}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[11px] text-muted-foreground">{refereeLabel}</span>
          <span className="font-mono text-lg font-semibold tabular-nums">{pct(referee)}</span>
        </div>
      </div>
      <div className="flex h-1.5 gap-0.5 overflow-hidden rounded-full" aria-hidden>
        <span className="rounded-full bg-emerald-500" style={{ width: `${keepPct}%` }} />
        <span className="flex-1 rounded-full bg-container-highest" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ card */

export interface ReferralCardProps {
  title?: ReactNode;
  /** Your referral code. */
  code: string;
  /** Full referral link. */
  link?: string;
  /** Small pill above the code, e.g. `Multilevel`. */
  badge?: ReactNode;
  /** Your rebate (commission) rate as a fraction of trading fees. */
  rebateRate: number;
  /** The discount your referees get, as a fraction of trading fees. */
  refereeRate: number;
  /** Commission on indirect (2nd-level+) trades. Omit to hide. */
  indirectRate?: number;
  /** Trading fee rebate shared with direct traders, as a fraction. Omit to hide. */
  tradingFeeRebate?: number;
  onCopy?: (value: string, kind: ReferralCopyKind) => void;
  /** Shows a "Configure" button. */
  onConfigure?: () => void;
  onSetTradingFeeRebate?: () => void;
  /** Extra content at the bottom, e.g. a create-code form. */
  children?: ReactNode;
  className?: string;
}

/** Your referral code and link with copy actions, plus the commission split between you and your referees. */
export function ReferralCard({
  title = "Referral",
  code,
  link,
  badge,
  rebateRate,
  refereeRate,
  indirectRate,
  tradingFeeRebate,
  onCopy,
  onConfigure,
  onSetTradingFeeRebate,
  children,
  className,
}: ReferralCardProps) {
  return (
    <section data-slot="referral-card" className={cn("flex flex-col gap-4 rounded-2xl border border-border bg-container p-5", className)}>
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold">{title}</h3>
          {badge != null && <span className="rounded-full border border-primary/40 px-2 py-0.5 text-[10px] leading-none font-medium text-primary">{badge}</span>}
        </div>
        {onConfigure && (
          <Button size="xs" variant="tonal" onClick={onConfigure}>
            <Settings2Icon />
            Configure
          </Button>
        )}
      </header>

      <div className="flex flex-col gap-2">
        <CopyRow label="Referral code" value={code} mono onCopy={(v) => onCopy?.(v, "code")} />
        {link != null && <CopyRow label="Referral link" value={link} onCopy={(v) => onCopy?.(v, "link")} />}
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-border p-3">
        <RateSplit keep={rebateRate} referee={refereeRate} keepLabel="Your rebate" refereeLabel="Referee discount" />
        {indirectRate != null && (
          <div className="flex items-center justify-between border-t border-border pt-2 text-xs">
            <HintLabel hint="When your referee's recruits (or deeper) trade.">Indirect trades</HintLabel>
            <span className="font-mono font-medium text-emerald-700 tabular-nums dark:text-emerald-400">{pct(indirectRate)}</span>
          </div>
        )}
      </div>

      {tradingFeeRebate != null && (
        <div className="flex items-center justify-between gap-2 rounded-xl bg-container-high px-3 py-2.5">
          <span className="flex items-center gap-1.5 text-xs">
            <HintLabel hint="The share of trading fees your directly referred traders get back. Paid from your commission.">Trading fee rebate</HintLabel>
            <span className="font-mono font-medium tabular-nums">{pct(tradingFeeRebate)}</span>
          </span>
          {onSetTradingFeeRebate && (
            <Button size="xs" variant="outline" onClick={onSetTradingFeeRebate}>
              Set rebate
            </Button>
          )}
        </div>
      )}
      {children}
    </section>
  );
}

/* ------------------------------------------------------------ create code form */

export type ReferralCodeFormValues = { code: string; keep: number; referee: number };

export interface ReferralCodeFormProps {
  /** Total commission available to split, as a fraction (0.4 = 40%). */
  totalSplit: number;
  /** Highest share you may keep; the rest is hatched. Defaults to `totalSplit`. */
  maxKeep?: number;
  /** Your share (controlled). */
  keep?: number;
  defaultKeep?: number;
  onKeepChange?: (keep: number) => void;
  /** Code text (controlled). */
  code?: string;
  defaultCode?: string;
  onCodeChange?: (code: string) => void;
  /** Hide the code input — when editing the split of an existing code. */
  hideCode?: boolean;
  /** Your direct-trade commission, shown above the split. */
  directRate?: number;
  indirectRate?: number;
  /** Minimum always passed to referees, e.g. a base rebate. Shown as a hint. */
  baseRefereeRate?: number;
  title?: ReactNode;
  submitLabel?: ReactNode;
  /** Error from your validation, e.g. "Code already taken". */
  error?: ReactNode;
  submitting?: boolean;
  disabled?: boolean;
  onSubmit?: (values: ReferralCodeFormValues) => void;
  onCancel?: () => void;
  className?: string;
}

/** Create a referral code and choose how much commission to pass down to referees. */
export function ReferralCodeForm({
  totalSplit,
  maxKeep = totalSplit,
  keep: keepProp,
  defaultKeep,
  onKeepChange,
  code: codeProp,
  defaultCode = "",
  onCodeChange,
  hideCode,
  directRate,
  indirectRate,
  baseRefereeRate,
  title = "Create referral code",
  submitLabel = "Create code",
  error,
  submitting,
  disabled,
  onSubmit,
  onCancel,
  className,
}: ReferralCodeFormProps) {
  const id = useId();
  const [keep, setKeep] = useControllable(keepProp, defaultKeep ?? maxKeep, onKeepChange);
  const [code, setCode] = useControllable(codeProp, defaultCode, onCodeChange);
  const referee = Math.max(0, totalSplit - keep);
  const selectable = totalSplit > 0 ? Math.min(100, (maxKeep / totalSplit) * 100) : 100;

  return (
    <form
      data-slot="referral-code-form"
      className={cn("flex flex-col gap-4", className)}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.({ code, keep, referee });
      }}
    >
      {title != null && <h4 className="text-sm font-semibold">{title}</h4>}

      {!hideCode && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-code`} className="text-[11px] text-muted-foreground">
            Referral code
          </label>
          <Input
            id={`${id}-code`}
            value={code}
            maxLength={15}
            autoComplete="off"
            spellCheck={false}
            placeholder="e.g. A1B2C3D4"
            aria-invalid={error != null || undefined}
            aria-describedby={`${id}-code-help`}
            onChange={(e) => setCode(formatReferralCode(e.target.value))}
            className="font-mono tracking-wider uppercase"
          />
          <p id={`${id}-code-help`} className={cn("text-[11px]", error != null ? "text-destructive" : "text-muted-foreground")}>
            {error ?? "4–15 characters, A–Z and 0–9 only."}
          </p>
        </div>
      )}

      {(directRate != null || indirectRate != null) && (
        <div className="grid grid-cols-2 gap-2">
          {directRate != null && (
            <div className="flex flex-col rounded-xl border border-border px-3 py-2">
              <HintLabel hint="When your direct referee trades.">Direct trades</HintLabel>
              <span className="font-mono text-base font-semibold text-emerald-700 tabular-nums dark:text-emerald-400">{pct(directRate)}</span>
            </div>
          )}
          {indirectRate != null && (
            <div className="flex flex-col rounded-xl border border-border px-3 py-2">
              <HintLabel hint="When your referee's recruits (or deeper) trade.">Indirect trades</HintLabel>
              <span className="font-mono text-base font-semibold text-emerald-700 tabular-nums dark:text-emerald-400">{pct(indirectRate)}</span>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col gap-2 rounded-xl border border-border p-3">
        <span id={`${id}-split`} className="text-[11px] text-muted-foreground">
          Total to split: <span className="font-mono text-foreground tabular-nums">{pct(totalSplit)}</span>
        </span>
        <div className="relative">
          <Slider
            aria-labelledby={`${id}-split`}
            min={0}
            max={toPct(totalSplit)}
            step={1}
            value={toPct(keep)}
            disabled={disabled}
            onValueChange={(v) => {
              const n = Array.isArray(v) ? v[0] : v;
              setKeep(Math.min(Math.round(n) / 100, maxKeep));
            }}
          />
          {selectable < 100 && (
            <span
              aria-hidden
              className="pointer-events-none absolute end-0 top-1/2 h-1.5 -translate-y-1/2 rounded-e-full bg-[repeating-linear-gradient(45deg,var(--color-border)_0,var(--color-border)_3px,transparent_3px,transparent_6px)]"
              style={{ left: `${selectable}%` }}
            />
          )}
        </div>
        <RateSplit keep={keep} referee={referee} refereeLabel="Direct referees get" />
        {baseRefereeRate != null && baseRefereeRate > 0 && (
          <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <InfoIcon className="size-3 shrink-0" />
            At least {pct(baseRefereeRate)} always passes down to your direct referees.
          </p>
        )}
      </div>

      <div className="flex gap-2">
        {onCancel && (
          <Button type="button" variant="tonal" className="flex-1" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" className="flex-1" disabled={disabled || submitting || (!hideCode && code.length < 4)}>
          {submitting ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------ bind code form */

export interface BindReferralCodeFormProps {
  /** Code text (controlled). */
  value?: string;
  defaultValue?: string;
  onValueChange?: (code: string) => void;
  title?: ReactNode;
  description?: ReactNode;
  /** e.g. "This referral code does not exist." */
  error?: ReactNode;
  /** Shows a "checking…" hint while you look the code up. */
  checking?: boolean;
  submitting?: boolean;
  /** Shows the "I was not referred" checkbox. */
  allowSkip?: boolean;
  /** Called with the code, or `null` when the trader skips. */
  onSubmit?: (code: string | null) => void;
  onCancel?: () => void;
  className?: string;
}

/** Lets a trader bind the referral code they were given. */
export function BindReferralCodeForm({
  value,
  defaultValue = "",
  onValueChange,
  title = "Were you referred by someone?",
  description = "If an affiliate shared a referral code with you, enter it to bind your account and get trading fee rebates.",
  error,
  checking,
  submitting,
  allowSkip = true,
  onSubmit,
  onCancel,
  className,
}: BindReferralCodeFormProps) {
  const id = useId();
  const [code, setCode] = useControllable(value, defaultValue, onValueChange);
  const [skip, setSkip] = useState(false);
  const ready = skip || (code.length >= 4 && error == null && !checking);

  return (
    <form
      data-slot="bind-referral-code-form"
      className={cn("flex flex-col gap-4", className)}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.(skip ? null : code);
      }}
    >
      <div className="flex flex-col gap-1">
        <h4 className="text-sm font-semibold">{title}</h4>
        {description != null && <p className="rounded-lg bg-warning-container px-3 py-2 text-[11px] leading-relaxed text-warning">{description}</p>}
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${id}-code`} className="text-[11px] text-muted-foreground">
          Referral code
        </label>
        <Input
          id={`${id}-code`}
          value={code}
          maxLength={15}
          disabled={skip}
          autoComplete="off"
          spellCheck={false}
          placeholder="Enter referrer's code"
          aria-invalid={(!skip && error != null) || undefined}
          onChange={(e) => setCode(formatReferralCode(e.target.value))}
          className="font-mono tracking-wider uppercase"
        />
        {!skip && (error != null || checking) && (
          <p className={cn("text-[11px]", error != null ? "text-destructive" : "text-muted-foreground")}>{error ?? "Checking code…"}</p>
        )}
      </div>
      {allowSkip && (
        <div className="flex items-center gap-2">
          <Checkbox
            id={`${id}-skip`}
            checked={skip}
            onCheckedChange={(checked) => {
              setSkip(checked);
              if (checked) setCode("");
            }}
          />
          <label htmlFor={`${id}-skip`} className="text-xs text-muted-foreground">
            No, I was not referred by anyone
          </label>
        </div>
      )}
      <div className="flex gap-2">
        {onCancel && (
          <Button type="button" variant="tonal" className="flex-1" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" className="flex-1" disabled={!ready || submitting}>
          {submitting ? "Binding…" : "Confirm"}
        </Button>
      </div>
    </form>
  );
}
