import AIBranch from "@/components/agents/ai-branch";

const branches = [
  {
    id: "a",
    userMessage: "Suggest a name for our component library.",
    aiResponse: "How about DesignX UI — short, memorable and it leaves room for the X to stand for anything.",
    isActive: true,
    timestamp: new Date("2025-01-08T10:00:00"),
  },
  {
    id: "b",
    userMessage: "Suggest a name for our component library.",
    aiResponse: "Try Kitbash — it hints at assembling interfaces from reusable parts.",
    isActive: false,
    timestamp: new Date("2025-01-08T10:01:00"),
  },
  {
    id: "c",
    userMessage: "Suggest a name for our component library.",
    aiResponse: "Consider Primer Motion — calm primitives with motion baked in.",
    isActive: false,
    timestamp: new Date("2025-01-08T10:02:00"),
  },
];

export default function AIBranchDemo() {
  return <AIBranch branches={branches} onBranchSelect={() => {}} />;
}
