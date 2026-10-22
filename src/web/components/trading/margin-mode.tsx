import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, InfoIcon, SearchIcon, XIcon } from "lucide-react";
import { useId, useMemo, useState, type ReactElement, type ReactNode } from "react";

import { SymbolBadge, SymbolDisplay } from "@/components/trading/token-icon";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type MarginMode = "cross" | "isolated";

export const MARGIN_MODES: MarginMode[] = ["cross", "isolated"];

export const MARGIN_MODE_LABEL: Record<MarginMode, string> = { cross: "Cross", isolated: "Isolated" };

export const MARGIN_MODE_DESCRIPTION: Record<MarginMode, string> = {
  cross: "Margin and PnL are shared across positions. You may lose all positions if liquidation occurs.",
  isolated: "Margin and PnL are independent for each position. Only the current position is at risk if it is liquidated.",
};

function useControllable<T>(value: T | undefined, defaultValue: T, onChange?: (value: T) => void) {
  const [inner, setInner] = useState(defaultValue);
  const current = value !== undefined ? value : inner;
  const set = (next: T) => {
    if (value === undefined) setInner(next);
    onChange?.(next);
  };
  return [current, set] as const;
}

/* ------------------------------------------------------------ segmented toggle */

export interface MarginModeToggleProps {
  value?: MarginMode;
  defaultValue?: MarginMode;
  onValueChange?: (mode: MarginMode) => void;
  /** Show the description of the selected mode under the control. */
  showDescription?: boolean;
  /** Modes that cannot be selected, e.g. cross on a community-listed market. */
  disabledModes?: MarginMode[];
  disabled?: boolean;
  size?: "sm" | "default";
  className?: string;
}

