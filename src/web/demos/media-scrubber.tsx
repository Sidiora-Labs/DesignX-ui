import { MediaScrubber } from "@/components/dx/media-scrubber";

export default function MediaScrubberDemo() {
  return (
    <MediaScrubber
      wrapperClassName="w-full max-w-xl"
      src="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
      poster="https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg"
      playsInline
      muted
      loop
    />
  );
}
