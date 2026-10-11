import AnimatedToggle from "@/components/elements/animated-toggle";

export default function AnimatedToggleDemo() {
  return (
    <div className="flex items-center gap-6">
      <AnimatedToggle defaultChecked label="Notifications" />
      <AnimatedToggle label="Morph" variant="morph" />
      <AnimatedToggle label="Icon" variant="icon" />
    </div>
  );
}
