/**
 * Builds the DX UI registry into `public/r/`.
 *
 *   bun run registry
 *
 * Emits one shadcn `registry-item` JSON per component / block / lib, plus
 * `registry.json` (shadcn `registry` schema, without file contents) and
 * `index.json` (a compact list the dx-ui CLI uses for `list` and `add --all`).
 */
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

import { blocks, catalog } from "../src/web/docs/catalog";
import { collectItemFiles, importSpecs, libItemName, resolveKey } from "../src/web/docs/item-files";

const root = path.resolve(import.meta.dir, "..");
const web = path.join(root, "src/web");
const out = path.join(root, "public/r");
const homepage = "https://dxuireact.com";

const pkg = JSON.parse(await readFile(path.join(root, "package.json"), "utf8")) as { dependencies: Record<string, string> };

type RegistryFile = { path: string; type: string; target?: string; content?: string };
type RegistryItem = {
  $schema: string;
  name: string;
  type: string;
  title?: string;
  description?: string;
  author?: string;
  dependencies?: string[];
  registryDependencies?: string[];
  files: RegistryFile[];
  cssVars?: Record<string, Record<string, string>>;
  meta?: Record<string, unknown>;
  categories?: string[];
};

const ITEM_SCHEMA = "https://ui.shadcn.com/schema/registry-item.json";
const NS = "@dx";

/* ------------------------------------------------------------ helpers */

const IGNORED_DEPS = new Set(["react", "react-dom"]);

function npmDeps(source: string) {
  const deps = new Set<string>();
  for (const m of source.matchAll(/(?:from|import)\s+"([^"]+)"/g)) {
    const spec = m[1];
    if (spec.startsWith(".") || spec.startsWith("@/")) continue;
    const name = spec.startsWith("@") ? spec.split("/").slice(0, 2).join("/") : spec.split("/")[0];
    if (IGNORED_DEPS.has(name)) continue;
    const range = pkg.dependencies[name];
    deps.add(range ? `${name}@${range}` : name);
  }
  return [...deps].sort();
}

/** Map local `@/…` imports to registry item names. */
function localDeps(source: string, self: string) {
  const deps = new Set<string>();
  for (const m of source.matchAll(/from\s+["']@\/([^"']+)["']/g)) {
    const spec = m[1];
    let name: string | undefined;
    if (spec === "lib/utils") name = "utils";
    else if (spec === "lib/demo-data") name = "lib-demo-data";
    else if (spec.startsWith("components/ui/")) name = spec.slice("components/ui/".length);
    else if (spec.startsWith("components/dx/")) name = spec.slice("components/dx/".length);
    else if (spec.startsWith("hooks/")) name = spec.slice("hooks/".length);
    else if (spec === "components/theme-provider") name = "theme-provider";
    else if (spec.startsWith("components/")) {
      const rel = spec.slice("components/".length);
      const item = catalog.find((c) => c.src === rel || c.src === `${rel}/index`);
      if (item) name = item.slug;
    }
    if (name && name !== self) deps.add(name);
  }
  return [...deps].sort();
}

const ns = (names: string[]) => names.map((n) => `${NS}/${n}`);

/** Parse `selector { --a: b; }` blocks of the theme file into shadcn cssVars. */
function parseCssVars(css: string) {
  const block = (re: RegExp) => {
    const m = css.match(re);
    const vars: Record<string, string> = {};
    if (!m) return vars;
    for (const v of m[1].matchAll(/--([\w-]+):\s*([^;]+);/g)) vars[v[1]] = v[2].trim();
    return vars;
  };
  return {
    theme: block(/@theme inline\s*\{([\s\S]*?)\n\}/),
    light: block(/:root,\s*\n?\.light\s*\{([\s\S]*?)\n\}/),
    dark: block(/\n\.dark\s*\{([\s\S]*?)\n\}/),
  };
}

async function read(rel: string) {
  return readFile(path.join(web, rel), "utf8");
}

const items: RegistryItem[] = [];
const itemNames = new Set<string>();

function push(item: Omit<RegistryItem, "$schema">) {
  if (itemNames.has(item.name)) return;
  itemNames.add(item.name);
  items.push({ $schema: ITEM_SCHEMA, author: "DesignX <ui@designx.dev>", ...item });
}

/* ------------------------------------------------------------ lib, hooks, theme */

const utils = await read("lib/utils.ts");
push({
  name: "utils",
  type: "registry:lib",
  title: "Utils",
  description: "The cn() helper — clsx + tailwind-merge.",
  dependencies: npmDeps(utils),
  files: [{ path: "lib/utils.ts", type: "registry:lib", content: utils }],
});

for (const hook of ["use-mobile"]) {
  const src = await read(`hooks/${hook}.ts`);
  push({
    name: hook,
    type: "registry:hook",
    title: hook,
    dependencies: npmDeps(src),
    files: [{ path: `hooks/${hook}.ts`, type: "registry:hook", content: src }],
  });
}

const themeProvider = await read("components/theme-provider.tsx");
push({
  name: "theme-provider",
  type: "registry:component",
  title: "Theme Provider",
  description: "Light / dark / system theme and the DX Gradient accent, persisted to localStorage.",
  files: [{ path: "components/theme-provider.tsx", type: "registry:component", target: "components/theme-provider.tsx", content: themeProvider }],
});

