import { alpha, contrast, oklch, parseHex, toOklch } from "./color";

/* ------------------------------------------------------------------ config */

export type NeutralId = "dx" | "neutral" | "stone" | "zinc" | "slate" | "sage" | "mauve";
export type ThemeConfig = {
  neutral: NeutralId;
  /** Hex color, or "ink" for the default monochrome primary. */
  primary: string;
  /** Base radius in px; the scale is derived from it. */
  radius: number;
  /** Fill default buttons with a gradient built from the primary. */
  gradient: boolean;
  /** Start the chart palette from the primary color. */
  charts: boolean;
};

export const DEFAULT_CONFIG: ThemeConfig = { neutral: "dx", primary: "ink", radius: 12, gradient: false, charts: false };

export const NEUTRALS: { id: NeutralId; label: string; hue: number; chroma: number }[] = [
  { id: "dx", label: "DX", hue: 270, chroma: 0.008 },
  { id: "neutral", label: "Neutral", hue: 0, chroma: 0 },
  { id: "stone", label: "Stone", hue: 60, chroma: 0.007 },
  { id: "zinc", label: "Zinc", hue: 286, chroma: 0.006 },
  { id: "slate", label: "Slate", hue: 257, chroma: 0.016 },
  { id: "sage", label: "Sage", hue: 150, chroma: 0.012 },
  { id: "mauve", label: "Mauve", hue: 320, chroma: 0.014 },
];

export const PRIMARIES: { id: string; label: string; value: string }[] = [
  { id: "ink", label: "Ink", value: "ink" },
  { id: "blue", label: "Blue", value: "#2b4fda" },
  { id: "violet", label: "Violet", value: "#6d4aff" },
  { id: "rose", label: "Rose", value: "#e11d67" },
  { id: "orange", label: "Orange", value: "#e8590c" },
  { id: "green", label: "Green", value: "#0e9f6e" },
  { id: "teal", label: "Teal", value: "#0d9488" },
];

export const RADII = [0, 6, 8, 12, 16, 20] as const;

export type Preset = { id: string; label: string; note: string; config: ThemeConfig };
export const PRESETS: Preset[] = [
  { id: "default", label: "DX Ink", note: "The shipped theme.", config: DEFAULT_CONFIG },
  { id: "gradient", label: "DX Gradient", note: "Blue gradient primary.", config: { neutral: "dx", primary: "#3b6bff", radius: 12, gradient: true, charts: false } },
  { id: "graphite", label: "Graphite", note: "Pure neutral, tighter corners.", config: { neutral: "neutral", primary: "ink", radius: 8, gradient: false, charts: false } },
  { id: "slate", label: "Slate Violet", note: "Cool surfaces, violet actions.", config: { neutral: "slate", primary: "#6d4aff", radius: 12, gradient: false, charts: true } },
  { id: "stone", label: "Stone Orange", note: "Warm paper, orange actions.", config: { neutral: "stone", primary: "#e8590c", radius: 16, gradient: false, charts: true } },
  { id: "sage", label: "Sage", note: "Soft green, generous corners.", config: { neutral: "sage", primary: "#0e9f6e", radius: 20, gradient: false, charts: true } },
];

/* ------------------------------------------------------------------ tokens */

export type Mode = "light" | "dark";
export type TokenMap = Record<string, string>;
export type ThemeTokens = { light: TokenMap; dark: TokenMap };

/** The neutral ladder exactly as shipped in dx-theme.css. */
const DX_NEUTRAL: Record<Mode, Record<string, string>> = {
  light: { bg: "#ffffff", c1: "#f8f9fc", c2: "#eff2f7", c3: "#e6eaf0", c4: "#e1e6ec", fg: "#121317", mfg: "#45474d", pop: "#ffffff", card: "#ffffff", line: "#212226" },
  dark: { bg: "#121317", c1: "#18191d", c2: "#212226", c3: "#2f3034", c4: "#45474d", fg: "#f8f9fc", mfg: "#b2bbc5", pop: "#1b1c20", card: "#18191d", line: "#e6eaf0" },
};

