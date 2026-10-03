import assert from "node:assert/strict";
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import test from "node:test";

const cli = fileURLToPath(new URL("../bin/dx-ui.mjs", import.meta.url));
const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
const baseDependencies = ["@base-ui/react", "class-variance-authority", "clsx", "tailwind-merge", "lucide-react", "tw-animate-css"];

function runCli(args, cwd = process.cwd()) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [cli, ...args], { cwd, env: { ...process.env, NO_COLOR: "1" } });
    let stdout = "";
    let stderr = "";
    const timer = setTimeout(() => child.kill("SIGTERM"), 10_000);
    child.stdout.setEncoding("utf8").on("data", (chunk) => (stdout += chunk));
    child.stderr.setEncoding("utf8").on("data", (chunk) => (stderr += chunk));
    child.once("error", reject);
    child.once("close", (status, signal) => {
      clearTimeout(timer);
      if (signal) reject(new Error(`CLI process ended with signal ${signal}`));
      else resolve({ status, stdout, stderr });
    });
  });
}

async function createProject(t) {
  const root = await mkdtemp(path.join(tmpdir(), "designx-ui-test-"));
  const project = path.join(root, "project");
  await mkdir(path.join(project, "src"), { recursive: true });
  await writeFile(
    path.join(project, "package.json"),
    JSON.stringify({ dependencies: Object.fromEntries(baseDependencies.map((name) => [name, "1.0.0"])) }),
  );
  await writeFile(path.join(project, "src/index.css"), "");
  t.after(() => rm(root, { recursive: true, force: true }));
  return { root, project };
}

async function startRegistry(t, items) {
  const server = createServer((req, res) => {
    const name = new URL(req.url, "http://127.0.0.1").pathname.split("/").at(-1).replace(/\.json$/, "");
    const item = items[name];
    if (!item) {
      res.writeHead(404).end();
      return;
    }
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify(item));
  });
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  t.after(() => new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve()))));
  const address = server.address();
  assert.ok(address && typeof address === "object");
  return `http://127.0.0.1:${address.port}/r/{name}.json`;
}

test("help and version use the published package name and metadata", async () => {
  const help = await runCli(["--help"]);
  assert.equal(help.status, 0);
  assert.match(help.stdout, /npx @sidioralabs\/designx-ui@latest/);
  assert.match(help.stdout, /dx-ui/);

  const version = await runCli(["--version"]);
  assert.equal(version.status, 0);
  assert.equal(version.stdout.trim(), packageJson.version);
});

test("the published config schema uses the canonical documentation host", async () => {
  const schema = JSON.parse(await readFile(new URL("../../public/schema.json", import.meta.url), "utf8"));
  assert.equal(schema.$id, "https://dxuireact.com/schema.json");
  assert.deepEqual(schema.required, ["registry", "css"]);
});

test("unknown commands exit unsuccessfully with a useful message", async () => {
  const result = await runCli(["not-a-command"]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Unknown command/);
});

test("init, add, and list work against a local registry", async (t) => {
  const { project } = await createProject(t);
  const registry = await startRegistry(t, {
    index: [{ name: "button", type: "registry:ui", description: "Fixture button" }],
    utils: {
      name: "utils",
      type: "registry:lib",
      files: [{ path: "lib/utils.ts", type: "registry:lib", content: 'export const cn = () => "";\n' }],
    },
    theme: {
      name: "theme",
      type: "registry:style",
      files: [{ path: "dx-theme.css", type: "registry:file", content: ":root { --dx-test: 1; }\n" }],
    },
    button: {
      name: "button",
      type: "registry:ui",
      files: [{ path: "ui/button.tsx", type: "registry:ui", content: 'export const Button = "ok";\n' }],
    },
  });

  const init = await runCli(["init", "--yes", "--registry", registry, "--cwd", project]);
  assert.equal(init.status, 0, init.stderr);
  const config = JSON.parse(await readFile(path.join(project, "dx.json"), "utf8"));
  assert.equal(config.registry, registry);
  assert.equal(config.$schema, "https://dxuireact.com/schema.json");
  assert.equal(await readFile(path.join(project, "src/lib/utils.ts"), "utf8"), 'export const cn = () => "";\n');
  assert.match(await readFile(path.join(project, "src/index.css"), "utf8"), /dx-theme\.css/);

  const add = await runCli(["add", "button", "--cwd", project]);
  assert.equal(add.status, 0, add.stderr);
  assert.equal(await readFile(path.join(project, "src/components/ui/button.tsx"), "utf8"), 'export const Button = "ok";\n');

  const list = await runCli(["list", "--cwd", project]);
  assert.equal(list.status, 0, list.stderr);
  assert.match(list.stdout, /button/);
});

test("registry file targets cannot escape the project directory", async (t) => {
  const { root, project } = await createProject(t);
  const escapedName = `outside-${path.basename(root)}.txt`;
  const registry = await startRegistry(t, {
    escape: {
      name: "escape",
      type: "registry:component",
      files: [{ path: "escape.tsx", target: `../../../${escapedName}`, type: "registry:component", content: "unsafe" }],
    },
  });
  await writeFile(path.join(project, "dx.json"), JSON.stringify({ registry }));

  const result = await runCli(["add", "escape", "--cwd", project]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /escapes the install directory/);
  assert.equal(existsSync(path.join(root, escapedName)), false);
});
