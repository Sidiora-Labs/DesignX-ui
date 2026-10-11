import ImageMetadataPreview from "@/components/elements/image-metadata-preview";
import { photo } from "@/lib/demo-data";

export default function ImageMetadataPreviewDemo() {
  return (
    <div className="relative flex h-[520px] w-full justify-center">
      <ImageMetadataPreview
      alt="Mountain lake"
      description="Hero image for the spring launch."
      filename="hero-spring.webp"
      imageSrc={photo(8)}
      metadata={{ by: "Maya Solis", created: "Mar 3, 2025", source: "DX Photo Library", updated: "Mar 9, 2025" }}
    />
    </div>
  );
}
