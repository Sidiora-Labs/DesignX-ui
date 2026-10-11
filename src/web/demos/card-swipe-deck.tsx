import CardSwipeDeck from "@/components/elements/card-swipe-deck";
import { getAllPeople } from "@/lib/demo-data";

export default function CardSwipeDeckDemo() {
  return (
    <CardSwipeDeck
      items={getAllPeople()
        .slice(0, 5)
        .map((p) => ({
          id: p.id,
          content: (
            <div className="flex h-full flex-col overflow-hidden rounded-3xl bg-card">
              <img alt={p.name} className="h-2/3 w-full object-cover" src={p.avatar} />
              <div className="p-4">
                <p className="font-semibold">{p.name}</p>
                <p className="text-xs text-muted-foreground">
                  {p.role} · {p.location}
                </p>
              </div>
            </div>
          ),
        }))}
      labels={{ left: "Pass", right: "Connect" }}
    />
  );
}
