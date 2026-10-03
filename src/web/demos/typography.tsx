import { Typography } from "@/components/ui/typography";

export default function TypographyDemo() {
  return (
    <div className="w-full max-w-2xl space-y-5 text-left">
      <Typography variant="eyebrow">Design system</Typography>
      <Typography variant="display">Build with clarity.</Typography>
      <Typography variant="lead">
        DX UI is a calm, tonal component systempill actions, layered surfaces and motion that feels physical.
      </Typography>
      <Typography variant="h3">Surfaces, not shadows</Typography>
      <Typography>
        Hierarchy comes from a tonal surface ladder rather than drop shadows. Use <Typography variant="code">bg-container</Typography>{" "}
        for grouped content and reserve <Typography variant="code">shadow-float</Typography> for things that genuinely float.
      </Typography>
      <Typography variant="blockquote">"Every pixel should earn its place."</Typography>
      <Typography variant="muted">Last updated October 2026</Typography>
    </div>
  );
}
