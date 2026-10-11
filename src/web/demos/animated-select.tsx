import Select from "@/components/elements/animated-select";

export default function AnimatedSelectDemo() {
  return (
    <Select
      aria-label="Theme"
      className="w-56"
      options={[
        { value: "light", label: "Light" },
        { value: "dark", label: "Dark" },
        { value: "system", label: "System" },
      ]}
      placeholder="Select a theme"
    />
  );
}
