import * as React from "react";
import { Link, useLocation } from "wouter";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { btn, Eyebrow, Tag } from "@/site/ui";
import { docsNav, flatDocs } from "./nav";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export function DocsSidebar() {
  const [location] = useLocation();
  const activeRef = React.useRef<HTMLAnchorElement>(null);
  React.useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest" });
  }, []);

  return (
    <aside className="sticky top-16 hidden h-[calc(100svh-4rem)] w-60 shrink-0 scrollbar-hover overflow-y-auto overscroll-contain py-8 pr-4 pl-1 md:block">
      {docsNav.map((section) => (
        <div key={section.title} className="mb-8">
          <div className="mb-2 px-3 font-code text-[11px] leading-[1.7] tracking-[0.06em] text-faint uppercase">{section.title}</div>
          <div className="flex flex-col gap-px">
            {section.items.map((item) => {
              const active = location === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  ref={active ? activeRef : undefined}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "site-focus relative flex h-8 items-center gap-2 rounded-xl px-3 text-sm text-pencil transition-colors hover:text-ink",
                    active && "bg-tile font-semibold text-ink",
                  )}
                >
                  {item.title}
                  {item.isNew && <span className="ml-auto font-code text-[10px] tracking-[-0.006em] text-faint">new</span>}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </aside>
  );
}

export function DocsShell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  React.useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location]);
  return (
    <div className="site flex min-h-svh flex-col">
      <SiteHeader />
      <div className="mx-auto flex w-full max-w-[1440px] flex-1 gap-6 px-4 md:px-6 lg:gap-12">
        <DocsSidebar />
        <main className="min-w-0 flex-1 py-8 md:py-12">{children}</main>
      </div>
      <SiteFooter />
    </div>
  );
}

export function DocsHeader({
  title,
  description,
  eyebrow,
  isNew,
  children,
}: {
  title: string;
  description: string;
  eyebrow?: string;
  isNew?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className="animate-rise not-prose mb-12">
      {eyebrow && <Eyebrow className="mb-4">{eyebrow}</Eyebrow>}
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
