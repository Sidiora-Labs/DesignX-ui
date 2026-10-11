import AnimatedList from "@/components/elements/animated-list";

const events = [
  ["New sign-up", "Maya joined the Pro plan"],
  ["Deploy finished", "ui.designx.dev is live"],
  ["Comment", "Theo replied to your review"],
  ["Payment", "Invoice #1042 was paid"],
  ["Mention", "Ava mentioned you in Tokens"],
  ["Release", "DX UI 1.4 is out"],
];

const items = events.map(([title, body]) => ({
  id: title,
  content: (
    <div className="rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border">
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-muted-foreground">{body}</p>
    </div>
  ),
}));

export default function AnimatedListDemo() {
  return (
    <AnimatedList className="w-full max-w-sm" feed feedInterval={1200} items={items} maxVisible={4} />
  );
}
