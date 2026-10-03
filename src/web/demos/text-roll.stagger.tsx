import { TextRoll } from "@/components/dx/text-roll";

export default function TextRollStagger() {
  return (
    <div className="grid justify-items-center gap-6 text-2xl font-medium">
      <TextRoll>Left to right</TextRoll>
      <TextRoll center>From the center</TextRoll>
      <TextRoll stagger={0.08} transition={{ type: "spring", stiffness: 260, damping: 22 }}>
        Slow spring
      </TextRoll>
    </div>
  );
}
