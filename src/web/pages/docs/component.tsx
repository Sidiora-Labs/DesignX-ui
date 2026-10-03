import * as React from "react";
import { useParams } from "wouter";
import { ArrowUpRightIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { catalogBySlug, groupLabels } from "@/docs/catalog";
import { apiDocs } from "@/docs/api";
import { CodeBlock } from "@/docs/code-block";
import { ComponentPreview } from "@/docs/component-preview";
import { DocsHeader, PrevNext, Toc } from "@/docs/docs-layout";
import { InstallBlock } from "@/docs/install-block";
import { PropsTable } from "@/docs/props-table";
import { exampleNames, hasDemo } from "@/docs/sources";
import NotFound from "../not-found";

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
            // oxlint-disable-next-line jsx-a11y/anchor-has-content, jsx-a11y/control-has-associated-label
            <Badge variant="tonal" render={<a href={`https://base-ui.com/react/components/${item.base}`} target="_blank" rel="noreferrer" />}>
              Base UI <ArrowUpRightIcon />
            </Badge>
          )}
          {item.lib && (
            // oxlint-disable-next-line jsx-a11y/anchor-has-content, jsx-a11y/control-has-associated-label
            <Badge variant="tonal" render={<a href={item.lib.href} target="_blank" rel="noreferrer" />}>
              {item.lib.name} <ArrowUpRightIcon />
            </Badge>
          )}
          {(item.group === "dx" || item.group === "motion") && (
            // oxlint-disable-next-line jsx-a11y/anchor-has-content, jsx-a11y/control-has-associated-label
            <Badge variant="tonal" render={<a href="https://motion.dev" target="_blank" rel="noreferrer" />}>
              Motion <ArrowUpRightIcon />
            </Badge>
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
              <section key={name} className="mb-10">
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
