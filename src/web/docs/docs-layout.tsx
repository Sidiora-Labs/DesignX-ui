import * as React from "react";
import { Link, useLocation } from "wouter";
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { btn, Crumbs, Eyebrow, Tag } from "@/site/ui";
import { docsNav, flatDocs } from "./nav";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

const OPEN_KEY = "dx-docs-nav-open";

function readOpen(): string[] | null {
  try {
    const raw = sessionStorage.getItem(OPEN_KEY);
    return raw ? (JSON.parse(raw) as string[]) : null;
  } catch {
    return null;
  }
}

/**
 * Docs navigation: collapsible sections with counts and a filter. Only the
 * open sections render their links, so the ~460 component entries are not all
 * in the DOM at once. Shared by the desktop sidebar and the mobile sheet.
 */
export function DocsNav({ className }: { className?: string }) {
  const [location] = useLocation();
  const [filter, setFilter] = React.useState("");
  const activeSection = docsNav.find((s) => s.items.some((i) => i.href === location))?.title;
  const [open, setOpen] = React.useState<Set<string>>(() => new Set(readOpen() ?? [docsNav[0].title, docsNav[1].title]));
  const listRef = React.useRef<HTMLDivElement>(null);

  // The section holding the current page is always open.
  React.useEffect(() => {
    if (activeSection) setOpen((prev) => (prev.has(activeSection) ? prev : new Set(prev).add(activeSection)));
  }, [activeSection]);
  React.useEffect(() => {
    try {
      sessionStorage.setItem(OPEN_KEY, JSON.stringify([...open]));
    } catch {
      /* private mode */
    }
  }, [open]);
  React.useEffect(() => {
    listRef.current?.querySelector('[aria-current="page"]')?.scrollIntoView({ block: "nearest" });
  }, [location, open]);

  const q = filter.trim().toLowerCase();
  const sections = q
    ? docsNav.map((s) => ({ ...s, items: s.items.filter((i) => i.title.toLowerCase().includes(q)) })).filter((s) => s.items.length > 0)
    : docsNav;
  const toggle = (title: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });

  return (
    <div className={cn("flex min-h-0 flex-col", className)}>
      <label className="relative mb-4 block shrink-0">
        <span className="sr-only">Filter navigation</span>
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-faint" />
        <input
          type="search"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter…"
          className="site-focus h-9 w-full rounded-2xl border border-hairline bg-transparent pr-3 pl-9 text-sm font-medium text-ink placeholder:text-faint [&::-webkit-search-cancel-button]:hidden"
        />
      </label>
      <div ref={listRef} className="-mr-3 min-h-0 flex-1 scrollbar-hover overflow-y-auto overscroll-contain pr-3 pb-8">
        {sections.length === 0 && <p className="px-3 py-2 text-sm text-faint">Nothing matches “{filter}”.</p>}
        {sections.map((section) => {
          const expanded = q ? true : open.has(section.title);
          const id = `docs-nav-${section.title.replace(/\W+/g, "-").toLowerCase()}`;
          return (
            <div key={section.title} className="mb-1">
              <button
                type="button"
                aria-expanded={expanded}
                aria-controls={id}
                disabled={!!q}
                onClick={() => toggle(section.title)}
                className={cn(
                  "site-focus group/sec flex h-9 w-full items-center gap-2 rounded-xl px-3 font-code text-[11px] leading-[1.7] tracking-[0.06em] uppercase transition-colors hover:text-ink",
                  section.title === activeSection ? "text-ink" : "text-pencil",
                )}
              >
                <span className="truncate">{section.title}</span>
                <span className="text-faint tabular-nums">{section.items.length}</span>
                {!q && <ChevronRightIcon className={cn("ml-auto size-3.5 text-faint transition-transform duration-200", expanded && "rotate-90")} />}
              </button>
              {expanded && (
                <div id={id} className="mb-3 flex flex-col gap-px">
                  {section.items.map((item) => {
                    const active = location === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "site-focus flex h-8 shrink-0 items-center rounded-xl px-3 text-sm text-pencil transition-colors hover:text-ink",
                          active && "bg-tile font-semibold text-ink",
                        )}
                      >
                        <span className="truncate">{item.title}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function DocsSidebar() {
  return (
    <aside className="sticky top-16 hidden h-[calc(100svh-4rem)] w-64 shrink-0 pt-8 md:block">
      <DocsNav className="h-full" />
    </aside>
  );
}

export function DocsShell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  React.useEffect(() => {
    // New page: start at the top, unless the URL points at a heading.
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) {
      window.scrollTo({ top: 0 });
      return;
    }
    // Lazy pages render after this effect; retry briefly until the heading exists.
    let tries = 0;
    const t = window.setInterval(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView();
      if (el || ++tries > 20) window.clearInterval(t);
    }, 100);
    return () => window.clearInterval(t);
  }, [location]);
  return (
    <div className="site flex min-h-svh flex-col">
      <SiteHeader />
      <div className="mx-auto flex w-full max-w-[1440px] flex-1 gap-6 px-4 md:px-6 lg:gap-12">
        <DocsSidebar />
        <main className="min-w-0 flex-1 py-8 md:py-12">
          <DocsBoundary key={location}>{children}</DocsBoundary>
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}

/** Keeps the shell (header, sidebar) alive if a page or one of its demos throws. */
class DocsBoundary extends React.Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="flex min-h-[50svh] flex-col items-start justify-center">
        <Eyebrow>Something broke</Eyebrow>
        <h1 className="mt-4 text-[28px] leading-[1.14] font-bold tracking-[-0.025em] text-ink">This page failed to render.</h1>
        <p className="mt-4 max-w-md text-base leading-[1.6] text-pencil">The rest of the docs still work. Try again, or pick another page from the sidebar.</p>
        <button type="button" className={btn({ variant: "ghost", className: "mt-6" })} onClick={() => this.setState({ failed: false })}>
          Try again
        </button>
      </div>
    );
  }
}

export function DocsHeader({
  title,
  description,
  eyebrow,
  isNew,
  crumbs,
  children,
}: {
  title: string;
  description: string;
  eyebrow?: string;
  isNew?: boolean;
  crumbs?: { title: string; href?: string }[];
  children?: React.ReactNode;
}) {
  return (
    <div className="animate-rise not-prose mb-12">
      {crumbs ? <Crumbs items={crumbs} className="mb-4" /> : eyebrow && <Eyebrow className="mb-4">{eyebrow}</Eyebrow>}
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-[clamp(2.25rem,6vw,3rem)] leading-[1.13] font-bold tracking-[-0.025em] text-ink">{title}</h1>
        {isNew && <Tag>New</Tag>}
      </div>
      <p className="mt-6 max-w-2xl text-lg leading-[1.33] tracking-[-0.025em] text-pretty text-pencil">{description}</p>
      {children && <div className="mt-6 flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}

export function PrevNext() {
  const [location] = useLocation();
  const i = flatDocs.findIndex((d) => d.href === location);
  if (i === -1) return null;
  const prev = flatDocs[i - 1];
  const next = flatDocs[i + 1];
  return (
    <div className="not-prose mt-16 flex items-center justify-between gap-4 border-t border-hairline pt-8">
      {prev ? (
        <Link href={prev.href} className={btn({ variant: "ghost" })}>
          <ChevronLeftIcon /> {prev.title}
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link href={next.href} className={btn({ variant: "ghost" })}>
          {next.title} <ChevronRightIcon />
        </Link>
      )}
    </div>
  );
}

export function Toc({ items }: { items: { id: string; title: string }[] }) {
  const [active, setActive] = React.useState(items[0]?.id);
  React.useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -65% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);
  if (!items.length) return null;
  return (
    <nav aria-label="On this page" className="sticky top-28 hidden w-48 shrink-0 self-start xl:block">
      <div className="mb-3 font-code text-[11px] leading-[1.7] tracking-[0.06em] text-faint uppercase">On this page</div>
      <ul className="flex flex-col gap-2 border-l border-hairline">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={cn(
                "-ml-px block border-l border-transparent pl-3 text-sm text-faint transition-colors hover:text-ink",
                active === item.id && "border-ink text-ink",
              )}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
