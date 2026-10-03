import * as React from "react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { CodeBlock } from "../code-block";
import { CopyButton } from "../copy-button";

const surfaces = ["background", "container", "container-high", "container-higher", "container-highest"];
const semantic = [
  "primary",
  "secondary",
  "muted-foreground",
  "accent",
  "destructive",
  "success",
  "warning",
  "info",
  "border",
  "outline-variant",
  "input",
  "ring",
];
const hues = ["blue", "green", "grey", "pink", "purple", "red", "yellow"];
const radii = ["xs", "sm", "md", "lg", "xl", "2xl"];

function Swatch({ name, value }: { name: string; value: string }) {
  return (
    <div className="group flex items-center gap-3 rounded-lg p-1.5 hover:bg-container">
      <div className="size-10 shrink-0 rounded-md border border-outline-variant" style={{ background: value }} />
      <div className="min-w-0 flex-1">
        <div className="truncate font-mono text-[12.5px]">--{name}</div>
        <ComputedValue variable={`--${name}`} />
      </div>
      <CopyButton value={`var(--${name})`} className="opacity-0 group-hover:opacity-100" />
    </div>
  );
}

/** Shows the live resolved value so the table updates with the theme toggle. */
function ComputedValue({ variable }: { variable: string }) {
  const [v, setV] = React.useState("");
  React.useEffect(() => {
    const read = () => setV(getComputedStyle(document.documentElement).getPropertyValue(variable).trim());
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, [variable]);
  return <div className="truncate font-mono text-[11.5px] text-muted-foreground">{v}</div>;
}

export function ThemingGuide() {
  return (
    <>
      <p>
        DX UI is themed with CSS variables. The components only ever use semantic utilities such as <code>bg-primary</code>,{" "}
        <code>bg-container-high</code> and <code>text-muted-foreground</code>, so changing a variable restyles everything
        that uses it.
      </p>
      <h2 id="surfaces">The surface ladder</h2>
      <p>
        Depth comes from tone rather than shadow. Content sits on one of five surfaces, and each step is slightly further
        from the background. Shadows are reserved for elements that really float: popovers, dialogs and toasts.
      </p>
      <div className="not-prose my-6 grid grid-cols-5 overflow-hidden rounded-xl border border-outline-variant">
        {surfaces.map((s) => (
          <div key={s} className="flex h-28 flex-col justify-end p-3" style={{ background: `var(--${s})` }}>
            <span className="font-mono text-[11px] text-muted-foreground">{s}</span>
          </div>
        ))}
      </div>
      <h2 id="state-layers">State layers</h2>
      <p>
        Hover, press and focus don't introduce new colors. The <code>state-layer</code> utility overlays{" "}
        <code>currentColor</code> at fixed opacities (5% hover, 9% press, 12% focus), so any surface gets consistent
        feedback for free.
      </p>
      <CodeBlock code={`<button className="state-layer focus-ring rounded-full px-4 py-2">Hover me</button>`} />
      <h2 id="customize">Customizing</h2>
      <p>Override tokens on <code>:root</code> and <code>.dark</code>:</p>
      <CodeBlock
        lang="css"
        title="src/index.css"
        code={`:root {
  --primary: #0b57d0;
  --primary-foreground: #ffffff;
  --ring: #0b57d0;
  --radius-xl: 20px;
}

.dark {
  --primary: #a8c7fa;
  --primary-foreground: #062e6f;
}`}
      />
      <h2 id="dx-gradient">DX Gradient accent</h2>
      <p>
        Add <code>.accent-dx-gradient</code> to <code>&lt;html&gt;</code> and the ink primary becomes the blue DX gradient. Use it for
        AI-forward products. Default buttons pick up the gradient through the <code>primary-fill</code> utility.
      </p>
      <div className="not-prose accent-dx-gradient my-6 flex flex-wrap items-center gap-3 rounded-xl border border-outline-variant p-6">
        <Button className="primary-fill">DX Gradient primary</Button>
        <Button variant="tonal">Tonal</Button>
        <Button variant="outline">Outline</Button>
      </div>
      <p>
        See every token on the <a href="/themes">Themes</a> page.
      </p>
    </>
  );
}

export function TokensGuide() {
  return (
    <>
      <p>Every value below is read live from the page, so it changes when you switch theme or accent.</p>
      <h2 id="surfaces">Surfaces</h2>
      <div className="not-prose grid gap-1 sm:grid-cols-2">
        {surfaces.map((s) => (
          <Swatch key={s} name={s} value={`var(--${s})`} />
        ))}
      </div>
      <h2 id="semantic">Semantic</h2>
      <div className="not-prose grid gap-1 sm:grid-cols-2">
        {semantic.map((s) => (
          <Swatch key={s} name={s} value={`var(--${s})`} />
        ))}
      </div>
      <h2 id="palette">Data-vis palette</h2>
      <p>
        There are seven hues at five emphasis levels: <code>--dx-&lt;hue&gt;-1</code> through <code>-5</code>. Charts use{" "}
        <code>--chart-1</code> to <code>--chart-5</code>.
      </p>
      <div className="not-prose grid gap-2">
        {hues.map((h) => (
          <div key={h} className="grid grid-cols-[64px_repeat(5,1fr)] items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">{h}</span>
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="h-10 rounded-md" style={{ background: `var(--dx-${h}-${n})` }} title={`--dx-${h}-${n}`} />
            ))}
          </div>
        ))}
      </div>
      <h2 id="radius">Radius</h2>
      <div className="not-prose flex flex-wrap gap-4">
        {radii.map((r) => (
          <div key={r} className="grid justify-items-center gap-2">
            <div className="size-16 border border-border bg-container" style={{ borderRadius: `var(--radius-${r})` }} />
            <span className="font-mono text-xs text-muted-foreground">{r}</span>
          </div>
        ))}
        <div className="grid justify-items-center gap-2">
          <div className="size-16 rounded-full border border-border bg-container" />
          <span className="font-mono text-xs text-muted-foreground">full</span>
        </div>
      </div>
      <h2 id="motion">Easing</h2>
      <CodeBlock lang="css" code={`--ease-dx: cubic-bezier(0.2, 0, 0, 1);      /* standard */\n--ease-dx-out: cubic-bezier(0.05, 0.7, 0.1, 1); /* emphasized decelerate */`} />
    </>
  );
}

