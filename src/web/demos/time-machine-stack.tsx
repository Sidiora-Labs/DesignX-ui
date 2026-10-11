import TimeMachineStack from "@/components/elements/time-machine-stack";

const versions = ["v1.4 · Agents kit", "v1.3 · Charts kit", "v1.2 · Motion kit", "v1.1 · Blocks", "v1.0 · Launch"];

export default function TimeMachineStackDemo() {
  return (
    <TimeMachineStack
      className="h-80 w-full max-w-md"
      items={versions.map((v) => ({
        id: v,
        content: (
          <div className="flex h-full flex-col justify-between rounded-3xl bg-card p-6 ring-1 ring-border">
            <span className="text-xs text-muted-foreground">Release</span>
            <span className="text-xl font-semibold">{v}</span>
          </div>
        ),
      }))}
    />
  );
}
