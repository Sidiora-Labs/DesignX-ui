import { CheckIcon, CopyIcon, DownloadIcon, Share2Icon } from "lucide-react";
import { useId, useState, type ReactElement, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatNumber, formatPrice, parseSymbol } from "@/lib/trading";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------ types */

/** Which headline figures the poster shows. */
export type PnlShareFormat = "roi_pnl" | "roi" | "pnl";

/** Optional detail fields the user can toggle. */
export type PnlShareField = "openPrice" | "closePrice" | "markPrice" | "openTime" | "closeTime" | "quantity" | "leverage";

export type PnlShareTheme = {
  id: string;
  label: string;
  /** Any CSS background — gradients or `url(...)`. */
  background: string;
  /** Text colour family that reads on the background. */
  tone?: "dark" | "light";
};

export type PnlSharePosition = {
  /** `PERP_BTC_USDC`, `BTC-PERP`… */
  symbol: string;
  side: "long" | "short";
  marginMode?: "cross" | "isolated";
  /** Realized or unrealized PnL in quote currency. */
  pnl?: number | null;
  /** Return on margin as a fraction (0.4235 = +42.35%). */
  roi?: number | null;
  openPrice?: number | null;
  closePrice?: number | null;
  markPrice?: number | null;
  quantity?: number | null;
  leverage?: number | null;
  openTime?: number | Date | null;
  closeTime?: number | Date | null;
};

export type PnlShareReferral = {
  code: string;
  link?: string;
  /** e.g. "Trade with me and get 10% off fees". */
  slogan?: ReactNode;
};

/** Everything the user picked — passed to the download / copy / share callbacks. */
export type PnlShareOptions = {
  format: PnlShareFormat;
  fields: PnlShareField[];
  themeId: string;
  /** Up to 25 characters; empty when the message is turned off. */
  message: string;
};

/* ------------------------------------------------------------ constants */

export const PNL_SHARE_THEMES: PnlShareTheme[] = [
  {
    id: "aurora",
    label: "Aurora",
    tone: "dark",
    background:
      "radial-gradient(90% 120% at 100% 0%, oklch(0.55 0.2 290 / 0.85), transparent 60%), radial-gradient(80% 120% at 0% 100%, oklch(0.6 0.16 180 / 0.55), transparent 60%), oklch(0.18 0.03 270)",
  },
  {
    id: "ember",
    label: "Ember",
    tone: "dark",
    background:
      "radial-gradient(90% 120% at 100% 0%, oklch(0.62 0.2 35 / 0.85), transparent 60%), radial-gradient(70% 110% at 0% 100%, oklch(0.55 0.2 350 / 0.5), transparent 60%), oklch(0.17 0.03 30)",
  },
  {
    id: "midnight",
    label: "Midnight",
    tone: "dark",
    background: "linear-gradient(135deg, oklch(0.22 0.04 250) 0%, oklch(0.14 0.02 250) 55%, oklch(0.3 0.09 240) 100%)",
  },
  {
    id: "paper",
    label: "Paper",
    tone: "light",
    background:
      "radial-gradient(90% 120% at 100% 0%, oklch(0.9 0.08 150 / 0.9), transparent 60%), radial-gradient(70% 110% at 0% 100%, oklch(0.92 0.06 90 / 0.8), transparent 60%), oklch(0.98 0.005 100)",
  },
];

export const PNL_SHARE_FIELDS: PnlShareField[] = ["openPrice", "closePrice", "markPrice", "openTime", "closeTime", "quantity", "leverage"];

const FIELD_LABEL: Record<PnlShareField, string> = {
  openPrice: "Open price",
  closePrice: "Close price",
  markPrice: "Mark price",
  openTime: "Opened at",
  closeTime: "Closed at",
  quantity: "Quantity",
  leverage: "Leverage",
};

const FORMAT_LABEL: Record<PnlShareFormat, string> = { roi_pnl: "ROI & PnL", roi: "ROI", pnl: "PnL" };

