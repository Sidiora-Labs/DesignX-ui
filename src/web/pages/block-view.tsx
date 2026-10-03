import * as React from "react";
import { useParams } from "wouter";

import { Spinner } from "@/components/ui/spinner";
import { blocks } from "@/docs/catalog";
import { loadBlock } from "@/docs/sources";
import NotFound from "./not-found";

/** Bare, chrome-less render of a single block. Embedded by /blocks in an iframe so fixed/viewport layouts stay contained. */
export default function BlockView() {
  const { slug = "" } = useParams<{ slug: string }>();
  const known = blocks.some((b) => b.slug === slug);
  const [Block, setBlock] = React.useState<React.ComponentType | null>(null);

  React.useEffect(() => {
    let alive = true;
    void loadBlock(slug)?.then((m) => alive && setBlock(() => m.default));
    return () => {
      alive = false;
    };
  }, [slug]);

  React.useEffect(() => {
    document.documentElement.dataset.blockView = "";
    return () => {
      delete document.documentElement.dataset.blockView;
    };
  }, []);

  if (!known) return <NotFound />;
  if (!Block)
    return (
      <div className="flex min-h-svh items-center justify-center text-muted-foreground">
        <Spinner />
      </div>
    );
  return <Block />;
}
