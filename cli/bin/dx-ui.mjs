#!/usr/bin/env node
/**
 * dx-ui — the DesignX UI CLI.
 *
 *   dx-ui init [-y] [--css <path>] [--registry <url>]
 *   dx-ui add [components...] [-a] [-o] [-p <dir>] [-y]
 *   dx-ui list
 *
 * Zero dependencies: Node 18.17+ built-ins only.
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { createInterface } from "node:readline/promises";
import { stdin, stdout, argv, exit, cwd as getCwd, env } from "node:process";

const VERSION = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8")).version;
const DEFAULT_REGISTRY = "https://dxuireact.com/r/{name}.json";
const CONFIG_FILE = "dx.json";
const BASE_DEPS = ["@base-ui/react", "class-variance-authority", "clsx", "tailwind-merge", "lucide-react", "tw-animate-css"];

/* ------------------------------------------------------------------ output */

const tty = stdout.isTTY && !env.NO_COLOR;
const paint = (code) => (s) => (tty ? `\x1b[${code}m${s}\x1b[0m` : String(s));
const c = { dim: paint(2), bold: paint(1), green: paint(32), red: paint(31), cyan: paint(36), yellow: paint(33) };
const log = (...a) => console.log(...a);
const ok = (s) => log(`${c.green("✓")} ${s}`);
const warn = (s) => log(`${c.yellow("!")} ${s}`);
const fail = (s) => {
  console.error(`${c.red("✗")} ${s}`);
  exit(1);
};

/* ------------------------------------------------------------------ args */

function parseArgs(args) {
  const flags = {};
  const positional = [];
  const alias = { y: "yes", a: "all", o: "overwrite", p: "path", h: "help", v: "version" };
  const valued = new Set(["css", "registry", "path", "cwd"]);
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith("-")) {
      let [key, value] = arg.replace(/^-+/, "").split("=");
      key = alias[key] ?? key;
      if (valued.has(key) && value === undefined) value = args[++i];
      flags[key] = value ?? true;
    } else positional.push(arg);
  }
  return { flags, positional };
}

/* ------------------------------------------------------------------ project */

const readJson = async (file) => JSON.parse(await readFile(file, "utf8"));
/** JSON with comments and trailing commas (tsconfig). */
const readJsonc = async (file) =>
  JSON.parse(
    (await readFile(file, "utf8"))
      .replace(/("(?:\\.|[^"\\])*")|\/\/[^\n]*|\/\*[\s\S]*?\*\//g, (m, str) => str ?? "")
      .replace(/,(\s*[}\]])/g, "$1"),
  );

async function aliasRoot(root) {
  for (const name of ["tsconfig.app.json", "tsconfig.json", "jsconfig.json"]) {
    const file = path.join(root, name);
    if (!existsSync(file)) continue;
    try {
      const ts = await readJsonc(file);
      const target = ts.compilerOptions?.paths?.["@/*"]?.[0];
      if (target) return path.join(root, ts.compilerOptions.baseUrl ?? ".", target.replace(/\*$/, ""));
    } catch {
      /* fall through */
    }
  }
  return existsSync(path.join(root, "src")) ? path.join(root, "src") : root;
}

function packageManager(root) {
  if (existsSync(path.join(root, "bun.lock")) || existsSync(path.join(root, "bun.lockb"))) return "bun";
  if (existsSync(path.join(root, "pnpm-lock.yaml"))) return "pnpm";
  if (existsSync(path.join(root, "yarn.lock"))) return "yarn";
  const ua = env.npm_config_user_agent ?? "";
  if (ua.startsWith("bun")) return "bun";
  if (ua.startsWith("pnpm")) return "pnpm";
  if (ua.startsWith("yarn")) return "yarn";
  return "npm";
}

