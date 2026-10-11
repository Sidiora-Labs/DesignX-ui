import OrbitalImageWheel from "@/components/effects/orbital-image-wheel";
import { photo } from "@/lib/demo-data";

const items = [1, 3, 5, 7, 9, 11, 13, 15].map((n) => ({ id: String(n), image: photo(n), alt: `Photo ${n}`, label: `No. ${n}` }));

export default function OrbitalImageWheelDemo() {
  return <OrbitalImageWheel autoRotate className="h-96 w-full max-w-2xl" items={items} />;
}
