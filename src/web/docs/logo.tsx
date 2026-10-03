import { cn } from "@/lib/utils";

/** The DX UI mark. Rendered from /brand so it stays crisp at any size. */
export function DxMark({ className }: { className?: string }) {
  return (
    <img
      src="/brand/dx-mark-128.webp"
      srcSet="/brand/dx-mark-128.webp 1x, /brand/dx-mark-512.webp 4x"
      alt=""
      aria-hidden="true"
      width={24}
      height={24}
      draggable={false}
      className={cn("size-6 shrink-0 select-none", className)}
    />
  );
}

export function DxLogo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-[15px] font-medium tracking-[-0.02em]", className)}>
      <DxMark />
      <span>
        DX <span className="text-muted-foreground">UI</span>
      </span>
    </span>
  );
}
