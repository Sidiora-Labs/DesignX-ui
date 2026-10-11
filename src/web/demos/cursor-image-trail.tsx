import CursorImageTrail from "@/components/effects/cursor-image-trail";
import { photo } from "@/lib/demo-data";

const images = [2, 5, 8, 11, 15, 18].map((n) => ({ src: photo(n), alt: `Photo ${n}` }));

export default function CursorImageTrailDemo() {
  return (
    <CursorImageTrail className="h-80 w-full max-w-2xl rounded-2xl bg-muted/40" images={images}>
      <div className="grid h-full place-items-center">
        <p className="text-2xl font-semibold tracking-tight">Move your cursor here</p>
      </div>
    </CursorImageTrail>
  );
}
