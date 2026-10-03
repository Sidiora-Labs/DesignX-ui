import type { ComponentType } from "react";

import { catalog } from "./catalog";
import { collectItemFiles } from "./item-files";

/** Raw sources of every registry component, keyed by "ui/button" / "dx/number-flow". */
const rawComponents = import.meta.glob<string>(["../components/ui/*.tsx", "../components/dx/*.tsx"], {
  query: "?raw",
  import: "default",
});

/** Demo modules: `demos/<slug>.tsx` (main) and `demos/<slug>.<example>.tsx` (extra examples). */
const demoModules = import.meta.glob<{ default: ComponentType }>("../demos/*.tsx");
const rawDemos = import.meta.glob<string>("../demos/*.tsx", { query: "?raw", import: "default" });

const keyOf = (path: string) => path.replace(/^\.\.\/(components\/)?/, "").replace(/\.tsx$/, "");

const componentSources = Object.fromEntries(Object.entries(rawComponents).map(([p, l]) => [keyOf(p).replace(/^components\//, ""), l]));
const demos = Object.fromEntries(Object.entries(demoModules).map(([p, l]) => [keyOf(p).replace(/^demos\//, ""), l]));
const demoSources = Object.fromEntries(Object.entries(rawDemos).map(([p, l]) => [keyOf(p).replace(/^demos\//, ""), l]));

export function loadComponentSource(group: "ui" | "dx", slug: string) {
  const loader = componentSources[`${group}/${slug}`];
  return loader ? loader() : Promise.resolve("");
}

/** Raw sources of the multi-file kits plus lib/, keyed by path relative to src/web ("components/motion/swap.tsx"). */
const rawKit = import.meta.glob<string>(
  ["../components/agents/**/*.{ts,tsx}", "../components/charts/**/*.{ts,tsx}", "../components/motion/**/*.{ts,tsx}", "../lib/**/*.{ts,tsx}"],
  { query: "?raw", import: "default" },
);
const kitSources = Object.fromEntries(Object.entries(rawKit).map(([p, l]) => [p.replace(/^\.\.\//, ""), l]));
const kitItems = catalog.filter((c) => c.src).map((c) => ({ slug: c.slug, src: c.src! }));

/** Every file a kit item needs, entry first, plus lib helpers and registry deps. */
export function loadItemGraph(src: string) {
  return collectItemFiles(src, Object.keys(kitSources), (k) => kitSources[k](), kitItems);
}

export function loadDemo(name: string) {
  return demos[name]?.();
}

export function loadDemoSource(name: string) {
  const loader = demoSources[name];
  return loader ? loader() : Promise.resolve("");
}

/** Extra example names for a component, e.g. ["button.variants", "button.sizes"]. */
export function exampleNames(slug: string) {
  return Object.keys(demos)
    .filter((k) => k.startsWith(`${slug}.`))
    .sort();
}

export function hasDemo(name: string) {
  return name in demos;
}

/** Parse `export { A, B, type C }` blocks into a sorted list of public names. */
export function parseExports(source: string) {
  const names = new Set<string>();
  for (const m of source.matchAll(/export\s*\{([\s\S]*?)\}/g)) {
    for (const part of m[1].split(",")) {
      const n = part.trim();
      if (!n || n.startsWith("type ")) continue;
      names.add(n.split(/\s+as\s+/).pop()!.trim());
    }
  }
  for (const m of source.matchAll(/export\s+(?:function|const)\s+(\w+)/g)) names.add(m[1]);
  return [...names];
}

/** npm dependencies used by a source file (excluding react and local imports). */
export function parseDependencies(source: string) {
  const deps = new Set<string>();
  for (const m of source.matchAll(/from\s+"([^"]+)"/g)) {
    const spec = m[1];
    if (spec.startsWith(".") || spec.startsWith("@/")) continue;
    const pkg = spec.startsWith("@") ? spec.split("/").slice(0, 2).join("/") : spec.split("/")[0];
    if (pkg === "react" || pkg === "react-dom") continue;
    deps.add(pkg);
  }
  return [...deps];
}

/* ---------------------------------------------------------------- blocks */

const blockModules = import.meta.glob<{ default: ComponentType }>(["../blocks/*.tsx", "../blocks/*/index.tsx"]);
const rawBlocks = import.meta.glob<string>("../blocks/**/*.tsx", { query: "?raw", import: "default" });

const blockSlugOf = (path: string) => path.replace(/^\.\.\/blocks\//, "").replace(/\/index\.tsx$|\.tsx$/, "");

const blocksBySlug = Object.fromEntries(Object.entries(blockModules).map(([p, l]) => [blockSlugOf(p), l]));

export function loadBlock(slug: string) {
  return blocksBySlug[slug]?.();
}

/** All files of a block as `{ path, code }`, index first. Paths are relative to the user's `components/` folder. */
export async function loadBlockFiles(slug: string) {
  const entries = Object.entries(rawBlocks).filter(([p]) => p === `../blocks/${slug}.tsx` || p.startsWith(`../blocks/${slug}/`));
  const files = await Promise.all(
    entries.map(async ([p, l]) => ({ path: p.replace(/^\.\.\/blocks\//, "blocks/"), code: await l() })),
  );
  return files.sort((a, b) => Number(b.path.endsWith("index.tsx")) - Number(a.path.endsWith("index.tsx")) || a.path.localeCompare(b.path));
}
