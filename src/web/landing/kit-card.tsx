import * as React from "react";
import { Link } from "wouter";
import { ArrowUpRightIcon } from "lucide-react";
import { useInView } from "motion/react";

import { cn } from "@/lib/utils";
import { catalogBySlug } from "@/docs/catalog";
import { loadDemo } from "@/docs/sources";
import { PreviewFit } from "./preview-fit";

export type CardSize = "s" | "w" | "f";

const SPAN: Record<CardSize, string> = {
  s: "",
  w: "sm:col-span-2",
  f: "sm:col-span-2 sm:row-span-2",
};

class Boundary extends React.Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function LazyDemo({ slug }: { slug: string }) {
  const [Comp, setComp] = React.useState<React.ComponentType | null>(null);
  React.useEffect(() => {
    let live = true;
    void loadDemo(slug)?.then((m) => live && setComp(() => m.default));
    return () => {
      live = false;
    };
  }, [slug]);
  return Comp ? <Comp /> : null;
}

export function KitCard({ slug, size = "s" }: { slug: string; size?: CardSize }) {
  const item = catalogBySlug[slug];
  const ref = React.useRef<HTMLElement>(null);
  const seen = useInView(ref, { once: true, margin: "200px 0px" });
  const [hover, setHover] = React.useState(false);
  if (!item) return null;
  const feature = size === "f";

  return (
    <article
      ref={ref}
      className={cn("group/card relative h-full min-h-[220px] sm:min-h-[260px]", SPAN[size])}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
    >
      <Link
        href={`/docs/components/${slug}`}
        aria-label={`View ${item.title}`}
        className="focus-ring absolute inset-0 z-20 rounded-[28px]"
      />
      <div className="relative flex h-full flex-col overflow-hidden rounded-[28px] border border-outline-variant bg-container transition-colors duration-300 group-hover/card:border-border-strong">
        {seen ? (
          <PreviewFit hover={hover} maxScale={feature ? 1 : 0.8}>
            <Boundary>
              <LazyDemo slug={slug} />
            </Boundary>
          </PreviewFit>
        ) : (
          <div aria-hidden="true" className="m-2 mb-0 flex-1 rounded-[22px] bg-background" />
        )}
        <div className="flex shrink-0 items-center justify-between gap-3 px-5 py-4">
          <div className="min-w-0">
            <h3 className={cn("truncate font-medium tracking-[-0.01em]", feature ? "text-[17px]" : "text-[15px]")}>{item.title}</h3>
            <p className="mt-0.5 line-clamp-1 text-[13px] text-muted-foreground">{item.description}</p>
          </div>
          <ArrowUpRightIcon className="size-4 shrink-0 -translate-x-1 text-muted-foreground opacity-0 transition-[opacity,transform] duration-300 group-hover/card:translate-x-0 group-hover/card:opacity-100" />
        </div>
      </div>
    </article>
  );
}
