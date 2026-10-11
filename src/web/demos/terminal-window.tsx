import TerminalWindow from "@/components/elements/terminal-window";

export default function TerminalWindowDemo() {
  return (
    <TerminalWindow
      className="w-full max-w-xl"
      lines={[
        { id: "1", type: "command", text: "npx dx-ui init" },
        { id: "2", type: "output", text: "Writing components.json…" },
        { id: "3", type: "success", text: "✔ DX UI is ready" },
        { id: "4", type: "command", text: "npx dx-ui add press-button voice-orb" },
        { id: "5", type: "success", text: "✔ Added 2 components" },
      ]}
      loop
      title="my-app"
    />
  );
}
