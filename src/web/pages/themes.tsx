import * as React from "react";
import { Link } from "wouter";
import { ArrowRightIcon, CheckIcon, DownloadIcon, LinkIcon, MoonIcon, RotateCcwIcon, SunIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";
import { CodeBlock, CommandBlock } from "@/docs/code-block";
import { SiteFooter } from "@/docs/site-footer";
import { SiteHeader } from "@/docs/site-header";
import { btn, Eyebrow, Frame, SegmentedPill, Serif, type Segment } from "@/site/ui";
import {
  applyToSite,
  decodeConfig,
  DEFAULT_CONFIG,
  encodeConfig,
  generateTheme,
  isHex,
  type Mode,
  NEUTRALS,
  PRESETS,
  PRIMARIES,
  RADII,
  readAppliedConfig,
  sameConfig,
  scopeStyle,
  type ThemeConfig,
  toCss,
  toRegistryJson,
  toTokensJson,
} from "@/themes/generate";
import { ThemePreview } from "@/themes/preview";

type Format = "css" | "registry" | "json";
const FORMATS: Segment<Format>[] = [
  { value: "css", label: "CSS" },
  { value: "registry", label: "Registry item" },
  { value: "json", label: "Tokens JSON" },
];
const MODES: Segment<Mode>[] = [
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
];
const FILES: Record<Format, { name: string; type: string; lang: "css" | "json" }> = {
  css: { name: "dx-theme-custom.css", type: "text/css", lang: "css" },
  registry: { name: "dx-theme.json", type: "application/json", lang: "json" },
  json: { name: "dx-tokens.json", type: "application/json", lang: "json" },
};
const SWATCHES = ["background", "container", "container-high", "container-higher", "container-highest", "foreground", "muted-foreground", "primary", "primary-foreground", "border", "ring"];

function Field({ label, hint, children }: { label: string; hint?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-code text-[11px] leading-[1.7] tracking-[0.06em] text-pencil uppercase">{label}</span>
        {hint && <span className="font-code text-[11px] tracking-[-0.01em] text-faint">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function Option({ active, className, children, ...props }: React.ComponentProps<"button"> & { active: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        "site-focus flex h-9 items-center gap-2 rounded-2xl border px-3 text-[13px] font-medium transition-colors",
        active ? "border-ink text-ink" : "border-hairline text-pencil hover:border-divider hover:text-ink",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function Toggle({ checked, onChange, disabled, children }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <label className={cn("flex cursor-pointer items-center justify-between gap-3 text-sm text-ink", disabled && "cursor-not-allowed text-faint")}>
      {children}
      <input type="checkbox" className="peer sr-only" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
      <span
        aria-hidden
        className="relative h-5 w-9 shrink-0 rounded-full bg-divider transition-colors peer-checked:bg-graphite peer-focus-visible:ring-2 peer-focus-visible:ring-ink/40 peer-disabled:opacity-40 after:absolute after:top-0.5 after:left-0.5 after:size-4 after:rounded-full after:bg-canvas after:transition-transform peer-checked:after:translate-x-4"
      />
    </label>
  );
}

function useFlash() {
  const [flash, setFlash] = React.useState<string | null>(null);
  React.useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(null), 1600);
    return () => clearTimeout(t);
  }, [flash]);
  return [flash, setFlash] as const;
}

export default function ThemesPage() {
  const { resolvedTheme, setAccent } = useTheme();
  const [config, setConfig] = React.useState<ThemeConfig>(() => decodeConfig(window.location.hash) ?? readAppliedConfig() ?? DEFAULT_CONFIG);
  const [mode, setMode] = React.useState<Mode>(resolvedTheme);
  const [format, setFormat] = React.useState<Format>("css");
  const [applied, setApplied] = React.useState<ThemeConfig | null>(readAppliedConfig);
  const [hexDraft, setHexDraft] = React.useState(config.primary === "ink" ? "" : config.primary);
  const [flash, setFlash] = useFlash();

  React.useEffect(() => {
    document.title = "Theme generator — DX UI";
  }, []);
  React.useEffect(() => setMode(resolvedTheme), [resolvedTheme]);

  // Keep the address bar shareable without adding history entries.
  React.useEffect(() => {
    const hash = encodeConfig(config);
    window.history.replaceState(null, "", `${window.location.pathname}${hash ? `#${hash}` : ""}`);
  }, [config]);

  const tokens = React.useMemo(() => generateTheme(config), [config]);
  const output = format === "css" ? toCss(tokens) : format === "registry" ? toRegistryJson(tokens) : toTokensJson(tokens);
  const update = (patch: Partial<ThemeConfig>) => setConfig((c) => ({ ...c, ...patch }));
  const ink = config.primary === "ink";
  const isApplied = applied != null && sameConfig(applied, config);
  const isDefault = sameConfig(config, DEFAULT_CONFIG);

  const pickPrimary = (value: string) => {
    update({ primary: value, ...(value === "ink" ? { gradient: false, charts: false } : null) });
    setHexDraft(value === "ink" ? "" : value);
  };
  const apply = (next: ThemeConfig | null) => {
    // The legacy accent class would fight the generated primary.
    setAccent("ink");
    applyToSite(next);
    setApplied(next && !sameConfig(next, DEFAULT_CONFIG) ? next : null);
  };
  const copy = (what: string, text: string) => {
    void navigator.clipboard?.writeText(text);
    setFlash(what);
  };
  const download = () => {
    const file = FILES[format];
    const url = URL.createObjectURL(new Blob([output], { type: file.type }));
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="site flex min-h-svh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 pb-24 md:px-6 md:pb-32">
        <header className="pt-16 pb-12 md:pt-24">
          <Eyebrow>Theme generator</Eyebrow>
          <h1 className="mt-4 max-w-4xl text-[clamp(2.5rem,8vw,4.5rem)] leading-none font-bold tracking-[-0.045em] text-balance text-ink">
            Tune the tokens. <Serif>Ship your own.</Serif>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-[1.33] tracking-[-0.025em] text-pretty text-pencil">
            Pick a neutral, a primary and a corner radius. The preview is built from real registry components; when it looks right, export the
            CSS variables or share the link.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-12">
          {/* ---------------------------------------------------------------- controls */}
          <aside aria-label="Theme controls" className="flex flex-col gap-8 lg:sticky lg:top-24 lg:max-h-[calc(100svh-7rem)] lg:self-start lg:overflow-y-auto lg:pr-2 lg:scrollbar-hover">
            <Field label="Presets">
              <div className="grid grid-cols-2 gap-2">
                {PRESETS.map((p) => {
                  const t = generateTheme(p.config)[mode];
                  const on = sameConfig(p.config, config);
                  return (
                    <Option
                      key={p.id}
                      active={on}
                      title={p.note}
                      className="h-auto flex-col items-start gap-2 p-3"
                      onClick={() => {
                        setConfig(p.config);
                        setHexDraft(p.config.primary === "ink" ? "" : p.config.primary);
                      }}
                    >
                      <span className="flex gap-1">
                        {[t.background, t["container-high"], t.primary].map((c, i) => (
                          <span key={i} className="size-4 rounded-full border border-hairline" style={{ background: c }} />
                        ))}
                      </span>
                      {p.label}
                    </Option>
                  );
                })}
              </div>
            </Field>

            <Field label="Neutral" hint={NEUTRALS.find((n) => n.id === config.neutral)?.label}>
              <div className="flex flex-wrap gap-2">
                {NEUTRALS.map((n) => {
                  const t = generateTheme({ ...DEFAULT_CONFIG, neutral: n.id })[mode];
                  return (
                    <Option key={n.id} active={config.neutral === n.id} onClick={() => update({ neutral: n.id })}>
                      <span className="size-3.5 rounded-full border border-hairline" style={{ background: `linear-gradient(135deg, ${t["container-higher"]} 50%, ${t.foreground} 50%)` }} />
                      {n.label}
                    </Option>
                  );
                })}
              </div>
            </Field>

            <Field label="Primary" hint={ink ? "ink" : config.primary}>
              <div className="flex flex-wrap gap-2">
                {PRIMARIES.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    aria-label={p.label}
                    aria-pressed={config.primary === p.value}
                    title={p.label}
                    onClick={() => pickPrimary(p.value)}
                    className={cn(
                      "site-focus grid size-9 place-items-center rounded-2xl border transition-colors",
                      config.primary === p.value ? "border-ink" : "border-hairline hover:border-divider",
                    )}
                  >
                    <span className="size-5 rounded-full" style={{ background: p.value === "ink" ? "var(--site-ink)" : p.value }} />
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <label className="site-focus relative grid size-9 shrink-0 cursor-pointer place-items-center overflow-hidden rounded-2xl border border-hairline" title="Pick a custom color">
                  <span className="sr-only">Custom primary color</span>
                  <span className="size-5 rounded-full" style={{ background: ink ? "conic-gradient(#e11d67, #e8590c, #0e9f6e, #2b4fda, #6d4aff, #e11d67)" : config.primary }} />
                  <input type="color" value={ink ? "#2b4fda" : config.primary} onChange={(e) => pickPrimary(e.target.value)} className="absolute inset-0 cursor-pointer opacity-0" />
                </label>
                <input
                  aria-label="Primary hex"
                  value={hexDraft}
                  placeholder="#2b4fda"
                  spellCheck={false}
                  onChange={(e) => {
                    const v = e.target.value.trim();
                    setHexDraft(v);
                    if (isHex(v) && v.replace("#", "").length === 6) update({ primary: `#${v.replace("#", "").toLowerCase()}` });
                  }}
                  className="site-focus h-9 min-w-0 flex-1 rounded-2xl border border-hairline bg-transparent px-3 font-code text-[13px] tracking-[-0.025em] text-ink placeholder:text-faint"
                />
              </div>
              <Toggle checked={config.gradient} disabled={ink} onChange={(v) => update({ gradient: v })}>
                Gradient fill on primary buttons
              </Toggle>
              <Toggle checked={config.charts} disabled={ink} onChange={(v) => update({ charts: v })}>
                Build chart colors from primary
              </Toggle>
            </Field>

            <Field label="Radius" hint={`${config.radius}px`}>
              <div className="grid grid-cols-6 gap-2">
                {RADII.map((r) => (
                  <Option key={r} active={config.radius === r} className="justify-center px-0 font-code" onClick={() => update({ radius: r })}>
                    {r}
                  </Option>
                ))}
              </div>
            </Field>

            <div className="flex flex-col gap-2 border-t border-hairline pt-6">
              <button type="button" className={btn({ variant: isApplied ? "ghost" : "filled", className: "w-full" })} onClick={() => apply(isApplied ? null : config)} disabled={!isApplied && isDefault && !applied}>
                {isApplied ? (
                  <>
                    <CheckIcon /> Applied to this site — undo
                  </>
                ) : (
                  "Apply to this site"
                )}
              </button>
              <p className="text-[13px] leading-[1.43] text-pencil">
                Applying re-themes every live preview on this site in your browser, so you can try the theme on{" "}
                <Link href="/docs/components" className="text-ink underline decoration-divider underline-offset-4 hover:decoration-ink">
                  components
                </Link>{" "}
                and{" "}
                <Link href="/blocks/dashboard-01" className="text-ink underline decoration-divider underline-offset-4 hover:decoration-ink">
                  blocks
                </Link>
                . Block thumbnails stay in the default theme.
              </p>
              <button
                type="button"
                className={btn({ variant: "ghost", size: "sm", className: "mt-2 self-start" })}
                disabled={isDefault}
                onClick={() => {
                  setConfig(DEFAULT_CONFIG);
                  setHexDraft("");
                }}
              >
                <RotateCcwIcon /> Reset
              </button>
            </div>
          </aside>

          {/* ---------------------------------------------------------------- preview + export */}
          <div className="flex min-w-0 flex-col gap-16">
            <section aria-labelledby="theme-preview">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h2 id="theme-preview" className="text-2xl leading-[1.17] font-semibold tracking-[-0.025em] text-ink">
                  Preview
                </h2>
                <SegmentedPill id="theme-mode" label="Preview scheme" size="sm" items={MODES} value={mode} onValueChange={setMode} />
              </div>
              <Frame className={cn(mode, "text-foreground")} style={scopeStyle(tokens, mode)}>
                <ThemePreview />
              </Frame>
              <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3 xl:grid-cols-4" aria-label="Key tokens">
                {SWATCHES.map((name) => (
                  <li key={name}>
                    <button
                      type="button"
                      onClick={() => copy(name, tokens[mode][name])}
                      title={`Copy ${tokens[mode][name]}`}
                      className="site-focus group/sw flex w-full items-center gap-3 rounded-2xl p-1 text-left transition-colors hover:bg-tile"
                    >
                      <span className="size-9 shrink-0 rounded-xl border border-hairline" style={{ background: tokens[mode][name] }} />
                      <span className="min-w-0">
                        <span className="block truncate font-code text-xs tracking-[-0.025em] text-ink">--{name}</span>
                        <span className="block truncate font-code text-[11px] tracking-[-0.01em] text-faint">{flash === name ? "copied" : tokens[mode][name]}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="theme-export">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 id="theme-export" className="text-2xl leading-[1.17] font-semibold tracking-[-0.025em] text-ink">
                    Export
                  </h2>
                  <p className="mt-2 max-w-xl text-sm leading-[1.43] text-pencil">
                    {format === "css" && (
                      <>
                        Paste after <code className="font-code text-[0.92em] text-ink">@import "./dx-theme.css";</code> — these variables override the defaults.
                      </>
                    )}
                    {format === "registry" && (
                      <>
                        A shadcn <code className="font-code text-[0.92em] text-ink">registry:theme</code> item. Save it, then run{" "}
                        <code className="font-code text-[0.92em] text-ink">npx shadcn@latest add ./dx-theme.json</code>.
                      </>
                    )}
                    {format === "json" && "Raw light and dark token maps, for design tools or your own build step."}
                  </p>
                </div>
                <SegmentedPill id="theme-format" label="Export format" tone="quiet" size="sm" items={FORMATS} value={format} onValueChange={setFormat} />
              </div>
              <CodeBlock key={format} code={output} lang={FILES[format].lang} title={FILES[format].name} collapsible maxHeight={420} />
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" className={btn()} onClick={() => copy("code", output)}>
                  {flash === "code" ? <CheckIcon /> : null}
                  {flash === "code" ? "Copied" : `Copy ${FORMATS.find((f) => f.value === format)?.label}`}
                </button>
                <button type="button" className={btn({ variant: "ghost" })} onClick={download}>
                  <DownloadIcon /> Download {FILES[format].name}
                </button>
                <button type="button" className={btn({ variant: "ghost" })} onClick={() => copy("link", window.location.href)}>
                  {flash === "link" ? <CheckIcon /> : <LinkIcon />}
                  {flash === "link" ? "Link copied" : "Copy share link"}
                </button>
              </div>
            </section>

            <section aria-labelledby="theme-base" className="border-t border-hairline pt-12">
              <h2 id="theme-base" className="text-2xl leading-[1.17] font-semibold tracking-[-0.025em] text-ink">
                Start from the base theme
              </h2>
              <p className="mt-2 mb-4 max-w-xl text-sm leading-[1.43] text-pencil">
                The generator only overrides variables. Install the base token file first — it carries the surface ladder, state layers and utilities
                every component relies on.
              </p>
              <CommandBlock command="npx shadcn@latest add @dx/theme" />
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href="/docs/theming" className={btn({ variant: "ghost" })}>
                  Theming guide <ArrowRightIcon />
                </Link>
                <Link href="/docs/tokens" className={btn({ variant: "ghost" })}>
                  Token reference <ArrowRightIcon />
                </Link>
                <Link href="/docs/dark-mode" className={btn({ variant: "ghost" })}>
                  Dark mode <ArrowRightIcon />
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
