import ProgressiveBlur from "@/components/effects/progressive-blur";
import { photo } from "@/lib/demo-data";

export default function ProgressiveBlurDemo() {
  return (
    <div className="relative h-80 w-full max-w-md overflow-hidden rounded-3xl">
      <img alt="Mountain lake" className="size-full object-cover" src={photo(9)} />
      <ProgressiveBlur className="top-auto h-1/2" direction="bottom" />
      <div className="absolute inset-x-0 bottom-0 p-6 text-white">
        <p className="text-xl font-semibold">Still water</p>
        <p className="text-sm text-white/80">Progressive blur keeps text legible on any photo.</p>
      </div>
    </div>
  );
}
