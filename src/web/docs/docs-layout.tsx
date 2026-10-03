import * as React from "react";
import { Link, useLocation } from "wouter";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    <aside className="sticky top-14 hidden h-[calc(100svh-3.5rem)] w-60 shrink-0 scrollbar-hover overflow-y-auto overscroll-contain py-8 pr-4 pl-1 md:block">
      {docsNav.map((section) => (
        <div key={section.title} className="mb-7">
          <div className="mb-1.5 px-3 text-xs font-medium text-muted-foreground/80">{section.title}</div>
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
                    "focus-ring state-layer relative flex h-8 items-center gap-2 rounded-full px-3 text-[13px] text-muted-foreground transition-colors hover:text-foreground",
                    active && "bg-container-high font-medium text-foreground",
                  )}
                >
                  {item.title}
                  {item.isNew && <span className="ml-auto size-1.5 rounded-full bg-[var(--dx-blue-3)]" aria-label="New" />}
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
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <div className="mx-auto flex w-full max-w-[1440px] flex-1 gap-6 px-4 md:px-6 lg:gap-12">
        <DocsSidebar />
        <main className="min-w-0 flex-1 py-8 md:py-10">{children}</main>
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
    <div className="animate-rise mb-10">
      {eyebrow && <div className="mb-3 text-xs font-medium tracking-[0.08em] text-muted-foreground uppercase">{eyebrow}</div>}
      <div className="flex items-center gap-3">
        <h1 className="text-[34px] leading-[1.1] font-medium tracking-[-0.03em] md:text-[40px]">{title}</h1>
        {isNew && <Badge variant="info">New</Badge>}
      </div>
      <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-muted-foreground">{description}</p>
      {children && <div className="mt-5 flex flex-wrap items-center gap-2">{children}</div>}
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
    <div className="mt-16 flex items-center justify-between gap-4 border-t border-outline-variant pt-6">
      {prev ? (
        <Button variant="tonal" render={<Link href={prev.href} />}>
          <ChevronLeftIcon /> {prev.title}
        </Button>
      ) : (
        <span />
      )}
      {next && (
        <Button variant="tonal" render={<Link href={next.href} />}>
          {next.title} <ChevronRightIcon />
        </Button>
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
    <nav aria-label="On this page" className="sticky top-24 hidden w-48 shrink-0 self-start xl:block">
      <div className="mb-3 text-xs font-medium text-muted-foreground">On this page</div>
      <ul className="flex flex-col gap-2 border-l border-outline-variant">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={cn(
                "-ml-px block border-l border-transparent pl-3 text-[13px] text-muted-foreground transition-colors hover:text-foreground",
                active === item.id && "border-foreground text-foreground",
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
