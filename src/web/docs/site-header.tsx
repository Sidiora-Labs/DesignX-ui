import * as React from "react";
import { Link, useLocation } from "wouter";
import { MenuIcon } from "lucide-react";
import { FaGithub } from "react-icons/fa6";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DxLogo } from "./logo";
import { docsNav, mainNav } from "./nav";
import { SearchButton } from "./search";
import { AccentToggle, ThemeToggle } from "./theme-switcher";

function isActive(location: string, href: string) {
  if (href === "/docs") return location === "/docs" || (location.startsWith("/docs/") && !location.startsWith("/docs/components"));
  if (href.startsWith("/docs/components")) return location.startsWith("/docs/components");
  return location.startsWith(href);
}

export function SiteHeader({ className }: { className?: string }) {
  const [location] = useLocation();
  return (
    <header className={cn("sticky top-0 z-40 w-full border-b border-outline-variant bg-background/80 backdrop-blur-xl", className)}>
      <div className="mx-auto flex h-14 max-w-[1440px] items-center gap-2 px-4 md:px-6">
        <MobileNav />
        <Link href="/" className="focus-ring mr-4 rounded-sm">
          <DxLogo />
        </Link>
        <nav className="hidden items-center gap-0.5 md:flex">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "focus-ring rounded-full px-3 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground",
                isActive(location, item.href) && "text-foreground",
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <div className="hidden sm:block">
            <SearchButton />
          </div>
          <Separator orientation="vertical" className="mx-1.5 hidden h-5 sm:block" />
          {/* oxlint-disable-next-line jsx-a11y/anchor-has-content, jsx-a11y/control-has-associated-label */}
          <Button variant="ghost" size="icon-sm" aria-label="GitHub" render={<a href="https://github.com/Sidiora-Labs/DesignX-ui" target="_blank" rel="noreferrer" />}>
            <FaGithub />
          </Button>
          <AccentToggle />
          <ThemeToggle />
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
      <SheetTrigger render={<Button variant="ghost" size="icon-sm" className="md:hidden" aria-label="Open menu" />}>
        <MenuIcon />
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] p-0">
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <div className="h-full scrollbar-hover overflow-y-auto px-5 py-6">
          <DxLogo />
          <div className="mt-5">
            <SearchButton />
          </div>
          <div className="mt-6 flex flex-col gap-1">
            {mainNav.map((item) => (
              <Link key={item.href} href={item.href} className="py-1 text-[15px] font-medium">
                {item.title}
              </Link>
            ))}
          </div>
          {docsNav.map((section) => (
            <div key={section.title} className="mt-7">
              <div className="mb-2 text-xs font-medium text-muted-foreground">{section.title}</div>
              <div className="flex flex-col">
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn("py-1 text-sm text-muted-foreground", location === item.href && "font-medium text-foreground")}
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