export const MESSAGE_MAX_LENGTH = 25;

/* ------------------------------------------------------------ helpers */

const pad2 = (n: number) => String(n).padStart(2, "0");
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function shortTime(t: number | Date) {
  const d = new Date(t);
  return `${MONTHS[d.getMonth()]}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

function stamp(t: number | Date) {
  const d = new Date(t);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

/** Formats the position offers, in the order the poster shows them. */
export function availableFormats(position: PnlSharePosition): PnlShareFormat[] {
  const roi = position.roi != null;
  const pnl = position.pnl != null;
  return roi && pnl ? ["roi_pnl", "roi", "pnl"] : roi ? ["roi"] : pnl ? ["pnl"] : [];
}

/** Optional fields the position has values for. */
export function availableFields(position: PnlSharePosition): PnlShareField[] {
  return PNL_SHARE_FIELDS.filter((f) => position[f] != null);
}

function resolveTheme(theme: PnlShareTheme | string | undefined, themes: PnlShareTheme[]) {
  if (theme && typeof theme === "object") return theme;
  return themes.find((t) => t.id === theme) ?? themes[0] ?? PNL_SHARE_THEMES[0];
}

/* ------------------------------------------------------------ poster */

export interface PnlShareCardProps {
  position: PnlSharePosition;
  format?: PnlShareFormat;
  /** Detail fields to print. Defaults to every field the position has. */
  fields?: PnlShareField[];
  /** A theme or a theme id from `themes`. */
  theme?: PnlShareTheme | string;
  themes?: PnlShareTheme[];
  /** A short quote printed under the brand. */
  message?: string;
  /** Logo or wordmark, top-left. */
  brand?: ReactNode;
  referral?: PnlShareReferral | null;
  /** QR code for the referral link — render your own (e.g. an SVG from your QR library). */
  qr?: ReactNode;
  /** Printed bottom-right when there is no referral. */
  timestamp?: number | Date;
  /** Printed bottom-left when there is no referral, e.g. `trade.example.com`. */
  domain?: ReactNode;
  /** Price increment for formatting prices. */
  tick?: number;
  /** Decimal places for quantity. */
  baseDp?: number;
  className?: string;
}

/** A 16:9 poster-style PnL card — brand, position, a big ROI / PnL, details and a referral strip. */
export function PnlShareCard({
  position,
  format,
  fields,
  theme,
  themes = PNL_SHARE_THEMES,
  message,
  brand,
  referral,
  qr,
  timestamp,
  domain,
  tick,
  baseDp,
  className,
}: PnlShareCardProps) {
  const t = resolveTheme(theme, themes);
  const dark = t.tone !== "light";
  const fmt = format ?? availableFormats(position)[0] ?? "roi_pnl";
  const shown = new Set(fields ?? availableFields(position));
  const { base, quote, type } = parseSymbol(position.symbol);
  const long = position.side === "long";
  const roi = position.roi;
  const pnl = position.pnl;
  const toneOf = (v: number | null | undefined) =>
    v == null || v === 0 ? "" : v > 0 ? (dark ? "text-emerald-300" : "text-emerald-700") : dark ? "text-rose-300" : "text-rose-600";

  const details: { label: string; value: string }[] = [];
  const price = (v: number) => formatPrice(v, tick);
  if (shown.has("openPrice") && position.openPrice != null) details.push({ label: FIELD_LABEL.openPrice, value: price(position.openPrice) });
  if (shown.has("closePrice") && position.closePrice != null) details.push({ label: FIELD_LABEL.closePrice, value: price(position.closePrice) });
  if (shown.has("markPrice") && position.markPrice != null) details.push({ label: FIELD_LABEL.markPrice, value: price(position.markPrice) });
  if (shown.has("openTime") && position.openTime != null) details.push({ label: FIELD_LABEL.openTime, value: shortTime(position.openTime) });
  if (shown.has("closeTime") && position.closeTime != null) details.push({ label: FIELD_LABEL.closeTime, value: shortTime(position.closeTime) });
  if (shown.has("quantity") && position.quantity != null)
    details.push({ label: FIELD_LABEL.quantity, value: formatNumber(position.quantity, "number", { dp: baseDp ?? 4, pad: false }) });

  const headline = fmt === "pnl" ? pnl : roi;
  const headlineText =
    headline == null ? "—" : fmt === "pnl" ? formatNumber(headline, "number", { dp: 2, sign: true }) : formatNumber(headline, "percent", { dp: 2, sign: true });

  return (
    <div
      data-slot="pnl-share-card"
      data-theme={t.id}
      className={cn(
        "@container relative isolate aspect-[552/310] w-full overflow-hidden rounded-2xl select-none",
        dark ? "text-white" : "text-zinc-900",
        className,
      )}
      style={{ background: t.background, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="absolute inset-0 flex flex-col px-[5.5cqw] pt-[5cqw] pb-[4.5cqw]">
        {/* brand + message */}
        <div className="flex min-h-[4.5cqw] items-center text-[2.9cqw] font-semibold tracking-[-0.01em]">{brand}</div>
        {message && <p className="mt-[1.5cqw] truncate text-[2.5cqw] opacity-90">“{message}”</p>}

        {/* position */}
        <div className={cn("flex items-center gap-[1.4cqw] text-[2.5cqw] font-medium", message ? "mt-[2.2cqw]" : "mt-[4cqw]")}>
          <span>
            {base}
            {type === "PERP" && <span className="opacity-60">-PERP</span>}
          </span>
          <span
            className={cn(
              "rounded-[0.8cqw] px-[1.2cqw] py-[0.3cqw] text-[2.1cqw] font-semibold",
              long ? (dark ? "bg-emerald-400/20 text-emerald-300" : "bg-emerald-600/15 text-emerald-700") : dark ? "bg-rose-400/20 text-rose-300" : "bg-rose-600/15 text-rose-600",
            )}
          >
            {long ? "Long" : "Short"}
          </span>
          {shown.has("leverage") && position.leverage != null && (
            <span className={cn("rounded-[0.8cqw] px-[1.2cqw] py-[0.3cqw] text-[2.1cqw] font-semibold", dark ? "bg-white/15" : "bg-black/8")}>{position.leverage}x</span>
          )}
          {position.marginMode && <span className="opacity-70">{position.marginMode === "cross" ? "Cross" : "Isolated"}</span>}
        </div>

        {/* headline */}
        <div className="mt-[0.8cqw] flex items-baseline gap-[1.8cqw]">
          <span className={cn("font-mono text-[9cqw] leading-none font-bold tracking-[-0.03em] tabular-nums", toneOf(headline))}>{headlineText}</span>
          {fmt === "roi_pnl" && pnl != null && (
            <span className={cn("font-mono text-[3.6cqw] font-semibold tabular-nums", toneOf(pnl))}>
              ({formatNumber(pnl, "number", { dp: 2, sign: true })} {quote || "USDC"})
            </span>
          )}
          {fmt === "pnl" && headline != null && <span className="text-[3.6cqw] font-semibold opacity-80">{quote || "USDC"}</span>}
        </div>

        {/* details */}
        {details.length > 0 && (
          <dl className="mt-[3cqw] grid w-[62%] grid-cols-2 gap-x-[4cqw] gap-y-[1.2cqw] text-[2.2cqw]">
            {details.map((d) => (
              <div key={d.label} className="flex items-baseline justify-between gap-[1.5cqw]">
                <dt className="opacity-60">{d.label}</dt>
                <dd className="font-mono tabular-nums">{d.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {/* footer */}
        <div className="mt-auto flex items-end justify-between gap-[3cqw] text-[2.2cqw]">
          {referral ? (
            <div className="flex items-end gap-[2cqw]">
              {qr && <div className="grid size-[10.2cqw] shrink-0 place-items-center overflow-hidden rounded-[1cqw] bg-white p-[0.4cqw] text-zinc-900">{qr}</div>}
              <div className="flex flex-col gap-[0.4cqw]">
                {referral.slogan && <span className={cn("text-[2.5cqw] font-medium", dark ? "text-emerald-300" : "text-emerald-700")}>{referral.slogan}</span>}
                <span className="opacity-60">Referral code</span>
                <span className="font-mono text-[2.9cqw] font-semibold tracking-wide">{referral.code}</span>
              </div>
            </div>
          ) : (
            <span className="opacity-70">{domain}</span>
          )}
          {timestamp != null && <span className="font-mono opacity-60 tabular-nums">{stamp(timestamp)}</span>}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ composer */

export interface PnlShareComposerProps extends Omit<PnlShareCardProps, "format" | "fields" | "theme" | "message" | "className"> {
  /** Controlled options. */
  options?: PnlShareOptions;
  defaultOptions?: Partial<PnlShareOptions>;
  onOptionsChange?: (options: PnlShareOptions) => void;
  /** Export the image yourself — e.g. html-to-image on the poster node. */
  onDownload?: (options: PnlShareOptions) => void;
  onCopy?: (options: PnlShareOptions) => void;
  onShare?: (options: PnlShareOptions) => void;
  className?: string;
}

/** The share editor: live poster, background picker, display format, optional fields, message and actions. */
export function PnlShareComposer({
  options: optionsProp,
  defaultOptions,
  onOptionsChange,
  onDownload,
  onCopy,
  onShare,
  className,
  ...card
}: PnlShareComposerProps) {
  const themes = card.themes ?? PNL_SHARE_THEMES;
  const formats = availableFormats(card.position);
  const fields = availableFields(card.position);
  const [inner, setInner] = useState<PnlShareOptions>(() => ({
    format: defaultOptions?.format ?? formats[0] ?? "roi_pnl",
    fields: defaultOptions?.fields ?? fields,
    themeId: defaultOptions?.themeId ?? themes[0]?.id ?? "",
    message: defaultOptions?.message ?? "",
  }));
  const options = optionsProp ?? inner;
  const update = (patch: Partial<PnlShareOptions>) => {
    const next = { ...options, ...patch };
    if (!optionsProp) setInner(next);
    onOptionsChange?.(next);
  };
  const [messageOn, setMessageOn] = useState(options.message.length > 0);
  const [draft, setDraft] = useState(options.message);
  const uid = useId();

  const toggleField = (f: PnlShareField, on: boolean) =>
    update({ fields: on ? PNL_SHARE_FIELDS.filter((x) => x === f || options.fields.includes(x)) : options.fields.filter((x) => x !== f) });

  const setMessage = (text: string, on = messageOn) => {
    setDraft(text);
    update({ message: on ? text : "" });
  };

  return (
    <div data-slot="pnl-share-composer" className={cn("flex w-full flex-col gap-5", className)}>
      <div className="flex flex-col gap-3">
        <PnlShareCard {...card} themes={themes} format={options.format} fields={options.fields} theme={options.themeId} message={options.message} />
        {themes.length > 1 && (
          <fieldset className="flex items-center gap-2">
            <legend className="sr-only">Background</legend>
            {themes.map((t) => {
              const active = t.id === options.themeId;
              return (
                <button
                  key={t.id}
                  type="button"
                  aria-label={t.label}
                  aria-pressed={active}
                  title={t.label}
                  onClick={() => update({ themeId: t.id })}
                  className={cn(
                    "focus-ring relative grid aspect-[552/310] w-16 place-items-center overflow-hidden rounded-lg ring-offset-2 ring-offset-background transition-shadow sm:w-20",
                    active ? "ring-2 ring-primary" : "ring-1 ring-outline-variant hover:ring-foreground/30",
                  )}
                  style={{ background: t.background, backgroundSize: "cover" }}
                >
                  {active && <CheckIcon className={cn("size-4", t.tone === "light" ? "text-zinc-900" : "text-white")} />}
                </button>
              );
            })}
          </fieldset>
        )}
      </div>

      {formats.length > 1 && (
        <fieldset className="flex flex-col gap-2.5">
          <legend className="sr-only">Display format</legend>
          <span aria-hidden="true" className="text-xs font-medium text-muted-foreground">
            Display format
          </span>
          <RadioGroup value={options.format} onValueChange={(v) => update({ format: v as PnlShareFormat })} className="flex flex-wrap gap-x-5 gap-y-2">
            {formats.map((f) => (
              <div key={f} className="flex items-center gap-2">
                <RadioGroupItem id={`${uid}-fmt-${f}`} value={f} />
                <Label htmlFor={`${uid}-fmt-${f}`} className="text-xs">
                  {FORMAT_LABEL[f]}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </fieldset>
      )}

      {fields.length > 0 && (
        <fieldset className="flex flex-col border-t border-outline-variant pt-4">
          <legend className="sr-only">Optional information</legend>
          <span aria-hidden="true" className="mb-2.5 text-xs font-medium text-muted-foreground">
            Optional information
          </span>
          <div className="flex flex-wrap gap-x-5 gap-y-2.5">
            {fields.map((f) => (
              <div key={f} className="flex items-center gap-2">
                <Checkbox id={`${uid}-f-${f}`} checked={options.fields.includes(f)} onCheckedChange={(on) => toggleField(f, on)} />
                <Label htmlFor={`${uid}-f-${f}`} className="text-xs">
                  {FIELD_LABEL[f]}
                </Label>
              </div>
            ))}
          </div>
        </fieldset>
      )}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="flex shrink-0 items-center gap-2">
          <Checkbox
            id={`${uid}-msg-on`}
            checked={messageOn}
            onCheckedChange={(on) => {
              setMessageOn(on);
              setMessage(draft, on);
            }}
          />
          <Label htmlFor={`${uid}-msg-on`} className="text-xs">
            Add a message
          </Label>
        </div>
        <label htmlFor={`${uid}-msg`} className="sr-only">
          Message
        </label>
        <Input
          id={`${uid}-msg`}
          value={draft}
          maxLength={MESSAGE_MAX_LENGTH}
          placeholder="Max 25 characters"
          className="h-8 text-xs sm:max-w-80"
          onChange={(e) => {
            const text = e.target.value.slice(0, MESSAGE_MAX_LENGTH);
            setMessageOn(text.length > 0);
            setMessage(text, text.length > 0);
          }}
        />
      </div>

      {(onDownload || onCopy || onShare) && (
        <div className="flex gap-2">
          {onDownload && (
            <Button variant="tonal" className="flex-1" onClick={() => onDownload(options)}>
              <DownloadIcon /> Download
            </Button>
          )}
          {onCopy && (
            <Button variant={onShare ? "tonal" : "default"} className="flex-1" onClick={() => onCopy(options)}>
              <CopyIcon /> Copy
            </Button>
          )}
          {onShare && (
            <Button className="flex-1" onClick={() => onShare(options)}>
              <Share2Icon /> Share
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------ dialog */

export interface PnlShareDialogProps extends PnlShareComposerProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Element that opens the dialog, e.g. `<Button />`. */
  trigger?: ReactElement;
  title?: ReactNode;
  description?: ReactNode;
}

/** `PnlShareComposer` in a dialog. */
export function PnlShareDialog({ open, defaultOpen, onOpenChange, trigger, title = "Share PnL", description, ...composer }: PnlShareDialogProps) {
  return (
    <Dialog open={open} defaultOpen={defaultOpen} onOpenChange={(o) => onOpenChange?.(o)}>
      {trigger && <DialogTrigger render={trigger} />}
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto p-4 sm:max-w-2xl sm:p-6">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <PnlShareComposer {...composer} />
      </DialogContent>
    </Dialog>
  );
}
