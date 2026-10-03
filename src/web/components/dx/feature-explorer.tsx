import * as React from "react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon, PlusIcon } from "lucide-react";
import useMeasure from "react-use-measure";

import { cn } from "@/lib/utils";
import { Carousel, CarouselContent, CarouselItem, useCarousel, type CarouselApi } from "@/components/ui/carousel";

export type FeatureVariant = {
  id: string;
  /** Swatch colour. */
  color: string;
  label?: string;
  /** Media shown while this variant is selected. A string is treated as an image URL. */
  media?: React.ReactNode;
};

export type FeatureItem = {
  id: string;
  name: string;
  description: React.ReactNode;
  /** A string is treated as an image URL. */
  media: React.ReactNode;
  /** Optional colour variants. Shows a swatch instead of the plus icon. */
  variants?: FeatureVariant[];
};

export type FeatureExplorerProps = Omit<React.ComponentProps<"section">, "onChange" | "defaultValue"> & {
  features: FeatureItem[];
  /** Media shown when no feature is open. */
  cover: React.ReactNode;
  /** Index of the open feature, or null. */
  value?: number | null;
  defaultValue?: number | null;
  onValueChange?: (index: number | null) => void;
  /** Below this container width the list turns into a swipeable carousel. */
  compactBelow?: number;
  /** Keep the stage dark regardless of the page theme. */
  forceDark?: boolean;
};

const pill = { type: "spring", duration: 0.7, bounce: 0.3 } as const;
const fadeIn = {
  initial: { opacity: 0, filter: "blur(2px)" },
  animate: { opacity: 1, filter: "blur(0px)" },
  exit: { opacity: 0, filter: "blur(2px)" },
};

function Media({ media, className }: { media: React.ReactNode; className?: string }) {
  if (typeof media === "string") {
    return <img src={media} alt="" draggable={false} className={cn("size-full object-cover", className)} />;
  }
  return <div className={cn("size-full", className)}>{media}</div>;
}

function PlusBadge() {
  return (
    <span aria-hidden className="flex size-6 shrink-0 items-center justify-center rounded-full border border-current/60">
      <PlusIcon className="size-3.5 stroke-[2.5]" />
    </span>
  );
}

function Swatch({ color, className }: { color: string; className?: string }) {
  return (
    <span
      aria-hidden
      style={{ backgroundColor: color }}
      className={cn("block size-6 shrink-0 rounded-full shadow-[inset_0_-1px_0_rgb(255_255_255/0.6),0_0_0_1px_rgb(255_255_255/0.15)]", className)}
    />
  );
}

function VariantPicker({
  variants,
  value,
  onChange,
}: {
  variants: FeatureVariant[];
  value: string | null;
  onChange: (id: string) => void;
}) {
  return (
    // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
    <div role="group" aria-label="Colour" className="mt-4 flex items-center justify-center gap-2">
      {variants.map((v) => {
        const on = (value ?? variants[0].id) === v.id;
        return (
          <button
            key={v.id}
            type="button"
            aria-pressed={on}
            aria-label={v.label ?? v.color}
            onClick={() => onChange(v.id)}
            className={cn(
              "rounded-full p-0.5 ring-2 ring-transparent transition-shadow outline-none focus-visible:ring-ring",
              on && "ring-current/70",
            )}
          >
            <Swatch color={v.color} />
          </button>
        );
      })}
    </div>
  );
}

function CarouselArrows() {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarousel();
  const cls = "absolute top-1/2 flex size-10 -translate-y-1/2 items-center justify-center transition-opacity active:scale-95 disabled:opacity-0";
  return (
    <>
      <button type="button" className={cn(cls, "left-0")} disabled={!canScrollPrev} onClick={scrollPrev} aria-label="Previous feature">
        <ChevronLeftIcon className="size-5" />
      </button>
      <button type="button" className={cn(cls, "right-0")} disabled={!canScrollNext} onClick={scrollNext} aria-label="Next feature">
        <ChevronRightIcon className="size-5" />
      </button>
    </>
  );
}

