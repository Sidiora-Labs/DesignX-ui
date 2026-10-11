import SharedAxisX from "@/components/text/shared-axis-x";

const phrases = ["Design faster", "Ship calmer", "Feel the motion", "Own the code"];

export default function SharedAxisXDemo() {
  return <SharedAxisX className="text-4xl font-semibold tracking-tight" phrases={phrases} />;
}
