import type { HighlighterCore } from "shiki/core";

let highlighter: Promise<HighlighterCore> | null = null;

function getHighlighter() {
  if (!highlighter) {
    highlighter = (async () => {
      const [{ createHighlighterCore }, { createJavaScriptRegexEngine }] = await Promise.all([
        import("shiki/core"),
        import("shiki/engine/javascript"),
      ]);
      return createHighlighterCore({
        themes: [import("shiki/themes/github-light-default.mjs"), import("shiki/themes/github-dark-default.mjs")],
        langs: [
          import("shiki/langs/tsx.mjs"),
          import("shiki/langs/bash.mjs"),
          import("shiki/langs/css.mjs"),
          import("shiki/langs/json.mjs"),
        ],
        engine: createJavaScriptRegexEngine(),
      });
    })();
  }
  return highlighter;
}

const cache = new Map<string, string>();

export type CodeLang = "tsx" | "bash" | "css" | "json";

export async function highlight(code: string, lang: CodeLang = "tsx") {
  const key = `${lang}:${code}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const h = await getHighlighter();
  const html = h.codeToHtml(code, {
    lang,
    themes: { light: "github-light-default", dark: "github-dark-default" },
    defaultColor: "light",
  });
  cache.set(key, html);
  return html;
}
