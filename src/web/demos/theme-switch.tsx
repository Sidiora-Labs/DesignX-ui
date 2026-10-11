import ThemeSwitch, { THEME_TOGGLE_VARIANTS } from "@/components/elements/theme-switch";

export default function ThemeSwitchDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      {THEME_TOGGLE_VARIANTS.map((variant) => (
        <ThemeSwitch defaultTheme="light" key={variant} variant={variant} />
      ))}
    </div>
  );
}
