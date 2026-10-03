import * as React from "react";
import { useRender } from "@base-ui/react/use-render";
import { mergeProps } from "@base-ui/react/merge-props";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * AnimatedLinkfive underline / highlight hover treatments with an optional
 * arrow. Renders an <a>; pass `render` for your router's Link.
 * Inspired by cursor.com.
 */

const line =
  "before:pointer-events-none before:absolute before:left-0 before:w-full before:bg-current before:content-[''] before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:before:transition-none";

const animatedLinkVariants = cva("group/link focus-ring relative inline-flex w-fit items-center rounded-[2px] text-foreground", {
  variants: {
    variant: {
      /** Draws in from the left, leaves to the right. */
      slide: cn(line, "before:top-[1.25em] before:h-[0.06em] before:origin-right before:scale-x-0 hover:before:origin-left hover:before:scale-x-100 focus-visible:before:origin-left focus-visible:before:scale-x-100"),
      /** Draws in from the right, leaves to the left. */
      reverse: cn(line, "before:top-[1.25em] before:h-[0.06em] before:origin-left before:scale-x-0 hover:before:origin-right hover:before:scale-x-100 focus-visible:before:scale-x-100"),
      /** Grows out from the center. */
      center: cn(line, "before:top-[1.25em] before:h-[0.06em] before:origin-center before:scale-x-0 hover:before:scale-x-100 focus-visible:before:scale-x-100"),
      /** A bar rises from the baseline and inverts the text. */
      highlight: cn(
        "px-[0.25em] before:pointer-events-none before:absolute before:bottom-0 before:left-0 before:z-10 before:h-0 before:w-full before:bg-white before:mix-blend-difference before:transition-[height] before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)] before:content-['']",
        "hover:before:h-full focus-visible:before:h-full",
      ),
      /** A block sweeps across left to right and inverts the text. */
      fill: cn(
        "px-[0.25em] before:pointer-events-none before:absolute before:inset-0 before:z-10 before:origin-left before:scale-x-0 before:bg-white before:mix-blend-difference before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)] before:content-['']",
        "hover:before:scale-x-100 focus-visible:before:scale-x-100",
      ),
    },
  },
  defaultVariants: { variant: "slide" },
});

const arrowMotion = {
  slide: "translate-y-1 group-hover/link:translate-y-0",
  reverse: "translate-y-1 group-hover/link:translate-y-0",
  center: "translate-y-1 group-hover/link:translate-y-0",
  highlight: "translate-y-1 group-hover/link:translate-y-0 group-hover/link:rotate-45",
  fill: "-translate-x-1 rotate-45 group-hover/link:translate-x-0",
} as const;

type AnimatedLinkProps = useRender.ComponentProps<"a"> &
  VariantProps<typeof animatedLinkVariants> & {
    /** Show the ↗ arrow on hover. */
    arrow?: boolean;
  };

function AnimatedLink({ className, variant = "slide", arrow = false, render, children, ...props }: AnimatedLinkProps) {
  const v = variant ?? "slide";
  const content = (
    <>
      {children}
      {arrow && (
        <svg
          aria-hidden
          viewBox="0 0 10 10"
          fill="none"
          className={cn(
            "ml-[0.35em] size-[0.55em] shrink-0 opacity-0 transition-all duration-300 group-hover/link:opacity-100 group-focus-visible/link:opacity-100 motion-reduce:transition-none",
            arrowMotion[v],
          )}
        >
          <path d="M1.004 9.166 9.337.833m0 0v8.333m0-8.333H1.004" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </>
  );
  return useRender({
    defaultTagName: "a",
    render,
    props: mergeProps<"a">(
      { className: cn(animatedLinkVariants({ variant }), className), "data-slot": "animated-link", children: content } as React.ComponentProps<"a">,
      props,
    ),
  });
}

export { AnimatedLink, animatedLinkVariants };
export type { AnimatedLinkProps };
