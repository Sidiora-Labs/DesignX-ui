import * as React from "react";
import { Link } from "wouter";
import { ArrowRightIcon, BlocksIcon, HeartHandshakeIcon, PaletteIcon, PlayIcon, TerminalIcon, WrenchIcon } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { SiReact, SiShadcnui, SiTailwindcss, SiTypescript, SiVite } from "react-icons/si";
import { useInView } from "motion/react";

import { cn } from "@/lib/utils";
import { BouncyAccordion } from "@/components/motion/bouncy-accordion";
import { Spinner } from "@/components/ui/spinner";
import { blocks } from "@/docs/catalog";
import { CopyButton } from "@/docs/copy-button";
import { btn, Eyebrow, Frame, SectionHeading, SegmentedPill, Serif, Tile, type Segment } from "@/site/ui";

/* ------------------------------------------------------------------ logo strip */

const STACK: { name: string; icon?: React.ComponentType<{ className?: string }> }[] = [
  { name: "React", icon: SiReact },
  { name: "Base UI" },
  { name: "Tailwind CSS", icon: SiTailwindcss },
  { name: "Motion" },
  { name: "TypeScript", icon: SiTypescript },
  { name: "shadcn registry", icon: SiShadcnui },
  { name: "Vite", icon: SiVite },
];

