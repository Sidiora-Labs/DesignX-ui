import VideoAmbient from "@/components/elements/video-ambient";

/** Point `src` at your own clip. The poster keeps the preview meaningful before a video loads. */
export default function VideoAmbientDemo() {
  return (
    <VideoAmbient
      alt="Ambient video preview"
      className="w-full max-w-xl"
      controls
      poster="/images/dx/photos/ph4.webp"
      src="/videos/sample.mp4"
    />
  );
}
