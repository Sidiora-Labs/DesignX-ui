import VideoModal from "@/components/elements/video-modal";

/** Point `src` at your own clip. The poster is shown as the thumbnail. */
export default function VideoModalDemo() {
  return (
    <VideoModal
      className="w-full max-w-md"
      poster="/images/dx/photos/ph11.webp"
      src="/videos/sample.mp4"
      title="DX UI in 90 seconds"
    />
  );
}
