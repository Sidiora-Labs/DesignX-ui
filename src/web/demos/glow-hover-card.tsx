import GlowHoverCard from "@/components/elements/glow-hover-card";

const features = [
  ["Motion first", "Springs and easing tuned for every component."],
  ["Own the code", "Copy the source, change anything."],
  ["Accessible", "Keyboard and screen reader support built in."],
];

export default function GlowHoverCardDemo() {
  return (
    <GlowHoverCard
      className="grid w-full max-w-3xl gap-4 sm:grid-cols-3"
      items={features.map(([title, body], i) => ({
        id: title,
        theme: { hue: 220 + i * 40, saturation: 90, lightness: 60 },
        element: (
          <div className="h-full rounded-3xl bg-card p-6 ring-1 ring-border">
            <p className="font-semibold">{title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{body}</p>
          </div>
        ),
      }))}
    />
  );
}
