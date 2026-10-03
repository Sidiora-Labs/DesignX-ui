import * as React from "react";
import { CheckIcon, SparklesIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock, CommandBlock } from "@/docs/code-block";
import { CopyButton } from "@/docs/copy-button";
import { SiteFooter } from "@/docs/site-footer";
import { SiteHeader } from "@/docs/site-header";

type Preset = { id: string; title: string; mode: "light" | "dark"; accent: "ink" | "dx-gradient"; note: string };

const presets: Preset[] = [
  { id: "light", title: "Light", mode: "light", accent: "ink", note: "Default. Ink primary on white." },
  { id: "dark", title: "Dark", mode: "dark", accent: "ink", note: "Near-black #121317 with a tonal ladder." },
  { id: "dx-gradient", title: "DX Gradient", mode: "light", accent: "dx-gradient", note: "Gradient primary, blue focus ring." },
  { id: "dx-gradient-dark", title: "DX Gradient dark", mode: "dark", accent: "dx-gradient", note: "The AI-moment palette after hours." },
];

const scopeClass = (p: Pick<Preset, "mode" | "accent">) => cn(p.mode, p.accent === "dx-gradient" && "accent-dx-gradient");

function MiniUI() {
  return (
    <div className="flex flex-col gap-3">
      <Card variant="tonal" className="gap-3 py-4 [&>*]:px-4">
        <CardHeader>
          <CardTitle className="text-sm">Storage</CardTitle>
          <CardDescription className="text-xs">68.4 GB of 100 GB used</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Progress value={68} />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            Auto backup
            <Switch size="sm" defaultChecked aria-label="Auto backup" />
          </div>
        </CardContent>
      </Card>
      <Input placeholder="Ask anything…" className="h-9" />
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm">
          <SparklesIcon />
          Generate
        </Button>
        <Button size="sm" variant="tonal">
          Draft
        </Button>
        <Button size="sm" variant="outline">
          Cancel
        </Button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <Badge variant="success">Live</Badge>
        <Badge variant="info">Beta</Badge>
        <Badge variant="warning">Pending</Badge>
        <Badge variant="destructive">Failed</Badge>
      </div>
    </div>
  );
}

function PresetCard({ preset }: { preset: Preset }) {
  const { resolvedTheme, accent, setTheme, setAccent } = useTheme();
  const active = resolvedTheme === preset.mode && accent === preset.accent;
  return (
    <div className="flex flex-col gap-3">
      <div className={cn(scopeClass(preset), "rounded-2xl border border-border bg-background p-4 text-foreground")}>
        <MiniUI />
      </div>
      <div className="flex items-start justify-between gap-3 px-1">
        <div>
          <div className="text-sm font-medium">{preset.title}</div>
          <div className="text-xs text-muted-foreground">{preset.note}</div>
        </div>
        <Button
          size="xs"
          variant={active ? "tonal" : "outline"}
          onClick={() => {
            setTheme(preset.mode);
            setAccent(preset.accent);
          }}
        >
          {active ? <CheckIcon /> : null}
          {active ? "Applied" : "Apply"}
        </Button>
      </div>
    </div>
  );
}

