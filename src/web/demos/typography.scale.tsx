import { Typography } from "@/components/ui/typography";

const scale = ["display", "h1", "h2", "h3", "h4", "lead", "p", "large", "small", "muted", "eyebrow"] as const;

export default function TypographyScaleDemo() {
  return (
    <div className="grid w-full max-w-2xl gap-4 text-left">
      {scale.map((v) => (
        <div key={v} className="grid grid-cols-[80px_1fr] items-baseline gap-4 border-b border-outline-variant pb-3 last:border-0">
          <code className="font-mono text-xs text-muted-foreground">{v}</code>
          <Typography variant={v} className="truncate">
            The quick brown fox
          </Typography>
        </div>
      ))}
    </div>
  );
}
