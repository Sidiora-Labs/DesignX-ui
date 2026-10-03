import * as React from "react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * MusicTogglea pill with a live waveform that springs open on hover.
 * Give it `src` to play a looping track with the native audio element, or
 * drive `playing` yourself to sync with any player.
 */

type MusicToggleProps = Omit<React.ComponentProps<"button">, "onClick"> & {
  /** Audio URL. When set, the toggle owns an <audio> element. */
  src?: string;
  playing?: boolean;
  defaultPlaying?: boolean;
  onPlayingChange?: (playing: boolean) => void;
  loop?: boolean;
  volume?: number;
  /** Number of bars. */
  bars?: number;
};

const rand = (n: number) => Array.from({ length: n }, () => Math.random() * 0.8 + 0.2);

function MusicToggle({
  src,
  playing: playingProp,
  defaultPlaying = false,
  onPlayingChange,
  loop = true,
  volume = 0.6,
  bars = 5,
  className,
  "aria-label": ariaLabel,
  ...props
}: MusicToggleProps) {
  const [inner, setInner] = React.useState(defaultPlaying);
  const playing = playingProp ?? inner;
  const [heights, setHeights] = React.useState(() => Array<number>(bars).fill(0.1));
  const audio = React.useRef<HTMLAudioElement>(null);
  const reduce = useReducedMotion();

  const set = (p: boolean) => {
    if (playingProp === undefined) setInner(p);
    onPlayingChange?.(p);
  };

  React.useEffect(() => {
    const a = audio.current;
    if (!a) return;
    a.volume = volume;
    if (playing) a.play().catch(() => set(false));
    else a.pause();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, volume]);

  React.useEffect(() => {
    if (!playing || reduce) {
      setHeights(Array<number>(bars).fill(playing ? 0.5 : 0.1));
      return;
    }
    const id = window.setInterval(() => setHeights(rand(bars)), 100);
    return () => window.clearInterval(id);
  }, [playing, bars, reduce]);

  return (
    <motion.button
      type="button"
      data-slot="music-toggle"
      aria-pressed={playing}
      aria-label={ariaLabel ?? (playing ? "Pause music" : "Play music")}
      onClick={() => set(!playing)}
      initial={{ padding: "14px 14px" }}
      whileHover={{ padding: "18px 22px" }}
      whileTap={{ padding: "18px 22px" }}
      whileFocus={{ padding: "18px 22px" }}
      transition={{ type: "spring", duration: 1, bounce: 0.6 }}
      className={cn("focus-ring inline-flex cursor-pointer rounded-full bg-card text-foreground shadow-float", className)}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      <span aria-hidden className="flex h-[18px] items-center gap-1">
        {heights.map((h, i) => (
          <motion.span
            key={i}
            className="w-px rounded-full bg-current"
            initial={{ height: 1 }}
            animate={{ height: Math.max(4, h * 14) }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          />
        ))}
      </span>
      {src && (
        // oxlint-disable-next-line jsx-a11y/media-has-caption, jsx-a11y/control-has-associated-label
        <audio aria-hidden ref={audio} src={src} loop={loop} preload="none" onEnded={() => set(false)} />
      )}
    </motion.button>
  );
}

export { MusicToggle };
export type { MusicToggleProps };
