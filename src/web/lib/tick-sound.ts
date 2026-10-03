/** A tiny Web Audio click for detents (wheel pickers, rulers). Created lazily on first use. */
export function createTickPlayer({ frequency = 2400, volume = 0.06, duration = 0.018 } = {}) {
  let ctx: AudioContext | null = null;
  let last = 0;
  const ensure = () => {
    if (typeof window === "undefined") return null;
    if (!ctx) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  };
  return {
    /** Unlock audio inside a user gesture so the first tick isn't dropped. */
    prepare() {
      ensure();
    },
    play() {
      const c = ensure();
      if (!c) return;
      const now = c.currentTime;
      if (now - last < 0.025) return;
      last = now;
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(frequency, now);
      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      osc.connect(gain).connect(c.destination);
      osc.start(now);
      osc.stop(now + duration + 0.01);
    },
    dispose() {
      void ctx?.close();
      ctx = null;
    },
  };
}
