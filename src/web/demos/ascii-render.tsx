import AsciiRender from "@/components/effects/ascii-render";
import { photo } from "@/lib/demo-data";

export default function AsciiRenderDemo() {
  return (
    <AsciiRender
      alt="Portrait rendered as ASCII"
      className="w-full max-w-lg overflow-hidden rounded-2xl"
      columns={100}
      source={{ src: photo(2), type: "image" }}
    />
  );
}
