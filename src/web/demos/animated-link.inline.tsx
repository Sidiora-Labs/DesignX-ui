import { Link } from "wouter";

import { AnimatedLink } from "@/components/dx/animated-link";

export default function AnimatedLinkInline() {
  return (
    <p className="max-w-md text-center text-[15px] leading-7 text-muted-foreground">
      Read the{" "}
      <AnimatedLink render={<Link href="/docs/installation" />} className="font-medium">
        installation guide
      </AnimatedLink>
      , browse the{" "}
      <AnimatedLink variant="center" href="https://github.com" target="_blank" rel="noreferrer" arrow className="font-medium">
        source on GitHub
      </AnimatedLink>
      , or pick a{" "}
      <AnimatedLink render={<Link href="/themes" />} variant="reverse" className="font-medium">
        theme
      </AnimatedLink>
      .
    </p>
  );
}
