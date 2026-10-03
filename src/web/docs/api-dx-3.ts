import type { ApiDoc } from "./api";

/** DX Motion component API docs — part 3. */
export const dxApi3: Record<string, ApiDoc> = {
  "country-select": {
    usage: `import { CountrySelect } from "@/components/dx/country-select"

<CountrySelect onValueChange={(code, country) => setRegion(code)} showName />`,
    notes: "Countries and flags load once from flagcdn and are cached for the session. With `detectRegion`, the initial value comes from the browser locale. Use `useCountries()` to read the same list elsewhere.",
    props: [
      {
        component: "CountrySelect",
        description: "A trigger that opens a searchable dialog of countries.",
        rows: [
          ["value", "string", undefined, "ISO 3166-1 alpha-2 code, lowercase."],
          ["defaultValue", "string"],
          ["onValueChange", "(code: string, country: Country) => void"],
          ["detectRegion", "boolean", "true", "Seed the value from navigator.language."],
          ["title", "string", '"Select your region"'],
          ["placeholder", "string", '"Search by country or region"'],
          ["showName", "boolean", "false", "Show the country name next to the flag in the trigger."],
          ["disabled", "boolean"],
        ],
      },
    ],
  },
  "token-swap": {
    usage: `import { TokenSwap } from "@/components/dx/token-swap"

<TokenSwap
  from={{ symbol: "ETH", name: "Ethereum", icon: <SiEthereum />, balance: 2.4, price: 3200 }}
  to={{ symbol: "SOL", name: "Solana", icon: <SiSolana /> }}
  rate={21.3}
  onFlip={flip}
/>`,
    notes: "Digits animate as you type. Exceeding the balance shakes the field and shows an alert. The Max toggle fills the full balance; editing the amount turns it off.",
    previewHeight: 420,
    props: [
      {
        component: "TokenSwap",
        rows: [
          ["from", "SwapToken & { balance: number; price: number }", undefined, "Token being sold."],
          ["to", "SwapToken", undefined, "Token being bought."],
          ["rate", "number", undefined, "Units of `to` per unit of `from`."],
          ["value", "string"],
          ["defaultValue", "string", '""'],
          ["onValueChange", "(value: string, amount: number) => void"],
          ["max", "number", "1000000", "Hard input cap."],
          ["currency", "string", '"USD"', "Fiat currency for the value line."],
          ["locale", "string", '"en-US"'],
          ["onFlip", "() => void", undefined, "Shows the flip button when set."],
        ],
      },
      {
        component: "SwapToken",
        rows: [
          ["symbol", "string"],
          ["name", "string"],
          ["icon", "ReactNode"],
          ["color", "string", undefined, "Icon tile background."],
        ],
      },
    ],
  },
  "wallet-cards": {
    usage: `import { WalletCards } from "@/components/dx/wallet-cards"

<WalletCards items={wallets} onCustomize={(w) => edit(w.id)} />`,
    notes: "Click a card to expand it across the grid. Escape or a click outside collapses it. Pass `renderActions` to replace the default Copy address / Customize buttons.",
    previewHeight: 400,
    props: [
      {
        component: "WalletCards",
        rows: [
          ["items", "WalletCardItem[]"],
          ["value", "string | null", undefined, "Id of the expanded card."],
          ["defaultValue", "string | null", "null"],
          ["onValueChange", "(id: string | null) => void"],
          ["renderActions", "(item) => ReactNode"],
          ["onCustomize", "(item) => void"],
        ],
      },
      {
        component: "WalletCardItem",
        rows: [
          ["id", "string"],
          ["name", "string"],
          ["detail", "ReactNode", undefined, "Balance or subtitle."],
          ["icon", "ComponentType<{ className?: string }>"],
          ["color", "string", undefined, "Card colour."],
          ["address", "string", undefined, "Copied by the default action."],
        ],
      },
    ],
  },
  "auth-drawer": {
    usage: `import { AuthDrawer } from "@/components/dx/auth-drawer"

<AuthDrawer
  trigger={<Button>Sign in</Button>}
  providers={providers}
  wallets={wallets}
  onSendCode={sendCode}
  onVerify={({ code }) => api.verify(code)}
  onSuccess={() => router.push("/app")}
/>`,
    notes: "Built on the Drawer primitive. The sheet height morphs between steps: sign in → code → done, plus passkey and wallet views. Return `false` from `onVerify` or `onPasskey` to show the error state. Try the code 123456 in the demo.",
    previewHeight: 420,
    props: [
      {
        component: "AuthDrawer",
        rows: [
          ["open", "boolean"],
          ["defaultOpen", "boolean", "false"],
          ["onOpenChange", "(open: boolean) => void"],
          ["trigger", "ReactElement"],
          ["title", "string", '"Sign in"'],
          ["providers", "AuthOption[]", "[]", "Social sign-in buttons."],
          ["wallets", "AuthOption[]", "[]", "Shows a wallet entry when non-empty."],
          ["methods", '("email" | "phone" | "passkey")[]', "all three"],
          ["onProvider", "(id: string) => void"],
          ["onWallet", "(id: string) => void"],
          ["onSendCode", "({ method, value }) => void | Promise<void>"],
          ["onVerify", "({ method, value, code }) => boolean | Promise<boolean>"],
          ["onPasskey", "() => boolean | Promise<boolean>"],
          ["onSuccess", "({ method, value? }) => void"],
        ],
      },
      {
        component: "AuthOption",
        rows: [
          ["id", "string"],
          ["label", "string"],
          ["icon", "ReactNode"],
          ["badge", "string"],
        ],
      },
    ],
  },
  "moving-border": {
    usage: `import { MovingBorder } from "@/components/dx/moving-border"

<MovingBorder radius="9999px" contentClassName="bg-surface px-5 py-2.5">
  Upgrade to Pro
</MovingBorder>`,
    notes: "The outer element is the border track; style it with `className`. The inner content sits `gap` inside it. Static under reduced motion.",
    props: [
      {
        component: "MovingBorder",
        rows: [
          ["duration", "number", "3000", "Milliseconds per lap."],
          ["radius", "string", '"1.75rem"'],
          ["gap", "string", '"1px"', "Border thickness."],
          ["color", "string", '"var(--dx-blue-3)"', "Glow colour."],
          ["size", "number", "80", "Glow diameter in px."],
          ["contentClassName", "string"],
        ],
      },
    ],
  },
  "dynamic-island": {
    usage: `import { DynamicIsland, IslandIdle, IslandCall } from "@/components/dx/dynamic-island"

<DynamicIsland view={view}>
  {view === "call" ? <IslandCall name="Ava" onDecline={hangUp} /> : <IslandIdle />}
</DynamicIsland>`,
    notes: "Change `view` and swap the children; the pill measures the new content and springs to it. Bounce can be tuned per transition with keys like \"idle-ring\", \"*-idle\" or \"ring-*\".",
    props: [
      {
        component: "DynamicIsland",
        rows: [
          ["view", "string", undefined, "Key of the current state."],
          ["children", "ReactNode"],
          ["bounce", "number | Record<string, number>", "built-in map"],
          ["defaultBounce", "number", "0.2"],
        ],
      },
      {
        component: "Views",
        description: "Ready-made contents.",
        rows: [
          ["IslandIdle", "—"],
          ["IslandRing", "{ silent?: boolean }"],
          ["IslandTimer", "{ seconds?: number; label?: string }", "300"],
          ["IslandRecord", "{ label?: string }"],
          ["IslandMusic", "{ title?; artist?; artwork? }"],
          ["IslandBattery", "{ level?: number }", "10"],
          ["IslandCall", "{ name?; subtitle?; onAccept?; onDecline? }"],
        ],
      },
    ],
  },
  "color-list": {
    usage: `import { ColorList } from "@/components/dx/color-list"

<ColorList items={swatches} onActiveChange={(item) => tick()} />`,
    notes: "Scrolls inside its own box. The row crossing `focusLine` becomes active: it tints the background and updates the preview tile. Text colour is chosen for contrast unless `foreground` is set.",
    previewHeight: 520,
    props: [
      {
        component: "ColorList",
        rows: [
          ["items", "ColorListItem[]"],
          ["infinite", "boolean", "true", "Append items as you near the end."],
          ["focusLine", "number", "0.35", "Fraction of the box height."],
          ["showPreview", "boolean", "true"],
          ["previewSize", '"sm" | "md" | "lg"', '"md"'],
          ["onActiveChange", "(item, index) => void", undefined, "Hook a tick sound or analytics here."],
          ["itemClassName", "string"],
        ],
      },
      {
        component: "ColorListItem",
        rows: [
          ["id", "string"],
          ["name", "string"],
          ["badge", "string"],
          ["meta", "string"],
          ["color", "string", undefined, "Hex."],
          ["foreground", "string"],
          ["preview", "string", undefined, "Image URL for the preview tile."],
        ],
      },
    ],
  },
  "music-toggle": {
    usage: `import { MusicToggle } from "@/components/dx/music-toggle"

<MusicToggle src="/ambient.mp3" />`,
    notes: "Silent unless `src` is set, in which case it drives a native audio element. Audio loads on first play.",
    props: [
      {
        component: "MusicToggle",
        rows: [
          ["src", "string"],
          ["playing", "boolean"],
          ["defaultPlaying", "boolean", "false"],
          ["onPlayingChange", "(playing: boolean) => void"],
          ["loop", "boolean", "true"],
          ["volume", "number", "0.6"],
          ["bars", "number", "5"],
        ],
      },
    ],
  },
  parallax: {
    usage: `import { ParallaxImage, ScaleReveal } from "@/components/dx/parallax"

<ParallaxImage src={hero} speed={40} className="h-[60vh]" />
<ScaleReveal src={trailer} organic />`,
    notes: "Both track the page scroll by default. Pass `container` (a ref) when they live inside a scrolling element, as in the demo.",
    previewHeight: 560,
    props: [
      {
        component: "ParallaxImage",
        rows: [
          ["src", "string"],
          ["alt", "string", '""'],
          ["speed", "number", "30", "Travel as a percentage of the frame."],
          ["container", "RefObject<HTMLElement>"],
          ["smooth", "boolean", "true", "Spring the scroll value."],
          ["imgClassName", "string"],
          ["children", "ReactNode", undefined, "Overlay."],
        ],
      },
      {
        component: "ScaleReveal",
        rows: [
          ["src", "string"],
          ["from", "number", "1", "Scale when entering."],
          ["to", "number", "0.7", "Scale when leaving."],
          ["zoom", "number", "1.3", "Inner image zoom."],
          ["organic", "boolean", "false", "Use the soft blob clip path."],
          ["container", "RefObject<HTMLElement>"],
          ["smooth", "boolean", "true"],
          ["children", "ReactNode", undefined, "Overlay."],
        ],
      },
    ],
  },
  "infinite-canvas": {
    usage: `import { InfiniteCanvas } from "@/components/dx/infinite-canvas"

<InfiniteCanvas items={photos.map((p) => <img src={p} />)} columns={5} />`,
    notes: "The grid is tiled so panning never runs out. Drag, use the wheel or trackpad, or focus it and use the arrow keys.",
    previewHeight: 520,
    props: [
      {
        component: "InfiniteCanvas",
        rows: [
          ["items", "ReactNode[]"],
          ["columns", "number", "5"],
          ["gap", "string", '"6rem"'],
          ["padding", "string", "gap"],
          ["itemClassName", "string", '"w-40"'],
          ["dragSpeed", "number", "1.5"],
        ],
      },
    ],
  },
  "feature-explorer": {
    usage: `import { FeatureExplorer } from "@/components/dx/feature-explorer"

<FeatureExplorer
  cover="/hero.jpg"
  features={[
    { id: "finish", name: "finishes", description: "Three finishes.", media: "/a.jpg",
      variants: [{ id: "ember", color: "#f77313", media: "/a-ember.jpg" }] },
    { id: "frame", name: "unibody frame", description: "…", media: "/b.jpg" },
  ]}
/>`,
    notes: "Pills expand in place to reveal their description while the stage slides to that feature's media. Up/down buttons step through; Escape or the close button returns to the cover. Below `compactBelow` (container width) it becomes a swipeable carousel. Features with `variants` get a colour picker.",
    previewHeight: 600,
    props: [
      {
        component: "FeatureExplorer",
        rows: [
          ["features", "FeatureItem[]"],
          ["cover", "ReactNode", undefined, "Stage media when nothing is open. Strings are image URLs."],
          ["value", "number | null", undefined, "Open feature index."],
          ["defaultValue", "number | null", "null"],
          ["onValueChange", "(index: number | null) => void"],
          ["compactBelow", "number", "720", "Container width in px."],
          ["forceDark", "boolean", "true", "Keep the stage dark in light mode."],
        ],
      },
      {
        component: "FeatureItem",
        rows: [
          ["id", "string"],
          ["name", "string"],
          ["description", "ReactNode"],
          ["media", "ReactNode"],
          ["variants", "{ id; color; label?; media? }[]"],
        ],
      },
    ],
  },
  "project-showcase": {
    usage: `import { ProjectShowcase } from "@/components/dx/project-showcase"

<ProjectShowcase
  projects={[{ id: "atlas", title: "Atlas", image: "/atlas.jpg", tagline: "Open source", description: <p>…</p>, actions: <Button>Live preview</Button> }]}
/>`,
    notes: "Hovering a title swaps the floating preview, which can be dragged. Clicking morphs the title and image into a detail view with a staggered reveal. Escape or “All projects” goes back.",
    previewHeight: 600,
    align: "start",
    props: [
      {
        component: "ProjectShowcase",
        rows: [
          ["projects", "ShowcaseProject[]"],
          ["label", "ReactNode", '"Selected work"'],
          ["value", "string | null", undefined, "Open project id."],
          ["defaultValue", "string | null", "null"],
          ["onValueChange", "(id: string | null) => void"],
          ["draggable", "boolean", "true"],
        ],
      },
      {
        component: "ShowcaseProject",
        rows: [
          ["id", "string"],
          ["title", "string"],
          ["image", "string"],
          ["tagline", "string"],
          ["description", "ReactNode"],
          ["actions", "ReactNode"],
        ],
      },
    ],
  },
};
