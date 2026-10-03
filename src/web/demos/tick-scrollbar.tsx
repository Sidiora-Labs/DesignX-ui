import * as React from "react";

import { TickScrollbar } from "@/components/dx/tick-scrollbar";

const sections = [
  { title: "Who we are", code: `const home = "Welcome"` },
  { title: "What we do", code: `const about = "Our story"` },
  { title: "How we do it", code: `const services = ["Web", "Mobile"]` },
  { title: "Our projects", code: `const portfolio = projects.map()` },
  { title: "Our team", code: `const team = members.join()` },
  { title: "Pricing", code: `const pricing = plans.reduce()` },
  { title: "FAQ", code: `const faq = questions.find()` },
];

export default function TickScrollbarDemo() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState(0);

  React.useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
      },
      { root, rootMargin: "-40% 0px -40% 0px" },
    );
    root.querySelectorAll("[data-index]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const s = sections[active];
  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-3xl bg-container">
      <div ref={ref} className="h-full overflow-y-auto px-6 py-10 scrollbar-none">
        {sections.map((sec, i) => (
          <section key={sec.title} data-index={i} className="mx-auto max-w-md py-10">
            <h3 className="mb-2 text-2xl font-semibold tracking-tight text-foreground/20">
              #{i + 1} {sec.title}
            </h3>
            <p className="text-sm leading-6 text-muted-foreground">
              Every section reports itself as it crosses the middle of the viewport, and the card above the ruler swaps to match. Drag the
              red handle, click anywhere on the ruler, or focus it and use the arrow keys to seek.
            </p>
          </section>
        ))}
      </div>
      <div className="absolute right-4 bottom-4">
        <TickScrollbar
          container={ref}
          cardKey={active}
          card={
            <div className="font-mono text-[13px]">
              <div className="mb-1 text-xs text-muted-foreground">{`// ${s.title}`}</div>
              <span className="text-[var(--dx-red-3)]">{s.code.split("=")[0]}</span>={s.code.split("=")[1]}
            </div>
          }
        />
      </div>
    </div>
  );
}
