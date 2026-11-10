import * as React from "react";
import { Link, useParams } from "wouter";
import { ChevronLeftIcon, ChevronRightIcon, ExternalLinkIcon, FileCodeIcon, MonitorIcon, RotateCcwIcon, SmartphoneIcon, TabletIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { blockBySlug, blockGroupLabels, blockGroupOf, blockGroups } from "@/docs/block-groups";
import { blocks } from "@/docs/catalog";
import { CodeBlock } from "@/docs/code-block";
import { SiteFooter } from "@/docs/site-footer";
import { SiteHeader } from "@/docs/site-header";
import { loadBlockFiles } from "@/docs/sources";
import { BlockCard } from "@/site/block-thumb";
import { btn, Crumbs, iconBtn, SegmentedPill, Tag, type Segment } from "@/site/ui";
import NotFound from "./not-found";

const viewports = {
  desktop: { width: "100%", icon: MonitorIcon, label: "Desktop" },
  tablet: { width: "768px", icon: TabletIcon, label: "Tablet" },
  mobile: { width: "390px", icon: SmartphoneIcon, label: "Mobile" },
} as const;
type Viewport = keyof typeof viewports;
type View = "preview" | "code";

const VIEWS: Segment<View>[] = [
  { value: "preview", label: "Preview" },
  { value: "code", label: "Code" },
];
const VIEWPORTS: Segment<Viewport>[] = (Object.keys(viewports) as Viewport[]).map((k) => ({
  value: k,
  icon: viewports[k].icon,
  label: <span className="sr-only">{viewports[k].label}</span>,
}));
type Cli = "dx" | "shadcn";
const CLIS: Segment<Cli>[] = [
  { value: "dx", label: "dx-ui" },
  { value: "shadcn", label: "shadcn" },
];

function BlockCode({ slug }: { slug: string }) {
  const [files, setFiles] = React.useState<{ path: string; code: string }[] | null>(null);
  const [active, setActive] = React.useState(0);
  React.useEffect(() => {
    let alive = true;
    void loadBlockFiles(slug).then((f) => alive && setFiles(f));
    return () => {
      alive = false;
    };
  }, [slug]);
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
        <nav aria-label="Files" className="flex shrink-0 scrollbar-none flex-row gap-1 overflow-x-auto md:w-56 md:flex-col">
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
      <CodeBlock key={file.path} code={file.code} title={file.path} className="min-w-0 flex-1" collapsible maxHeight={640} />
    </div>
  );
}

function BlockStage({ slug, title, height }: { slug: string; title: string; height: number }) {
  const [view, setView] = React.useState<View>("preview");
  const [viewport, setViewport] = React.useState<Viewport>("desktop");
  const [reload, setReload] = React.useState(0);
  const [loaded, setLoaded] = React.useState(false);
  const [cli, setCli] = React.useState<Cli>("dx");
  const src = `/blocks/view/${slug}`;
  const command = cli === "dx" ? `npx @sidioralabs/designx-ui@latest add ${slug}` : `npx shadcn@latest add @dx/${slug}`;
  React.useEffect(() => setLoaded(false), [reload]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <SegmentedPill id="block-view" label="Preview or code" size="sm" items={VIEWS} value={view} onValueChange={setView} />
          {view === "preview" && (
            <SegmentedPill id="block-viewport" label="Viewport" tone="quiet" size="sm" className="hidden lg:inline-flex" items={VIEWPORTS} value={viewport} onValueChange={setViewport} />
          )}
        </div>
        <div className="flex items-center gap-1">
          <button type="button" className={iconBtn()} aria-label="Reload preview" title="Reload preview" onClick={() => setReload((r) => r + 1)}>
            <RotateCcwIcon />
          </button>
          <a href={src} target="_blank" rel="noreferrer" className={iconBtn()} aria-label="Open in new tab" title="Open in new tab">
            <ExternalLinkIcon />
          </a>
        </div>
      </div>

      {view === "preview" ? (
        <div className={cn("relative overflow-hidden rounded-3xl", viewport === "desktop" ? "border border-hairline" : "bg-tile lg:p-3")}>
          <div
            className={cn("dx-scope relative mx-auto overflow-hidden bg-background transition-[width] duration-500 ease-(--ease-dx)", viewport !== "desktop" && "lg:rounded-[18px]")}
            style={{ width: viewports[viewport].width, maxWidth: "100%", height: `min(${height}px, 82svh)`, minHeight: 360 }}
          >
            {!loaded && (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                <Spinner />
              </div>
            )}
            {/* oxlint-disable-next-line react/iframe-missing-sandbox -- same-origin preview of our own block */}
            <iframe
              key={reload}
              src={src}
              title={`${title} preview`}
              onLoad={() => setLoaded(true)}
              className={cn("size-full bg-background transition-opacity duration-300", loaded ? "opacity-100" : "opacity-0")}
            />
          </div>
        </div>
      ) : (
        <BlockCode slug={slug} />
      )}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <SegmentedPill id="block-cli" label="CLI" tone="quiet" size="sm" items={CLIS} value={cli} onValueChange={setCli} className="self-start" />
        <CodeBlock code={command} lang="bash" className="min-w-0 flex-1" />
      </div>
    </div>
  );
}

