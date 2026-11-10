import { Link } from "wouter";

import { DxLogo } from "./logo";
import { mainNav } from "./nav";

export function SiteFooter() {
  return (
    <footer className="site border-t border-hairline">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-4 py-12 md:flex-row md:items-start md:justify-between md:px-6">
        <div className="max-w-sm">
          <DxLogo />
          <p className="mt-4 text-sm leading-[1.43] text-pencil">Built on Base UI, Tailwind CSS and Motion. MIT licensed.</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
          {mainNav.map((item) => (
            <Link key={item.href} href={item.href} className="site-focus rounded-md text-faint transition-colors hover:text-ink">
              {item.title}
            </Link>
          ))}
          <a href="https://github.com/Sidiora-Labs/DesignX-ui" target="_blank" rel="noreferrer" className="site-focus rounded-md text-faint transition-colors hover:text-ink">
            GitHub
          </a>
        </nav>
      </div>
      <div className="mx-auto max-w-[1200px] px-4 pb-8 md:px-6">
        <span className="font-code text-[11px] tracking-[-0.01em] text-faint">npm i @sidioralabs/designx-ui</span>
      </div>
    </footer>
  );
}
