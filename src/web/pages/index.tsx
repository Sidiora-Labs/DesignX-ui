import * as React from "react";
import { Link } from "wouter";
import {
  ArrowRightIcon,
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
import { KitsSection } from "@/landing/kits";
import { BuildCta, Faq, GettingStarted } from "@/landing/sections";

const INSTALL = "npx @sidioralabs/designx-ui@latest init";

function PromptCard() {
  const [thinking, setThinking] = React.useState(true);
  return (
    <div className="relative rounded-[28px]">
      <GlowBorder active={thinking} />
      <div className="relative grid gap-4 rounded-[28px] p-5">
        <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
          <SparklesIcon className="size-4 text-[var(--dx-blue-3)]" />
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
    <Card variant="tonal">
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
        <div className="size-12 rounded-[14px] bg-gradient-to-br from-[var(--dx-blue-3)] to-[var(--dx-purple-3)]" />
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
    <div className={cn("relative flex flex-col rounded-[28px] border border-outline-variant bg-background p-5", className)}>
      {label && <div className="mb-4 text-[11px] font-medium tracking-[0.12em] text-muted-foreground uppercase">{label}</div>}
      {children}
    </div>
  );
}

function Showcase() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [code, setCode] = React.useState("2048");
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div className="grid gap-4">
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
      <div className="grid gap-4">
        <Tile label="Morph panel" className="h-72 justify-between">
          <div className="flex flex-1 items-end justify-center">
            <MorphPanel tabs={morphTabs} />
          </div>
        </Tile>
        <Tile label="Calendar" className="items-center">
          <Calendar mode="single" selected={date} onSelect={setDate} className="p-0" />
        </Tile>
      </div>
      <div className="grid gap-4 md:col-span-2 lg:col-span-1">
        <Tile label="Digit input" className="items-center">
          <DigitInput numeric maxLength={6} value={code} onValueChange={setCode} placeholder="000000" aria-label="Code" />
        </Tile>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Storage <Badge variant="warning">82%</Badge>
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
    document.title = "DX UIDesignX component system";
  }, []);
  const kits = catalog.filter((c) => c.src).length;

  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)] opacity-60" />
          <div className="relative mx-auto max-w-[1200px] px-4 pt-20 pb-14 text-center md:px-6 md:pt-28">
            <Link href="/docs/components/chat-app" className="animate-rise focus-ring mb-7 inline-flex rounded-full">
              <Badge variant="tonal" className="h-7 gap-2 px-3">
                <span className="size-1.5 rounded-full bg-[var(--dx-blue-3)]" /> {kits} new: Agents · Charts · Motion Kit <ArrowRightIcon />
              </Badge>
            </Link>
            <h1
              className="animate-rise mx-auto max-w-4xl text-[clamp(2.75rem,7vw,5.5rem)] leading-[1.02] font-normal tracking-[-0.045em]"
              style={{ animationDelay: "60ms" }}
            >
              The component system
              <br />
              <span className="bg-gradient-to-r from-[var(--dx-blue-4)] via-[var(--dx-purple-3)] to-[var(--dx-pink-4)] bg-clip-text text-transparent">
                for calm interfaces.
              </span>
            </h1>
            <p className="animate-rise mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground" style={{ animationDelay: "120ms" }}>
              {catalog.length - (catalog.length % 10)}+ accessible components on Base UI, Tailwind 4 and Motion. Copy them in, then make them yours.
            </p>
            <div className="animate-rise mt-9 flex flex-wrap items-center justify-center gap-3" style={{ animationDelay: "180ms" }}>
              <Button size="lg" render={<Link href="/docs" />}>
                Get started <ArrowRightIcon />
              </Button>
              <Button size="lg" variant="tonal" render={<Link href="/docs/components/button" />}>
                Browse components
              </Button>
            </div>
            <div
              className="animate-rise mx-auto mt-6 flex w-fit items-center gap-3 rounded-full border border-outline-variant bg-background py-1.5 pr-1.5 pl-4 font-mono text-[13px]"
              style={{ animationDelay: "240ms" }}
            >
              <span className="text-muted-foreground">$</span> {INSTALL}
              <CopyButton value={INSTALL} />
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-[1200px] px-4 pb-24 md:px-6">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4 px-1">
            <div>
              <h2 className="text-2xl font-normal tracking-[-0.02em]">Everything here is live.</h2>
              <p className="mt-1 text-[15px] text-muted-foreground">Click, type and drag. Every tile is built from registry components.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" render={<Link href="/blocks" />}>
                View blocks
              </Button>
              <Button variant="outline" render={<Link href="/themes" />}>
                Themes
              </Button>
            </div>
          </div>
          <div className="rounded-[36px] bg-container p-3 md:p-4">
            <Showcase />
          </div>
        </section>
        <KitsSection />
        <GettingStarted />
        <Faq />
        <BuildCta />
      </main>
      <SiteFooter />
    </div>
  );
}
