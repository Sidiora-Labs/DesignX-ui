import * as React from "react";
import { useSearchParams } from "wouter";
import { SearchIcon, XIcon } from "lucide-react";

import { catalog, type CatalogGroup, groupLabels } from "@/docs/catalog";
import { DocsHeader } from "@/docs/docs-layout";
import { KitCard } from "@/landing/kit-card";
import { btn, Chip } from "@/site/ui";

const GROUPS = (Object.keys(groupLabels) as CatalogGroup[]).map((id) => ({
  id,
  label: groupLabels[id],
  count: catalog.filter((c) => c.group === id).length,
}));
const PAGE = 24;

export default function ComponentsIndexPage() {
  const [params, setParams] = useSearchParams();
  const group = (params.get("group") ?? "all") as CatalogGroup | "all";
  const query = params.get("q") ?? "";
  const [limit, setLimit] = React.useState(PAGE);
  const sentinel = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    document.title = "Components — DX UI";
  }, []);
  React.useEffect(() => setLimit(PAGE), [group, query]);

  const set = (key: "group" | "q", value: string) =>
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
  const items = React.useMemo(
    () =>
      catalog
        .filter((c) => group === "all" || c.group === group)
        .filter((c) => !q || `${c.title} ${c.slug} ${c.description}`.toLowerCase().includes(q))
        .toSorted((a, b) => (group === "all" ? 0 : a.title.localeCompare(b.title))),
    [group, q],
  );
  const shown = items.slice(0, limit);
  const more = items.length - shown.length;

  // Load the next page as the end of the grid approaches.
  React.useEffect(() => {
    const el = sentinel.current;
    if (!el || more <= 0) return;
    const io = new IntersectionObserver((e) => e[0].isIntersecting && setLimit((l) => l + PAGE), { rootMargin: "600px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [more, limit]);

  return (
    <div>
      <DocsHeader
        crumbs={[{ title: "Docs", href: "/docs" }, { title: "Components" }]}
        title="Components"
        description={`${catalog.length} components across ${GROUPS.length} kits. Every card is the live component — open one for install commands, examples and the API.`}
      />

      <div className="sticky top-16 z-20 -mx-4 mb-8 flex flex-col gap-3 bg-canvas/90 px-4 py-3 backdrop-blur-xl md:mx-0 md:px-0 xl:flex-row xl:items-center xl:justify-between">
        <div role="group" aria-label="Kit" className="-mx-4 flex scrollbar-none gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
          <Chip active={group === "all"} count={catalog.length} onClick={() => set("group", "all")}>
            All
          </Chip>
          {GROUPS.map((g) => (
            <Chip key={g.id} active={group === g.id} count={g.count} onClick={() => set("group", g.id)}>
              {g.label}
            </Chip>
          ))}
        </div>
        <label className="relative block w-full shrink-0 xl:w-60">
          <span className="sr-only">Search components</span>
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-faint" />
          <input
            type="search"
            value={query}
            onChange={(e) => set("q", e.target.value)}
            placeholder="Search components…"
            className="site-focus h-9 w-full rounded-2xl border border-hairline bg-transparent pr-9 pl-10 text-sm font-medium text-ink placeholder:text-faint [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button type="button" aria-label="Clear search" onClick={() => set("q", "")} className="absolute top-1/2 right-2 grid size-6 -translate-y-1/2 place-items-center rounded-lg text-faint hover:text-ink">
              <XIcon className="size-3.5" />
            </button>
          )}
        </label>
      </div>

      <p aria-live="polite" className="mb-4 font-code text-[11px] tracking-[0.06em] text-faint uppercase">
        {items.length} {items.length === 1 ? "component" : "components"}
      </p>

      {items.length === 0 ? (
        <div className="flex flex-col items-center py-24 text-center">
          <p className="text-2xl font-semibold tracking-[-0.025em] text-ink">No components match “{query}”.</p>
          <button type="button" onClick={() => setParams({}, { replace: true })} className="site-focus mt-4 rounded-md text-sm text-pencil underline decoration-divider underline-offset-4 hover:text-ink">
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid auto-rows-[260px] grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {shown.map((c) => (
              <KitCard key={c.slug} slug={c.slug} persist={false} />
            ))}
          </div>
          {more > 0 && (
            <div ref={sentinel} className="mt-8 flex justify-center">
              <button type="button" className={btn({ variant: "ghost" })} onClick={() => setLimit((l) => l + PAGE)}>
                Show {Math.min(PAGE, more)} more
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
