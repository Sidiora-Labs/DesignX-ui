import SharedAxisY from "@/components/text/shared-axis-y";

const phrases = ["Design faster", "Ship calmer", "Feel the motion", "Own the code"];

export default function SharedAxisYDemo() {
  return <SharedAxisY className="text-4xl font-semibold tracking-tight" phrases={phrases} />;
}
