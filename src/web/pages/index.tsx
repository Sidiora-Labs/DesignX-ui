import * as React from "react";
import { Link } from "wouter";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowUpIcon,
  BellIcon,
  CalendarIcon,
  LayersIcon,
  MessageCircleIcon,
  MinusIcon,
  MusicIcon,
  PaperclipIcon,
  PlusIcon,
  SparklesIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { GlowBorder } from "@/components/dx/glow-border";
import { MorphPanel } from "@/components/dx/expanding-tabs";
import { NumberFlow } from "@/components/dx/number-flow";
import { DigitInput } from "@/components/dx/digit-input";
import { CopyIcon, SendIcon, TrashIcon, BellIcon as AnimatedBell, LockIcon, GlobeIcon } from "@/components/dx/animated-icons";
import { Avatar, AvatarFallback, AvatarGroup } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CopyButton } from "@/docs/copy-button";
import { SiteFooter } from "@/docs/site-footer";
import { SiteHeader } from "@/docs/site-header";
import { catalog } from "@/docs/catalog";
import { KitGrid, SHOWCASE_SEGMENTS, ShowcaseCaption, type ShowcaseId } from "@/landing/kits";
import { BlocksShowcase, BuildCta, Faq, GettingStarted, LiveDemoLink, StackStrip } from "@/landing/sections";
import { btn, SegmentedPill } from "@/site/ui";
import { EASE_OUT } from "@/lib/ease";

const INSTALL = "npx @sidioralabs/designx-ui@latest init";

function PromptCard() {
  const [thinking, setThinking] = React.useState(false);
  return (
    <div className="relative rounded-[20px] bg-background">
      <GlowBorder active={thinking} />
      <div className="relative grid gap-4 rounded-[20px] p-5">
        <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
          <SparklesIcon className="size-4" />
          {thinking ? "Thinking…" : "Ready"}
        </div>
        <p className="text-[15px] leading-relaxed">Draft a launch plan for DX UI with milestones for docs, registry and the CLI.</p>
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            <Button variant="ghost" size="icon-sm" aria-label="Attach">
              <PaperclipIcon />
            </Button>
            <Button variant="ghost" size="icon-sm" aria-label="Layers">
              <LayersIcon />
            </Button>
          </div>
          <Button size="icon-sm" aria-label={thinking ? "Stop" : "Send"} onClick={() => setThinking((t) => !t)}>
            {thinking ? <span className="size-2.5 rounded-[2px] bg-current" /> : <ArrowUpIcon />}
          </Button>
        </div>
      </div>
    </div>
  );
}

function PricingCard() {
  const [seats, setSeats] = React.useState(12);
  const [yearly, setYearly] = React.useState(true);
  const price = seats * (yearly ? 16 : 20);
  return (
    <Card className="rounded-[20px] border-0 shadow-none">
      <CardHeader>
        <CardTitle>Team plan</CardTitle>
        <CardDescription>Every digit animates into place.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5">
        <div className="flex items-baseline gap-1">
          <NumberFlow value={price} prefix="$" className="text-5xl tracking-[-0.03em]" />
          <span className="text-sm text-muted-foreground">/ mo</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon-sm" aria-label="Remove seat" onClick={() => setSeats((s) => Math.max(1, s - 1))}>
              <MinusIcon />
            </Button>
            <span className="w-16 text-center text-sm tabular-nums">{seats} seats</span>
            <Button variant="outline" size="icon-sm" aria-label="Add seat" onClick={() => setSeats((s) => s + 1)}>
              <PlusIcon />
            </Button>
          </div>
          <Label className="gap-2 text-[13px]">
            <Switch size="sm" checked={yearly} onCheckedChange={setYearly} /> Yearly
          </Label>
        </div>
      </CardContent>
    </Card>
  );
}

