import * as React from "react";
import { Link } from "wouter";

import { SegmentedPill, type Segment } from "@/site/ui";
import { CodeBlock } from "./code-block";
import { catalogBySlug, type CatalogItem } from "./catalog";
import type { ItemFile } from "./item-files";
import { loadComponentSource, loadItemGraph, parseDependencies } from "./sources";

type Method = "cli" | "shadcn" | "manual";
const METHODS: Segment<Method>[] = [
  { value: "cli", label: "dx-ui CLI" },
  { value: "shadcn", label: "shadcn CLI" },
  { value: "manual", label: "Manual" },
];

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
      void loadComponentSource(group).then((code) => {
        if (live) setLoaded({ files: [{ path: `components/${group}/${slug}.tsx`, content: code }], requires: [] });
      });
    }
    return () => {
      live = false;
    };
  }, [group, slug, src]);
  const [method, setMethod] = React.useState<Method>("cli");
  const uid = React.useId();
  const deps = [...new Set(loaded.files.flatMap((f) => parseDependencies(f.content)))].sort();

  return (
    <div className="not-prose flex flex-col gap-3">
      <SegmentedPill id={uid} label="Install method" tone="quiet" size="sm" items={METHODS} value={method} onValueChange={setMethod} className="self-start" />
      {method === "cli" && <CodeBlock code={`npx @sidioralabs/designx-ui@latest add ${slug}`} lang="bash" />}
      {method === "shadcn" && (
      <div>
        <CodeBlock code={`npx shadcn@latest add @dx/${slug}`} lang="bash" />
        <p className="mt-3 text-sm text-pencil">
          Requires the <code className="rounded-md bg-tile px-1.5 py-0.5 font-code text-[12px] text-ink">@dx</code> registry in your components.jsonsee{" "}
          <Link href="/docs/cli" className="text-ink underline decoration-divider underline-offset-4 hover:decoration-ink">CLI</Link>.
        </p>
      </div>
      )}
      {method === "manual" && (
      <div className="flex flex-col gap-6 pt-1">
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
            <p className="mb-3 text-sm text-pencil">
              Also requires{" "}
              {loaded.requires.map((d, i) => (
                <React.Fragment key={d}>
                  {i > 0 && ", "}
                  <Link href={`/docs/components/${d}`} className="text-ink underline decoration-divider underline-offset-4 hover:decoration-ink">
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
      </div>
      )}
    </div>
  );
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-3 text-sm font-semibold text-ink">
      <span className="flex size-6 items-center justify-center rounded-full bg-tile font-code text-[11px] font-normal">{n}</span>
      {children}
    </div>
  );
}
