import ScrollableCardStack from "@/components/elements/scrollable-card-stack";
import { getAllPeople, photo } from "@/lib/demo-data";

export default function ScrollableCardStackDemo() {
  const items = getAllPeople()
    .slice(0, 6)
    .map((p, i) => ({
      id: p.id,
      name: p.name,
      handle: `@${p.name.split(" ")[0].toLowerCase()}`,
      avatar: p.avatar,
      image: photo(i * 3 + 1),
      href: "#",
    }));
  return <ScrollableCardStack className="w-full max-w-sm" items={items} />;
}