const morphTabs = [
  {
    title: "Today",
    icon: CalendarIcon,
    content: (
      <div className="grid gap-0.5 text-sm">
        {[
          ["Design review", "10:00"],
          ["Registry launch", "14:30"],
        ].map(([t, m]) => (
          <div key={t} className="flex justify-between rounded-[18px] px-3 py-2.5 hover:bg-container">
            <span className="font-medium">{t}</span>
            <span className="text-xs text-muted-foreground">{m}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: "Inbox",
    icon: MessageCircleIcon,
    content: <div className="p-3 text-sm text-muted-foreground">3 new messages from the design team.</div>,
  },
  {
    title: "Music",
    icon: MusicIcon,
    content: (
      <div className="flex items-center gap-3 p-2">
        <div className="grid size-12 place-items-center rounded-[14px] bg-container-higher"><MusicIcon className="size-4 text-muted-foreground" /></div>
        <div className="text-sm">
          <div className="font-medium">Midnight City</div>
          <div className="text-xs text-muted-foreground">M83</div>
        </div>
      </div>
    ),
  },
];

function Tile({ className, children, label }: { className?: string; children: React.ReactNode; label?: string }) {
  return (
    <div className={cn("relative flex flex-col rounded-[20px] bg-background p-5", className)}>
      {label && <div className="mb-4 font-code text-[11px] tracking-[0.06em] text-pencil uppercase">{label}</div>}
      {children}
    </div>
  );
}

function Showcase() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [code, setCode] = React.useState("2048");
  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      <div className="grid gap-3">
        <PromptCard />
        <PricingCard />
        <Tile label="Toggle group">
          <ToggleGroup defaultValue={["week"]} className="w-full">
            {["Day", "Week", "Month", "Year"].map((v) => (
              <ToggleGroupItem key={v} value={v.toLowerCase()} className="flex-1">
                {v}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </Tile>
      </div>
      <div className="grid gap-3">
        <Tile label="Morph panel" className="h-72 justify-between">
          <div className="flex flex-1 items-end justify-center">
            <MorphPanel tabs={morphTabs} />
          </div>
        </Tile>
        <Tile label="Calendar" className="items-center">
          <Calendar mode="single" selected={date} onSelect={setDate} className="p-0" />
        </Tile>
      </div>
      <div className="grid gap-3 md:col-span-2 lg:col-span-1">
        <Tile label="Digit input" className="items-center">
          <DigitInput numeric maxLength={6} value={code} onValueChange={setCode} placeholder="000000" aria-label="Code" />
        </Tile>
        <Card className="rounded-[20px] border-0 shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Storage <Badge variant="outline">82%</Badge>
            </CardTitle>
            <CardDescription>41 GB of 50 GB used</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5">
            <Progress value={82} />
            <div className="grid gap-3">
              <Label>Auto-archive after</Label>
              <Slider defaultValue={30} max={90} />
            </div>
            <div className="flex items-center justify-between">
              <AvatarGroup>
                {["AL", "GH", "AT", "KJ"].map((i) => (
                  <Avatar key={i} className="size-8">
                    <AvatarFallback>{i}</AvatarFallback>
                  </Avatar>
                ))}
              </AvatarGroup>
              <Button variant="tonal" size="sm">
                <BellIcon /> Notify team
              </Button>
            </div>
          </CardContent>
        </Card>
        <Tile label="Animated icons">
          <div className="flex flex-wrap gap-1">
            <CopyIcon text={INSTALL} />
            <SendIcon />
            <TrashIcon />
            <AnimatedBell />
            <LockIcon />
            <GlobeIcon />
          </div>
        </Tile>
      </div>
    </div>
  );
}

export default function Index() {
  React.useEffect(() => {
    document.title = "DX UI — DesignX component system";
  }, []);
  const [view, setView] = React.useState<ShowcaseId>("components");
  const reduce = useReducedMotion();
  const total = catalog.length - (catalog.length % 10);

  return (
    <div className="site flex min-h-svh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-[1200px] px-4 pt-16 text-center md:px-6 md:pt-24">
          <div className="animate-rise flex justify-center">
            <SegmentedPill
              id="hero"
              label="Showcase"
              items={SHOWCASE_SEGMENTS}
              value={view}
              onValueChange={setView}
              controls="showcase"
              className="max-sm:w-full max-sm:[&_svg]:hidden max-sm:justify-between max-sm:[&>button]:px-2.5 max-sm:[&>button]:text-[13px]"
            />
          </div>
          <h1
            className="animate-rise mx-auto mt-12 max-w-5xl text-[clamp(2.75rem,10vw,6rem)] leading-none font-bold tracking-[-0.05em] text-balance text-ink md:mt-16"
            style={{ animationDelay: "60ms" }}
          >
            The component system for calm interfaces.
          </h1>
          <p
            className="animate-rise mx-auto mt-8 max-w-xl text-lg leading-[1.33] tracking-[-0.025em] text-pretty text-pencil"
            style={{ animationDelay: "120ms" }}
          >
            {total}+ accessible components on Base UI, Tailwind 4 and Motion. Copy them in, then make them yours.
          </p>
          <div className="animate-rise mt-8 flex flex-col items-stretch justify-center gap-2 sm:flex-row sm:items-center" style={{ animationDelay: "180ms" }}>
            <Link href="/docs" className={btn({ size: "lg", className: "w-full sm:w-auto" })}>
              Start building
            </Link>
            <LiveDemoLink href="#showcase" />
          </div>
          <div
            className="animate-rise mx-auto mt-8 flex w-full max-w-full items-center gap-3 font-code text-[13px] tracking-[-0.025em] text-pencil sm:w-fit"
            style={{ animationDelay: "240ms" }}
          >
            <span className="shrink-0 text-faint">$</span>
            <code className="min-w-0 flex-1 text-left break-all sm:flex-none sm:break-normal">{INSTALL}</code>
            <CopyButton value={INSTALL} className="shrink-0" />
          </div>
        </section>

        <section id="showcase" role="tabpanel" aria-label="Live showcase" className="mx-auto max-w-[1200px] scroll-mt-24 px-4 pt-16 md:px-6">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={view}
              initial={reduce ? false : { opacity: 0, y: 12, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={reduce ? undefined : { opacity: 0, y: -8, filter: "blur(4px)" }}
              transition={{ duration: 0.3, ease: EASE_OUT }}
            >
              {view === "components" ? (
                <div className="dx-scope rounded-3xl bg-tile p-3">
                  <Showcase />
                </div>
              ) : (
                <KitGrid id={view} />
              )}
              <ShowcaseCaption id={view} />
            </motion.div>
          </AnimatePresence>
        </section>

        <StackStrip />
        <GettingStarted />
        <BlocksShowcase />
        <Faq />
        <BuildCta />
      </main>
      <SiteFooter />
    </div>
  );
}