export default function BlockDetailPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const block = blockBySlug[slug];

  React.useEffect(() => {
    if (block) document.title = `${block.title} — Blocks — DX UI`;
    window.scrollTo({ top: 0 });
  }, [block]);

  if (!block)
    return (
      <div className="site flex min-h-svh flex-col">
        <SiteHeader />
        <main className="flex flex-1 items-center justify-center px-4">
          <NotFound />
        </main>
        <SiteFooter />
      </div>
    );

  const groupId = blockGroupOf(block);
  const i = blocks.indexOf(block);
  const prev = blocks[i - 1];
  const next = blocks[i + 1];
  const related = (blockGroups.find((g) => g.id === groupId)?.items ?? []).filter((b) => b.slug !== slug).slice(0, 4);

  return (
    <div className="site flex min-h-svh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 pb-24 md:px-6 md:pb-32">
        <header className="flex flex-col gap-6 pt-10 pb-8 md:flex-row md:items-end md:justify-between md:pt-14">
          <div className="min-w-0">
            <Crumbs
              items={[
                { title: "Blocks", href: "/blocks" },
                { title: blockGroupLabels[groupId], href: `/blocks?category=${groupId}` },
                { title: block.title },
              ]}
            />
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <h1 className="text-[clamp(2rem,6vw,3rem)] leading-[1.13] font-bold tracking-[-0.025em] text-ink">{block.title}</h1>
              <Tag>{block.slug}</Tag>
            </div>
            <p className="mt-4 max-w-2xl text-lg leading-[1.33] tracking-[-0.025em] text-pretty text-pencil">{block.description}</p>
          </div>
          <div className="flex shrink-0 gap-2">
            {prev ? (
              <Link href={`/blocks/${prev.slug}`} className={btn({ variant: "ghost", className: "px-3" })} aria-label={`Previous: ${prev.title}`} title={prev.title}>
                <ChevronLeftIcon />
              </Link>
            ) : null}
            {next ? (
              <Link href={`/blocks/${next.slug}`} className={btn({ variant: "ghost" })} title={next.title}>
                Next <ChevronRightIcon />
              </Link>
            ) : null}
          </div>
        </header>

        <BlockStage key={slug} slug={slug} title={block.title} height={block.height} />

        {related.length > 0 && (
          <section aria-labelledby="related-blocks" className="mt-24">
            <div className="mb-6 flex items-baseline justify-between gap-4 border-b border-hairline pb-4">
              <h2 id="related-blocks" className="text-[28px] leading-[1.14] font-bold tracking-[-0.025em] text-ink">
                More {blockGroupLabels[groupId].toLowerCase()}
              </h2>
              <Link href={`/blocks?category=${groupId}`} className="site-focus rounded-md text-sm text-pencil hover:text-ink">
                View all
              </Link>
            </div>
            <div className="grid gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((b) => (
                <BlockCard key={b.slug} block={b} />
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