const themeCss = await read("dx-theme.css");
push({
  name: "theme",
  type: "registry:style",
  title: "DX Theme",
  description: "Tokens, surface ladder, state layers and the DX Gradient accent. Import after tailwindcss.",
  dependencies: ["tw-animate-css"],
  registryDependencies: ns(["utils"]),
  cssVars: parseCssVars(themeCss),
  files: [{ path: "dx-theme.css", type: "registry:file", target: "src/dx-theme.css", content: themeCss }],
});

/* ------------------------------------------------------------ components */

for (const c of catalog) {
  if (c.src) continue;
  const dir = c.group === "ui" ? "components/ui" : "components/dx";
  const rel = `${dir}/${c.slug}.tsx`;
  if (!existsSync(path.join(web, rel))) {
    console.warn(`! missing source for ${c.slug} (${rel})`);
    continue;
  }
  const src = await read(rel);
  push({
    name: c.slug,
    type: c.group === "ui" ? "registry:ui" : "registry:component",
    title: c.title,
    description: c.description,
    dependencies: npmDeps(src),
    registryDependencies: ns(localDeps(src, c.slug)),
    files: [
      c.group === "ui"
        ? { path: `ui/${c.slug}.tsx`, type: "registry:ui", content: src }
        : { path: `dx/${c.slug}.tsx`, type: "registry:component", target: `components/dx/${c.slug}.tsx`, content: src },
    ],
    categories: [c.group === "ui" ? "components" : "motion"],
    meta: { group: c.group, base: c.base, docs: `${homepage}/docs/components/${c.slug}` },
  });
}

/* ------------------------------------------------------------ agents / charts / motion kits */

async function walk(dir: string): Promise<string[]> {
  const abs = path.join(web, dir);
  if (!existsSync(abs)) return [];
  const out: string[] = [];
  for (const e of await readdir(abs, { withFileTypes: true })) {
    const rel = `${dir}/${e.name}`;
    if (e.isDirectory()) out.push(...(await walk(rel)));
    else if (/\.(ts|tsx)$/.test(e.name)) out.push(rel);
  }
  return out;
}

const kitKeys = (
  await Promise.all(
    [
      "components/agents",
      "components/charts",
      "components/trading",
      "components/motion",
      "components/text",
      "components/transitions",
      "components/effects",
      "components/elements",
      "lib",
    ].map(walk),
  )
).flat();
const kitKeySet = new Set(kitKeys);
const kitItems = catalog.filter((c) => c.src).map((c) => ({ slug: c.slug, src: c.src! }));
const neededLibs = new Set<string>();
const neededItemLibs = new Set<string>();
const GROUP_CATEGORY = {
  agents: "agents",
  charts: "charts",
  trading: "trading",
  motion: "motion-kit",
  text: "text",
  transitions: "transitions",
  effects: "effects",
  elements: "elements",
} as const;

for (const c of catalog) {
  if (!c.src) continue;
  const graph = await collectItemFiles(c.src, kitKeys, read, kitItems);
  if (!graph) {
    console.warn(`! missing source for ${c.slug} (components/${c.src})`);
    continue;
  }
  graph.libs = graph.libs.filter((l) => !l.path.startsWith("lib/hooks/"));
  const deps = new Set<string>();
  for (const f of graph.files) npmDeps(f.content).forEach((d) => deps.add(d));
  const reg = new Set(graph.deps);
  for (const l of graph.libs) {
    neededItemLibs.add(l.path);
    reg.add(libItemName(l.path));
  }
  push({
    name: c.slug,
    type: "registry:component",
    title: c.title,
    description: c.description,
    dependencies: [...deps].sort(),
    registryDependencies: ns([...reg].sort()),
    files: graph.files.map((f) => ({ path: f.path, type: "registry:component", target: f.path, content: f.content })),
    categories: [GROUP_CATEGORY[c.group as keyof typeof GROUP_CATEGORY]],
    meta: { group: c.group, docs: `${homepage}/docs/components/${c.slug}` },
  });
}

const baseLibs = new Set(["lib/utils.ts", ...["use-mobile"].map((hook) => `hooks/${hook}.ts`)]);
for (const key of [...new Set([...neededItemLibs, ...neededLibs, ...baseLibs])].sort()) {
  const src = await read(key);
  const reg = new Set<string>();
  for (const spec of importSpecs(src)) {
    if (spec === "@/lib/utils") reg.add("utils");
    else if (spec === "@/lib/demo-data") reg.add("lib-demo-data");
    else if (spec.startsWith("@/lib/")) {
      const k = resolveKey(spec.slice(2), (x) => kitKeySet.has(x));
      if (k) reg.add(libItemName(k));
    } else if (spec.startsWith(".")) {
      const k = resolveKey(path.posix.normalize(`${path.posix.dirname(key)}/${spec}`), (x) => kitKeySet.has(x));
      if (k) reg.add(libItemName(k));
    }
  }
  const isHook = key.startsWith("hooks/") || key.startsWith("lib/hooks/");
  push({
    name: libItemName(key),
    type: isHook ? "registry:hook" : "registry:lib",
    title: libItemName(key),
    dependencies: npmDeps(src),
    registryDependencies: ns([...reg].sort()),
    files: [{ path: key, type: isHook ? "registry:hook" : "registry:lib", target: key, content: src }],
  });
}

