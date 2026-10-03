import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.resolve(process.argv[2] ?? path.join(root, "public/r"));
const errors = [];
const readJson = async (file) => JSON.parse(await readFile(file, "utf8"));
const registry = await readJson(path.join(output, "registry.json"));
const index = await readJson(path.join(output, "index.json"));
const schema = await readJson(path.join(path.dirname(output), "schema.json"));

if (!Array.isArray(registry.items)) errors.push("registry.json must contain an items array");
if (!Array.isArray(index)) errors.push("index.json must be an array");
if (schema.$id !== "https://dxuireact.com/schema.json") errors.push("schema.json must use the canonical dxuireact.com URL");
if (!Array.isArray(schema.required) || !schema.required.includes("registry") || !schema.required.includes("css")) {
  errors.push("schema.json must require registry and css");
}

const registryItems = Array.isArray(registry.items) ? registry.items : [];
const indexItems = Array.isArray(index) ? index : [];
const names = new Set();
const dependencies = [];
const safeRelativePath = (value) => {
  if (typeof value !== "string" || !value || /^[a-z]:[\\/]/i.test(value)) return false;
  const normalized = path.posix.normalize(value.replaceAll("\\", "/"));
  return !path.posix.isAbsolute(normalized) && normalized !== ".." && !normalized.startsWith("../");
};

for (const item of registryItems) {
  const name = item?.name;
  if (typeof name !== "string" || !/^[a-z0-9][a-z0-9-]*$/.test(name)) {
    errors.push(`invalid registry item name: ${String(name)}`);
    continue;
  }
  if (names.has(name)) errors.push(`duplicate registry item: ${name}`);
  names.add(name);
  const detail = await readJson(path.join(output, `${name}.json`));
  if (detail.name !== name) errors.push(`${name}.json declares the name ${String(detail.name)}`);
  if (detail.type !== item.type) errors.push(`${name}.json type does not match registry.json`);
  if (!Array.isArray(detail.files) || detail.files.length === 0) errors.push(`${name}.json must contain files`);
  for (const file of detail.files ?? []) {
    if (!safeRelativePath(file.path)) errors.push(`${name}.json has an unsafe file path: ${String(file.path)}`);
    if (file.target && !safeRelativePath(file.target)) errors.push(`${name}.json has an unsafe file target: ${String(file.target)}`);
    if (typeof file.content !== "string") errors.push(`${name}.json has a file without string content`);
  }
  for (const dependency of detail.registryDependencies ?? []) {
    const local = typeof dependency === "string" ? dependency.match(/^@dx\/(.+)$/) : null;
    if (local) dependencies.push({ name: local[1], owner: name });
  }
}

const indexedNames = new Set();
for (const entry of indexItems) {
  if (indexedNames.has(entry?.name)) errors.push(`duplicate index item: ${String(entry?.name)}`);
  indexedNames.add(entry?.name);
  if (!names.has(entry?.name)) errors.push(`index.json references missing item: ${String(entry?.name)}`);
  const detail = registryItems.find((item) => item?.name === entry?.name);
  if (detail && detail.type !== entry.type) errors.push(`index.json type does not match ${entry.name}.json`);
}
if (indexItems.length !== registryItems.length) errors.push("index.json and registry.json have different item counts");

for (const dependency of dependencies) {
  if (!names.has(dependency.name)) errors.push(`${dependency.owner}.json references missing registry item @dx/${dependency.name}`);
}

const expectedFiles = new Set(["index.json", "registry.json", ...[...names].map((name) => `${name}.json`)]);
const actualFiles = (await readdir(output)).filter((name) => name.endsWith(".json"));
for (const name of expectedFiles) if (!actualFiles.includes(name)) errors.push(`missing registry file: ${name}`);
for (const name of actualFiles) if (!expectedFiles.has(name)) errors.push(`unexpected registry JSON file: ${name}`);

if (errors.length) {
  console.error(`registry check failed for ${output}:\n${errors.map((error) => `- ${error}`).join("\n")}`);
  process.exitCode = 1;
} else {
  console.log(`✓ registry: ${registryItems.length} items and config schema validated in ${output}`);
}
