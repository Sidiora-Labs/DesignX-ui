import AIApproval from "@/components/agents/ai-approval";

export default function AIApprovalDemo() {
  return (
    <AIApproval
      className="w-full max-w-md"
      options={[
        { id: "keep", label: "Keep the draft", detail: "Save it to the workspace and continue." },
        { id: "publish", label: "Publish now", detail: "Push the changes to production." },
        { id: "delete", label: "Delete everything", detail: "This cannot be undone.", destructive: true },
      ]}
      question="The agent finished the release notes. What next?"
    />
  );
}
