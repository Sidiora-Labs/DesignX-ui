import * as React from "react";
import { useLocation, useSearchParams } from "wouter";
import { SearchIcon, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { blockBySlug, blockGroups, type BlockGroupId } from "@/docs/block-groups";
import { blocks } from "@/docs/catalog";
import { SiteFooter } from "@/docs/site-footer";
import { SiteHeader } from "@/docs/site-header";
import { BlockCard } from "@/site/block-thumb";
import { Chip, Eyebrow, Serif } from "@/site/ui";

export default function BlocksPage() {
  const [, navigate] = useLocation();
  const [params, setParams] = useSearchParams();
  const group = (params.get("category") ?? "all") as BlockGroupId | "all";
  const query = params.get("q") ?? "";

  React.useEffect(() => {
    document.title = "Blocks — DX UI";
    // Old links pointed at /blocks#<slug>; send them to the block's own page.
    const hash = window.location.hash.slice(1);
    if (hash && blockBySlug[hash]) navigate(`/blocks/${hash}`, { replace: true });
  }, [navigate]);

  const set = (key: "category" | "q", value: string) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (!value || value === "all") next.delete(key);
        else next.set(key, value);
        return next;
      },
      { replace: true },
    );

  const q = query.trim().toLowerCase();
  const visible = blockGroups
    .filter((g) => group === "all" || g.id === group)
    .map((g) => ({
      ...g,
      items: q ? g.items.filter((b) => `${b.title} ${b.slug} ${b.description}`.toLowerCase().includes(q)) : g.items,
    }))
    .filter((g) => g.items.length > 0);
  const count = visible.reduce((n, g) => n + g.items.length, 0);

  return (
    <div className="site flex min-h-svh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 pb-24 md:px-6 md:pb-32">
        <header className="pt-16 pb-12 md:pt-24">
          <Eyebrow>{blocks.length} blocks · copy, paste, own</Eyebrow>
          <h1 className="mt-4 max-w-4xl text-[clamp(2.5rem,8vw,4.5rem)] leading-none font-bold tracking-[-0.045em] text-balance text-ink">
            Building blocks for the <Serif>real thing.</Serif>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-[1.33] tracking-[-0.025em] text-pretty text-pencil">
            Dashboards, auth flows and marketing sections composed from DX UI. Open one to preview it at any viewport, then add it to your app
            with one command.
          </p>
        </header>

        <div className="sticky top-16 z-30 -mx-4 flex flex-col gap-3 bg-canvas/90 px-4 py-3 backdrop-blur-xl md:-mx-6 md:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div role="group" aria-label="Category" className="-mx-4 flex scrollbar-none gap-2 overflow-x-auto px-4 md:mx-0 md:px-0 lg:flex-wrap">
            <Chip active={group === "all"} count={blocks.length} onClick={() => set("category", "all")}>
              All
            </Chip>
            {blockGroups.map((g) => (
              <Chip key={g.id} active={group === g.id} count={g.items.length} onClick={() => set("category", g.id)}>
                {g.label}
              </Chip>
            ))}
          </div>
          <label className="relative block w-full shrink-0 lg:w-64">
            <span className="sr-only">Search blocks</span>
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-faint" />
            <input
              type="search"
              value={query}
              onChange={(e) => set("q", e.target.value)}
              placeholder="Search blocks…"
              className="site-focus h-9 w-full rounded-2xl border border-hairline bg-transparent pr-9 pl-10 text-sm font-medium text-ink placeholder:text-faint [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button type="button" aria-label="Clear search" onClick={() => set("q", "")} className="absolute top-1/2 right-2 grid size-6 -translate-y-1/2 place-items-center rounded-lg text-faint hover:text-ink">
                <XIcon className="size-3.5" />
              </button>
            )}
          </label>
        </div>

        <p aria-live="polite" className="sr-only">
          {count} blocks shown
        </p>

        {visible.length === 0 ? (
          <div className="flex flex-col items-center py-32 text-center">
            <p className="text-2xl font-semibold tracking-[-0.025em] text-ink">No blocks match “{query}”.</p>
            <button type="button" onClick={() => setParams({}, { replace: true })} className="site-focus mt-4 rounded-md text-sm text-pencil underline decoration-divider underline-offset-4 hover:text-ink">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="mt-8 flex flex-col gap-16 md:gap-24">
            {visible.map((g, gi) => (
              <section key={g.id} aria-labelledby={`blocks-${g.id}`}>
                <div className="mb-6 flex items-baseline justify-between gap-4 border-b border-hairline pb-4">
                  <h2 id={`blocks-${g.id}`} className="text-[28px] leading-[1.14] font-bold tracking-[-0.025em] text-ink">
                    {g.label}
                  </h2>
                  <span className="font-code text-xs tracking-[-0.025em] text-faint tabular-nums">{g.items.length}</span>
                </div>
                <div className={cn("grid gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4")}>
                  {g.items.map((b, i) => (
                    <BlockCard key={b.slug} block={b} eager={gi === 0 && i < 4} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
