import Checkbox from "@/components/elements/animated-checkbox";

export default function AnimatedCheckboxDemo() {
  return (
    <div className="flex flex-col gap-3">
      {["Email me about releases", "Send weekly digest", "Notify on mentions"].map((label) => (
        <label className="flex items-center gap-3 text-sm" key={label}>
          <Checkbox />
          {label}
        </label>
      ))}
    </div>
  );
}
