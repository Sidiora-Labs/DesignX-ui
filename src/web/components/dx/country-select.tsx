import * as React from "react";
import { CheckIcon, ChevronDownIcon, SearchIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

/**
 * CountrySelecta flag pill that opens a searchable region dialog. Flags
 * and names come from flagcdn.com (CORS-friendly), fetched once and cached
 * for the session. Defaults to the visitor's region from navigator.language.
 */

type Country = { code: string; name: string; flag: string };

const flagUrl = (code: string) => `https://flagcdn.com/${code.toLowerCase()}.svg`;

let cache: Promise<Country[]> | null = null;

function fetchCountries(): Promise<Country[]> {
  if (!cache) {
    cache = fetch("https://flagcdn.com/en/codes.json")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load countries");
        return r.json() as Promise<Record<string, string>>;
      })
      .then((data) =>
        Object.entries(data)
          .filter(([code]) => code.length === 2)
          .map(([code, name]) => ({ code: code.toUpperCase(), name, flag: flagUrl(code) }))
          .sort((a, b) => a.name.localeCompare(b.name)),
      )
      .catch((e: unknown) => {
        cache = null;
        throw e;
      });
  }
  return cache;
}

/** Loads the country list. Shared across every CountrySelect on the page. */
function useCountries() {
  const [state, setState] = React.useState<{ data: Country[]; loading: boolean; error: string | null }>({
    data: [],
    loading: true,
    error: null,
  });
  React.useEffect(() => {
    let live = true;
    fetchCountries().then(
      (data) => live && setState({ data, loading: false, error: null }),
      (e: unknown) => live && setState({ data: [], loading: false, error: e instanceof Error ? e.message : "Failed to load countries" }),
    );
    return () => {
      live = false;
    };
  }, []);
  return state;
}

function userRegion(): string | undefined {
  if (typeof navigator === "undefined") return undefined;
  const locale = navigator.language || navigator.languages?.[0] || "";
  return locale.split(/[-_]/)[1]?.toUpperCase();
}

function Flag({ src, className }: { src: string; className?: string }) {
  return (
    <span className={cn("inline-block shrink-0 overflow-hidden rounded-full bg-container-high ring-1 ring-outline-variant ring-inset", className)}>
      <img src={src} alt="" loading="lazy" className="size-full object-cover" />
    </span>
  );
}

type CountrySelectProps = {
  /** ISO 3166-1 alpha-2 code, e.g. "US". */
  value?: string;
  defaultValue?: string;
  onValueChange?: (code: string, country: Country) => void;
  /** Use the visitor's locale region when uncontrolled and no default is given. */
  detectRegion?: boolean;
  title?: string;
  placeholder?: string;
  /** Show the selected country's name next to the flag. */
  showName?: boolean;
  className?: string;
  disabled?: boolean;
};

function CountrySelect({
  value: valueProp,
  defaultValue,
  onValueChange,
  detectRegion = true,
  title = "Select your region",
  placeholder = "Search by country or region",
  showName = false,
  className,
  disabled,
}: CountrySelectProps) {
  const { data, loading, error } = useCountries();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [inner, setInner] = React.useState<string | undefined>(defaultValue ?? (detectRegion ? userRegion() : undefined));
  const value = valueProp ?? inner ?? "US";
  const selected = data.find((c) => c.code === value);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter((c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase() === q);
  }, [data, query]);

  const pick = (c: Country) => {
    setInner(c.code);
    onValueChange?.(c.code, c);
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        data-slot="country-select"
        disabled={disabled}
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label={`Region: ${selected?.name ?? value}`}
        className={cn(
          "state-layer focus-ring inline-flex h-9 items-center gap-1 rounded-full bg-container-high p-1.5 pr-2 text-sm font-medium transition-colors hover:bg-container-higher disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
      >
        <Flag src={flagUrl(value)} className="size-6" />
        {showName && <span className="max-w-40 truncate pl-1">{selected?.name ?? value}</span>}
        <ChevronDownIcon className="size-4 text-muted-foreground" />
      </button>

      <Dialog
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (!o) setQuery("");
        }}
      >
        <DialogContent className="flex h-[min(640px,85svh)] flex-col gap-0 overflow-hidden p-0 sm:max-w-md">
          <DialogHeader className="gap-3 p-5 pb-3">
            <DialogTitle className="text-base">{title}</DialogTitle>
            <DialogDescription className="sr-only">Search and choose a country or region.</DialogDescription>
            <label className="flex h-11 items-center gap-2 rounded-xl bg-container-high px-3 ring-1 ring-outline-variant transition-shadow ring-inset focus-within:ring-foreground/40">
              <SearchIcon className="size-4.5 shrink-0 text-muted-foreground" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                aria-label={placeholder}
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </label>
          </DialogHeader>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 pb-2">
            {loading ? (
              <ul aria-hidden className="flex flex-col">
                {Array.from({ length: 8 }, (_, i) => (
                  <li key={i} className="flex h-14 items-center gap-3 px-3">
                    <span className="size-8 animate-pulse rounded-full bg-container-high" />
                    <span className="h-3 w-32 animate-pulse rounded-full bg-container-high" />
                  </li>
                ))}
              </ul>
            ) : error ? (
              <p className="p-8 text-center text-sm text-destructive">{error}</p>
            ) : filtered.length === 0 ? (
              <p className="p-8 text-center text-sm text-muted-foreground">No countries found</p>
            ) : (
              <ul aria-label="Countries" className="flex flex-col">
                {filtered.map((c) => {
                  const active = c.code === value;
                  return (
                    <li key={c.code}>
                      <button
                        type="button"
                        aria-current={active || undefined}
                        onClick={() => pick(c)}
                        className={cn(
                          "state-layer focus-ring flex h-14 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-medium tracking-tight transition-colors",
                          active && "bg-container",
                        )}
                      >
                        <Flag src={c.flag} className="size-8" />
                        <span className="flex-1 truncate">{c.name}</span>
                        {active && <CheckIcon className="size-4.5" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export { CountrySelect, useCountries };
export type { Country, CountrySelectProps };