/* ------------------------------------------------------------ blocks */

for (const b of blocks) {
  const single = path.join(web, `blocks/${b.slug}.tsx`);
  const dir = path.join(web, `blocks/${b.slug}`);
  const rels: string[] = existsSync(single)
    ? [`blocks/${b.slug}.tsx`]
    : (await readdir(dir)).filter((f) => /\.(tsx|css)$/.test(f)).map((f) => `blocks/${b.slug}/${f}`);
  for (let i = 0; i < rels.length; i++) {
    const code = await read(rels[i]);
    for (const m of code.matchAll(/from\s+["']\.\.?\/(?:\.\.\/)?shared\/([\w-]+)["']/g)) {
      const rel = `blocks/shared/${m[1]}.tsx`;
      if (!rels.includes(rel) && existsSync(path.join(web, rel))) rels.push(rel);
    }
  }
  const files: RegistryFile[] = [];
  const deps = new Set<string>();
  const reg = new Set<string>();
  for (const rel of rels) {
    const src = await read(rel);
    npmDeps(src).forEach((d) => deps.add(d));
    localDeps(src, b.slug).forEach((d) => reg.add(d));
    for (const spec of importSpecs(src)) {
      if (spec === "@/lib/demo-data") {
        reg.add("lib-demo-data");
        neededLibs.add("lib/demo-data.ts");
      } else if (spec.startsWith("@/lib/") && spec !== "@/lib/utils") {
        const k = resolveKey(spec.slice(2), (x) => kitKeySet.has(x));
        if (k) {
          reg.add(libItemName(k));
          neededLibs.add(k);
        }
      } else if (spec.startsWith("@/components/")) {
        const rel = spec.slice("@/components/".length);
        const item = kitItems.find((it) => it.src === rel || it.src === `${rel}/index`);
        if (item) reg.add(item.slug);
        else if (rel === "theme-provider") reg.add("theme-provider");
        else if (!rel.startsWith("ui/") && !rel.startsWith("dx/")) console.warn(`! block ${b.slug}: no registry item for ${spec}`);
      }
    }
    files.push({ path: rel, type: "registry:block", target: `components/${rel}`, content: src });
  }
  push({
    name: b.slug,
    type: "registry:block",
    title: b.title,
    description: b.description,
    dependencies: [...deps].sort(),
    registryDependencies: ns([...reg].sort()),
    files,
    categories: [b.slug.split("-")[0]],
    meta: { iframeHeight: `${b.height}px`, preview: `${homepage}/blocks#${b.slug}` },
  });
}

for (const key of [...neededLibs].filter((k) => !neededItemLibs.has(k) && !baseLibs.has(k)).sort()) {
  const src = await read(key);
  push({
    name: libItemName(key),
    type: "registry:lib",
    title: libItemName(key),
    dependencies: npmDeps(src),
    registryDependencies: ns(["utils"]),
    files: [{ path: key, type: "registry:lib", target: key, content: src }],
  });
}

/* ------------------------------------------------------------ write */

for (const it of items) {
  if (it.dependencies?.length === 0) delete it.dependencies;
  if (it.registryDependencies?.length === 0) delete it.registryDependencies;
}

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

await Promise.all(items.map((it) => writeFile(path.join(out, `${it.name}.json`), `${JSON.stringify(it, null, 2)}\n`)));

const strip = (it: RegistryItem) => {
  const { $schema: _s, ...rest } = it;
  return { ...rest, files: it.files.map(({ content: _c, ...f }) => f) };
};

await writeFile(
  path.join(out, "registry.json"),
  `${JSON.stringify({ $schema: "https://ui.shadcn.com/schema/registry.json", name: "dx", homepage, items: items.map(strip) }, null, 2)}\n`,
);

await writeFile(
  path.join(out, "index.json"),
  `${JSON.stringify(
    items.map((it) => ({
      name: it.name,
      type: it.type,
      title: it.title,
      description: it.description,
      registryDependencies: it.registryDependencies?.map((d) => d.replace(`${NS}/`, "")) ?? [],
    })),
    null,
    2,
  )}\n`,
);

const count = (t: string) => items.filter((i) => i.type === t).length;
const byGroup = (g: string) => items.filter((i) => i.meta?.group === g).length;
console.log(
  `✓ registry: ${items.length} items → public/r  (ui ${count("registry:ui")}, dx ${byGroup("dx")}, agents ${byGroup("agents")}, charts ${byGroup("charts")}, trading ${byGroup("trading")}, motion ${byGroup("motion")}, text ${byGroup("text")}, transitions ${byGroup("transitions")}, effects ${byGroup("effects")}, elements ${byGroup("elements")}, libs ${count("registry:lib") + count("registry:hook")}, blocks ${count("registry:block")})`,
);
