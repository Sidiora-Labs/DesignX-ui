import * as React from "react";
import { useParams } from "wouter";

import { guides } from "@/docs/catalog";
import { DocsHeader, PrevNext, Toc } from "@/docs/docs-layout";
import { CliGuide, DarkModeGuide, InstallationGuide, IntroductionGuide } from "@/docs/guides/getting-started";
import { MotionGuide, ThemingGuide, TokensGuide, TypographyGuide } from "@/docs/guides/design";
import NotFound from "../not-found";

const content: Record<string, React.ComponentType> = {
  introduction: IntroductionGuide,
  installation: InstallationGuide,
  cli: CliGuide,
  theming: ThemingGuide,
  tokens: TokensGuide,
  typography: TypographyGuide,
  motion: MotionGuide,
  "dark-mode": DarkModeGuide,
};

export default function GuidePage() {
  const { guide = "introduction" } = useParams<{ guide?: string }>();
  const page = guides.find((g) => g.slug === guide);
  const Body = content[guide];
  const ref = React.useRef<HTMLDivElement>(null);
  const [toc, setToc] = React.useState<{ id: string; title: string }[]>([]);

  React.useEffect(() => {
    if (page) document.title = `${page.title}DX UI`;
    const hs = ref.current?.querySelectorAll("h2[id]") ?? [];
    setToc([...hs].map((h) => ({ id: h.id, title: h.textContent ?? "" })));
  }, [page]);

  if (!page || !Body) return <NotFound />;

  return (
    <div className="flex gap-12" key={guide}>
      <article className="docs-prose min-w-0 flex-1 max-w-3xl">
        <DocsHeader title={page.title} description={page.description} eyebrow="Getting started" />
        <div ref={ref}>
          <Body />
        </div>
        <PrevNext />
      </article>
      <Toc items={toc} />
    </div>
  );
}
