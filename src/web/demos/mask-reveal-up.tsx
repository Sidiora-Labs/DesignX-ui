import MaskRevealUp from "@/components/text/mask-reveal-up";

export default function MaskRevealUpDemo() {
  return (
    <MaskRevealUp
      className="text-4xl font-semibold tracking-tight"
      lines={["Interfaces that", "feel considered"]}
      triggerOnView={false}
    />
  );
}
