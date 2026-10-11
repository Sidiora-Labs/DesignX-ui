import ImageGenerationPanel from "@/components/agents/image-generation-panel";
import { photo } from "@/lib/demo-data";

export default function ImageGenerationPanelDemo() {
  return (
    <ImageGenerationPanel
      className="w-full max-w-xl"
      images={[1, 4, 9, 14].map((n) => ({ id: String(n), src: photo(n), alt: `Generated image ${n}` }))}
      model="DX Vision"
      prompt="Soft morning light over a quiet coastline, film grain"
      status="done"
    />
  );
}
