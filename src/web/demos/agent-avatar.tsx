import AgentAvatar from "@/components/agents/agent-avatar";

const agents = ["atlas", "nova", "orbit", "pixel", "quill"];

export default function AgentAvatarDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {agents.map((seed) => (
        <div className="flex flex-col items-center gap-2" key={seed}>
          <AgentAvatar seed={seed} />
          <span className="text-xs text-muted-foreground capitalize">{seed}</span>
        </div>
      ))}
    </div>
  );
}
