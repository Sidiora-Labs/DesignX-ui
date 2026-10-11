import { MediaScrubber } from "@/components/dx/media-scrubber";

export default function MediaScrubberDemo() {
  return (
    <MediaScrubber
      wrapperClassName="w-full max-w-xl"
      src="/videos/sample.mp4"
      poster="/images/dx/photos/ph1.webp"
      playsInline
      muted
      loop
    />
  );
}
