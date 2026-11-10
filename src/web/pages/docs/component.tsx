import * as React from "react";
import { Link, useParams } from "wouter";
import { ArrowUpRightIcon } from "lucide-react";

import { catalog, catalogBySlug, groupLabels } from "@/docs/catalog";
import { KitCard } from "@/landing/kit-card";
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
  const related = React.useMemo(() => {
    if (!item) return [];
    const peers = catalog.filter((c) => c.group === item.group);
    const at = peers.indexOf(item);
    return [1, 2, 3, 4].map((n) => peers[(at + n) % peers.length]).filter((c, i, all) => c && c !== item && all.indexOf(c) === i);
  }, [item]);

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
      <article className="docs-prose min-w-0 max-w-5xl flex-1">
        <DocsHeader
          title={item.title}
          description={item.description}
          crumbs={[
            { title: "Docs", href: "/docs" },
            { title: "Components", href: "/docs/components" },
            ...(item.group === "ui" ? [] : [{ title: groupLabels[item.group], href: `/docs/components?group=${item.group}` }]),
            { title: item.title },
          ]}
        >
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
        {related.length > 0 && (
          <section aria-labelledby="related" className="not-prose mt-20">
            <div className="mb-6 flex items-baseline justify-between gap-4 border-b border-hairline pb-4">
              <h2 id="related" className="text-[28px] leading-[1.14] font-bold tracking-[-0.025em] text-ink">
                More in {groupLabels[item.group]}
              </h2>
              <Link href={`/docs/components?group=${item.group}`} className="site-focus rounded-md text-sm text-pencil hover:text-ink">
                View all
              </Link>
            </div>
            <div className="grid auto-rows-[260px] grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-4">
              {related.map((c) => (
                <KitCard key={c.slug} slug={c.slug} persist={false} />
              ))}
            </div>
          </section>
        )}
        <PrevNext />
      </article>
      <Toc items={toc} />
    </div>
  );
}
