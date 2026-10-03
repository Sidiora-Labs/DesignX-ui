import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from "@/components/ui/avatar";

const people = [
  { name: "Mira Chen", src: "https://i.pravatar.cc/96?img=47" },
  { name: "Leo Park", src: "https://i.pravatar.cc/96?img=12" },
  { name: "Ana Ruiz", src: "https://i.pravatar.cc/96?img=32" },
  { name: "Sam Okafor", src: "https://i.pravatar.cc/96?img=59" },
];

const initials = (n: string) => n.split(" ").map((p) => p[0]).join("");

export default function AvatarDemo() {
  return (
    <div className="flex flex-wrap items-center gap-8">
      <Avatar>
        <AvatarImage src={people[0].src} alt={people[0].name} />
        <AvatarFallback>MC</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>DX</AvatarFallback>
      </Avatar>
      <Avatar className="size-12">
        <AvatarImage src={people[1].src} alt={people[1].name} />
        <AvatarFallback>LP</AvatarFallback>
      </Avatar>
      <AvatarGroup>
        {people.map((p) => (
          <Avatar key={p.name}>
            <AvatarImage src={p.src} alt={p.name} />
            <AvatarFallback>{initials(p.name)}</AvatarFallback>
          </Avatar>
        ))}
        <Avatar>
          <AvatarFallback>+8</AvatarFallback>
        </Avatar>
      </AvatarGroup>
    </div>
  );
}