function FeatureExplorer({
  features,
  cover,
  value,
  defaultValue = null,
  onValueChange,
  compactBelow = 720,
  forceDark = true,
  className,
  ...props
}: FeatureExplorerProps) {
  const [inner, setInner] = React.useState<number | null>(defaultValue);
  const active = value !== undefined ? value : inner;
  const setActive = React.useCallback(
    (i: number | null) => {
      if (value === undefined) setInner(i);
      onValueChange?.(i);
    },
    [value, onValueChange],
  );

  const [variant, setVariant] = React.useState<Record<string, string>>({});
  const [ref, bounds] = useMeasure();
  const compact = bounds.width > 0 && bounds.width < compactBelow;

  const variantOf = (f: FeatureItem) => f.variants?.find((v) => v.id === variant[f.id]) ?? null;
  const pickVariant = (f: FeatureItem, id: string) => setVariant((s) => ({ ...s, [f.id]: id }));

  const stageMedia = (() => {
    if (active === null) return cover;
    const f = features[active];
    return variantOf(f)?.media ?? f.media;
  })();
  const stageKey = active === null ? "cover" : `${active}:${variant[features[active].id] ?? ""}`;

  React.useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, setActive]);

  const collapsedButton = (f: FeatureItem, i: number, extra?: string) => (
    <motion.button
      key="btn"
      type="button"
      {...fadeIn}
      transition={{ duration: 0.3, delay: 0.25 }}
      onClick={() => setActive(i)}
      className={cn("flex h-14 items-center gap-3.5 rounded-full pr-8 pl-3.5 outline-none focus-visible:ring-2 focus-visible:ring-ring", extra)}
    >
      {f.variants?.length ? <Swatch color={(variantOf(f) ?? f.variants[0]).color} /> : <PlusBadge />}
      <span className="text-lg font-semibold whitespace-nowrap capitalize">{f.name}</span>
    </motion.button>
  );

  const expandedBody = (f: FeatureItem, extra?: string) => (
    <motion.div
      key="body"
      initial={{ opacity: 0, filter: "blur(2px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className={cn("p-6 text-base leading-relaxed", extra)}
    >
      <p>
        <b className="capitalize">{f.name}.</b> <span className="opacity-80">{f.description}</span>
      </p>
      {f.variants?.length ? <VariantPicker variants={f.variants} value={variant[f.id] ?? null} onChange={(id) => pickVariant(f, id)} /> : null}
    </motion.div>
  );

  return (
    <MotionConfig transition={{ type: "spring", stiffness: 200, damping: 30 }}>
      <section
        ref={ref}
        data-slot="feature-explorer"
        aria-label={props["aria-label"] ?? "Feature explorer"}
        className={cn(
          "relative flex h-[600px] w-full flex-col justify-end overflow-hidden rounded-[2rem] bg-surface pb-5 text-foreground",
          forceDark && "dark bg-black text-white",
          !compact && "justify-center pb-0",
          className,
        )}
        {...props}
      >
        {/* stage */}
        <div className="absolute inset-0">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={stageKey}
              initial={active === null ? { opacity: 0, scale: 1.35 } : { opacity: 0, x: "15%", scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1.1, transition: { delay: 0.2, type: "spring", stiffness: 320, damping: 30 } }}
              exit={active === null ? { opacity: 0, scale: 1.35 } : { opacity: 0, x: "-15%", scale: 0.95 }}
              className="size-full"
            >
              <Media media={stageMedia} />
            </motion.div>
          </AnimatePresence>
          <div aria-hidden className={cn("absolute inset-0", compact ? "bg-linear-to-t from-black/70 via-transparent" : "bg-linear-to-r from-black/60 via-black/10 to-transparent")} />
        </div>

        {!compact ? (
          <div className="relative flex items-center px-24">
            <AnimatePresence>
              {active !== null && (
                <motion.div
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "100%", opacity: 0 }}
                  transition={{ ease: "easeOut", duration: 0.3 }}
                  className="absolute left-8 flex flex-col gap-2"
                >
                  <button
                    type="button"
                    aria-label="Previous feature"
                    disabled={active === 0}
                    onClick={() => setActive(Math.max(0, active - 1))}
                    className="flex size-10 items-center justify-center rounded-full bg-current/10 backdrop-blur-sm transition-opacity hover:bg-current/15 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronUpIcon className="size-5 stroke-[2.5]" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next feature"
                    disabled={active === features.length - 1}
                    onClick={() => setActive(Math.min(features.length - 1, active + 1))}
                    className="flex size-10 items-center justify-center rounded-full bg-current/10 backdrop-blur-sm transition-opacity hover:bg-current/15 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronDownIcon className="size-5 stroke-[2.5]" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            <ul className="relative flex flex-col justify-center gap-3">
              {features.map((f, i) => (
                <motion.li
                  key={f.id}
                  layout
                  transition={pill}
                  style={{ borderRadius: 25 }}
                  className="flex h-fit w-fit items-center bg-current/10 backdrop-blur-md hover:bg-current/15"
                >
                  {active === i ? expandedBody(f, "max-w-[26rem]") : collapsedButton(f, i)}
                </motion.li>
              ))}
            </ul>
          </div>
        ) : (
          <CompactRail
            features={features}
            active={active}
            setActive={setActive}
            collapsed={collapsedButton}
            expanded={expandedBody}
          />
        )}

        <AnimatePresence>
          {active !== null && (
            <motion.button
              type="button"
              aria-label="Close"
              initial={{ y: "100%", opacity: 0, scale: 0 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: "100%", opacity: 0, scale: 0 }}
              onClick={() => setActive(null)}
              className="absolute top-5 right-5 flex size-10 items-center justify-center rounded-full bg-current/10 backdrop-blur-sm hover:bg-current/15 active:scale-95"
            >
              <PlusIcon className="size-5 rotate-45 stroke-[2.5]" />
            </motion.button>
          )}
        </AnimatePresence>
      </section>
    </MotionConfig>
  );
}

function CompactRail({
  features,
  active,
  setActive,
  collapsed,
  expanded,
}: {
  features: FeatureItem[];
  active: number | null;
  setActive: (i: number | null) => void;
  collapsed: (f: FeatureItem, i: number, extra?: string) => React.ReactNode;
  expanded: (f: FeatureItem, extra?: string) => React.ReactNode;
}) {
  const [api, setApi] = React.useState<CarouselApi>();

  React.useEffect(() => {
    if (!api) return;
    const onSelect = () => setActive(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api, setActive]);

  React.useEffect(() => {
    if (!api || active === null) return;
    if (api.selectedScrollSnap() !== active) api.scrollTo(active, true);
  }, [api, active]);

  if (active === null) {
    return (
      <ul className="relative flex gap-3 overflow-x-auto scrollbar-none px-5">
        {features.map((f, i) => (
          <motion.li key={f.id} layout transition={pill} style={{ borderRadius: 25 }} className="flex shrink-0 bg-current/10 backdrop-blur-md">
            {collapsed(f, i)}
          </motion.li>
        ))}
      </ul>
    );
  }

  return (
    <Carousel className="relative w-full px-10" setApi={setApi} opts={{ startIndex: active }}>
      <CarouselContent className="-ml-2 items-end">
        {features.map((f, i) => (
          <CarouselItem key={f.id} className="basis-[88%] pl-2">
            <motion.div layout transition={pill} style={{ borderRadius: 25 }} className="flex w-full bg-current/10 backdrop-blur-md">
              {active === i ? (
                expanded(f)
              ) : (
                <motion.button
                  key="arrow"
                  type="button"
                  aria-label={`Show ${f.name}`}
                  {...fadeIn}
                  transition={{ duration: 0.3, delay: 0.25 }}
                  onClick={() => setActive(i)}
                  className={cn("flex h-14 w-full items-center", i > active ? "justify-start pl-3" : "justify-end pr-3")}
                >
                  {i > active ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </motion.button>
              )}
            </motion.div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselArrows />
    </Carousel>
  );
}

export { FeatureExplorer };
