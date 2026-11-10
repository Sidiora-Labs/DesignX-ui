import * as React from "react";
import { useParams } from "wouter";
import { ArrowUpRightIcon } from "lucide-react";

import { catalogBySlug, groupLabels } from "@/docs/catalog";
import { apiDocs } from "@/docs/api";
import { CodeBlock } from "@/docs/code-block";
import { ComponentPreview } from "@/docs/component-preview";
import { DocsHeader, PrevNext, Toc } from "@/docs/docs-layout";
import { InstallBlock } from "@/docs/install-block";
import { PropsTable } from "@/docs/props-table";
import { exampleNames, hasDemo } from "@/docs/sources";
import NotFound from "../not-found";

const tagLink =
  "site-focus inline-flex h-7 items-center gap-1.5 rounded-full border border-hairline px-3 text-[13px] text-pencil transition-colors hover:border-divider hover:text-ink [&_svg]:size-3.5";

const titleCase = (s: string) => s.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());

export default function ComponentDocPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const item = catalogBySlug[slug];
  const api = apiDocs[slug];
  const examples = React.useMemo(() => exampleNames(slug), [slug]);

  React.useEffect(() => {
    if (item) document.title = `${item.title}DX UI`;
  }, [item]);

  if (!item) return <NotFound />;

  const toc = [
    { id: "installation", title: "Installation" },
    ...(api?.usage ? [{ id: "usage", title: "Usage" }] : []),
    ...(examples.length ? [{ id: "examples", title: "Examples" }] : []),
    ...(api?.props?.length ? [{ id: "api", title: "API Reference" }] : []),
  ];

  return (
    <div className="flex gap-12" key={slug}>
      <article className="docs-prose min-w-0 flex-1">
        <DocsHeader title={item.title} description={item.description} isNew={item.isNew} eyebrow={groupLabels[item.group]}>
          {item.base && (
            <a href={`https://base-ui.com/react/components/${item.base}`} target="_blank" rel="noreferrer" className={tagLink}>
              Base UI <ArrowUpRightIcon />
            </a>
          )}
          {item.lib && (
            <a href={item.lib.href} target="_blank" rel="noreferrer" className={tagLink}>
              {item.lib.name} <ArrowUpRightIcon />
            </a>
          )}
          {(item.group === "dx" || item.group === "motion") && (
            <a href="https://motion.dev" target="_blank" rel="noreferrer" className={tagLink}>
              Motion <ArrowUpRightIcon />
            </a>
          )}
        </DocsHeader>

        {hasDemo(slug) && <ComponentPreview name={slug} align={api?.align} minHeight={api?.previewHeight} />}

        <h2 id="installation">Installation</h2>
        <InstallBlock item={item} />

        {api?.usage && (
          <>
            <h2 id="usage">Usage</h2>
            <CodeBlock code={api.usage} />
          </>
        )}

        {examples.length > 0 && (
          <>
            <h2 id="examples">Examples</h2>
            {examples.map((name) => (
              <section key={name} className="mb-12">
                <h3 id={name}>{api?.exampleTitles?.[name.split(".")[1]] ?? titleCase(name.split(".")[1])}</h3>
                <ComponentPreview name={name} minHeight={260} align={api?.align} />
              </section>
            ))}
          </>
        )}

        {api?.props && api.props.length > 0 && (
          <>
            <h2 id="api">API Reference</h2>
            {api.notes && <p>{api.notes}</p>}
            {api.props.map((group) => (
              <section key={group.component} className="mb-8">
                <h3>{group.component}</h3>
                {group.description && <p>{group.description}</p>}
                <PropsTable rows={group.rows} />
              </section>
            ))}
          </>
        )}
        <PrevNext />
      </article>
      <Toc items={toc} />
    </div>
  );
}
