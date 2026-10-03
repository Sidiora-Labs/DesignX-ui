import type { ApiDoc } from "./api";

/** DX Motion component API docs — part 2. */
export const dxApi2: Record<string, ApiDoc> = {
  "text-roll": {
    usage: `import { TextRoll } from "@/components/dx/text-roll"

<a href="/pricing" className="group">
  <TextRoll>Pricing</TextRoll>
</a>`,
    exampleTitles: { stagger: "Stagger & spring" },
    props: [
      {
        component: "TextRoll",
        description: "Rolls on hover of itself. Pass `active` to drive it from a parent instead.",
        rows: [
          ["children", "string"],
          ["center", "boolean", "false", "Stagger outward from the middle letter."],
          ["stagger", "number", "0.035", "Seconds between letters."],
          ["transition", "Transition", "spring"],
          ["active", "boolean", undefined, "Controlled rolled state."],
          ["className", "string"],
        ],
      },
    ],
  },
  "text-loop": {
    usage: `import { TextLoop } from "@/components/dx/text-loop"

<h2>Build <TextLoop items={["faster", "smarter", "together"]} /></h2>`,
    exampleTitles: { hook: "useLoop hook" },
    props: [
      {
        component: "TextLoop",
        rows: [
          ["items", "ReactNode[]"],
          ["interval", "number", "2000", "Milliseconds per item."],
          ["paused", "boolean", "false"],
          ["direction", '"up" | "down"', '"up"'],
          ["transition", "Transition", "spring"],
          ["className", "string"],
        ],
      },
      {
        component: "useLoop(delay, paused)",
        description: "Returns `{ key, reset }`. Use `key` on a motion element to replay its enter animation every `delay` ms.",
        rows: [
          ["delay", "number", "1000"],
          ["paused", "boolean", "false"],
        ],
      },
    ],
  },
  "count-up": {
    usage: `import { CountUp } from "@/components/dx/count-up"

<CountUp to={12840} prefix="$" duration={1.6} />`,
    notes: "Starts when the element scrolls into view. Hoist `format` objects so they keep a stable identity.",
    exampleTitles: { repeat: "Replay" },
    props: [
      {
        component: "CountUp",
        rows: [
          ["to", "number"],
          ["from", "number", "0"],
          ["duration", "number", "1", "Seconds."],
          ["ease", "Easing", '"easeOut"'],
          ["mode", '"tween" | "scramble" | "flow"', '"tween"', "flow renders NumberFlow."],
          ["repeat", "boolean", "false", "Replay every time it re-enters the viewport."],
          ["immediate", "boolean", "false", "Start on mount instead of in view."],
          ["prefix", "string"],
          ["suffix", "string"],
          ["locale", "string", '"en-US"'],
          ["format", "Intl.NumberFormatOptions"],
          ["onComplete", "() => void"],
          ["className", "string"],
        ],
      },
    ],
  },
  "animated-link": {
    usage: `import { AnimatedLink } from "@/components/dx/animated-link"
import { Link } from "wouter"

<AnimatedLink href="/docs" variant="slide" arrow>Read the docs</AnimatedLink>
<AnimatedLink render={<Link href="/blocks" />}>Blocks</AnimatedLink>`,
    exampleTitles: { inline: "Inline with router links" },
    props: [
      {
        component: "AnimatedLink",
        description: "Accepts every <a> prop.",
        rows: [
          ["variant", '"slide" | "reverse" | "center" | "highlight" | "fill"', '"slide"'],
          ["arrow", "boolean", "false", "Show an animated arrow."],
          ["render", "ReactElement", undefined, "Render as another element, e.g. a router Link."],
        ],
      },
    ],
  },
  "theme-toggle": {
    usage: `import { ThemeToggle } from "@/components/dx/theme-toggle"

<ThemeToggle icon="half" variant="circle" start="pointer" />`,
    notes:
      "Uses the View Transitions API. Falls back to an instant switch when the API is unavailable or the user prefers reduced motion.",
    exampleTitles: { transitions: "View transitions" },
    props: [
      {
        component: "ThemeToggle",
        rows: [
          ["icon", '"half" | "sun" | "dots" | "bulb" | "eclipse"', '"half"'],
          ["appearance", '"ghost" | "solid"', '"ghost"'],
          ["variant", '"none" | "circle" | "circle-blur" | "rectangle" | "polygon" | "gif"', '"circle"', "Reveal shape."],
          [
            "start",
            '"pointer" | "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top-center" | "bottom-center" | "bottom-up" | "top-down" | "left-right" | "right-left"',
            '"pointer"',
          ],
          ["duration", "number", undefined, "Milliseconds."],
          ["className", "string"],
        ],
      },
      {
        component: "useThemeTransition(options)",
        description: "Returns `{ isDark, toggle(event?), setTheme(next, event?) }` for custom triggers.",
        rows: [],
      },
    ],
  },
  "morph-confirm": {
    usage: `import { MorphConfirm } from "@/components/dx/morph-confirm"

<MorphConfirm
  label="Delete project"
  title="Delete this project?"
  description="This can't be undone."
  onConfirm={remove}
/>`,
    exampleTitles: { destructive: "Destructive" },
    props: [
      {
        component: "MorphConfirm",
        description: "The card is an alertdialog; Escape cancels.",
        rows: [
          ["label", "ReactNode", undefined, "Button content."],
          ["title", "ReactNode"],
          ["description", "ReactNode"],
          ["icon", "ReactNode"],
          ["cancelLabel", "ReactNode", '"Cancel"'],
          ["onConfirm", "() => void"],
          ["onCancel", "() => void"],
          ["open", "boolean"],
          ["onOpenChange", "(open: boolean) => void"],
          ["backdrop", "boolean", "true"],
          ["className", "string"],
          ["buttonClassName", "string"],
        ],
      },
    ],
  },
  "mouse-follow": {
    usage: `import { MouseFollow } from "@/components/dx/mouse-follow"

<MouseFollow className="h-64 rounded-3xl bg-muted">…</MouseFollow>`,
    exampleTitles: { label: "Custom cursor" },
    props: [
      {
        component: "MouseFollow",
        description: "Accepts every <div> prop.",
        rows: [
          ["spring", "boolean | SpringOptions", "{ mass: 0.1, damping: 10, stiffness: 131 }", "false snaps directly."],
          ["cursor", "ReactNode", undefined, "Custom follower content."],
          ["size", "number", "20"],
          ["hideCursor", "boolean", "false", "Hide the native cursor."],
          ["cursorClassName", "string"],
        ],
      },
    ],
  },
  "tick-scrollbar": {
    usage: `import { TickScrollbar } from "@/components/dx/tick-scrollbar"

const ref = React.useRef<HTMLDivElement>(null)
<div ref={ref} className="h-96 overflow-y-auto">…</div>
<TickScrollbar container={ref} />`,
    previewHeight: 460,
    props: [
      {
        component: "TickScrollbar",
        description: "A role=slider: drag, click to seek, Arrow / Home / End keys.",
        rows: [
          ["container", "RefObject<HTMLElement>", "window"],
          ["ticks", "number", "40"],
          ["major", "number", "5", "Every nth tick is long."],
          ["card", "ReactNode", undefined, "Floating label next to the thumb."],
          ["cardKey", "Key", undefined, "Change to animate the card content."],
          ["fixed", "boolean", "false", "Pin to the viewport edge."],
          ["label", "string", '"Scroll position"'],
          ["className", "string"],
        ],
      },
    ],
  },
  "dev-tools": {
    usage: `import { BreakpointIndicator, DebugPanel } from "@/components/dx/dev-tools"

<BreakpointIndicator />
<DebugPanel values={{ x, y, progress }} />`,
    notes: "Both render nothing in production builds unless `force` is set.",
    previewHeight: 420,
    props: [
      {
        component: "BreakpointIndicator",
        rows: [
          ["position", '"bottom-left" | "bottom-right" | "top-left" | "top-right" | false', '"bottom-left"', "false renders inline."],
          ["force", "boolean", "false"],
          ["className", "string"],
        ],
      },
      {
        component: "DebugPanel",
        rows: [
          ["values", "Record<string, unknown | MotionValue>", undefined, "MotionValues update live."],
          ["title", "string", '"Debug"'],
          ["force", "boolean", "false"],
          ["className", "string"],
        ],
      },
    ],
  },
  "ai-composer": {
    usage: `import {
  Composer, ComposerInput, ComposerToolbar, ComposerGroup,
  ComposerToggle, ComposerModelSelect, ComposerSend,
} from "@/components/dx/ai-composer"

<Composer onSubmit={(text) => ask(text)} busy={busy} onStop={cancel}>
  <ComposerInput placeholders={["Ask anything", "Summarise a PDF"]} />
  <ComposerToolbar>
    <ComposerGroup>
      <ComposerToggle icon={<Globe />} label="Search" />
    </ComposerGroup>
    <ComposerGroup>
      <ComposerModelSelect models={models} defaultValue="dx-pro" />
      <ComposerSend variant="primary" />
    </ComposerGroup>
  </ComposerToolbar>
</Composer>`,
    notes: "Enter submits, Shift+Enter inserts a newline. While `busy`, the send button becomes a stop button that calls `onStop`. Pair with Chat Thread and Text Shimmer for a full chat surface.",
    previewHeight: 520,
    exampleTitles: { minimal: "Minimal with deep thinking", burst: "Gradient burst", mesh: "Mesh background" },
    props: [
      {
        component: "Composer",
        description: "A `<form>` that owns the text value and submit/stop state. Children read it via `useComposer()`.",
        rows: [
          ["value", "string", undefined, "Controlled text."],
          ["defaultValue", "string", '""'],
          ["onValueChange", "(value: string) => void"],
          ["onSubmit", "(value: string) => void", undefined, "Called with trimmed text; the input clears afterwards."],
          ["busy", "boolean", "false", "Shows the stop state and blocks submit."],
          ["onStop", "() => void"],
          ["disabled", "boolean", "false"],
        ],
      },
      {
        component: "ComposerInput",
        description: "Auto-growing textarea with an animated, rotating placeholder.",
        rows: [
          ["placeholder", "string"],
          ["placeholders", "string[]", undefined, "Cycled while empty."],
          ["interval", "number", "3000", "Milliseconds per placeholder."],
        ],
      },
      {
        component: "ComposerToggle",
        description: "A chip that expands to reveal its label when pressed.",
        rows: [
          ["icon", "ReactNode"],
          ["label", "string"],
          ["pressed", "boolean"],
          ["defaultPressed", "boolean", "false"],
          ["onPressedChange", "(pressed: boolean) => void"],
          ["spin", "boolean", "false", "Rotates the icon when toggled."],
        ],
      },
      {
        component: "ComposerModelSelect",
        rows: [
          ["models", "{ id: string; name: string; description?: string; icon?: ComponentType }[]"],
          ["value", "string"],
          ["defaultValue", "string"],
          ["onValueChange", "(id: string) => void"],
          ["side", '"top" | "bottom"', '"top"'],
        ],
      },
      {
        component: "ComposerSend",
        description: "Arrow rotates up when there is text; morphs into a stop square while busy.",
        rows: [["variant", '"default" | "primary"', '"default"']],
      },
      {
        component: "ComposerButton",
        description: "Round icon button for the toolbar.",
        rows: [["active", "boolean", "false"]],
      },
      {
        component: "ComposerBurst",
        description: "A gradient wave that plays each time `trigger` changes — use it on submit.",
        rows: [
          ["trigger", "number"],
          ["colors", "string[]", "DX gradient tokens"],
        ],
      },
    ],
  },
  "mention-composer": {
    usage: `import { MentionComposer } from "@/components/dx/mention-composer"

<MentionComposer
  mentions={[{ id: "notion", label: "Notion", icon: <SiNotion /> }]}
  onSubmit={({ text, mentions }) => run(text, mentions)}
/>`,
    notes: "Type `@` to open suggestions; Tab completes the first match. Each mention renders as a card that stacks above the input.",
    previewHeight: 420,
    props: [
      {
        component: "MentionComposer",
        rows: [
          ["mentions", "Mention[]", undefined, "Available tools: `{ id, label, icon? }`."],
          ["onSubmit", "({ text, mentions }) => void"],
          ["placeholder", "string"],
          ["className", "string"],
        ],
      },
    ],
  },
  "chat-thread": {
    usage: `import { ChatThread, ChatBubble, ChatThinking } from "@/components/dx/chat-thread"

<ChatThread className="h-80">
  <ChatBubble from="user">Hi</ChatBubble>
  <ChatBubble from="assistant">Hello! How can I help?</ChatBubble>
  {busy && <ChatThinking />}
</ChatThread>`,
    props: [
      {
        component: "ChatThread",
        description: '`role="log"` container that sticks to the bottom as messages arrive.',
        rows: [["fade", "boolean", "true", "Fades the top edge."]],
      },
      { component: "ChatBubble", rows: [["from", '"user" | "assistant"', '"assistant"']] },
      { component: "ChatThinking", rows: [["label", "string", '"Thinking…"']] },
    ],
  },
  "text-shimmer": {
    usage: `import { TextShimmer } from "@/components/dx/text-shimmer"

<TextShimmer>Generating response…</TextShimmer>`,
    notes: "Static under reduced motion.",
    props: [
      {
        component: "TextShimmer",
        rows: [
          ["children", "string"],
          ["as", '"p" | "span" | "div" | "h1" | "h2" | "h3"', '"span"'],
          ["duration", "number", "2", "Seconds per sweep."],
          ["spread", "number", "2", "Highlight width per character."],
          ["baseColor", "string", "muted foreground"],
          ["shimmerColor", "string", "foreground"],
          ["className", "string"],
        ],
      },
    ],
  },
  "mesh-gradient": {
    usage: `import { MeshGradient } from "@/components/dx/mesh-gradient"

<MeshGradient className="rounded-2xl p-8">
  <h2>Content sits above the mesh</h2>
</MeshGradient>`,
    notes: "A container: children render above the drifting blobs. The last colour is also the base fill. Static under reduced motion.",
    props: [
      {
        component: "MeshGradient",
        rows: [
          ["colors", "string[]", "DX gradient tokens"],
          ["duration", "number", "18", "Seconds per drift cycle."],
          ["blur", "number", "64", "Blob blur in px."],
          ["grain", "boolean", "false", "Adds film grain."],
          ["className", "string"],
        ],
      },
    ],
  },
};
