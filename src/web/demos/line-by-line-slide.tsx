import LineByLineSlide from "@/components/text/line-by-line-slide";

export default function LineByLineSlideDemo() {
  return (
    <LineByLineSlide
      className="text-3xl font-semibold tracking-tight"
      lines={["Copy the source.", "Tune the springs.", "Ship it today."]}
      triggerOnView={false}
    />
  );
}
