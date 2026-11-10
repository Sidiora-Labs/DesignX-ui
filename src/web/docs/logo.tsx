import { cn } from "@/lib/utils";

/**
 * The DX UI mark. Rendered from /brand so it stays crisp at any size; the site
 * chrome is monochrome, so the mark is drawn in graphite unless `color` is set.
 */
export function DxMark({ className, color = false }: { className?: string; color?: boolean }) {
  return (
    <img
      src="/brand/dx-mark-128.webp"
      srcSet="/brand/dx-mark-128.webp 1x, /brand/dx-mark-512.webp 4x"
      alt=""
      aria-hidden="true"
      width={24}
      height={24}
      draggable={false}
      className={cn("size-6 shrink-0 select-none", !color && "contrast-125 grayscale dark:brightness-150", className)}
    />
  );
}

export function DxLogo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-ui text-[15px] font-semibold tracking-[-0.025em] text-ink", className)}>
      <DxMark />
      <span>
        DX <span className="text-faint">UI</span>
      </span>
    </span>
  );
}
