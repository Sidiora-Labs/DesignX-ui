import type { ApiDoc } from "./api";

/** DX Motion component API docs. */
export const dxApi: Record<string, ApiDoc> = {
  "smooth-input": {
    usage: `import { SmoothInput } from "@/components/dx/smooth-input"

<SmoothInput placeholder="Type something…" />
<SmoothInput type="password" size="lg" />`,
    exampleTitles: { sizes: "Sizes" },
    props: [
      {
        component: "SmoothInput",
        description: "Accepts every native <input> prop.",
        rows: [
          ["type", '"text" | "password" | "email" | "search"', '"text"'],
          ["size", '"default" | "lg" | "xl"', '"default"'],
          ["spring", "{ stiffness?, damping?, mass? }", undefined, "Caret spring."],
          ["wrapperClassName", "string"],
        ],
      },
    ],
  },
  "digit-input": {
    usage: `import { DigitInput } from "@/components/dx/digit-input"

const [code, setCode] = React.useState("")
<DigitInput numeric maxLength={6} value={code} onValueChange={setCode} />`,
    props: [
      {
        component: "DigitInput",
        rows: [
          ["value", "string"],
          ["defaultValue", "string", '""'],
          ["onValueChange", "(value: string) => void"],
          ["numeric", "boolean", "false", "Strip everything but digits."],
          ["placeholder", "string", '"0"'],
          ["wrapperClassName", "string"],
        ],
      },
    ],
  },
  "number-flow": {
    usage: `import { NumberFlow } from "@/components/dx/number-flow"

<NumberFlow value={price} prefix="$" className="text-5xl" />`,
    exampleTitles: { format: "Formats & locales", countdown: "Countdown" },
    props: [
      {
        component: "NumberFlow",
        rows: [
          ["value", "number"],
          ["prefix", "string"],
          ["suffix", "string"],
          ["locale", "string", '"en-US"'],
          ["format", "Intl.NumberFormatOptions", "{ maximumFractionDigits: 2 }", "Memoize or hoist to avoid re-formatting."],
          ["transition", "Transition", "spring 400 / 35"],
        ],
      },
    ],
  },
  "autoscale-input": {
    usage: `import { AutoscaleInput } from "@/components/dx/autoscale-input"

<AutoscaleInput
  defaultValue="1250"
  numberFormat="us"
  onValueChange={(formatted, amount) => console.log(formatted, amount)}
/>`,
    exampleTitles: { formats: "Number formats" },
    props: [
      {
        component: "AutoscaleInput",
        rows: [
          ["value", "string"],
          ["defaultValue", "string", '""'],
          ["onValueChange", "(formatted: string, numeric: number) => void"],
          ["numberFormat", '"us" | "eu" | "space" | "ch" | "in" | "none" | "string"', '"us"'],
          ["prefix", "ReactNode", '"$"'],
          ["suffix", "ReactNode"],
          ["minSize", "number", "18", "Smallest font size in px."],
          ["maxSize", "number", "96", "Largest font size in px."],
        ],
      },
      { component: "formatAmount / parseAmount", description: "Pure helpers for formatting and parsing outside the component.", rows: [["(value: string, format: NumberFormat)", "string | number"]] },
    ],
  },
  "expanding-tabs": {
    usage: `import { ExpandingTabs, MorphPanel } from "@/components/dx/expanding-tabs"

const [selected, setSelected] = React.useState<number | null>(0)

<ExpandingTabs tabs={[{ title: "Home", icon: HomeIcon }]} selected={selected} onSelectedChange={setSelected} />`,
    exampleTitles: { morph: "Morph panel" },
    props: [
      {
        component: "ExpandingTabs",
        rows: [
          ["tabs", "{ title: string; icon: LucideIcon }[]"],
          ["selected", "number | null"],
          ["onSelectedChange", "(index: number | null, direction: 1 | -1) => void"],
          ["collapsible", "boolean", "true", "Clicking the active tab collapses it."],
        ],
      },
      {
        component: "MorphPanel",
        rows: [
          ["tabs", "{ title; icon; content: ReactNode }[]"],
          ["defaultSelected", "number | null", "null"],
          ["collapsedWidth", "number", "212"],
          ["expandedWidth", "number", "300"],
        ],
      },
    ],
  },
  "media-scrubber": {
    usage: `import { MediaScrubber, Scrubber } from "@/components/dx/media-scrubber"

<MediaScrubber src="/video.mp4" poster="/poster.jpg" playsInline />`,
    exampleTitles: { audio: "Standalone scrubber" },
    props: [
      { component: "MediaScrubber", description: "Accepts every native <video> prop.", rows: [["wrapperClassName", "string"]] },
      {
        component: "Scrubber",
        rows: [
          ["value", "MotionValue<number>"],
          ["max", "MotionValue<number>"],
          ["onChange", "(next: number) => void"],
          ["onScrubStart", "() => void"],
          ["onScrubEnd", "() => void"],
          ["format", "(v: number) => string", "formatTime"],
          ["showLabels", "boolean", "true"],
        ],
      },
    ],
  },
  "glow-border": {
    usage: `import { GlowBorder } from "@/components/dx/glow-border"

<div className="relative rounded-3xl">
  <GlowBorder active={thinking} />
  <div className="relative p-6">…</div>
</div>`,
    notes: "GlowBorder fills its nearest relative parent and inherits its border radius.",
    exampleTitles: { variants: "Intensity, speed & colors" },
    props: [
      {
        component: "GlowBorder",
        rows: [
          ["active", "boolean", "true"],
          ["intensity", '"none" | "sm" | "md" | "lg" | "xl" | "2xl"', '"lg"'],
          ["thickness", "number", "2"],
          ["duration", "number", "5", "Seconds per rotation."],
          ["colors", "string[]", "DX gradient palette"],
        ],
      },
    ],
  },
  gooey: {
    usage: `import { Gooey, GooeyFilter } from "@/components/dx/gooey"

<Gooey>
  <div className="size-12 rounded-full bg-foreground" />
  <div className="size-12 rounded-full bg-foreground" />
</Gooey>

// or render the filter once and reference it
<GooeyFilter />
<div style={{ filter: "url(#dx-goo)" }}>…</div>`,
    previewHeight: 300,
    props: [
      { component: "Gooey", rows: [["filterId", "string", "auto"], ["blur", "number", "4.4"]] },
      { component: "GooeyFilter", rows: [["id", "string", '"dx-goo"'], ["blur", "number", "4.4"], ["contrast", "number", "20"], ["threshold", "number", "-7"]] },
      { component: "SquircleFilter", rows: [["id", "string", '"dx-squircle"'], ["blur", "number", "10"]] },
    ],
  },
  "animated-icons": {
    usage: `import { BellIcon, CopyIcon, SendIcon } from "@/components/dx/animated-icons"

<CopyIcon text="npx @sidioralabs/designx-ui@latest init" />
<BellIcon onClick={toggleNotifications} />`,
    notes: "Every icon is a self-contained <button> with an aria-label. Pass label to override it.",
    props: [
      { component: "All icons", rows: [["label", "string", undefined, "Accessible name."], ["...props", "ButtonHTMLAttributes"]] },
      { component: "CopyIcon", rows: [["text", "string", '""', "Copied to the clipboard on click."]] },
      { component: "WaveformIcon", rows: [["bars", "number", "9"]] },
      { component: "VolumeIcon", rows: [["muted", "boolean", undefined, "Controlled muted state."], ["onMutedChange", "(muted: boolean) => void"]] },
      { component: "SpinnerIcon", rows: [["size", "number", "20"], ["color", "string", '"currentColor"']] },
    ],
  },
  "stack-scroll": {
    usage: `import { StackScroll } from "@/components/dx/stack-scroll"

<StackScroll
  items={[{ title: "Install", description: "…", media: <img src="…" /> }]}
  scrollLength="300vh"
/>`,
    align: "start",
    previewHeight: 500,
    props: [
      {
        component: "StackScroll",
        rows: [
          ["items", "{ title: string; description: string; media?: ReactNode }[]"],
          ["scrollLength", "string", '"300vh"', "Total scroll distance."],
          ["containerRef", "RefObject<HTMLElement>", "window", "Custom scroll container."],
        ],
      },
    ],
  },
  "icon-accordion": {
    usage: `import { IconAccordion } from "@/components/dx/icon-accordion"

<IconAccordion items={[{ icon: <BoltIcon />, title: "Fast", description: "…" }]} defaultValue={0} />`,
    previewHeight: 420,
    props: [
      {
        component: "IconAccordion",
        rows: [
          ["items", "{ icon: ReactNode; title: string; description: ReactNode }[]"],
          ["value", "number | null"],
          ["defaultValue", "number | null", "null"],
          ["onValueChange", "(value: number | null) => void"],
          ["radius", "number", "20"],
        ],
      },
    ],
  },
};
