import Combobox from "@/components/elements/animated-combobox";

export default function AnimatedComboboxDemo() {
  return (
    <Combobox
      aria-label="Framework"
      className="w-64"
      options={[
        { value: "react", label: "React" },
        { value: "vue", label: "Vue" },
        { value: "svelte", label: "Svelte" },
        { value: "solid", label: "Solid" },
        { value: "angular", label: "Angular" },
      ]}
      placeholder="Pick a framework"
    />
  );
}
