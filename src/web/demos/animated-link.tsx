import { AnimatedLink } from "@/components/dx/animated-link";

const variants = ["slide", "reverse", "center", "highlight", "fill"] as const;

export default function AnimatedLinkDemo() {
  return (
    <div className="grid justify-items-center gap-5 text-2xl font-medium">
      {variants.map((v) => (
        <AnimatedLink key={v} variant={v} arrow href="mailto:hello@designx.dev">
          hello@designx.dev
        </AnimatedLink>
      ))}
    </div>
  );
}
