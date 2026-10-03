import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const typographyVariants = cva("text-foreground", {
  variants: {
    variant: {
      display: "text-[clamp(2.75rem,6vw,4.5rem)] leading-[1.02] font-normal tracking-[-0.035em]",
      h1: "text-[clamp(2.25rem,4vw,3rem)] leading-[1.08] font-normal tracking-[-0.03em]",
      h2: "text-[2rem] leading-[1.15] font-normal tracking-[-0.02em]",
      h3: "text-2xl leading-tight font-medium tracking-[-0.015em]",
      h4: "text-lg leading-snug font-medium tracking-[-0.01em]",
      lead: "text-lg leading-relaxed text-muted-foreground",
      p: "text-[15px] leading-7",
      large: "text-base font-medium",
      small: "text-[13px] leading-snug font-medium",
      muted: "text-sm text-muted-foreground",
      eyebrow: "text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase",
      code: "rounded-xs bg-container px-1.5 py-0.5 font-mono text-[0.88em]",
      blockquote: "border-l-2 border-foreground pl-5 text-[17px] leading-relaxed italic",
    },
  },
  defaultVariants: { variant: "p" },
});

const tagMap = {
  display: "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  lead: "p",
  p: "p",
  large: "div",
  small: "small",
  muted: "p",
  eyebrow: "span",
  code: "code",
  blockquote: "blockquote",
} as const;

type TypographyProps = React.HTMLAttributes<HTMLElement> &
  VariantProps<typeof typographyVariants> & { as?: React.ElementType };

function Typography({ className, variant = "p", as, ...props }: TypographyProps) {
  const Comp = (as ?? tagMap[variant ?? "p"]) as React.ElementType;
  return <Comp data-slot="typography" data-variant={variant} className={cn(typographyVariants({ variant }), className)} {...props} />;
}

export { Typography, typographyVariants };
