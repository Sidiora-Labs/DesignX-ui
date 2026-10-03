import { ThemeToggle } from "@/components/dx/theme-toggle";

const icons = ["half", "sun", "dots", "bulb", "eclipse"] as const;

export default function ThemeToggleDemo() {
  return (
    <div className="grid justify-items-center gap-6">
      <div className="flex items-center gap-2">
        {icons.map((icon) => (
          <ThemeToggle key={icon} icon={icon} className="size-12" />
        ))}
      </div>
      <div className="flex items-center gap-2">
        {icons.map((icon) => (
          <ThemeToggle key={icon} icon={icon} appearance="solid" className="size-12" />
        ))}
      </div>
    </div>
  );
}
