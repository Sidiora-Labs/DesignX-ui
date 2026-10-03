import * as React from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Parallaxscroll-linked image primitives.
 * - ParallaxImage: the image drifts inside its frame as the frame scrolls by.
 * - ScaleReveal: the frame shrinks while the image inside grows, optionally
 *   through an organic, hand-cut mask.
 * Both track the window by default; pass `container` for a scrolling box.
 */

type ScrollContainer = React.RefObject<HTMLElement | null>;

function useSmooth(v: MotionValue<number>, smooth: boolean) {
  const s = useSpring(v, { stiffness: 140, damping: 30, restDelta: 0.0005 });
  return smooth ? s : v;
}

type ParallaxImageProps = Omit<React.ComponentProps<"div">, "children"> & {
  src: string;
  alt?: string;
  /** How far the image travels, as a percentage of the frame height. Negative reverses. */
  speed?: number;
  container?: ScrollContainer;
  /** Spring-smooth the scroll value. */
  smooth?: boolean;
  imgClassName?: string;
  children?: React.ReactNode;
};

function ParallaxImage({
  src,
  alt = "",
  speed = 30,
  container,
  smooth = true,
  className,
  imgClassName,
  children,
  ...props
}: ParallaxImageProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, container, offset: ["start end", "end start"] });
  const p = useSmooth(scrollYProgress, smooth);
  const half = Math.abs(speed) / 2;
  const y = useTransform(p, [0, 1], speed >= 0 ? [`-${half}%`, `${half}%`] : [`${half}%`, `-${half}%`]);

  return (
    <div ref={ref} data-slot="parallax-image" className={cn("relative overflow-hidden", className)} {...props}>
      <motion.img
        src={src}
        alt={alt}
        style={reduce ? undefined : { y, height: `${100 + Math.abs(speed)}%`, top: `-${half}%` }}
        className={cn("absolute inset-x-0 w-full object-cover", reduce && "inset-y-0 h-full", imgClassName)}
      />
      {children && <div className="relative z-10 size-full">{children}</div>}
    </div>
  );
}

/** An irregular, hand-cut rounded rectangle (1836×1053 units, scaled to the box). */
const ORGANIC =
  "M457.525 1.148c-20.789-3.198-193.979 1.16-283.854 2.496 11.104-.178 1.297-2.868-81.146-2.496-103.5.468-86 102.499-86 109.999s-7 524.5-6.5 547.5 10 59 6.5 99c-2.8 32-1.167 234.667 0 332.003.5 75 62.5 66.5 67 68.5s38.5 0 81.5 0 436 6 526 10.5 438.995-.5 505.495 0 330.01-12.5 417.51-12.5 230.99 2 270.99 0 40.5-16 51-31.5 12.5-61 12.5-105.5c0-44.503 7.01-274.504 7.01-348.004s-3.51-159.998-7.01-230.998 0-256.002 0-318.002 7.01-92.998-22.5-110.999c-18.79-11.471-81.99-9.999-133.49-9.999H853.525c-29 0-370 4-396 0Z";

type ScaleRevealProps = Omit<React.ComponentProps<"div">, "children"> & {
  src: string;
  alt?: string;
  /** Frame scale at the end of the scroll range. */
  from?: number;
  to?: number;
  /** How much the image zooms in as the frame shrinks. */
  zoom?: number;
  /** Clip the frame with a hand-cut organic shape. */
  organic?: boolean;
  container?: ScrollContainer;
  smooth?: boolean;
  /** Overlay content, centred over the image. */
  children?: React.ReactNode;
};

function ScaleReveal({
  src,
  alt = "",
  from = 1,
  to = 0.7,
  zoom = 1.3,
  organic = false,
  container,
  smooth = true,
  className,
  children,
  style,
  ...props
}: ScaleRevealProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const clipId = React.useId().replace(/:/g, "");
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, container, offset: ["start end", "end start"] });
  const p = useSmooth(scrollYProgress, smooth);
  const scale = useTransform(p, [0, 1], [from, to]);
  const imgScale = useTransform(p, [0, 1], [1, zoom]);

  return (
    <motion.div
      ref={ref}
      data-slot="scale-reveal"
      style={{ scale: reduce ? 1 : scale, clipPath: organic ? `url(#${clipId})` : undefined, ...style }}
      className={cn("relative flex aspect-video w-full items-center justify-center overflow-hidden", !organic && "rounded-3xl", className)}
      {...(props as React.ComponentProps<typeof motion.div>)}
    >
      {organic && (
        <svg aria-hidden width="0" height="0" className="absolute">
          <clipPath id={clipId} clipPathUnits="objectBoundingBox">
            <path d={ORGANIC} transform="scale(0.0005139987561, 0.0008543065594)" />
          </clipPath>
        </svg>
      )}
      <motion.img src={src} alt={alt} style={{ scale: reduce ? 1 : imgScale }} className="absolute inset-0 size-full object-cover" />
      {children && <div className="relative z-10">{children}</div>}
    </motion.div>
  );
}

export { ParallaxImage, ScaleReveal };
export type { ParallaxImageProps, ScaleRevealProps };
