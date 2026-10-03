import { Link } from "wouter";
import { ArrowRightIcon, BoxIcon, PaletteIcon, SparklesIcon, TerminalIcon } from "lucide-react";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeBlock } from "../code-block";
import { registryTemplate } from "../registry-url";

export function IntroductionGuide() {
  return (
    <>
      <p>
        DX UI is the DesignX component system: around seventy accessible components built on{" "}
        <a href="https://base-ui.com" target="_blank" rel="noreferrer">
          Base UI
        </a>
        , styled with Tailwind 4 and animated with Motion. It is not a package you install and wrap. You copy the
        source into your app and it becomes your code.
      </p>
      <p>
        The visual language is calm and tonal. Actions are pill-shaped. Surfaces step through a five-level container
        ladder instead of stacking shadows, and interactive states use a shared state layer. Motion runs on springs with
        no bounce. A separate set of <strong>DX Motion</strong> components adds expressive micro-interactions: smooth
        carets, rolling digits, gooey filters and the DX gradient glow.
      </p>
      <h2 id="principles">Principles</h2>
      <ul>
        <li>
          <strong>Open code.</strong> Every component is a single file you can read, fork and change.
        </li>
        <li>
          <strong>Composition over configuration.</strong> Parts compose with the Base UI <code>render</code> prop instead of an
          ever-growing list of props.
        </li>
        <li>
          <strong>Accessible by default.</strong> Keyboard navigation, focus management and ARIA come from tested primitives.
        </li>
        <li>
          <strong>Tokens first.</strong> Change the CSS variables to rebrand the whole system.
        </li>
        <li>
          <strong>shadcn compatible.</strong> The registry follows the shadcn schema, so either CLI can install from it.
        </li>
      </ul>
      <div className="not-prose mt-8 grid gap-3 sm:grid-cols-2">
        {[
          { href: "/docs/installation", icon: BoxIcon, title: "Installation", desc: "Set up a new or existing project." },
          { href: "/docs/cli", icon: TerminalIcon, title: "CLI", desc: "Add components with one command." },
          { href: "/docs/theming", icon: PaletteIcon, title: "Theming", desc: "Tokens, surfaces and accents." },
          { href: "/docs/components/smooth-input", icon: SparklesIcon, title: "DX Motion", desc: "The expressive layer." },
        ].map((c) => (
          <Link key={c.href} href={c.href} className="focus-ring group rounded-xl">
            <Card variant="tonal" className="h-full transition-colors group-hover:bg-container-high">
              <CardHeader>
                <c.icon className="mb-2 size-5 text-muted-foreground" />
                <CardTitle className="flex items-center gap-1.5">
                  {c.title} <ArrowRightIcon className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
                </CardTitle>
                <CardDescription>{c.desc}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}

export function InstallationGuide() {
  return (
    <>
      <p>DX UI needs React 19 and Tailwind CSS 4. These steps use Vite, and they work the same in Next.js, Remix or any other React setup.</p>
      <h2 id="create">1. Create a project</h2>
      <CodeBlock lang="bash" code={`npm create vite@latest my-app -- --template react-ts\ncd my-app\nnpm install tailwindcss @tailwindcss/vite`} />
      <h2 id="alias">2. Configure the path alias</h2>
      <p>
        Components import each other through <code>@/</code>. Add the alias to <code>tsconfig.json</code> and <code>vite.config.ts</code>.
      </p>
      <CodeBlock
        title="vite.config.ts"
        code={`import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
})`}
      />
      <h2 id="init">3. Run init</h2>
      <p>
        <code>init</code> writes <code>dx.json</code>, installs the base dependencies, and adds <code>lib/utils.ts</code> and the
        theme stylesheet.
      </p>
      <CodeBlock lang="bash" code="npx @sidioralabs/designx-ui@latest init" />
      <h2 id="add">4. Add components</h2>
      <CodeBlock lang="bash" code="npx @sidioralabs/designx-ui@latest add button card dialog" />
      <CodeBlock
        title="src/App.tsx"
        code={`import { Button } from "@/components/ui/button"

export default function App() {
  return <Button>Hello DX</Button>
}`}
      />
      <h2 id="shadcn">Using the shadcn CLI instead</h2>
      <p>
        If your project already uses shadcn, add DX UI as a namespaced registry in <code>components.json</code>:
      </p>
      <CodeBlock lang="json" title="components.json" code={JSON.stringify({ registries: { "@dx": registryTemplate } }, null, 2)} />
      <CodeBlock lang="bash" code={`npx shadcn@latest add @dx/theme @dx/button`} />
      <h2 id="fonts">Fonts</h2>
      <p>
        The theme uses Google Sans Flex and Google Sans Code and falls back to system UI fonts. Load the fonts in your{" "}
        <code>index.html</code>, or set <code>--font-sans</code> and <code>--font-mono</code> to fonts of your own.
      </p>
    </>
  );
}

export function CliGuide() {
  return (
    <>
      <p>
        The <code>dx-ui</code> CLI installs components from the DX registry. It resolves registry dependencies such as{" "}
        <code>button</code> to <code>utils</code>, installs npm packages with your package manager, and rewrites import aliases to
        match your project.
      </p>
      <h2 id="init">init</h2>
      <p>Sets up a project: config file, theme CSS, the utilities and base dependencies.</p>
      <CodeBlock lang="bash" code={`npx @sidioralabs/designx-ui@latest init\n\nOptions:\n  -y, --yes            skip prompts and use defaults\n  --css <path>         stylesheet to write the theme into (default: src/index.css)\n  --registry <url>     custom registry template`} />
      <h2 id="add">add</h2>
      <p>Adds one or more components and their dependencies.</p>
      <CodeBlock lang="bash" code={`npx @sidioralabs/designx-ui@latest add [components...]\n\nOptions:\n  -a, --all            add every component\n  -o, --overwrite      overwrite existing files\n  -p, --path <dir>     install into a custom directory`} />
      <h2 id="list">list</h2>
      <CodeBlock lang="bash" code="npx @sidioralabs/designx-ui@latest list" />
      <h2 id="config">dx.json</h2>
      <CodeBlock
        lang="json"
        title="dx.json"
        code={JSON.stringify(
          {
            $schema: "https://dxuireact.com/schema.json",
            registry: registryTemplate,
            css: "src/index.css",
            aliases: { components: "@/components", ui: "@/components/ui", dx: "@/components/dx", lib: "@/lib", hooks: "@/hooks" },
          },
          null,
          2,
        )}
      />
      <h2 id="registry">Registry</h2>
      <p>
        Every item is served as JSON that follows the shadcn <code>registry-item</code> schema. The full index is at{" "}
        <a href="/r/registry.json" target="_blank" rel="noreferrer">
          /r/registry.json
        </a>
        .
      </p>
      <CodeBlock lang="bash" code={`curl ${registryTemplate.replace("{name}", "button")}`} />
    </>
  );
}

export function DarkModeGuide() {
  return (
    <>
      <p>
        Dark mode is class based: adding <code>.dark</code> to <code>&lt;html&gt;</code> switches every token. A small inline
        script applies the stored preference before first paint, so the page never flashes the wrong theme.
      </p>
      <h2 id="script">No-flash script</h2>
      <CodeBlock
        lang="tsx"
        title="index.html"
        code={`<script>
  (function () {
    var t = localStorage.getItem("dx-theme") || "system";
    var dark = t === "dark" || (t === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", dark);
    if (localStorage.getItem("dx-accent") === "dx-gradient") document.documentElement.classList.add("accent-dx-gradient");
  })();
</script>`}
      />
      <h2 id="provider">ThemeProvider</h2>
      <CodeBlock
        code={`import { ThemeProvider, useTheme } from "@/components/theme-provider"

<ThemeProvider>
  <App />
</ThemeProvider>

function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  return <Button onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>Toggle</Button>
}`}
      />
      <p>
        <code>useTheme()</code> returns <code>theme</code>, <code>resolvedTheme</code>, <code>accent</code>, <code>setTheme</code>,{" "}
        <code>setAccent</code> and <code>toggleTheme</code>.
      </p>
    </>
  );
}