function neutralLadder(id: NeutralId, mode: Mode) {
  if (id === "dx") return DX_NEUTRAL[mode];
  const n = NEUTRALS.find((x) => x.id === id)!;
  const tone = (l: number, k = 1) => oklch(l, n.chroma * k, n.hue);
  return mode === "light"
    ? { bg: "#ffffff", c1: tone(0.98), c2: tone(0.955), c3: tone(0.93), c4: tone(0.905), fg: tone(0.19, 1.2), mfg: tone(0.4, 1.2), pop: "#ffffff", card: "#ffffff", line: tone(0.25, 1.2) }
    : { bg: tone(0.185), c1: tone(0.21), c2: tone(0.25), c3: tone(0.3), c4: tone(0.39), fg: tone(0.98, 0.5), mfg: tone(0.78), pop: tone(0.225), card: tone(0.21), line: tone(0.93) };
}

/** Pick the more legible of near-white and near-black on a fill. */
const onColor = (fill: string) => (contrast(fill, "#ffffff") >= contrast(fill, "#121317") * 0.75 ? "#ffffff" : "#121317");

export function isHex(v: string) {
  return parseHex(v) !== null;
}

function modeTokens(config: ThemeConfig, mode: Mode): TokenMap {
  const n = neutralLadder(config.neutral, mode);
  const dark = mode === "dark";
  const ink = config.primary === "ink" || !isHex(config.primary);

  let primary = n.fg;
  if (!ink) {
    const p = toOklch(config.primary);
    // Dark surfaces need a slightly lighter primary to keep its presence.
    primary = dark ? oklch(Math.min(0.78, Math.max(p.l + 0.08, 0.62)), p.c, p.h) : oklch(p.l, p.c, p.h);
  }
  const primaryFg = ink ? n.bg : onColor(primary);
  let fill = "none";
  if (config.gradient && !ink) {
    const p = toOklch(primary);
    fill = `linear-gradient(90deg, ${primary} 0%, ${oklch(Math.min(0.82, p.l + 0.1), p.c * 0.9, p.h - 14)} 65%, ${oklch(Math.min(0.9, p.l + 0.24), p.c * 0.55, p.h + 10)} 100%)`;
  }

  const t: TokenMap = {
    background: n.bg,
    foreground: n.fg,
    container: n.c1,
    "container-high": n.c2,
    "container-higher": n.c3,
    "container-highest": n.c4,
    card: n.card,
    "card-foreground": n.fg,
    popover: n.pop,
    "popover-foreground": n.fg,
    primary,
    "primary-foreground": primaryFg,
    "primary-fill": fill,
    secondary: n.c2,
    "secondary-foreground": n.fg,
    muted: n.c1,
    "muted-foreground": n.mfg,
    accent: n.c2,
    "accent-foreground": n.fg,
    border: alpha(n.line, 0.12),
    "border-strong": alpha(n.line, 0.24),
    "outline-variant": alpha(n.line, 0.06),
    input: alpha(n.line, 0.16),
    ring: primary,
    sidebar: n.c1,
    "sidebar-foreground": n.fg,
    "sidebar-primary": primary,
    "sidebar-primary-foreground": primaryFg,
    "sidebar-accent": n.c2,
    "sidebar-accent-foreground": n.fg,
    "sidebar-border": alpha(n.line, 0.08),
    "sidebar-ring": primary,
  };

  if (config.charts && !ink) {
    const p = toOklch(primary);
    const step = (i: number) => oklch(dark ? 0.7 : 0.6, Math.max(0.12, p.c * 0.9), (p.h + i * 62) % 360);
    t["chart-1"] = primary;
    for (let i = 1; i < 5; i++) t[`chart-${i + 1}`] = step(i);
  }
  return t;
}

export function generateTheme(config: ThemeConfig): ThemeTokens {
  const light = modeTokens(config, "light");
  light.radius = `${config.radius}px`;
  return { light, dark: modeTokens(config, "dark") };
}

