import type { CSSProperties } from "react";

export const TEXT_SHIMMER_CLASS_NAME = "dx-text-shimmer";

export const TEXT_SHIMMER_KEYFRAMES = `
@keyframes dx-text-shimmer { from { background-position: 100% 0; } to { background-position: 0% 0; } }
.dx-text-shimmer {
  color: transparent;
  background-image: linear-gradient(90deg, var(--dx-shimmer-base, color-mix(in oklab, currentColor 45%, transparent)) 0%, var(--dx-shimmer-base, color-mix(in oklab, currentColor 45%, transparent)) 40%, var(--dx-shimmer-highlight, var(--foreground)) 50%, var(--dx-shimmer-base, color-mix(in oklab, currentColor 45%, transparent)) 60%, var(--dx-shimmer-base, color-mix(in oklab, currentColor 45%, transparent)) 100%);
  background-size: 250% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  animation: dx-text-shimmer var(--dx-shimmer-duration, 2.5s) linear infinite;
}
@media (prefers-reduced-motion: reduce) { .dx-text-shimmer { animation: none; color: inherit; background: none; opacity: .7; } }
`;

export function textShimmerStyle(duration = 2.5): CSSProperties {
  return { ["--dx-shimmer-duration" as string]: `${duration}s` } as CSSProperties;
}
