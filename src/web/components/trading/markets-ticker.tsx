import { ListFilterIcon } from "lucide-react";
import { useAnimate, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";

import { Numeral } from "@/components/trading/numeral";
import { TokenIcon } from "@/components/trading/token-icon";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { parseSymbol } from "@/lib/trading";
import { cn } from "@/lib/utils";

export type TickerMarket = {
  symbol: string;
  iconSrc?: string;
  price: number | null;
  /** 24h change as a fraction. */
  change?: number | null;
  tick?: number;
  /** Tags matched by `types` filters, e.g. `crypto`, `rwa`, `new`. */
  tags?: readonly string[];
};

export type TickerType = {
  value: string;
  label: ReactNode;
  /** Which markets the type shows. Omit to show all. */
  filter?: (market: TickerMarket) => boolean;
};

export const DEFAULT_TICKER_TYPES: TickerType[] = [
  { value: "all", label: "All markets" },
  { value: "crypto", label: "Crypto", filter: (m) => m.tags?.includes("crypto") ?? false },
  { value: "new", label: "New listings", filter: (m) => m.tags?.includes("new") ?? false },
  { value: "rwa", label: "TradFi", filter: (m) => m.tags?.includes("rwa") ?? false },
];

export interface MarketChipProps {
  market: TickerMarket;
  active?: boolean;
  onClick?: (symbol: string) => void;
  /** Removed from the tab order — used for the duplicated marquee track. */
  inert?: boolean;
}

/** One market in the ticker: icon, ticker, last price and 24h change. */
export function MarketChip({ market, active, onClick, inert }: MarketChipProps) {
  const { base } = parseSymbol(market.symbol);
  return (
    <button
      type="button"
      tabIndex={inert ? -1 : undefined}
      aria-current={active ? "true" : undefined}
      onClick={() => onClick?.(market.symbol)}
      className={cn(
        "focus-ring flex h-7 shrink-0 items-center gap-1.5 rounded-md px-2 text-xs transition-colors hover:bg-container-high",
        active && "bg-container-high",
      )}
    >
      <TokenIcon symbol={base} src={market.iconSrc} size="2xs" />
      <span className="font-medium">{base}</span>
      <Numeral value={market.price} tick={market.tick} className="text-foreground/80" />
      <Numeral value={market.change} rule="percent" showSign coloring />
    </button>
  );
}

export interface MarketsTickerProps {
  markets: readonly TickerMarket[];
  /** Highlighted chip. */
  activeSymbol?: string;
  onSymbolClick?: (symbol: string) => void;
  /** Filter options. Pass `false` to hide the filter button. */
  types?: TickerType[] | false;
  type?: string;
  defaultType?: string;
  onTypeChange?: (type: string) => void;
  /** Scroll continuously, pausing on hover and focus. Off under reduced motion. */
  autoScroll?: boolean;
  /** Pixels per second when auto scrolling. */
  speed?: number;
  /** Where the filter popover opens. */
  filterSide?: "top" | "bottom";
  className?: string;
}

/** A horizontal strip of market chips with price and change, filtered by market type. */
export function MarketsTicker({
  markets,
  activeSymbol,
  onSymbolClick,
  types = DEFAULT_TICKER_TYPES,
  type: typeProp,
  defaultType,
  onTypeChange,
  autoScroll = true,
  speed = 40,
  filterSide = "bottom",
  className,
}: MarketsTickerProps) {
  const typeList = types || [];
  const [innerType, setInnerType] = useState(defaultType ?? typeList[0]?.value ?? "");
  const type = typeProp ?? innerType;
  const setType = (next: string) => {
    if (typeProp === undefined) setInnerType(next);
    onTypeChange?.(next);
  };
  const [filterOpen, setFilterOpen] = useState(false);
  const idBase = useId();

  const filter = typeList.find((t) => t.value === type)?.filter;
  const visible = filter ? markets.filter(filter) : markets;

  const reduce = useReducedMotion();
  const scrolling = autoScroll && !reduce && visible.length > 0;
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const controls = useRef<ReturnType<typeof animate> | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const trackKey = visible.map((m) => m.symbol).join(",");

  useEffect(() => {
    if (!scrolling || !trackKey || !scope.current || !trackRef.current) return;
    const width = trackRef.current.offsetWidth;
    if (!width) return;
    const c = animate(scope.current, { x: [0, -width] }, { duration: width / speed, ease: "linear", repeat: Infinity });
    controls.current = c;
    return () => {
      c.stop();
      controls.current = null;
    };
  }, [scrolling, speed, trackKey, animate, scope]);

  const pause = useCallback(() => controls.current?.pause(), []);
  const play = useCallback(() => controls.current?.play(), []);

  const chips = (dup: boolean) =>
    visible.map((m) => (
      <div key={m.symbol} className="flex shrink-0 items-center gap-1 pr-1">
        <MarketChip market={m} active={m.symbol === activeSymbol} onClick={onSymbolClick} inert={dup} />
        <span aria-hidden="true" className="h-3.5 w-px bg-border" />
      </div>
    ));

  return (
    <div data-slot="markets-ticker" className={cn("flex h-10 w-full items-center gap-2 rounded-xl bg-container px-2", className)}>
      {typeList.length > 0 && (
        <Popover open={filterOpen} onOpenChange={setFilterOpen}>
          <PopoverTrigger
            aria-label="Filter markets"
            className={cn(
              "focus-ring grid size-7 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-container-high hover:text-foreground data-popup-open:bg-container-high data-popup-open:text-foreground",
              filter && "text-primary",
            )}
          >
            <ListFilterIcon className="size-4" />
          </PopoverTrigger>
          <PopoverContent side={filterSide} align="start" className="w-56 p-3">
            <RadioGroup
              aria-label="Market type"
              value={type}
              onValueChange={(v) => {
                setType(String(v));
                setFilterOpen(false);
              }}
              className="gap-2.5"
            >
              {typeList.map((t) => {
                const id = `${idBase}-${t.value}`;
                return (
                  <div key={t.value} className="flex items-center gap-2">
                    <RadioGroupItem id={id} value={t.value} />
                    <label htmlFor={id} className="cursor-pointer text-[13px]">
                      {t.label}
                    </label>
                  </div>
                );
              })}
            </RadioGroup>
          </PopoverContent>
        </Popover>
      )}
      {typeList.length > 0 && <span aria-hidden="true" className="h-4 w-px shrink-0 bg-border" />}

      {/* oxlint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- pause-on-hover only; chips are buttons */}
      <section
        aria-label="Markets ticker"
        onMouseEnter={pause}
        onMouseLeave={play}
        onFocus={pause}
        onBlur={play}
        className={cn(
          "relative min-w-0 flex-1",
          scrolling
            ? "overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_24px,black_calc(100%-24px),transparent)]"
            : "overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        )}
      >
        {visible.length === 0 ? (
          <p className="px-2 text-xs text-muted-foreground">No markets.</p>
        ) : (
          <div ref={scope} className="flex w-max items-center will-change-transform">
            <div ref={trackRef} className="flex shrink-0 items-center gap-1 pr-1">
              {chips(false)}
            </div>
            {scrolling && (
              <div aria-hidden="true" inert className="flex shrink-0 items-center gap-1 pr-1">
                {chips(true)}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
