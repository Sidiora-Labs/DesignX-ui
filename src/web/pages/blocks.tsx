import * as React from "react";
import { ExternalLinkIcon, FileCodeIcon, MonitorIcon, RotateCcwIcon, SmartphoneIcon, TabletIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { btn, Eyebrow, iconBtn, SegmentedPill, Serif, Tag, type Segment } from "@/site/ui";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { blocks, type BlockCategory, type BlockItem } from "@/docs/catalog";
import { CodeBlock, CommandBlock } from "@/docs/code-block";
import { SiteFooter } from "@/docs/site-footer";
import { SiteHeader } from "@/docs/site-header";
import { loadBlockFiles } from "@/docs/sources";

const viewports = {
  desktop: { width: "100%", icon: MonitorIcon, label: "Desktop" },
  tablet: { width: "768px", icon: TabletIcon, label: "Tablet" },
  mobile: { width: "390px", icon: SmartphoneIcon, label: "Mobile" },
} as const;
type Viewport = keyof typeof viewports;

const VIEWS: Segment<"preview" | "code">[] = [
  { value: "preview", label: "Preview" },
  { value: "code", label: "Code" },
];
const VIEWPORTS: Segment<Viewport>[] = (Object.keys(viewports) as Viewport[]).map((k) => ({
  value: k,
  icon: viewports[k].icon,
  label: <span className="sr-only">{viewports[k].label}</span>,
}));

function useBlockFiles(slug: string, enabled: boolean) {
  const [files, setFiles] = React.useState<{ path: string; code: string }[] | null>(null);
  React.useEffect(() => {
    if (!enabled || files) return;
    let alive = true;
    void loadBlockFiles(slug).then((f) => alive && setFiles(f));
    return () => {
      alive = false;
    };
  }, [slug, enabled, files]);
  return files;
}

function BlockCode({ slug }: { slug: string }) {
  const files = useBlockFiles(slug, true);
  const [active, setActive] = React.useState(0);
  if (!files)
    return (
      <div className="flex h-80 items-center justify-center rounded-3xl border border-hairline text-faint">
        <Spinner />
      </div>
    );
  const file = files[active] ?? files[0];
  return (
    <div className="flex flex-col gap-3 md:flex-row">
      {files.length > 1 && (
        <nav aria-label="Files" className="flex shrink-0 flex-row gap-1 scrollbar-none overflow-x-auto md:w-56 md:flex-col">
          {files.map((f, i) => (
            <button
              key={f.path}
              type="button"
              onClick={() => setActive(i)}
              aria-current={i === active ? "true" : undefined}
              className={cn(
                "site-focus flex h-8 shrink-0 items-center gap-2 rounded-xl px-3 text-left font-code text-xs tracking-[-0.025em] text-pencil transition-colors hover:text-ink",
                i === active && "bg-tile text-ink",
              )}
            >
              <FileCodeIcon className="size-3.5 shrink-0" />
              <span className="truncate">{f.path.split("/").slice(1).join("/")}</span>
            </button>
          ))}
        </nav>
      )}
      <CodeBlock key={file.path} code={file.code} title={file.path} className="min-w-0 flex-1" collapsible maxHeight={560} />
    </div>
  );
}

function BlockSection({ block }: { block: BlockItem }) {
  const [viewport, setViewport] = React.useState<Viewport>("desktop");
  const [view, setView] = React.useState<"preview" | "code">("preview");
  const [reload, setReload] = React.useState(0);
  const [loaded, setLoaded] = React.useState(false);
  const src = `/blocks/view/${block.slug}`;

  return (
    <section id={block.slug} className="scroll-mt-24">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <a href={`#${block.slug}`} className="site-focus rounded-md text-2xl leading-[1.17] font-semibold tracking-[-0.025em] text-ink hover:underline">
                {block.title}
              </a>
              <Tag>{block.slug}</Tag>
            </div>
            <p className="mt-2 text-sm leading-[1.43] text-pencil">{block.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <SegmentedPill id={`${block.slug}-view`} label="Preview or code" size="sm" items={VIEWS} value={view} onValueChange={setView} />
            <SegmentedPill
              id={`${block.slug}-viewport`}
              label="Viewport"
              tone="quiet"
              size="sm"
              className="hidden lg:inline-flex"
              items={VIEWPORTS}
              value={viewport}
              onValueChange={setViewport}
            />
            <Tooltip>
              <TooltipTrigger render={<button type="button" className={iconBtn()} aria-label="Reload preview" onClick={() => setReload((r) => r + 1)} />}>
                <RotateCcwIcon />
              </TooltipTrigger>
              <TooltipContent>Reload</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger
                // oxlint-disable-next-line jsx-a11y/anchor-has-content, jsx-a11y/control-has-associated-label
                render={<a href={src} target="_blank" rel="noreferrer" className={iconBtn()} aria-label="Open in new tab" />}
              >
                <ExternalLinkIcon />
              </TooltipTrigger>
              <TooltipContent>Open in new tab</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {view === "preview" ? (
          <div className={cn("relative overflow-hidden rounded-3xl", viewport === "desktop" ? "border border-hairline" : "bg-tile lg:p-3")}>
            <div
              className={cn(
                "dx-scope relative mx-auto overflow-hidden bg-background transition-[width] duration-500 ease-(--ease-dx)",
                viewport !== "desktop" && "lg:rounded-[18px]",
              )}
              style={{ width: viewports[viewport].width, maxWidth: "100%", height: block.height }}
            >
              {!loaded && (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  <Spinner />
                </div>
              )}
              <iframe
                key={reload}
                src={src}
                title={`${block.title} preview`}
                loading="lazy"
                onLoad={() => setLoaded(true)}
                className={cn("size-full bg-background transition-opacity duration-300", loaded ? "opacity-100" : "opacity-0")}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <CommandBlock command={`npx shadcn@latest add @dx/${block.slug}`} />
            <BlockCode slug={block.slug} />
          </div>
        )}
      </div>
    </section>
  );
}

const SECTIONS: { id: BlockCategory; label: string }[] = [
  { id: "application", label: "Application" },
  { id: "marketing", label: "Marketing" },
];
const byCategory = (id: BlockCategory) => blocks.filter((b) => (b.category ?? "application") === id);

export default function BlocksPage() {
  React.useEffect(() => {
    document.title = "Blocks — DX UI";
  }, []);

  return (
    <div className="site flex min-h-svh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 pb-24 md:px-6 md:pb-32">
        <header className="flex flex-col py-16 md:py-24">
          <Eyebrow>{blocks.length} blocks</Eyebrow>
          <h1 className="mt-4 max-w-4xl text-[clamp(2.5rem,8vw,4.5rem)] leading-none font-bold tracking-[-0.045em] text-balance text-ink">
            Building blocks for the <Serif>real thing.</Serif>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-[1.33] tracking-[-0.025em] text-pretty text-pencil">
            Dashboards, auth flows and settings screens composed from DX UI. Preview them at any viewport, then add them to your app with one
            command.
          </p>
          <div className="mt-12 grid gap-8">
            {SECTIONS.map((sec) => (
              <nav key={sec.id} aria-label={`${sec.label} blocks`} className="flex flex-col gap-3">
                <Eyebrow className="text-faint">{sec.label}</Eyebrow>
                <div className="flex flex-wrap gap-2">
                  {byCategory(sec.id).map((b) => (
                    <a key={b.slug} href={`#${b.slug}`} className={btn({ variant: "ghost", size: "sm" })}>
                      {b.title}
                    </a>
                  ))}
                </div>
              </nav>
            ))}
          </div>
        </header>
        <div className="flex flex-col gap-24 md:gap-32">
          {SECTIONS.map((sec) => (
            <div key={sec.id} id={sec.id} className="flex scroll-mt-24 flex-col gap-16 md:gap-24">
              <div className="flex items-baseline justify-between gap-4 border-b border-hairline pb-6">
                <h2 className="text-[clamp(2rem,6vw,3rem)] leading-[1.13] font-bold tracking-[-0.025em] text-ink">{sec.label}</h2>
                <span className="font-code text-xs tracking-[-0.025em] text-faint">{byCategory(sec.id).length} blocks</span>
              </div>
              {byCategory(sec.id).map((b) => (
                <BlockSection key={b.slug} block={b} />
              ))}
            </div>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
