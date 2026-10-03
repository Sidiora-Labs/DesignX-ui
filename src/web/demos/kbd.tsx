import { Kbd, KbdGroup } from "@/components/ui/kbd";

export default function KbdDemo() {
  return (
    <div className="flex flex-col items-center gap-4 text-sm text-muted-foreground">
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>⇧</Kbd>
        <Kbd>⌥</Kbd>
        <Kbd>⌃</Kbd>
      </KbdGroup>
      <p>
        Press{" "}
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>{" "}
        to search, or <Kbd>Esc</Kbd> to close.
      </p>
    </div>
  );
}
