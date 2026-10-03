import * as React from "react";
import { Link } from "wouter";
import { ArrowRightIcon, BotIcon, ChartColumnIcon, WandSparklesIcon } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";
import { EASE_OUT, SPRING_LAYOUT } from "@/lib/ease";
import { Button } from "@/components/ui/button";
import { catalog } from "@/docs/catalog";
import { type CardSize, KitCard } from "./kit-card";

type Kit = {
  id: "agents" | "charts" | "motion";
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  blurb: string;
  first: string;
  cards: [string, CardSize][];
};

const KITS: Kit[] = [
  {
    id: "agents",
    label: "Agents",
    icon: BotIcon,
    blurb: "Chat surfaces, tool calls, approvals and streaming textthe parts every AI product rebuilds.",
    first: "chat-app",
    cards: [
      ["chat-app", "f"],
      ["prompt-input", "w"],
      ["agent-activity", "s"],
      ["tool-approval", "s"],
      ["todo-list", "s"],
      ["file-diff", "s"],
      ["streaming-response", "w"],
    ],
  },
  {
    id: "charts",
    label: "Charts",
    icon: ChartColumnIcon,
    blurb: "Hand-built SVG charts for markets and product analytics. Hover, pin and animate between states.",
    first: "bump-chart",
    cards: [
      ["bump-chart", "f"],
      ["price-target-fan", "w"],
      ["heat-calendar", "s"],
      ["funnel-chart", "s"],
      ["composition-chart", "s"],
      ["liquidity-heatmap", "s"],
      ["returns-calendar", "w"],
    ],
  },
  {
    id: "motion",
    label: "Motion Kit",
    icon: WandSparklesIcon,
    blurb: "Controls, overlays, lists and text effects with springs tuned to feel physical, never bouncy for its own sake.",
    first: "swap",
    cards: [
      ["swap", "f"],
      ["motion-table", "w"],
      ["dock", "s"],
      ["file-tree", "s"],
      ["bloom-menu", "s"],
      ["notification-stack", "s"],
      ["shader-background", "w"],
    ],
  },
];

export function KitsSection() {
  const [active, setActive] = React.useState<Kit["id"]>("agents");
  const reduce = useReducedMotion();
  const kit = KITS.find((k) => k.id === active)!;
  const count = catalog.filter((c) => c.group === active).length;

  return (
    <section aria-labelledby="landing-kits" className="mx-auto max-w-[1200px] px-4 pb-24 md:px-6">
      <div className="mb-7 flex flex-col items-center text-center sm:mb-8">
        <p className="text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">New in DX UI</p>
        <h2 id="landing-kits" className="mt-3 max-w-2xl text-[clamp(1.8rem,7vw,2.75rem)] leading-[1.08] font-normal tracking-[-0.03em] sm:text-[clamp(1.9rem,4vw,2.75rem)]">
          Three new kits.{" "}
          <span className="text-muted-foreground">{catalog.filter((c) => c.src).length} components, all live below.</span>
        </h2>
        <div role="tablist" aria-label="Kits" className="mt-6 grid w-full max-w-full grid-cols-3 rounded-[20px] bg-container p-1 sm:mt-8 sm:inline-flex sm:w-auto sm:rounded-full">
          {KITS.map((k) => {
            const on = k.id === active;
            const Icon = k.icon;
            return (
              <button
                key={k.id}
                type="button"
                role="tab"
                aria-selected={on}
                aria-controls="landing-kit-panel"
                onClick={() => setActive(k.id)}
                className={cn(
                  "focus-ring relative flex h-10 min-w-0 items-center justify-center gap-1.5 rounded-[16px] px-2 text-xs font-medium transition-colors sm:gap-2 sm:rounded-full sm:px-4 sm:text-sm",
                  on ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {on && (
                  <motion.span
                    layoutId="landing-kit-pill"
                    transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
                    className="absolute inset-0 rounded-full bg-background shadow-[0_1px_2px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.04)]"
                  />
                )}
                <Icon className="relative size-4 shrink-0" />
                <span className="relative truncate">{k.label}</span>
                <span className="relative hidden font-mono text-[11px] text-muted-foreground tabular-nums sm:inline">
                  {catalog.filter((c) => c.group === k.id).length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div id="landing-kit-panel" role="tabpanel" aria-label={kit.label}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={kit.id}
            initial={reduce ? false : { opacity: 0, y: 12, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={reduce ? undefined : { opacity: 0, y: -8, filter: "blur(4px)" }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
          >
            <div className="mb-5 flex flex-col justify-between gap-3 px-1 sm:flex-row sm:items-end sm:gap-4">
              <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-[15px]">{kit.blurb}</p>
              <Button variant="outline" className="w-full shrink-0 sm:w-auto" render={<Link href={`/docs/components/${kit.first}`} />}>
                Browse all {count} <ArrowRightIcon />
              </Button>
            </div>
            <div className="grid auto-rows-[240px] grid-flow-dense gap-3 sm:auto-rows-[280px] sm:grid-cols-2 lg:grid-cols-4">
              {kit.cards.map(([slug, size]) => (
                <KitCard key={slug} slug={slug} size={size} />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