async function install(root, deps) {
  if (!deps.length) return;
  const pkgFile = path.join(root, "package.json");
  const pkg = existsSync(pkgFile) ? await readJson(pkgFile) : {};
  const have = { ...pkg.dependencies, ...pkg.devDependencies };
  const bare = (d) => (d.startsWith("@") ? `@${d.slice(1).split("@")[0]}` : d.split("@")[0]);
  const byName = new Map();
  for (const d of deps) if (!byName.has(bare(d)) || d.length > byName.get(bare(d)).length) byName.set(bare(d), d);
  const missing = [...byName.values()].filter((d) => !have[bare(d)]);
  if (!missing.length) return;
  const pm = packageManager(root);
  const cmd = pm === "npm" ? ["install", ...missing] : ["add", ...missing];
  log(c.dim(`  ${pm} ${cmd.join(" ")}`));
  const res = spawnSync(pm, cmd, { cwd: root, stdio: "inherit", shell: process.platform === "win32" });
  if (res.status !== 0) warn(`Dependency install failed. Run it yourself: ${pm} ${cmd.join(" ")}`);
  else ok(`Installed ${missing.length} ${missing.length === 1 ? "dependency" : "dependencies"}`);
}

async function loadConfig(root) {
  const file = path.join(root, CONFIG_FILE);
  if (!existsSync(file)) fail(`No ${CONFIG_FILE} found. Run ${c.cyan("npx @sidioralabs/designx-ui@latest init")} first.`);
  const config = await readJson(file);
  return {
    registry: DEFAULT_REGISTRY,
    css: "src/index.css",
    ...config,
    aliases: {
      components: "@/components",
      ui: "@/components/ui",
      dx: "@/components/dx",
      lib: "@/lib",
      hooks: "@/hooks",
      ...config.aliases,
    },
  };
}

/* ------------------------------------------------------------------ registry */

const cache = new Map();
async function fetchItem(registry, name) {
  const url = registry.replace("{name}", name);
  if (!cache.has(url)) {
    cache.set(
      url,
      fetch(url).then(async (r) => {
        if (r.status === 404) throw new Error(`"${name}" was not found in the registry (${url})`);
        if (!r.ok) throw new Error(`Registry request failed: ${r.status} ${r.statusText} (${url})`);
        return r.json();
      }),
    );
  }
  return cache.get(url);
}

