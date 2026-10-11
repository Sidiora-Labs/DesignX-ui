import DepthLayers from "@/components/effects/depth-layers";
import { photo } from "@/lib/demo-data";

export default function DepthLayersDemo() {
  return (
    <DepthLayers
      className="h-96 w-full max-w-2xl overflow-hidden rounded-3xl"
      direction="both"
      layers={[
        { id: "bg", depth: 0.2, content: <img alt="" className="size-full object-cover" src={photo(6)} /> },
        {
          id: "mid",
          depth: 0.6,
          content: <div className="absolute inset-x-10 bottom-10 h-24 rounded-3xl bg-background/60 backdrop-blur" />,
        },
        {
          id: "fg",
          depth: 1,
          content: (
            <div className="grid size-full place-items-center">
              <h3 className="text-5xl font-semibold tracking-tight text-white drop-shadow-lg">Depth</h3>
            </div>
          ),
        },
      ]}
      pointerParallax
    />
  );
}