/** An inline Cross / Isolated segmented control. */
export function MarginModeToggle({
  value,
  defaultValue = "cross",
  onValueChange,
  showDescription,
  disabledModes = [],
  disabled,
  size = "default",
  className,
}: MarginModeToggleProps) {
  const [mode, setMode] = useControllable(value, defaultValue, onValueChange);
  const descId = useId();
  return (
    <div data-slot="margin-mode-toggle" className={cn("flex flex-col gap-2", className)}>
      <fieldset aria-describedby={showDescription ? descId : undefined} className="grid min-w-0 grid-cols-2 gap-1 rounded-xl bg-container p-1">
        <legend className="sr-only">Margin mode</legend>
        {MARGIN_MODES.map((m) => (
          <button
            key={m}
            type="button"
            aria-pressed={mode === m}
            disabled={disabled || disabledModes.includes(m)}
            onClick={() => setMode(m)}
            className={cn(
              "focus-ring rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40",
              size === "sm" ? "h-7 text-xs" : "h-8 text-[13px]",
              mode === m
                ? "bg-background text-foreground shadow-[0_1px_2px_rgb(0_0_0/0.08),0_0_0_1px_var(--outline-variant)] dark:bg-container-highest"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {MARGIN_MODE_LABEL[m]}
          </button>
        ))}
      </fieldset>
      {showDescription && (
        <p id={descId} className="text-[11px] leading-relaxed text-muted-foreground">
          {MARGIN_MODE_DESCRIPTION[mode]}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------ option cards */

export interface MarginModeOptionsProps {
  value: MarginMode;
  onValueChange: (mode: MarginMode) => void;
  /** The mode the account currently uses — tagged "Current". */
  currentMode?: MarginMode;
  disabledModes?: MarginMode[];
  /** Override the explainer under each title. */
  descriptions?: Partial<Record<MarginMode, ReactNode>>;
  className?: string;
}

/** Two selectable cards with the title and explainer of each margin mode. */
export function MarginModeOptions({ value, onValueChange, currentMode, disabledModes = [], descriptions, className }: MarginModeOptionsProps) {
  return (
    <fieldset data-slot="margin-mode-options" className={cn("flex min-w-0 flex-col gap-2", className)}>
      <legend className="sr-only">Margin mode</legend>
      {MARGIN_MODES.map((m) => {
        const selected = value === m;
        const disabled = disabledModes.includes(m);
        return (
          <button
            key={m}
            type="button"
            aria-pressed={selected}
            disabled={disabled}
            onClick={() => onValueChange(m)}
            className={cn(
              "focus-ring relative flex w-full flex-col items-start gap-1.5 rounded-xl border bg-container p-3 text-left transition-colors",
              "disabled:cursor-not-allowed disabled:opacity-50",
              selected ? "border-primary" : "border-transparent hover:border-border",
            )}
          >
            <span className="text-sm font-semibold">{MARGIN_MODE_LABEL[m]} margin</span>
            <span className="text-[11px] leading-relaxed text-muted-foreground">{descriptions?.[m] ?? MARGIN_MODE_DESCRIPTION[m]}</span>
            {currentMode === m && (
              <span className="absolute -top-px -right-px rounded-tr-xl rounded-bl-lg bg-primary px-1.5 py-0.5 text-[10px] leading-none font-semibold text-primary-foreground">
                Current
              </span>
            )}
          </button>
        );
      })}
    </fieldset>
  );
}

/* ------------------------------------------------------------ per-symbol settings */

export type MarginModeSettingsItem = {
  /** `PERP_BTC_USDC`, `BTC-PERP`… */
  symbol: string;
  mode: MarginMode;
  /** Locked rows can't be selected — explain why in `disabledReason`. */
  disabled?: boolean;
  disabledReason?: ReactNode;
};

export interface MarginModeSettingsProps {
  items: MarginModeSettingsItem[];
  /** Called with the selected symbols and the mode to set them to. */
  onApply?: (symbols: string[], mode: MarginMode) => void;
  /** Disables the actions while the host applies the change. */
  applying?: boolean;
  /** Height of the scrolling list. */
  listClassName?: string;
  className?: string;
}

/** Search, select and bulk-set the margin mode for many symbols. */
export function MarginModeSettings({ items, onApply, applying, listClassName, className }: MarginModeSettingsProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const searchId = useId();
  const allId = useId();

  const filtered = useMemo(() => {
    const q = query.trim().toUpperCase();
    return q ? items.filter((i) => i.symbol.toUpperCase().includes(q)) : items;
  }, [items, query]);
  const selectable = filtered.filter((i) => !i.disabled);
  const allChecked = selectable.length > 0 && selectable.every((i) => selected.has(i.symbol));
  const someChecked = selectable.some((i) => selected.has(i.symbol));

  const toggle = (symbol: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(symbol)) next.delete(symbol);
      else next.add(symbol);
      return next;
    });
  const toggleAll = () =>
    setSelected((prev) => {
      const next = new Set(prev);
      for (const i of selectable) {
        if (allChecked) next.delete(i.symbol);
        else next.add(i.symbol);
      }
      return next;
    });

  const count = selected.size;
  const apply = (mode: MarginMode) => onApply?.([...selected], mode);

  return (
    <div data-slot="margin-mode-settings" className={cn("flex min-h-0 flex-col gap-3", className)}>
      <div className="flex h-9 items-center gap-2 rounded-lg bg-container px-3 focus-within:ring-1 focus-within:ring-primary">
        <SearchIcon aria-hidden className="size-3.5 shrink-0 text-muted-foreground" />
        <label htmlFor={searchId} className="sr-only">
          Search symbols
        </label>
        <input
          id={searchId}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
          autoComplete="off"
          className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        {query && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => setQuery("")}
            className="focus-ring grid size-5 place-items-center rounded-full text-muted-foreground hover:text-foreground"
          >
            <XIcon className="size-3" />
          </button>
        )}
      </div>

      <ScrollArea className={cn("h-64 rounded-xl bg-container", listClassName)}>
        <ul className="flex flex-col p-1">
          {filtered.map((item) => (
            <SettingsRow key={item.symbol} item={item} checked={selected.has(item.symbol)} onToggle={() => toggle(item.symbol)} />
          ))}
          {filtered.length === 0 && <li className="px-3 py-6 text-center text-xs text-muted-foreground">No symbols match “{query}”.</li>}
        </ul>
      </ScrollArea>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Checkbox id={allId} checked={allChecked} indeterminate={!allChecked && someChecked} onCheckedChange={toggleAll} disabled={selectable.length === 0} />
          <label htmlFor={allId} className="text-xs font-medium select-none">
            Select all
          </label>
        </div>
        <span className="text-xs text-muted-foreground">
          Selected: <span className={cn("font-mono font-semibold tabular-nums", count > 0 ? "text-primary" : "text-muted-foreground")}>{count}</span>
        </span>
      </div>

      <div className="flex items-center justify-end gap-2">
        <span className="mr-auto text-xs text-muted-foreground sm:mr-0">Set as</span>
        {MARGIN_MODES.map((m) => (
          <Button key={m} size="sm" variant="tonal" disabled={count === 0 || applying} onClick={() => apply(m)}>
            {MARGIN_MODE_LABEL[m]}
          </Button>
        ))}
      </div>
    </div>
  );
}

function SettingsRow({ item, checked, onToggle }: { item: MarginModeSettingsItem; checked: boolean; onToggle: () => void }) {
  const id = useId();
  return (
    <li className={cn("flex items-center gap-2.5 rounded-lg px-2.5 py-2 hover:bg-container-high", item.disabled && "opacity-60")}>
      <Checkbox id={id} checked={checked} disabled={item.disabled} onCheckedChange={onToggle} />
      <label htmlFor={id} className={cn("flex min-w-0 flex-1 items-center gap-2 select-none", item.disabled ? "cursor-not-allowed" : "cursor-pointer")}>
        <SymbolDisplay symbol={item.symbol} className="text-sm" />
      </label>
      <SymbolBadge>{MARGIN_MODE_LABEL[item.mode]}</SymbolBadge>
      {item.disabled && item.disabledReason && (
        <Tooltip>
          <TooltipTrigger
            render={<button type="button" aria-label="Why is this locked?" />}
            className="focus-ring grid size-5 place-items-center rounded-full text-muted-foreground hover:text-foreground"
          >
            <InfoIcon className="size-3.5" />
          </TooltipTrigger>
          <TooltipContent className="max-w-64">{item.disabledReason}</TooltipContent>
        </Tooltip>
      )}
    </li>
  );
}

/* ------------------------------------------------------------ dialog */

export interface MarginModeDialogProps {
  /** Symbol the switch applies to. */
  symbol: string;
  /** The mode in effect — preselected and tagged "Current". */
  value: MarginMode;
  /** Called with the chosen mode on confirm. Uncontrolled dialogs then close; with `open` controlled, close it yourself once saved. */
  onValueChange?: (mode: MarginMode) => void;
  disabledModes?: MarginMode[];
  /** Per-symbol list for the "Margin mode settings" view. Omit to hide the link. */
  settings?: MarginModeSettingsItem[];
  onApplySettings?: (symbols: string[], mode: MarginMode) => void;
  applying?: boolean;
  /** Custom trigger element. Defaults to a small "Cross ▾" button. */
  trigger?: ReactElement;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
}

/** A dialog to switch one symbol between cross and isolated — with an optional bulk settings view. */
export function MarginModeDialog({ trigger, open, defaultOpen = false, onOpenChange, disabled, ...props }: MarginModeDialogProps) {
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  return (
    <Dialog open={isOpen} onOpenChange={(o) => setOpen(o)}>
      <DialogTrigger
        disabled={disabled}
        render={
          trigger ?? (
            <Button variant="tonal" size="xs">
              {MARGIN_MODE_LABEL[props.value]}
              <ChevronDownIcon />
            </Button>
          )
        }
      />
      <DialogContent className="gap-4 sm:max-w-md">
        <MarginModeDialogBody
          {...props}
          onClose={() => setOpen(false)}
          onConfirmed={() => {
            // Controlled dialogs stay open so the host can close them once the switch is saved.
            if (open === undefined) setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

function MarginModeDialogBody({
  symbol,
  value,
  onValueChange,
  disabledModes,
  settings,
  onApplySettings,
  applying,
  onClose,
  onConfirmed,
}: Omit<MarginModeDialogProps, "trigger" | "open" | "defaultOpen" | "onOpenChange" | "disabled"> & { onClose: () => void; onConfirmed: () => void }) {
  const [draft, setDraft] = useState(value);
  const [view, setView] = useState<"switch" | "settings">("switch");

  if (view === "settings" && settings) {
    return (
      <>
        <DialogHeader>
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Back"
              onClick={() => setView("switch")}
              className="focus-ring -ml-1.5 grid size-7 place-items-center rounded-full text-muted-foreground hover:bg-container-high hover:text-foreground"
            >
              <ChevronLeftIcon className="size-4" />
            </button>
            <DialogTitle className="text-base font-semibold">Margin mode settings</DialogTitle>
          </div>
          <DialogDescription className="text-xs">Select perpetual markets and set their margin mode in one go.</DialogDescription>
        </DialogHeader>
        <MarginModeSettings items={settings} onApply={onApplySettings} applying={applying} />
      </>
    );
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-base font-semibold">Margin mode</DialogTitle>
        <DialogDescription className="sr-only">Choose cross or isolated margin for this symbol.</DialogDescription>
      </DialogHeader>
      <SymbolDisplay symbol={symbol} size="sm" className="text-sm" />
      <MarginModeOptions value={draft} onValueChange={setDraft} currentMode={value} disabledModes={disabledModes} />
      {settings && (
        <button
          type="button"
          onClick={() => setView("settings")}
          className="focus-ring mx-auto flex items-center gap-0.5 rounded-md px-1 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          Margin mode settings
          <ChevronRightIcon className="size-3.5" />
        </button>
      )}
      <DialogFooter className="grid grid-cols-2 gap-2 sm:grid">
        <Button variant="tonal" onClick={onClose}>
          Cancel
        </Button>
        <Button
          disabled={draft === value}
          onClick={() => {
            onValueChange?.(draft);
            onConfirmed();
          }}
        >
          Confirm
        </Button>
      </DialogFooter>
    </>
  );
}