const itemName = (dep) => dep.replace(/^@dx\//, "").replace(/^https?:\/\/.*\/r\/([^/]+)\.json$/, "$1");

/** Resolve a set of names to every item they need, dependencies first. */
async function resolveTree(registry, names) {
  const seen = new Map();
  const visit = async (name) => {
    if (seen.has(name)) return;
    seen.set(name, null);
    const item = await fetchItem(registry, name);
    for (const dep of item.registryDependencies ?? []) await visit(itemName(dep));
    seen.delete(name);
    seen.set(name, item);
  };
  for (const n of names) await visit(n);
  return [...seen.values()];
}

/* ------------------------------------------------------------------ writing */

function rewriteImports(source, aliases) {
  return source.replace(/(["'])@\/(components\/ui|components\/dx|components|lib|hooks)\//g, (_m, q, kind) => {
    const map = { "components/ui": aliases.ui, "components/dx": aliases.dx, components: aliases.components, lib: aliases.lib, hooks: aliases.hooks };
    return `${q}${map[kind]}/`;
  });
}

function aliasToDir(base, alias) {
  return path.join(base, alias.replace(/^@\//, "").replace(/^~\//, ""));
}

function targetFor(file, { base, aliases, custom }) {
  const name = path.basename(file.path);
  const rest = (file.target ?? file.path).replace(/^components\//, "");
  if (custom) return file.type === "registry:block" ? path.join(custom, rest.replace(/^blocks\//, "")) : path.join(custom, name);
  switch (file.type) {
    case "registry:ui":
      return path.join(aliasToDir(base, aliases.ui), name);
    case "registry:lib":
      return path.join(aliasToDir(base, aliases.lib), name);
    case "registry:hook":
      return path.join(aliasToDir(base, aliases.hooks), name);
    case "registry:component":
    case "registry:block":
      return path.join(aliasToDir(base, aliases.components), rest);
    default:
      return path.join(base, (file.target ?? file.path).replace(/^src\//, ""));
  }
}

async function writeFiles(item, ctx) {
  const written = [];
  const skipped = [];
  const boundary = path.resolve(ctx.custom ?? ctx.root);
  const files = (item.files ?? [])
    .filter((file) => file.content)
    .map((file) => {
      const dest = path.resolve(targetFor(file, ctx));
      const relative = path.relative(boundary, dest);
      if (relative === ".." || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
        throw new Error(`Registry file path escapes the install directory: ${file.path}`);
      }
      return { file, dest };
    });
  for (const { file, dest } of files) {
    if (existsSync(dest) && !ctx.overwrite) {
      skipped.push(path.relative(ctx.root, dest));
      continue;
    }
    await mkdir(path.dirname(dest), { recursive: true });
    await writeFile(dest, rewriteImports(file.content, ctx.aliases));
    written.push(path.relative(ctx.root, dest));
  }
  return { written, skipped };
}

/* ------------------------------------------------------------------ commands */

async function init(root, flags) {
  if (!existsSync(path.join(root, "package.json"))) fail("No package.json here. Run init from the root of a React project.");

  const rl = flags.yes ? null : createInterface({ input: stdin, output: stdout });
  const ask = async (q, d) => (rl ? (await rl.question(`${c.cyan("?")} ${q} ${c.dim(`(${d})`)} `)).trim() || d : d);

  const guessCss = ["src/index.css", "src/app/globals.css", "app/globals.css", "src/styles.css", "src/globals.css"].find((f) =>
    existsSync(path.join(root, f)),
  );
  const css = flags.css ?? (await ask("Where is your global CSS file?", guessCss ?? "src/index.css"));
  const registry = flags.registry ?? DEFAULT_REGISTRY;
  rl?.close();

  const config = {
    $schema: "https://dxuireact.com/schema.json",
    registry,
    css,
    aliases: { components: "@/components", ui: "@/components/ui", dx: "@/components/dx", lib: "@/lib", hooks: "@/hooks" },
  };
  await writeFile(path.join(root, CONFIG_FILE), `${JSON.stringify(config, null, 2)}\n`);
  ok(`Wrote ${CONFIG_FILE}`);

  const base = await aliasRoot(root);
  const [utils, theme] = await Promise.all([fetchItem(registry, "utils"), fetchItem(registry, "theme")]);
  const ctx = { root, base, aliases: config.aliases, overwrite: true };
  const { written } = await writeFiles(utils, ctx);
  written.forEach((f) => ok(`Added ${f}`));

  // Theme stylesheet lives next to the global CSS and is imported from it.
  const cssPath = path.join(root, css);
  const themeFile = theme.files.find((f) => f.path.endsWith(".css"));
  await mkdir(path.dirname(cssPath), { recursive: true });
  await writeFile(path.join(path.dirname(cssPath), "dx-theme.css"), themeFile.content);
  ok(`Added ${path.relative(root, path.join(path.dirname(cssPath), "dx-theme.css"))}`);

  const current = existsSync(cssPath) ? await readFile(cssPath, "utf8") : "";
  const has = (needle) => current.includes(needle);
  const header = ['@import "tailwindcss";'];
  if (!has("tw-animate-css")) header.push('@import "tw-animate-css";');
  if (!has("dx-theme.css")) header.push('@import "./dx-theme.css";');
  if (!has("@custom-variant dark")) header.push("", "@custom-variant dark (&:is(.dark *));");
  if (header.length > 1 || !has("tailwindcss")) {
    const body = current.replace(/@import\s+["']tailwindcss["'];?[^\n]*\n?/, "").trimStart();
    await writeFile(cssPath, `${header.join("\n")}\n${body ? `\n${body}` : ""}`);
    ok(`Updated ${css}`);
  }

  await install(root, [...BASE_DEPS, ...(utils.dependencies ?? []), ...(theme.dependencies ?? [])]);
  log(`\n${c.bold("DX UI is ready.")} Add components with ${c.cyan("npx @sidioralabs/designx-ui@latest add button")}`);
}

async function add(root, names, flags) {
  const config = await loadConfig(root);
  if (flags.all) {
    const index = await fetchItem(config.registry, "index");
    names = index.filter((i) => i.type === "registry:ui" || i.type === "registry:component").map((i) => i.name);
  }
  if (!names.length) {
    const index = await fetchItem(config.registry, "index");
    log(`Usage: ${c.cyan("dx-ui add <component...>")}\n\nAvailable: ${index.map((i) => i.name).join(", ")}`);
    return;
  }

  const items = await resolveTree(config.registry, names);
  const base = await aliasRoot(root);
  const custom = flags.path ? path.resolve(root, flags.path) : undefined;
  const deps = [];
  let skippedAny = false;

  for (const item of items) {
    if (item.type === "registry:style") continue; // theme is handled by init
    const requested = names.includes(item.name);
    const { written, skipped } = await writeFiles(item, {
      root,
      base,
      aliases: config.aliases,
      overwrite: Boolean(flags.overwrite) && requested,
      custom: requested ? custom : undefined,
    });
    written.forEach((f) => ok(`${item.name.padEnd(18)} ${c.dim(f)}`));
    if (requested && skipped.length) {
      skippedAny = true;
      skipped.forEach((f) => warn(`${item.name.padEnd(18)} ${c.dim(`${f} exists, skipped`)}`));
    }
    deps.push(...(item.dependencies ?? []));
  }
  if (skippedAny) log(c.dim("  Use --overwrite to replace existing files."));
  await install(root, deps);
}

async function list(root) {
  let registry = DEFAULT_REGISTRY;
  if (existsSync(path.join(root, CONFIG_FILE))) registry = (await loadConfig(root)).registry;
  const index = await fetchItem(registry, "index");
  const groups = [
    ["Components", "registry:ui"],
    ["DX Motion", "registry:component"],
    ["Blocks", "registry:block"],
    ["Library", "registry:lib"],
  ];
  for (const [title, type] of groups) {
    const rows = index.filter((i) => i.type === type);
    if (!rows.length) continue;
    log(`\n${c.bold(title)} ${c.dim(`(${rows.length})`)}`);
    for (const r of rows) log(`  ${r.name.padEnd(20)} ${c.dim(r.description ?? "")}`);
  }
}

const HELP = `${c.bold("dx-ui")} ${c.dim(`v${VERSION}`)} — DesignX UI

${c.bold("Usage")}
  npx @sidioralabs/designx-ui@latest <command> [options]

${c.bold("Commands")}
  init                 set up dx.json, theme CSS, utils and base dependencies
  add [components...]  add components and their dependencies
  list                 list everything in the registry

${c.bold("Options")}
  -y, --yes            skip prompts and use defaults        (init)
  --css <path>         global stylesheet to import the theme into (init)
  --registry <url>     custom registry template, {name} is replaced (init)
  -a, --all            add every component                  (add)
  -o, --overwrite      overwrite existing files             (add)
  -p, --path <dir>     install into a custom directory      (add)
  --cwd <dir>          run in another directory
  -h, --help           show help
  -v, --version        show version
`;

async function main() {
  const [command, ...rest] = argv.slice(2);
  const { flags, positional } = parseArgs(rest);
  if (!command || command === "help" || command === "-h" || command === "--help" || flags.help) return log(HELP);
  if (command === "-v" || command === "--version") return log(VERSION);
  const root = path.resolve(flags.cwd ?? getCwd());
  if (command === "init") return init(root, flags);
  if (command === "add") return add(root, positional, flags);
  if (command === "list" || command === "ls") return list(root);
  fail(`Unknown command "${command}". Run ${c.cyan("dx-ui --help")}.`);
}

main().catch((err) => fail(err instanceof Error ? err.message : String(err)));