export function TypographyGuide() {
  return (
    <>
      <p>
        UI text uses <strong>Google Sans Flex</strong> with stylistic set 02, and code uses <strong>Google Sans Code</strong>.
        The base size is 14px with a line height of 1.45. Headings stay light (400 to 500) with tight negative tracking.
      </p>
      <div className="not-prose my-8 grid gap-5 rounded-xl border border-outline-variant p-6">
        {(["display", "h1", "h2", "h3", "h4", "lead", "p", "small", "muted", "eyebrow"] as const).map((v) => (
          <div key={v} className="grid grid-cols-[72px_1fr] items-baseline gap-4">
            <code className="font-mono text-xs text-muted-foreground">{v}</code>
            <Typography variant={v} className="truncate">
              Build with clarity
            </Typography>
          </div>
        ))}
      </div>
      <p>
        Use the <a href="/docs/components/typography">Typography</a> component, or copy the classes from{" "}
        <code>typographyVariants</code>.
      </p>
    </>
  );
}

export function MotionGuide() {
  const [on, setOn] = React.useState(false);
  return (
    <>
      <p>Motion in DX UI should feel physical and settled. The rules are short:</p>
      <ul>
        <li>
          <strong>Springs with no bounce</strong> for layout: <code>{`{ type: "spring", bounce: 0, duration: 0.5 }`}</code>.
        </li>
        <li>
          <strong>CSS transitions</strong> of 150 to 250ms on <code>--ease-dx</code> for color and opacity.
        </li>
        <li>
          <strong>Popups</strong> fade and scale from 0.96 to 1, starting from the trigger (<code>--transform-origin</code>).
        </li>
        <li>
          <strong>Respect reduced motion.</strong> Motion components honor <code>prefers-reduced-motion</code>.
        </li>
      </ul>
      <div className="not-prose my-8 flex flex-col items-center gap-6 rounded-xl border border-outline-variant p-10">
        <div className={cn("flex h-14 w-full max-w-sm rounded-full bg-container p-1", on ? "justify-end" : "justify-start")}>
          <motion.div layout className="size-12 rounded-full bg-primary" transition={{ type: "spring", bounce: 0, duration: 0.6 }} />
        </div>
        <Button variant="tonal" onClick={() => setOn((v) => !v)}>
          Play spring
        </Button>
      </div>
      <CodeBlock
        code={`import { motion } from "motion/react"

<motion.div
  animate={{ x: open ? 240 : 0 }}
  transition={{ type: "spring", bounce: 0, duration: 0.6 }}
/>`}
      />
      <p>
        The <a href="/docs/components/number-flow">DX Motion</a> components are more expressive and still follow the same
        springs.
      </p>
    </>
  );
}