/** Grayscale band of the stack DX UI is built on. Floats on canvas — no container. */
export function StackStrip() {
  return (
    <section aria-label="Built on" className="mx-auto max-w-[1200px] px-4 py-16 md:px-6 md:py-24">
      <Eyebrow className="mb-8 text-center text-faint">Built on</Eyebrow>
      <ul className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 text-faint md:gap-x-16">
        {STACK.map(({ name, icon: Icon }) => (
          <li key={name} className="flex items-center gap-2 text-lg font-semibold tracking-[-0.025em]">
            {Icon && <Icon className="size-5" />}
            {name}
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ getting started */

const STEPS = [
  {
    n: "01",
    title: "Initialise",
    body: "Sets up tokens, the cn helper and a components.json in your project.",
    cmd: "npx @sidioralabs/designx-ui@latest init",
  },
  {
    n: "02",
    title: "Add what you need",
    body: "Pull any component, kit item or block. Dependencies resolve automatically. The shadcn CLI works too.",
    cmd: "npx @sidioralabs/designx-ui@latest add chat-app",
    alt: "npx shadcn@latest add @dx/chat-app",
  },
  {
    n: "03",
    title: "Own the code",
    body: "Files land in your repo as plain TypeScript. Change the markup, the springs, the tokens — no wrapper to fight.",
    cmd: "components/agents/chat-app.tsx",
  },
];

function Cmd({ value, dim }: { value: string; dim?: boolean }) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-2 rounded-2xl bg-canvas py-1 pr-1 pl-4 font-code text-[13px] tracking-[-0.025em]">
      <span className={cn("min-w-0 truncate", dim ? "text-faint" : "text-ink")}>{value}</span>
      <CopyButton value={value} />
    </div>
  );
}

export function GettingStarted() {
  return (
    <section aria-labelledby="landing-start" className="mx-auto max-w-[1200px] px-4 py-16 md:px-6 md:py-24">
      <SectionHeading
        id="landing-start"
        eyebrow="Getting started"
        title={
          <>
            Three commands. Then it's <Serif>your code.</Serif>
          </>
        }
        action={
          <Link href="/docs/installation" className={btn({ variant: "ghost" })}>
            Installation guide <ArrowRightIcon />
          </Link>
        }
      >
        No package to version-lock, no wrapper to fight. The CLI copies source into your repository and steps aside.
      </SectionHeading>
      <ol className="grid gap-4 md:grid-cols-3">
        {STEPS.map((s) => (
          <li key={s.n} className="min-w-0">
            <Tile className="flex h-full flex-col gap-6">
              <span className="font-code text-[11px] tracking-[0.06em] text-pencil tabular-nums">{s.n}</span>
              <div>
                <h3 className="text-lg leading-[1.33] font-semibold tracking-[-0.025em] text-ink">{s.title}</h3>
                <p className="mt-4 text-sm leading-[1.43] text-pencil">{s.body}</p>
              </div>
              <div className="mt-auto flex min-w-0 flex-col gap-2">
                <Cmd value={s.cmd} />
                {s.alt && <Cmd value={s.alt} dim />}
              </div>
            </Tile>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ------------------------------------------------------------------ blocks */

const FEATURED = ["dashboard-01", "trading-01", "settings-01"] as const;
const BLOCK_SEGMENTS: Segment<(typeof FEATURED)[number]>[] = FEATURED.map((slug) => ({
  value: slug,
  label: blocks.find((b) => b.slug === slug)?.title.split(" — ")[0] ?? slug,
}));

export function BlocksShowcase() {
  const [slug, setSlug] = React.useState<(typeof FEATURED)[number]>("dashboard-01");
  const [loaded, setLoaded] = React.useState<string | null>(null);
  const ref = React.useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "300px 0px" });
  return (
    <section aria-labelledby="landing-blocks" className="mx-auto max-w-[1200px] px-4 py-16 md:px-6 md:py-24">
      <SectionHeading
        id="landing-blocks"
        eyebrow={`${blocks.length} blocks`}
        title={
          <>
            Whole screens, for the <Serif>real thing.</Serif>
          </>
        }
        action={
          <Link href="/blocks" className={btn({ variant: "ghost" })}>
            View all blocks <ArrowRightIcon />
          </Link>
        }
      >
        Dashboards, auth flows and trading terminals composed from the same components. One command drops a full page into your app.
      </SectionHeading>
      <SegmentedPill id="landing-blocks" label="Featured blocks" tone="quiet" items={BLOCK_SEGMENTS} value={slug} onValueChange={setSlug} className="mb-4" />
      <Frame ref={ref} className="relative h-[520px] md:h-[680px]">
        {loaded !== slug && (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            <Spinner />
          </div>
        )}
        {seen && (
          // oxlint-disable-next-line react/iframe-missing-sandbox -- same-origin preview of our own block
          <iframe
            key={slug}
            src={`/blocks/view/${slug}`}
            title={`${slug} block preview`}
            loading="lazy"
            onLoad={() => setLoaded(slug)}
            className={cn("size-full bg-background transition-opacity duration-300", loaded === slug ? "opacity-100" : "opacity-0")}
          />
        )}
      </Frame>
    </section>
  );
}

/* ------------------------------------------------------------------ faq */

const FAQ = [
  {
    id: "free",
    icon: <HeartHandshakeIcon className="size-4" />,
    title: "Is DX UI free to use?",
    description:
      "Yes. Every component, kit item and block is MIT licensed. Use it in personal, commercial and client projects without attribution.",
  },
  {
    id: "install",
    icon: <TerminalIcon className="size-4" />,
    title: "How do I install a component?",
    description:
      "Run npx @sidioralabs/designx-ui@latest init once, then npx @sidioralabs/designx-ui@latest add <name>. Each docs page also has a Manual tab with every file and dependency if you'd rather paste it in.",
  },
  {
    id: "requirements",
    icon: <WrenchIcon className="size-4" />,
    title: "What does my project need?",
    description:
      "React 19, Tailwind CSS 4 and TypeScript. Interactive primitives are built on Base UI and animation runs on Motion — the CLI installs both when a component needs them.",
  },
  {
    id: "customise",
    icon: <PaletteIcon className="size-4" />,
    title: "Can I customise the look?",
    description:
      "Everything reads from CSS variables, so a theme is a handful of tokens. Pick a scheme on the Themes page, or edit the component source directly — it lives in your repo.",
  },
  {
    id: "shadcn",
    icon: <BlocksIcon className="size-4" />,
    title: "Does it work with the shadcn CLI?",
    description:
      "Yes. The registry follows the shadcn schema. Add the @dx namespace to components.json and run npx shadcn@latest add @dx/<name>. It mixes cleanly with existing shadcn components.",
  },
];

export function Faq() {
  return (
    <section aria-labelledby="landing-faq" className="mx-auto grid max-w-[1200px] gap-10 px-4 py-16 md:grid-cols-[1fr_1.4fr] md:gap-16 md:px-6 md:py-24">
      <div>
        <SectionHeading
          id="landing-faq"
          eyebrow="FAQ"
          className="mb-8 sm:mb-8 md:flex-col md:items-start"
          title={
            <>
              Questions, <Serif>answered.</Serif>
            </>
          }
        >
          Anything else? The docs cover installation, theming and the registry in detail.
        </SectionHeading>
        <Link href="/docs" className={btn({ variant: "ghost" })}>
          Read the docs <ArrowRightIcon />
        </Link>
      </div>
      <div className="dx-scope">
        <BouncyAccordion items={FAQ} defaultValue="free" />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ closing statement */

export function BuildCta() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 pt-16 pb-24 text-center md:px-6 md:pt-24 md:pb-48">
      <h2 className="text-[clamp(2.75rem,9vw,6rem)] leading-none font-bold tracking-[-0.05em] text-ink">
        Build with
        <br />
        <span className="font-editorial text-[clamp(3.5rem,12vw,8rem)] font-normal tracking-[-0.025em] italic">DX UI.</span>
      </h2>
      <p className="mx-auto mt-8 max-w-lg text-lg leading-[1.33] tracking-[-0.025em] text-pretty text-pencil">
        Components, kits and blocks that feel finished on day one — and stay yours on day one hundred.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
        <Link href="/docs" className={btn({ size: "lg" })}>
          Get started
        </Link>
        <a href="https://github.com/Sidiora-Labs/DesignX-ui" target="_blank" rel="noreferrer" className={btn({ variant: "ghost", size: "lg" })}>
          <FaGithub /> Star on GitHub
        </a>
      </div>
    </section>
  );
}

/** Ghost action with a media affordance, used in the hero. */
export function LiveDemoLink({ href }: { href: string }) {
  return (
    <a href={href} className={btn({ variant: "ghost", size: "lg", className: "w-full sm:w-auto" })}>
      <PlayIcon className="size-3.5 fill-current" /> See it live
    </a>
  );
}
