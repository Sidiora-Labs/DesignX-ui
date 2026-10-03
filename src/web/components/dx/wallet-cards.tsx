import * as React from "react";
import { AnimatePresence, LayoutGroup, motion, MotionConfig } from "motion/react";
import { CheckIcon, CopyIcon, EllipsisIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * WalletCardsa 2×2 grid of accounts. Selecting one grows it to full width
 * with shared-layout motion while the rest shrink into the row below.
 * Escape or a click outside collapses it.
 */

type WalletCardItem = {
  id: string;
  name: string;
  /** Secondary line, e.g. a balance. */
  detail: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
  /** Card backgroundany CSS colour or gradient. */
  color: string;
  /** Copied by the default "Copy address" action. */
  address?: string;
};

type WalletCardsProps = {
  items: WalletCardItem[];
  /** Expanded card id, or null. */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (id: string | null) => void;
  /** Replace the expanded card's actions. Defaults to Copy address + Customize. */
  renderActions?: (item: WalletCardItem) => React.ReactNode;
  onCustomize?: (item: WalletCardItem) => void;
  className?: string;
};

function CopyAction({ item }: { item: WalletCardItem }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard?.writeText(item.address ?? item.name);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1400);
      }}
      className="focus-ring flex items-center gap-2 rounded-full text-sm font-semibold tracking-tight"
    >
      {copied ? "Copied" : "Copy address"}
      <span className="flex size-6 items-center justify-center rounded-full bg-white/20 transition-colors hover:bg-white/30 [&_svg]:size-3.5">
        {copied ? <CheckIcon /> : <CopyIcon />}
      </span>
    </button>
  );
}

function WalletCards({
  items,
  value: valueProp,
  defaultValue = null,
  onValueChange,
  renderActions,
  onCustomize,
  className,
}: WalletCardsProps) {
  const [inner, setInner] = React.useState<string | null>(defaultValue);
  const expanded = valueProp !== undefined ? valueProp : inner;
  const ref = React.useRef<HTMLDivElement>(null);
  const groupId = React.useId();

  const set = React.useCallback(
    (id: string | null) => {
      if (valueProp === undefined) setInner(id);
      onValueChange?.(id);
    },
    [valueProp, onValueChange],
  );

  React.useEffect(() => {
    if (expanded === null) return;
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) set(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") set(null);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [expanded, set]);

  const top = expanded === null ? items.slice(0, 2) : items.filter((i) => i.id === expanded);
  const bottom = expanded === null ? items.slice(2, 4) : items.filter((i) => i.id !== expanded).slice(0, 3);
  const compact = expanded !== null && bottom.length >= 3;

  const card = (item: WalletCardItem, row: "top" | "bottom") => {
    const isOpen = item.id === expanded;
    const small = compact && row === "bottom";
    const Icon = item.icon;
    const shared = {
      layoutId: `${groupId}-card-${item.id}`,
      style: { background: item.color, borderRadius: 24 },
      className: cn(
        "relative flex min-w-0 flex-col items-start justify-between overflow-hidden p-3 text-left text-white",
        isOpen ? "h-[180px] w-full" : small ? "h-[100px] flex-1" : "h-[125px] flex-1",
      ),
    };
    const body = (
      <>
        <div className="flex w-full items-start justify-between">
          <motion.span layoutId={`${groupId}-icon-${item.id}`} className="flex">
            <Icon className={cn("fill-current", isOpen ? "size-12" : small ? "size-6" : "size-8")} />
          </motion.span>
          {!isOpen && (
            <motion.span
              initial={{ opacity: 0, filter: "blur(2px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              className={cn(
                "flex shrink-0 items-center justify-center rounded-full bg-white/20 transition-colors group-hover:bg-white/30",
                small ? "size-5 [&_svg]:size-3.5" : "size-6 [&_svg]:size-4",
              )}
            >
              <EllipsisIcon />
            </motion.span>
          )}
        </div>
        <div className="flex min-w-0 flex-col items-start">
          <motion.span
            layoutId={`${groupId}-title-${item.id}`}
            className={cn("max-w-full truncate font-semibold select-none", isOpen ? "text-xl" : small ? "text-sm" : "text-base")}
          >
            {item.name}
          </motion.span>
          <motion.span
            layoutId={`${groupId}-detail-${item.id}`}
            className={cn("font-semibold text-white/60 select-none", isOpen ? "text-lg" : small ? "text-xs" : "text-sm")}
          >
            {item.detail}
          </motion.span>
        </div>
      </>
    );

    if (!isOpen) {
      return (
        <motion.button
          key={item.id}
          type="button"
          {...shared}
          aria-label={`${item.name}, ${typeof item.detail === "string" ? item.detail : ""}`.replace(/, $/, "")}
          aria-expanded={false}
          onClick={() => set(item.id)}
          className={cn(shared.className, "group focus-ring cursor-pointer")}
        >
          {body}
        </motion.button>
      );
    }

    return (
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
      <motion.div key={item.id} {...shared} role="group" aria-label={item.name}>
        {body}
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, filter: "blur(0px)", transition: { delay: 0.12 } }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
          >
            {renderActions ? (
              <div className="pointer-events-auto absolute top-4 right-4 flex gap-2">{renderActions(item)}</div>
            ) : (
              <>
                <div className="pointer-events-auto absolute top-4 right-4">
                  <CopyAction item={item} />
                </div>
                <button
                  type="button"
                  onClick={() => onCustomize?.(item)}
                  className="focus-ring pointer-events-auto absolute right-4 bottom-4 rounded-full bg-white/20 px-3 py-1 text-sm font-semibold tracking-tight transition-colors hover:bg-white/30"
                >
                  Customize
                </button>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <MotionConfig transition={{ type: "spring", stiffness: 380, damping: 34 }}>
      <LayoutGroup id={groupId}>
        <div ref={ref} data-slot="wallet-cards" className={cn("flex h-[300px] w-full max-w-[360px] flex-col justify-end gap-4", className)}>
          <div className="flex gap-4">{top.map((i) => card(i, "top"))}</div>
          <div className="flex gap-4">{bottom.map((i) => card(i, "bottom"))}</div>
        </div>
      </LayoutGroup>
    </MotionConfig>
  );
}

export { WalletCards };
export type { WalletCardItem, WalletCardsProps };
