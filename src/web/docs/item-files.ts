/**
 * Resolves the file closure of a multi-file catalog item (agents / charts / motion).
 * Pure — shared by the docs site (via import.meta.glob) and `scripts/build-registry.ts` (via fs).
 *
 * Keys are paths relative to `src/web/`, e.g. "components/motion/swap.tsx".
 */

export type ItemRef = { slug: string; src: string };

export type ItemFile = { path: string; content: string };

export type ItemGraph = {
  /** The item's own files, entry first. */
  files: ItemFile[];
  /** `lib/*` files it needs (transitively), excluding lib/utils. */
  libs: ItemFile[];
  /** Other registry items it depends on (catalog slugs, "utils", "theme-provider"). */
  deps: string[];
};

const EXTS = [".tsx", ".ts", "/index.tsx", "/index.ts"];

const dirname = (p: string) => p.slice(0, p.lastIndexOf("/"));

function normalize(p: string) {
  const out: string[] = [];
  for (const part of p.split("/")) {
    if (part === "..") out.pop();
    else if (part !== ".") out.push(part);
  }
  return out.join("/");
}

export function resolveKey(base: string, has: (key: string) => boolean) {
  for (const ext of EXTS) if (has(base + ext)) return base + ext;
  return null;
}

/** Every module specifier imported or re-exported by a source file. */
export function importSpecs(source: string) {
  const specs = new Set<string>();
  for (const m of source.matchAll(/(?:from|import)\s+"([^"]+)"/g)) specs.add(m[1]);
  return [...specs];
}

const KIT = /^components\/(agents|charts|motion)\//;

export async function collectItemFiles(
  src: string,
  keys: string[],
  read: (key: string) => Promise<string>,
  items: ItemRef[],
): Promise<ItemGraph | null> {
  const keySet = new Set(keys);
  const has = (k: string) => keySet.has(k);
  const entry = resolveKey(`components/${src}`, has);
  if (!entry) return null;

  const owner = (key: string) => {
    const bare = key.replace(/\.(tsx|ts)$/, "").replace(/\/index$/, "");
    let best: ItemRef | undefined;
    for (const it of items) {
      const root = `components/${it.src}`;
      if ((bare === root || bare.startsWith(`${root}/`)) && (!best || it.src.length > best.src.length)) best = it;
    }
    return best;
  };
  const self = owner(entry);

  const files: ItemFile[] = [];
  const libs: ItemFile[] = [];
  const deps = new Set<string>();
  const seen = new Set<string>();
  const queue = [entry];

  while (queue.length) {
    const key = queue.shift()!;
    if (seen.has(key)) continue;
    seen.add(key);
    const content = await read(key);
    (key.startsWith("lib/") ? libs : files).push({ path: key, content });

    for (const spec of importSpecs(content)) {
      let target: string | null = null;
      if (spec.startsWith(".")) target = resolveKey(normalize(`${dirname(key)}/${spec}`), has);
      else if (spec.startsWith("@/")) {
        const local = spec.slice(2);
        if (local === "lib/utils") {
          deps.add("utils");
          continue;
        }
        if (local === "components/theme-provider") {
          deps.add("theme-provider");
          continue;
        }
        const ud = local.match(/^components\/(ui|dx)\/([\w-]+)$/);
        if (ud) {
          deps.add(ud[2]);
          continue;
        }
        target = resolveKey(local, has);
      }
      if (!target) continue;
      if (KIT.test(target)) {
        const o = owner(target);
        if (o && o !== self) {
          deps.add(o.slug);
          continue;
        }
      }
      queue.push(target);
    }
  }

  return { files, libs, deps: [...deps].sort() };
}

/** Registry item name for a `lib/` file: "lib/ease.ts" → "lib-ease", "lib/hooks/use-x.ts" → "use-x". */
export function libItemName(key: string) {
  const bare = key.replace(/\.(tsx|ts)$/, "");
  if (bare.startsWith("lib/hooks/")) return bare.slice("lib/hooks/".length);
  return `lib-${bare.slice("lib/".length)}`;
}
