import PhotoStack from "@/components/elements/photo-stack";
import { getAllPeople, photo } from "@/lib/demo-data";

export default function PhotoStackDemo() {
  const people = getAllPeople().slice(0, 4);
  return (
    <PhotoStack
      photos={people.map((p, i) => ({ id: p.id, src: photo(i * 4 + 2), alt: p.name, name: p.name, role: p.role }))}
    />
  );
}
