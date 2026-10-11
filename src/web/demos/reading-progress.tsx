import { useRef } from "react";

import ReadingProgress from "@/components/elements/reading-progress";

export default function ReadingProgressDemo() {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className="relative h-80 w-full max-w-xl overflow-y-auto rounded-2xl bg-muted/40" ref={ref}>
      <ReadingProgress container={ref} position="top" showLabel />
      <article className="space-y-4 p-8 text-sm leading-relaxed text-muted-foreground">
        <h3 className="text-xl font-semibold text-foreground">Scroll this article</h3>
        {Array.from({ length: 8 }, (_, i) => (
          <p key={i}>
            DX UI components are copied into your project, so you own the code. Tune the springs, swap the tokens and
            ship. Every piece respects reduced motion and works with a keyboard.
          </p>
        ))}
      </article>
    </div>
  );
}
