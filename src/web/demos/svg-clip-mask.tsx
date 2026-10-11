import SvgClipMask from "@/components/effects/svg-clip-mask";
import { photo } from "@/lib/demo-data";

export default function SvgClipMaskDemo() {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {(["blob", "arch", "diamond"] as const).map((shape, i) => (
        <SvgClipMask animate={shape === "blob" ? "morph" : "hover"} className="size-48" key={shape} shape={shape}>
          <img alt="" className="size-full object-cover" src={photo(10 + i)} />
        </SvgClipMask>
      ))}
    </div>
  );
}
