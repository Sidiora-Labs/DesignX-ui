import { ChevronDownIcon, XIcon } from "lucide-react";
import { useCallback, useState, useSyncExternalStore, type ReactNode } from "react";

import { MarketsList, type Market, type MarketsListProps } from "@/components/trading/markets-list";
import { SymbolBadge, SymbolDisplay } from "@/components/trading/token-icon";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const MOBILE_QUERY = "(max-width: 767px)";

function useIsNarrow() {
  return useSyncExternalStore(
    (cb) => {
      const mql = window.matchMedia(MOBILE_QUERY);
      mql.addEventListener("change", cb);
      return () => mql.removeEventListener("change", cb);
    },
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false,
  );
}

export interface MarketSelectorProps extends Omit<MarketsListProps, "activeSymbol" | "className" | "bodyClassName"> {
  /** The market currently traded — shown on the trigger and highlighted in the list. */
  symbol: string;
  iconSrc?: string;
  /** Badge on the trigger, e.g. max leverage. */
  badge?: ReactNode;
  /** Replace the trigger's content. */
  trigger?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** `auto` uses a popover on desktop and a side sheet under 768px. */
  mode?: "auto" | "popover" | "sheet";
  /** Close after a market is picked. */
  closeOnSelect?: boolean;
  /** Heading of the mobile sheet. */
  title?: ReactNode;
  className?: string;
  contentClassName?: string;
}

/** A symbol trigger that opens a searchable markets list — a popover on desktop, a sheet on mobile. */
export function MarketSelector({
  symbol,
  iconSrc,
  badge,
  trigger,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  mode = "auto",
  closeOnSelect = true,
  title = "Markets",
  className,
  contentClassName,
  onSymbolSelect,
  ...listProps
}: MarketSelectorProps) {
  const [inner, setInner] = useState(defaultOpen);
  const open = openProp ?? inner;
  const setOpen = useCallback(
    (next: boolean) => {
      if (openProp === undefined) setInner(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange],
  );
  const narrow = useIsNarrow();
  const sheet = mode === "sheet" || (mode === "auto" && narrow);

  const select = (market: Market) => {
    onSymbolSelect?.(market);
    if (closeOnSelect) setOpen(false);
  };

  const triggerClass = cn(
    "focus-ring group inline-flex h-9 items-center gap-1.5 rounded-lg px-2 text-sm font-semibold transition-colors hover:bg-container-high data-popup-open:bg-container-high",
    className,
  );
  const triggerContent = trigger ?? (
    <>
      <SymbolDisplay symbol={symbol} iconSrc={iconSrc} size="sm" />
      {badge != null && <SymbolBadge className="bg-primary/12 text-primary">{badge}</SymbolBadge>}
      <ChevronDownIcon className="size-3.5 text-muted-foreground transition-transform duration-200 group-data-popup-open:rotate-180" />
      <span className="sr-only">, change market</span>
    </>
  );

  const list = (extra: Partial<MarketsListProps>) => (
    <MarketsList
      autoFocusSearch={!sheet}
      {...listProps}
      {...extra}
      activeSymbol={symbol}
      onSymbolSelect={select}
    />
  );

  if (sheet) {
    return (
      <Sheet open={open} onOpenChange={(o) => setOpen(o)}>
        <SheetTrigger className={triggerClass}>{triggerContent}</SheetTrigger>
        <SheetContent side="left" showCloseButton={false} className={cn("gap-0 overflow-hidden p-0", contentClassName)}>
          <div className="flex items-center justify-between px-4 pt-4">
            <SheetTitle className="text-base font-semibold">{title}</SheetTitle>
            <button
              type="button"
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="focus-ring grid size-8 place-items-center rounded-full text-muted-foreground hover:bg-container-high hover:text-foreground"
            >
              <XIcon className="size-4" />
            </button>
          </div>
          <SheetDescription className="sr-only">Search and pick a market to trade.</SheetDescription>
          {list({ className: "min-h-0 flex-1 bg-popover pb-[env(safe-area-inset-bottom)]" })}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Popover open={open} onOpenChange={(o) => setOpen(o)}>
      <PopoverTrigger className={triggerClass}>{triggerContent}</PopoverTrigger>
      <PopoverContent
        align="start"
        aria-label={typeof title === "string" ? title : "Markets"}
        className={cn("flex h-[min(480px,70vh)] w-[min(440px,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl p-0", contentClassName)}
      >
        {list({ className: "min-h-0 flex-1 bg-popover" })}
      </PopoverContent>
    </Popover>
  );
}
