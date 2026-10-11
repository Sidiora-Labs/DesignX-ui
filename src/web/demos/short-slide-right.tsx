import ShortSlideRight from "@/components/text/short-slide-right";

const phrases = ["Design faster", "Ship calmer", "Feel the motion", "Own the code"];

export default function ShortSlideRightDemo() {
  return <ShortSlideRight className="text-4xl font-semibold tracking-tight" phrases={phrases} />;
}
