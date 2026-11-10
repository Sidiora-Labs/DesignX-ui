import * as React from "react";
import { Link } from "wouter";
import { ArrowRightIcon, BotIcon, ChartColumnIcon, ComponentIcon, WandSparklesIcon } from "lucide-react";

import { catalog } from "@/docs/catalog";
import { btn, type Segment } from "@/site/ui";
import { type CardSize, KitCard } from "./kit-card";

export type ShowcaseId = "components" | "agents" | "charts" | "motion";

type Kit = {
  id: Exclude<ShowcaseId, "components">;
  blurb: string;
  first: string;
  cards: [string, CardSize][];
};

const KITS: Kit[] = [
  {
    id: "agents",
    blurb: "Chat surfaces, tool calls, approvals and streaming text — the parts every AI product rebuilds.",
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

const count = (group: string) => catalog.filter((c) => c.group === group).length;

/** Segments for the hero pill. */
export const SHOWCASE_SEGMENTS: Segment<ShowcaseId>[] = [
  { value: "components", label: "Components", icon: ComponentIcon, hint: count("ui") + count("dx") },
  { value: "agents", label: "Agents", icon: BotIcon, hint: count("agents") },
  { value: "charts", label: "Charts", icon: ChartColumnIcon, hint: count("charts") },
  { value: "motion", label: "Motion", icon: WandSparklesIcon, hint: count("motion") },
];

export const SHOWCASE_BLURB: Record<ShowcaseId, { text: string; href: string; cta: string }> = {
  components: {
    text: "Click, type and drag. Every tile is built from registry components.",
    href: "/docs/components/button",
    cta: "Browse components",
  },
  ...(Object.fromEntries(
    KITS.map((k) => [k.id, { text: k.blurb, href: `/docs/components/${k.first}`, cta: `Browse all ${count(k.id)}` }]),
  ) as Record<Kit["id"], { text: string; href: string; cta: string }>),
};

export function KitGrid({ id }: { id: Kit["id"] }) {
  const kit = KITS.find((k) => k.id === id)!;
  return (
    <div className="grid auto-rows-[240px] grid-flow-dense gap-3 sm:auto-rows-[280px] sm:grid-cols-2 lg:grid-cols-4">
      {kit.cards.map(([slug, size]) => (
        <KitCard key={slug} slug={slug} size={size} />
      ))}
    </div>
  );
}

export function ShowcaseCaption({ id }: { id: ShowcaseId }) {
  const b = SHOWCASE_BLURB[id];
  return (
    <div className="mt-6 flex flex-col justify-between gap-4 px-1 sm:flex-row sm:items-center">
      <p className="max-w-xl text-sm leading-[1.43] text-pencil">{b.text}</p>
      <Link href={b.href} className={btn({ variant: "ghost", className: "w-full sm:w-auto" })}>
        {b.cta} <ArrowRightIcon />
      </Link>
    </div>
  );
}
