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
Sticky blurred header, left docs sidebar (240px), content max 760px, right "on this page" rail. Landing: oversized headline, live component showcase mosaic on container surfaces.