/** Inline style object that scopes a generated theme to one element. */
export function scopeStyle(tokens: ThemeTokens, mode: Mode): Record<string, string> {
  const out: Record<string, string> = { "--radius": tokens.light.radius };
  for (const [k, v] of Object.entries(tokens[mode])) out[`--${k}`] = v;
  return out;
}

/* ------------------------------------------------------------------ export */

const block = (selector: string, map: TokenMap) => `${selector} {\n${Object.entries(map).map(([k, v]) => `  --${k}: ${v};`).join("\n")}\n}`;

/** Drop-in overrides: paste after `@import "./dx-theme.css";`. */
export function toCss(tokens: ThemeTokens) {
  return [
    "/* Generated with the DX UI theme generator.",
    '   Paste after `@import "./dx-theme.css";` — these override the defaults. */',
    block(":root,\n.light", tokens.light),
    "",
    block(".dark", tokens.dark),
    "",
  ].join("\n");
}

/** shadcn `registry:theme` item, installable with `npx shadcn@latest add ./dx-theme.json`. */
export function toRegistryJson(tokens: ThemeTokens, name = "dx-custom") {
  return JSON.stringify(
    {
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      name,
      type: "registry:theme",
      cssVars: { light: tokens.light, dark: tokens.dark },
    },
    null,
    2,
  );
}

export function toTokensJson(tokens: ThemeTokens) {
  return JSON.stringify(tokens, null, 2);
}

/* ------------------------------------------------------------------ share links */

export function encodeConfig(c: ThemeConfig) {
  const p = new URLSearchParams();
  if (c.neutral !== DEFAULT_CONFIG.neutral) p.set("n", c.neutral);
  if (c.primary !== DEFAULT_CONFIG.primary) p.set("p", c.primary.replace("#", ""));
  if (c.radius !== DEFAULT_CONFIG.radius) p.set("r", String(c.radius));
  if (c.gradient) p.set("g", "1");
  if (c.charts) p.set("c", "1");
  return p.toString();
}

export function decodeConfig(raw: string): ThemeConfig | null {
  const p = new URLSearchParams(raw.replace(/^#/, ""));
  if (![...p.keys()].some((k) => ["n", "p", "r", "g", "c"].includes(k))) return null;
  const neutral = NEUTRALS.find((n) => n.id === p.get("n"))?.id ?? DEFAULT_CONFIG.neutral;
  const hex = p.get("p");
  const primary = hex && isHex(hex) ? `#${hex.replace("#", "").toLowerCase()}` : "ink";
  const r = Number(p.get("r"));
  const radius = p.has("r") && Number.isFinite(r) ? Math.min(24, Math.max(0, Math.round(r))) : DEFAULT_CONFIG.radius;
  return { neutral, primary, radius, gradient: p.get("g") === "1", charts: p.get("c") === "1" };
}

export const sameConfig = (a: ThemeConfig, b: ThemeConfig) => encodeConfig(a) === encodeConfig(b);

/* ------------------------------------------------------------------ apply to this site */

const STORE_KEY = "dx-custom-theme";
const STYLE_ID = "dx-custom-theme";

/** Reads the theme applied to the docs site, if any. */
export function readAppliedConfig(): ThemeConfig | null {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? decodeConfig(raw) : null;
  } catch {
    return null;
  }
}

/** Injects (or removes) the generated overrides so every preview on the site wears them. */
export function mountAppliedTheme(config: ThemeConfig | null) {
  let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!config || sameConfig(config, DEFAULT_CONFIG)) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("style");
    el.id = STYLE_ID;
    document.head.appendChild(el);
  }
  el.textContent = toCss(generateTheme(config));
}

export function applyToSite(config: ThemeConfig | null) {
  try {
    if (config && !sameConfig(config, DEFAULT_CONFIG)) localStorage.setItem(STORE_KEY, encodeConfig(config));
    else localStorage.removeItem(STORE_KEY);
  } catch {
    /* private mode: still applies for this page */
  }
  mountAppliedTheme(config);
}

export const APPLIED_THEME_KEY = STORE_KEY;
