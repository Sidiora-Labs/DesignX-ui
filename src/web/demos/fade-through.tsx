import FadeThrough from "@/components/text/fade-through";

const phrases = ["Design faster", "Ship calmer", "Feel the motion", "Own the code"];

export default function FadeThroughDemo() {
  return <FadeThrough className="text-4xl font-semibold tracking-tight" phrases={phrases} />;
}
