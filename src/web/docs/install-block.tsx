import * as React from "react";
import { Link } from "wouter";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock } from "./code-block";
import { catalogBySlug, type CatalogItem } from "./catalog";
import type { ItemFile } from "./item-files";
import { loadComponentSource, loadItemGraph, parseDependencies } from "./sources";

type Loaded = { files: ItemFile[]; requires: string[] };

export function InstallBlock({ item }: { item: CatalogItem }) {
  const { slug, group, src } = item;
  const [loaded, setLoaded] = React.useState<Loaded>({ files: [], requires: [] });
  React.useEffect(() => {
    let live = true;
    if (src) {
      void loadItemGraph(src).then((g) => {
        if (live && g) setLoaded({ files: [...g.files, ...g.libs], requires: g.deps.filter((d) => catalogBySlug[d]) });
      });
    } else {
      void loadComponentSource(group as "ui" | "dx", slug).then((code) => {
        if (live) setLoaded({ files: [{ path: `components/${group}/${slug}.tsx`, content: code }], requires: [] });
      });
    }
    return () => {
      live = false;
    };
  }, [group, slug, src]);
  const deps = [...new Set(loaded.files.flatMap((f) => parseDependencies(f.content)))].sort();

  return (
    <Tabs defaultValue="cli">
      <TabsList variant="line">
        <TabsTrigger value="cli">dx-ui CLI</TabsTrigger>
        <TabsTrigger value="shadcn">shadcn CLI</TabsTrigger>
        <TabsTrigger value="manual">Manual</TabsTrigger>
      </TabsList>
      <TabsContent value="cli" className="pt-2">
        <CodeBlock code={`npx @sidioralabs/designx-ui@latest add ${slug}`} lang="bash" />
      </TabsContent>
      <TabsContent value="shadcn" className="pt-2">
        <CodeBlock code={`npx shadcn@latest add @dx/${slug}`} lang="bash" />
        <p className="mt-3 text-[13px] text-muted-foreground">
          Requires the <code className="rounded-xs bg-container-high px-1 font-mono text-[12px]">@dx</code> registry in your components.jsonsee{" "}
          <Link href="/docs/cli" className="text-foreground underline underline-offset-4">CLI</Link>.
        </p>
      </TabsContent>
      <TabsContent value="manual" className="flex flex-col gap-5 pt-2">
        {deps.length > 0 && (
          <div>
            <Step n={1}>Install the dependencies.</Step>
            <CodeBlock code={`npm install ${deps.join(" ")}`} lang="bash" />
          </div>
        )}
        <div>
          <Step n={deps.length > 0 ? 2 : 1}>
            Copy and paste the following {loaded.files.length > 1 ? `${loaded.files.length} files` : "code"} into your project.
          </Step>
          {loaded.requires.length > 0 && (
            <p className="mb-3 text-[13px] text-muted-foreground">
              Also requires{" "}
              {loaded.requires.map((d, i) => (
                <React.Fragment key={d}>
                  {i > 0 && ", "}
                  <Link href={`/docs/components/${d}`} className="text-foreground underline underline-offset-4">
                    {catalogBySlug[d].title}
                  </Link>
                </React.Fragment>
              ))}
              .
            </p>
          )}
          <div className="flex flex-col gap-3">
            {loaded.files.length === 0 && <CodeBlock code="// loading…" />}
            {loaded.files.map((f) => (
              <CodeBlock key={f.path} code={f.content} title={f.path} collapsible />
            ))}
          </div>
        </div>
        <div>
          <Step n={deps.length > 0 ? 3 : 2}>Update the import paths to match your project setup.</Step>
        </div>
      </TabsContent>
    </Tabs>
  );
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-3 text-[14px] font-medium">
      <span className="flex size-6 items-center justify-center rounded-full bg-container-high font-mono text-xs">{n}</span>
      {children}
    </div>
  );
}
