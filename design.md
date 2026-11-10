# DX UI — Design System

Derived from the DesignX reference CSS (tonal surfaces, ink primary, state layers) and the DX motion components.

## Principles
1. **Tone over shadow.** Depth comes from the surface ladder; shadows are reserved for floating layers (popovers, dialogs, toasts) and are soft + low.
2. **Ink primary.** Primary is the on-surface ink (#121317 light / #f8f9fc dark). Color is reserved for meaning (data-vis, status) or the optional *DX Gradient* accent.
3. **State layers, not new colors.** Hover/press/focus overlay `currentColor` at fixed opacities (hover 5%, press 9%, focus 12%; primary uses 12/16/20).
4. **Springs with no bounce.** `type: spring, bounce: 0, duration: 0.5–0.6`. CSS uses `--ease-dx: cubic-bezier(.2,0,0,1)` at 150–250ms.
5. **Pill actions, soft containers.** Buttons/toggles/badges are pills; inputs 12px; cards 24px; dialogs 28px.

## Color tokens (light → dark)
| Token | Light | Dark |
|---|---|---|
| background / surface | #ffffff | #121317 |
| foreground / on-surface | #121317 | #f8f9fc |
| muted-foreground / on-surface-variant | #45474d | #b2bbc5 |
| container | #f8f9fc | #18191d |
| container-high | #eff2f7 | #212226 |
| container-higher | #e6eaf0 | #2f3034 |
| container-highest | #e1e6ec | #45474d |
| border / outline | rgba(33,34,38,.12) | rgba(230,234,240,.12) |
| outline-variant | rgba(33,34,38,.06) | rgba(230,234,240,.06) |
| destructive | #be1c1b | #ff4c45 |
| success | #008052 | #0ebc5f |
| warning | #e57e00 | #ffcf03 |
| info | #2b4fda | #3c90ff |

Data-vis: blue, green, grey, pink, purple, red, yellow × 5 emphasis levels (`--dx-<hue>-1..5`). Charts use `chart-1..5` = blue, green, yellow, pink, purple (mid/high emphasis).

**DX Gradient accent** (`.accent-dx-gradient` on html): primary = `linear-gradient(90deg,#3b6bff,#2e96ff 65%,#acb7ff)`, ring blue.

## Typography
- Sans: **Google Sans Flex** (`font-feature-settings: "ss02"`), Mono: **Google Sans Code**
- UI base 14px / 1.45. Headings 450–500 weight, tight negative tracking (-0.01em to -0.03em), line-height 1.06–1.14.
- Display scale (docs/landing): 38 / 54 / 72 / 98px fluid.

## Shape
xs 4 · sm 8 · md 12 · lg 16 · xl 24 · 2xl 36 · full

## Spacing & density
4px grid. Control heights: sm 32, default 40, lg 48. Inputs 40. Menu items 36.

## Motion
- Popups: fade + scale .96 → 1, 180ms `--ease-dx`, origin = `--transform-origin`.
- Dialog: fade + scale .96 + y 8px, 220ms.
- Sheet/drawer: translate, 300ms.
- Layout motion (tabs indicator, expanding tabs, number flow): Motion spring bounce 0.

## Docs site layout
The site chrome (landing, docs, blocks, themes) wears a separate monochrome skin — "graphite on vellum" — defined in `src/web/styles.css` and `src/web/site/ui.tsx`. It is not part of the registry; the component theme above is untouched and renders inside `.dx-scope` preview frames.

- **Palette:** canvas `#fafafa`, tile `#ededed`, hairline `#e5e7eb`, divider `#dadada`, graphite `#242424` (filled actions), ink `#171717`, pencil `#5c5c5c`, faint `#a3a3a3`. No chromatic color in chrome. Dark mode inverts the same ladder.
- **Type:** Inter 500/600/700 with tight negative tracking (-0.025em headings, -0.05em display); one Instrument Serif italic phrase per headline as punctuation; Fragment Mono for code and micro-labels.
- **Shape:** 16px buttons, 24px frames/tiles, full pills only for segmented controls. No drop shadows — hairline borders or the tile step; the filled button and dark pill carry an inset bevel.
- **Layout:** floating header with centered links and a filled "Get started"; landing is a centered hero stack (dark segmented pill, 96px Inter headline, subhead, filled + ghost actions) over a live showcase, a grayscale "built on" strip, then left-aligned section heading + full-width frame sections at 64–96px rhythm. Docs keep the 240px sidebar, content column and "on this page" rail.
