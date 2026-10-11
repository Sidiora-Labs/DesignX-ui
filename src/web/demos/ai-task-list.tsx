import AITaskList from "@/components/agents/ai-task-list";

export default function AITaskListDemo() {
  return (
    <AITaskList
      className="w-full max-w-md"
      tasks={[
        { id: "1", label: "Read the design tokens", status: "done" },
        {
          id: "2",
          label: "Scaffold the dashboard",
          status: "running",
          children: [
            { id: "2a", label: "Sidebar and header", status: "done" },
            { id: "2b", label: "Charts", status: "running" },
          ],
        },
        { id: "3", label: "Write tests", status: "pending" },
        { id: "4", label: "Deploy preview", status: "pending", note: "Waiting on tests" },
      ]}
    />
  );
}
