import AIDiff from "@/components/agents/ai-diff";

export default function AIDiffDemo() {
  return (
    <AIDiff
      className="w-full max-w-lg"
      lines={[
        { kind: "context", number: 1, content: 'import { Button } from "@/components/ui/button";' },
        { kind: "removed", number: 2, content: '<Button variant="default">Save</Button>' },
        { kind: "added", number: 2, content: '<Button variant="default" loading={saving}>' },
        { kind: "added", number: 3, content: "  Save changes" },
        { kind: "added", number: 4, content: "</Button>" },
      ]}
      title="settings-form.tsx"
    />
  );
}
