import TiltSurface from "@/components/elements/tilt-surface";
import { photo } from "@/lib/demo-data";

export default function TiltSurfaceDemo() {
  return (
    <TiltSurface className="w-72 overflow-hidden rounded-3xl" glare parallax>
      <img alt="Peaks" className="aspect-[3/4] w-full object-cover" src={photo(3)} />
    </TiltSurface>
  );
}