const tokenGroups: { title: string; tokens: string[] }[] = [
  { title: "Surface", tokens: ["background", "container", "container-high", "container-higher", "container-highest", "card", "popover"] },
  { title: "Content", tokens: ["foreground", "muted-foreground", "primary", "primary-foreground", "secondary", "accent"] },
  { title: "Lines", tokens: ["border", "outline-variant", "input", "ring", "overlay"] },
  {
    title: "Status",
    tokens: ["destructive", "destructive-container", "success", "success-container", "warning", "warning-container", "info", "info-container"],
  },
  { title: "Charts", tokens: ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"] },
  { title: "Sidebar", tokens: ["sidebar", "sidebar-foreground", "sidebar-primary", "sidebar-accent", "sidebar-border"] },
];

function readTokens(el: HTMLElement) {
  const cs = getComputedStyle(el);
  const next: Record<string, string> = {};
  for (const g of tokenGroups) for (const t of g.tokens) next[t] = cs.getPropertyValue(`--${t}`).trim();
  return next;
}

function TokenExplorer() {
  const [mode, setMode] = React.useState<"light" | "dark">("light");
  const [accent, setAccent] = React.useState<"ink" | "dx-gradient">("ink");
  const ref = React.useRef<HTMLDivElement>(null);
  const [values, setValues] = React.useState<Record<string, string>>({});
  React.useEffect(() => {
    if (ref.current) setValues(readTokens(ref.current));
  }, [mode, accent]);

  return (
    <section id="tokens" className="scroll-mt-20">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-medium tracking-tight">Tokens</h2>
          <p className="mt-1 text-sm text-muted-foreground">Every color variable, resolved for the selected scheme. Click a value to copy it.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Tabs value={mode} onValueChange={(v) => setMode(v as "light" | "dark")}>
            <TabsList>
              <TabsTrigger value="light">Light</TabsTrigger>
              <TabsTrigger value="dark">Dark</TabsTrigger>
            </TabsList>
          </Tabs>
          <Tabs value={accent} onValueChange={(v) => setAccent(v as "ink" | "dx-gradient")}>
            <TabsList>
              <TabsTrigger value="ink">Ink</TabsTrigger>
              <TabsTrigger value="dx-gradient">DX Gradient</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      <div ref={ref} className={cn(scopeClass({ mode, accent }), "rounded-2xl border border-border bg-background p-4 text-foreground md:p-6")}>
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {tokenGroups.map((g) => (
            <div key={g.title}>
              <div className="mb-2 text-xs font-medium text-muted-foreground">{g.title}</div>
              <div className="flex flex-col gap-1">
                {g.tokens.map((t) => (
                  <div key={t} className="group/token flex items-center gap-3 rounded-lg py-1 pr-1">
                    <span
                      className="size-8 shrink-0 rounded-md border border-border"
                      style={{ background: t === "primary" ? "var(--primary-fill, var(--primary))" : `var(--${t})` }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-mono text-xs">--{t}</div>
                      <div className="truncate font-mono text-[11px] text-muted-foreground">{values[t] || "—"}</div>
                    </div>
                    <CopyButton value={`var(--${t})`} label={`Copy var(--${t})`} className="opacity-0 group-hover/token:opacity-100 focus-visible:opacity-100" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const radii = [
  ["xs", "4px"],
  ["sm", "8px"],
  ["md", "12px"],
  ["lg", "16px"],
  ["xl", "24px"],
  ["2xl", "36px"],
  ["full", "pill"],
] as const;

function RadiusScale() {
  return (
    <section id="radius" className="scroll-mt-20">
      <h2 className="text-2xl font-medium tracking-tight">Shape</h2>
      <p className="mt-1 mb-6 text-sm text-muted-foreground">
        Controls are pills, fields are 12px, cards are 24px, dialogs are 28px. Larger surface, softer corner.
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {radii.map(([name, px]) => (
          <div key={name} className="flex flex-col gap-2">
            <div
              className="aspect-square border border-border bg-container-high"
              style={{ borderRadius: name === "full" ? 9999 : `var(--radius-${name})` }}
            />
            <div className="flex justify-between font-mono text-xs">
              <span>rounded-{name}</span>
              <span className="text-muted-foreground">{px}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ThemeSource() {
  const [css, setCss] = React.useState("");
  React.useEffect(() => {
    void import("../dx-theme.css?raw").then((m) => setCss(m.default));
  }, []);
  return (
    <section id="source" className="scroll-mt-20">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-medium tracking-tight">Use it</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Install the theme item, or paste the file after <code className="font-mono text-foreground">@import "tailwindcss";</code>
          </p>
        </div>
        {css && <CopyButton value={css} label="Copy CSS" />}
      </div>
      <div className="flex flex-col gap-3">
        <CommandBlock command="npx shadcn@latest add @dx/theme" />
        {css ? (
          <CodeBlock code={css} lang="css" title="dx-theme.css" collapsible maxHeight={420} />
        ) : (
          <div className="h-40 animate-pulse rounded-lg bg-container" />
        )}
      </div>
    </section>
  );
}

export default function ThemesPage() {
  React.useEffect(() => {
    document.title = "ThemesDX UI";
  }, []);

  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-20 px-4 pb-24 md:px-6">
        <header className="flex flex-col gap-4 pt-14 md:pt-20">
          <Badge variant="tonal" className="w-fit">
            Themes
          </Badge>
          <h1 className="max-w-3xl text-4xl font-medium tracking-[-0.03em] text-balance md:text-5xl">One token file. Two schemes. One accent.</h1>
          <p className="max-w-2xl text-lg text-pretty text-muted-foreground">
            DX UI is themed entirely with CSS variables. Scope a scheme to any element with <code className="font-mono">.light</code>,{" "}
            <code className="font-mono">.dark</code> or <code className="font-mono">.accent-dx-gradient</code>like the previews below.
          </p>
        </header>
        <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {presets.map((p) => (
            <PresetCard key={p.id} preset={p} />
          ))}
        </section>
        <TokenExplorer />
        <RadiusScale />
        <ThemeSource />
      </main>
      <SiteFooter />
    </div>
  );
}
