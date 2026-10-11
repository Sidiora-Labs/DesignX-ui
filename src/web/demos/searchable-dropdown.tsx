import SearchableDropdown from "@/components/elements/searchable-dropdown";

export default function SearchableDropdownDemo() {
  return (
    <SearchableDropdown
      items={[
        { id: 1, label: "Press Button", description: "Elements" },
        { id: 2, label: "Voice Orb", description: "Agents" },
        { id: 3, label: "Aurora Curtain", description: "Effects" },
        { id: 4, label: "Shared Axis X", description: "Text" },
        { id: 5, label: "SDF Blob", description: "Transitions" },
      ]}
      label="Find a component"
      placeholder="Search…"
    />
  );
}
