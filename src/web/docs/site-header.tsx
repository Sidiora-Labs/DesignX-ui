import * as React from "react";
import { Link, useLocation } from "wouter";
import { MenuIcon } from "lucide-react";
import { FaGithub } from "react-icons/fa6";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DxLogo } from "./logo";
import { docsNav, mainNav } from "./nav";
import { SearchButton } from "./search";
import { ThemeToggle } from "./theme-switcher";
import { btn, iconBtn } from "@/site/ui";

function isActive(location: string, href: string) {
  if (href === "/docs") return location === "/docs" || (location.startsWith("/docs/") && !location.startsWith("/docs/components"));
  if (href.startsWith("/docs/components")) return location.startsWith("/docs/components");
  return location.startsWith(href);
}

export function SiteHeader({ className }: { className?: string }) {
  const [location] = useLocation();
  return (
    <header className={cn("site sticky top-0 z-40 w-full bg-canvas/85 backdrop-blur-xl", className)}>
      <div className="mx-auto grid h-16 max-w-[1440px] grid-cols-[auto_1fr_auto] items-center gap-4 px-4 md:px-6 lg:grid-cols-[1fr_auto_1fr]">
        <div className="flex items-center gap-1">
          <MobileNav />
          <Link href="/" className="site-focus rounded-md" aria-label="DX UI home">
            <DxLogo />
          </Link>
        </div>
        <nav aria-label="Main" className="hidden items-center gap-8 justify-self-start md:flex lg:justify-self-center">
          {mainNav.map((item) => {
            const active = isActive(location, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn("site-focus rounded-md text-sm transition-colors hover:text-ink", active ? "text-ink" : "text-faint")}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>
        <div className="col-start-3 flex items-center justify-end gap-1">
          <div className="mr-1 hidden lg:block">
            <SearchButton />
          </div>
          <a href="https://github.com/Sidiora-Labs/DesignX-ui" target="_blank" rel="noreferrer" aria-label="GitHub" className={iconBtn("hidden sm:inline-flex")}>
            <FaGithub />
          </a>
          <ThemeToggle />
          <Link href="/docs" className={btn({ className: "ml-2" })}>
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}

function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const [location] = useLocation();
  React.useEffect(() => setOpen(false), [location]);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="ghost" size="icon-sm" className="rounded-2xl text-ink md:hidden" aria-label="Open menu" />}>
        <MenuIcon />
      </SheetTrigger>
      <SheetContent side="left" className="site w-[300px] bg-canvas p-0">
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <div className="h-full scrollbar-hover overflow-y-auto px-5 py-6">
          <DxLogo />
          <div className="mt-5">
            <SearchButton />
          </div>
          <div className="mt-6 flex flex-col gap-1">
            {mainNav.map((item) => (
              <Link key={item.href} href={item.href} className="py-1 text-lg font-semibold tracking-[-0.025em] text-ink">
                {item.title}
              </Link>
            ))}
          </div>
          {docsNav.map((section) => (
            <div key={section.title} className="mt-7">
              <div className="mb-2 font-code text-[11px] tracking-[0.06em] text-faint uppercase">{section.title}</div>
              <div className="flex flex-col">
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn("py-1 text-sm text-pencil", location === item.href && "font-semibold text-ink")}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
