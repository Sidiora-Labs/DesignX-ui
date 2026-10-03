import * as React from "react";
import { ExternalLinkIcon, FileCodeIcon, MonitorIcon, RotateCcwIcon, SmartphoneIcon, TabletIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { blocks, type BlockItem } from "@/docs/catalog";
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
      <div className="flex h-80 items-center justify-center rounded-xl border border-outline-variant text-muted-foreground">
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
                "focus-ring state-layer flex h-8 shrink-0 items-center gap-2 rounded-full px-3 text-left font-mono text-xs text-muted-foreground",
                i === active && "bg-container-high text-foreground",
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
  const [reload, setReload] = React.useState(0);
  const [loaded, setLoaded] = React.useState(false);
  const src = `/blocks/view/${block.slug}`;

  return (
    <section id={block.slug} className="scroll-mt-20">
      <Tabs defaultValue="preview" className="gap-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <a href={`#${block.slug}`} className="text-lg font-medium tracking-tight hover:underline">
                {block.title}
              </a>
              <Badge variant="outline" className="font-mono">
                {block.slug}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{block.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
            </TabsList>
            <ToggleGroup
              size="sm"
              variant="outline"
              className="hidden lg:flex"
              value={[viewport]}
              onValueChange={(v) => v[0] && setViewport(v[0] as Viewport)}
            >
              {(Object.keys(viewports) as Viewport[]).map((k) => {
                const V = viewports[k];
                return (
                  <ToggleGroupItem key={k} value={k} aria-label={V.label}>
                    <V.icon />
                  </ToggleGroupItem>
                );
              })}
            </ToggleGroup>
            <Tooltip>
              <TooltipTrigger
                render={<Button variant="ghost" size="icon-sm" aria-label="Reload preview" onClick={() => setReload((r) => r + 1)} />}
              >
                <RotateCcwIcon />
              </TooltipTrigger>
              <TooltipContent>Reload</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger
                // oxlint-disable-next-line jsx-a11y/anchor-has-content, jsx-a11y/control-has-associated-label
                render={<Button variant="ghost" size="icon-sm" aria-label="Open in new tab" render={<a href={src} target="_blank" rel="noreferrer" />} />}
              >
                <ExternalLinkIcon />
              </TooltipTrigger>
              <TooltipContent>Open in new tab</TooltipContent>
            </Tooltip>
          </div>
        </div>

        <TabsContent value="preview">
          <div className="relative overflow-hidden rounded-2xl border border-outline-variant bg-container p-0 lg:p-3">
            <div
              className="relative mx-auto overflow-hidden rounded-xl bg-background shadow-[var(--shadow-float)] transition-[width] duration-500 ease-(--ease-dx) lg:border lg:border-outline-variant"
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
        </TabsContent>
        <TabsContent value="code" className="flex flex-col gap-3">
          <CommandBlock command={`npx shadcn@latest add @dx/${block.slug}`} />
          <BlockCode slug={block.slug} />
        </TabsContent>
      </Tabs>
    </section>
  );
}

export default function BlocksPage() {
  React.useEffect(() => {
    document.title = "BlocksDX UI";
  }, []);

  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 pb-24 md:px-6">
        <header className="flex flex-col gap-4 py-14 md:py-20">
          <Badge variant="tonal" className="w-fit">
            {blocks.length} blocks
          </Badge>
          <h1 className="max-w-3xl text-4xl font-medium tracking-[-0.03em] text-balance md:text-5xl">Building blocks for the real thing.</h1>
          <p className="max-w-2xl text-lg text-pretty text-muted-foreground">
            Dashboards, auth flows and settings screens composed from DX UI. Preview them at any viewport, then add them to your app with one
            command.
          </p>
          <nav aria-label="Blocks" className="mt-2 flex flex-wrap gap-2">
            {blocks.map((b) => (
              // oxlint-disable-next-line jsx-a11y/anchor-has-content, jsx-a11y/control-has-associated-label
              <Button key={b.slug} variant="outline" size="sm" render={<a href={`#${b.slug}`} />}>
                {b.title}
              </Button>
            ))}
          </nav>
        </header>
        <div className="flex flex-col gap-20">
          {blocks.map((b) => (
            <BlockSection key={b.slug} block={b} />
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
