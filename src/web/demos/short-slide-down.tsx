import ShortSlideDown from "@/components/text/short-slide-down";

const phrases = ["Design faster", "Ship calmer", "Feel the motion", "Own the code"];

export default function ShortSlideDownDemo() {
  return <ShortSlideDown className="text-4xl font-semibold tracking-tight" phrases={phrases} />;
}
