import ExpandableCards from "@/components/elements/expandable-cards";
import { getAllPeople, photo } from "@/lib/demo-data";

const people = getAllPeople();

export default function ExpandableCardsDemo() {
  return (
    <ExpandableCards
      cards={[
        { id: 1, title: "Northern Light", image: photo(1), content: "A study of the first light over the fjords.", author: { name: people[0].name, role: people[0].role, image: people[0].avatar } },
        { id: 2, title: "Still Water", image: photo(4), content: "Long exposures of mountain lakes at dawn.", author: { name: people[2].name, role: people[2].role, image: people[2].avatar } },
        { id: 3, title: "Open Road", image: photo(8), content: "Highways that disappear into the horizon.", author: { name: people[4].name, role: people[4].role, image: people[4].avatar } },
      ]}
    />
  );
}
