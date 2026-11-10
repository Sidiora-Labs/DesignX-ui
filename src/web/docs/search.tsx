import * as React from "react";
import { useLocation } from "wouter";
import {
  BookOpenIcon,
  BotIcon,
  BoxIcon,
  CandlestickChartIcon,
  ChartColumnIcon,
  WandSparklesIcon,
  TypeIcon,
  LayersIcon,
  ZapIcon,
  ShapesIcon,
  LayoutTemplateIcon,
  MoonIcon,
  PaletteIcon,
  SparklesIcon,
  SunIcon,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useTheme } from "@/components/theme-provider";
import { blocks, catalog, type CatalogGroup, groupLabels, guides } from "./catalog";

const GROUP_ICONS: Record<CatalogGroup, React.ComponentType> = {
  ui: BoxIcon,
  dx: SparklesIcon,
  agents: BotIcon,
  charts: ChartColumnIcon,
  trading: CandlestickChartIcon,
  motion: WandSparklesIcon,
  text: TypeIcon,
  transitions: LayersIcon,
  effects: ZapIcon,
  elements: ShapesIcon,
};

const SearchContext = React.createContext<{ open: () => void }>({ open: () => {} });
export const useSearch = () => React.useContext(SearchContext);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [, navigate] = useLocation();
  const { setTheme, setAccent } = useTheme();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !isTyping(e))) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const go = (fn: () => void) => {
    setOpen(false);
    fn();
  };

  return (
    <SearchContext.Provider value={{ open: () => setOpen(true) }}>
      {children}
      <CommandDialog open={open} onOpenChange={setOpen} title="Search documentation">
        <CommandInput placeholder="Search components, guides, blocks…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Getting started">
            {guides.map((g) => (
              <CommandItem key={g.slug} value={`guide ${g.title}`} onSelect={() => go(() => navigate(g.slug === "introduction" ? "/docs" : `/docs/${g.slug}`))}>
                <BookOpenIcon />
                {g.title}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Components">
            {catalog.map((c) => {
              const Icon = GROUP_ICONS[c.group];
              return (
                <CommandItem
                  key={c.slug}
                  value={`${c.title} ${c.slug} ${groupLabels[c.group]}`}
                  onSelect={() => go(() => navigate(`/docs/components/${c.slug}`))}
                >
                  <Icon />
                  {c.title}
                  {c.group !== "ui" && <span className="ml-auto text-xs text-muted-foreground">{groupLabels[c.group]}</span>}
                </CommandItem>
              );
            })}
          </CommandGroup>
          <CommandGroup heading="Blocks">
            {blocks.map((b) => (
              <CommandItem key={b.slug} value={`block ${b.title}`} onSelect={() => go(() => navigate(`/blocks#${b.slug}`))}>
                <LayoutTemplateIcon />
                {b.title}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Theme">
            <CommandItem value="theme light" onSelect={() => go(() => setTheme("light"))}>
              <SunIcon /> Light
            </CommandItem>
            <CommandItem value="theme dark" onSelect={() => go(() => setTheme("dark"))}>
              <MoonIcon /> Dark
            </CommandItem>
            <CommandItem value="accent dx gradient" onSelect={() => go(() => setAccent("dx-gradient"))}>
              <SparklesIcon /> DX Gradient accent
            </CommandItem>
            <CommandItem value="accent ink" onSelect={() => go(() => setAccent("ink"))}>
              <PaletteIcon /> Ink accent
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </SearchContext.Provider>
  );
}

function isTyping(e: KeyboardEvent) {
  const t = e.target as HTMLElement | null;
  return !!t && (t.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName));
}

export function SearchButton() {
  const { open } = useSearch();
  return (
    <button
      type="button"
      onClick={open}
      className="site-focus flex h-9 w-full items-center gap-2 rounded-2xl border border-hairline px-3.5 font-ui text-sm font-medium text-faint transition-colors hover:border-divider hover:text-pencil sm:w-56"
    >
      <span className="flex-1 text-left">Search docs…</span>
      <kbd className="hidden font-code text-[10px] leading-[1.7] tracking-[-0.006em] text-faint sm:inline">⌘K</kbd>
    </button>
  );
}
