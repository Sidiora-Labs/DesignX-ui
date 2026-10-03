import { Link } from "wouter";
import {
  ArrowRightIcon,
  BlocksIcon,
  CodeIcon,
  HeartHandshakeIcon,
  PackageIcon,
  PaletteIcon,
  TerminalIcon,
  WrenchIcon,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { BouncyAccordion } from "@/components/motion/bouncy-accordion";
import { CopyButton } from "@/docs/copy-button";
import { DxMark } from "@/docs/logo";

const STEPS = [
  {
    n: "01",
    icon: TerminalIcon,
    title: "Initialise",
    body: "Sets up tokens, the cn helper and a components.json in your project.",
    cmd: "npx @sidioralabs/designx-ui@latest init",
  },
  {
    n: "02",
    icon: PackageIcon,
    title: "Add what you need",
    body: "Pull any component, kit item or block. Dependencies resolve automatically. The shadcn CLI works too.",
    cmd: "npx @sidioralabs/designx-ui@latest add chat-app",
    alt: "npx shadcn@latest add @dx/chat-app",
  },
  {
    n: "03",
    icon: CodeIcon,
    title: "Own the code",
    body: "Files land in your repo as plain TypeScript. Change the markup, the springs, the tokensno wrapper to fight.",
    cmd: "components/agents/chat-app.tsx",
  },
];

function Cmd({ value, dim }: { value: string; dim?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-[14px] bg-container py-1 pr-1 pl-3 font-mono text-[12.5px]">
      <span className={dim ? "truncate text-muted-foreground" : "truncate"}>{value}</span>
      <CopyButton value={value} />
    </div>
  );
}

export function GettingStarted() {
  return (
    <section aria-labelledby="landing-start" className="mx-auto max-w-[1200px] px-4 pb-24 md:px-6">
      <div className="mb-7 px-1 sm:mb-8">
        <p className="text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">Getting started</p>
        <h2 id="landing-start" className="mt-3 text-[clamp(1.8rem,7vw,2.75rem)] leading-[1.08] font-normal tracking-[-0.03em]">
          Three commands. <span className="text-muted-foreground">Then it's your code.</span>
        </h2>
      </div>
      <ol className="grid gap-3 md:grid-cols-3">
        {STEPS.map((s) => {
          const Icon = s.icon;
          return (
            <li key={s.n} className="flex min-w-0 flex-col gap-4 rounded-[24px] border border-outline-variant bg-background p-4 sm:rounded-[28px] sm:p-5">
              <div className="flex items-center justify-between">
                <span className="grid size-10 place-items-center rounded-full bg-container">
                  <Icon className="size-4" />
                </span>
                <span className="font-mono text-xs text-muted-foreground tabular-nums">{s.n}</span>
              </div>
              <div>
                <h3 className="text-lg font-medium tracking-[-0.01em]">{s.title}</h3>
                <p className="mt-1 text-[14px] leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
              <div className="mt-auto grid min-w-0 gap-2">
                <Cmd value={s.cmd} />
                {s.alt && <Cmd value={s.alt} dim />}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

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
      "React 19, Tailwind CSS 4 and TypeScript. Interactive primitives are built on Base UI and animation runs on Motionthe CLI installs both when a component needs them.",
  },
  {
    id: "customise",
    icon: <PaletteIcon className="size-4" />,
    title: "Can I customise the look?",
    description:
      "Everything reads from --dx- CSS variables, so a theme is a handful of tokens. Pick an accent on the Themes page, or edit the component source directlyit lives in your repo.",
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
    <section aria-labelledby="landing-faq" className="mx-auto grid max-w-[1200px] gap-6 px-4 pb-20 sm:gap-8 sm:pb-24 md:grid-cols-[1fr_1.4fr] md:px-6">
      <div className="px-1">
        <p className="text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">FAQ</p>
        <h2 id="landing-faq" className="mt-3 text-[clamp(1.8rem,7vw,2.75rem)] leading-[1.08] font-normal tracking-[-0.03em]">
          Questions, answered.
        </h2>
        <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
          Anything else? The docs cover installation, theming and the registry in detail.
        </p>
        <Button variant="outline" className="mt-6" render={<Link href="/docs" />}>
          Read the docs <ArrowRightIcon />
        </Button>
      </div>
      <BouncyAccordion items={FAQ} defaultValue="free" />
    </section>
  );
}

export function BuildCta() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 pb-20 sm:pb-24 md:px-6">
      <div className="accent-dx-gradient relative isolate overflow-hidden rounded-[28px] border border-outline-variant bg-background px-4 py-12 text-center sm:rounded-[36px] sm:px-6 sm:py-16 md:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-70 blur-3xl dark:opacity-50"
          style={{
            background:
              "radial-gradient(40% 60% at 20% 100%, var(--dx-blue-3), transparent 70%), radial-gradient(40% 60% at 50% 110%, var(--dx-purple-3), transparent 70%), radial-gradient(40% 60% at 80% 100%, var(--dx-pink-4), transparent 70%)",
          }}
        />
        <div className="bg-grid pointer-events-none absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        <DxMark className="mx-auto size-12" />
        <h2 className="mx-auto mt-6 max-w-2xl text-[clamp(1.9rem,8vw,3.5rem)] leading-[1.04] font-normal tracking-[-0.04em] sm:text-[clamp(2rem,5vw,3.5rem)]">
          Build with DX UI.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-[16px] leading-relaxed text-muted-foreground">
          Components, kits and blocks that feel finished on day oneand stay yours on day one hundred.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" render={<Link href="/docs" />}>
            Get started <ArrowRightIcon />
          </Button>
          <Button size="lg" variant="tonal" render={<a href="https://github.com/Sidiora-Labs/DesignX-ui" target="_blank" rel="noreferrer" aria-label="Star DX UI on GitHub" />}>
            <FaGithub /> Star on GitHub
          </Button>
        </div>
      </div>
    </section>
  );
}
