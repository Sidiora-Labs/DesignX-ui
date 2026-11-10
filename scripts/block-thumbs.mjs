#!/usr/bin/env node
/**
 * Renders a light and a dark thumbnail for every block into
 * public/images/blocks/<slug>.webp and <slug>.dark.webp.
 *
 * The /blocks gallery shows these instead of mounting a live iframe per block.
 * Re-run after adding or restyling a block:
 *
 *   bun run dev            # in another terminal
 *   node scripts/block-thumbs.mjs [http://localhost:5173] [slug ...]
 *
 * Needs `playwright` resolvable from this machine (it is not a project dependency).
 */
import { mkdir, readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "public/images/blocks");

const args = process.argv.slice(2);
const base = args.find((a) => /^https?:/.test(a)) ?? "http://localhost:5173";
const only = args.filter((a) => !/^https?:/.test(a));

const catalog = await readFile(path.join(root, "src/web/docs/catalog.ts"), "utf8");
const section = catalog.slice(catalog.indexOf("export const blocks"));
const slugs = [...section.matchAll(/slug:\s*"([\w-]+)"/g)].map((m) => m[1]).filter((s) => !only.length || only.includes(s));

const { chromium } = require("playwright");
const sharp = require("sharp");

const VIEW = { width: 1280, height: 800 };
const OUT_WIDTH = 880;

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();
for (const theme of ["light", "dark"]) {
  const ctx = await browser.newContext({ viewport: VIEW, deviceScaleFactor: 1, reducedMotion: "no-preference" });
  await ctx.addInitScript((t) => {
    localStorage.setItem("dx-theme", t);
    localStorage.removeItem("dx-accent");
    localStorage.removeItem("dx-custom-theme");
  }, theme);
  for (const slug of slugs) {
    const page = await ctx.newPage();
    await page.goto(`${base}/blocks/view/${slug}`, { waitUntil: "networkidle", timeout: 60_000 }).catch(() => {});
    await page.waitForTimeout(2200); // entrance animations and count-ups
    // Strip dev/analytics overlays injected on localhost so they don't end up in the thumbnail.
    await page.evaluate(() => {
      for (const el of document.querySelectorAll("body *")) {
        const text = (el.shadowRoot?.textContent ?? "") + (el.children.length === 0 ? (el.textContent ?? "") : "");
        if (/debug window|tracking localhost/i.test(text)) (el.closest("body > *") ?? el).remove();
      }
    });
    const png = await page.screenshot({ type: "png" });
    const file = path.join(outDir, `${slug}${theme === "dark" ? ".dark" : ""}.webp`);
    await sharp(png).resize({ width: OUT_WIDTH }).webp({ quality: 78 }).toFile(file);
    await page.close();
    console.log(`${theme.padEnd(5)} ${slug}`);
  }
  await ctx.close();
}
await browser.close();
