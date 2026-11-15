import type { CatalogGroup, CatalogItem } from "./catalog";

export type StandardsArea = {
  id: string;
  label: string;
  summary: string;
  checks: string[];
  source: string;
};

export const modernGuidanceSource = "https://github.com/GoogleChrome/modern-web-guidance-src";
export const modernGuidanceDocs = "https://developer.chrome.com/docs/modern-web-guidance";

const source = (slug: string) => `${modernGuidanceSource}/tree/main/guides/${slug}`;

export const standardsAreas: Record<string, StandardsArea> = {
  accessibility: {
    id: "accessibility",
    label: "Accessibility",
    summary: "Use native semantics first, keep every interaction keyboard reachable, and expose state changes to assistive technology.",
    checks: [
      "Prefer the native element whose behaviour matches the interaction before adding ARIA.",
      "Keep a visible focus indicator and a predictable keyboard path for every interactive state.",
      "Give controls an explicit accessible name and associate descriptions and errors with the control.",
      "Respect prefers-reduced-motion and never communicate state with colour or motion alone.",
    ],
    source: source("accessibility/accessibility"),
  },
  performance: {
    id: "performance",
    label: "Performance",
    summary: "Let the browser schedule work, reserve media space, and keep interaction handlers short so INP and layout stability stay predictable.",
    checks: [
      "Reserve intrinsic space for images and media with width, height, aspect-ratio, or contain-intrinsic-size.",
      "Lazy-load below-the-fold media and avoid eagerly mounting expensive previews.",
      "Prefer CSS and platform observers over per-frame scroll or resize listeners.",
      "Yield long tasks with scheduler.yield() when work cannot be deferred.",
    ],
    source: source("performance/performance"),
  },
  "css-layout": {
    id: "css-layout",
    label: "CSS and layout",
    summary: "Build from intrinsic sizing, logical properties, container queries, and progressive enhancement instead of viewport-specific hacks.",
    checks: [
      "Use container queries and fluid sizing when a component responds to its own available space.",
      "Use logical properties so writing modes and right-to-left layouts remain correct.",
      "Animate opacity and transform where possible; use @starting-style and allow-discrete for entry and exit states.",
      "Guard newer features with @supports and keep a readable baseline style.",
    ],
    source: source("css/css-layout"),
  },
  forms: {
    id: "forms",
    label: "Forms and input",
    summary: "Keep native form behaviour, autofill, validation, and IME input intact while enhancing the visual treatment.",
    checks: [
      "Use a real form and submit button, with labels, autocomplete tokens, and inputmode where they help.",
      "Use field-sizing: content for auto-growing fields, with min and max block sizes as guardrails.",
      "Ignore Enter while an IME is composing (isComposing or keyCode 229).",
      "Expose invalid and pending states through both programmatic and visual feedback.",
    ],
    source: source("forms/ime-safe-enter-submit"),
  },
  security: {
    id: "security",
    label: "Security and privacy",
    summary: "Treat copied components as application code: constrain origins, external resources, and the data a UI exposes.",
    checks: [
      "Use a restrictive Content-Security-Policy and Trusted Types when rendering untrusted HTML.",
      "Add rel=noopener noreferrer to new-tab links and choose a deliberate referrer policy.",
      "Keep permissions policy and cross-origin requests explicit.",
      "Do not expose secrets, private identifiers, or unnecessary user data in previews and logs.",
    ],
    source: source("security/security"),
  },
};

const groupAreas: Record<CatalogGroup, string[]> = {
  ui: ["accessibility", "forms", "performance"],
  dx: ["accessibility", "performance", "css-layout"],
  agents: ["accessibility", "performance", "forms", "security"],
  charts: ["accessibility", "performance", "css-layout"],
  trading: ["accessibility", "performance", "forms", "security"],
  motion: ["accessibility", "performance", "css-layout"],
  text: ["accessibility", "css-layout", "performance"],
  transitions: ["accessibility", "css-layout", "performance"],
  effects: ["accessibility", "performance", "css-layout"],
  elements: ["accessibility", "performance", "security"],
};

export function standardsForItem(item: CatalogItem): StandardsArea[] {
  return groupAreas[item.group].map((id) => standardsAreas[id]);
}
