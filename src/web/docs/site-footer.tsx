import { DxMark } from "./logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-outline-variant">
      <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-3 px-4 py-6 text-[13px] text-muted-foreground sm:flex-row sm:items-center md:px-6">
        <div className="flex items-center gap-2">
          <DxMark className="size-5" />
          <span>DesignX UIbuilt on Base UI, Tailwind CSS and Motion. MIT licensed.</span>
        </div>
        <span className="font-mono text-xs">NPM: @sidioralabs/designx-ui</span>
      </div>
    </footer>
  );
}
